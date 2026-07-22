import { assessments, exercises } from "./course-content";

let _env: Record<string, unknown> = {};
try {
  _env = (await import("cloudflare:workers")).env as Record<string, unknown>;
} catch {
  // Not running in Cloudflare Workers — API routes will use in-memory fallback.
}

type D1Result<T> = { results?: T[] };

type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  first: <T = unknown>() => Promise<T | null>;
  all: <T = unknown>() => Promise<D1Result<T>>;
  run: () => Promise<unknown>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1Statement;
};

type RuntimeEnv = {
  DB?: D1DatabaseLike;
  ADMIN_ACCESS_TOKEN?: string;
};

export type ParticipantRow = {
  email: string;
  name?: string | null;
  created_at: string;
  updated_at: string;
};

export type ExerciseAnswerRow = {
  participant_email: string;
  exercise_id: string;
  answer: string;
  created_at: string;
  updated_at: string;
};

export type AssessmentAnswerRow = {
  participant_email: string;
  assessment_id: string;
  payload: string;
  score?: number | null;
  created_at: string;
  updated_at: string;
};

export type ParticipantProfileRow = {
  participant_email: string;
  name: string;
  country: string;
  professional_background: string;
  ai_interests: string;
  ai_model: string;
  course_goals: string;
  fun_fact: string;
  created_at: string;
  updated_at: string;
};

type MemoryStore = {
  participants: ParticipantRow[];
  exerciseAnswers: ExerciseAnswerRow[];
  assessmentAnswers: AssessmentAnswerRow[];
  participantProfiles: ParticipantProfileRow[];
};

declare global {
  var __aiLeadersCourseStore: MemoryStore | undefined;
}

const runtime = _env as unknown as RuntimeEnv;

function memoryStore() {
  globalThis.__aiLeadersCourseStore ??= {
    participants: [],
    exerciseAnswers: [],
    assessmentAnswers: [],
    participantProfiles: [],
  };

  return globalThis.__aiLeadersCourseStore;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function now() {
  return new Date().toISOString();
}

function db() {
  return runtime.DB;
}

export function adminToken() {
  return runtime.ADMIN_ACCESS_TOKEN || "710208";
}

export function assertAdmin(request: Request) {
  const token =
    request.headers.get("x-admin-token") ||
    new URL(request.url).searchParams.get("token");

  return token === adminToken();
}

export async function upsertParticipant(email: string, name?: string) {
  const normalized = normalizeEmail(email);
  const timestamp = now();

  if (!normalized || !normalized.includes("@")) {
    throw new Error("يرجى إدخال بريد إلكتروني صحيح.");
  }

  const database = db();

  if (database) {
    try {
      await database
        .prepare(
          `insert into participants (email, name, created_at, updated_at)
           values (?, ?, ?, ?)
           on conflict(email) do update set
             name = coalesce(excluded.name, participants.name),
             updated_at = excluded.updated_at`
        )
        .bind(normalized, name ?? null, timestamp, timestamp)
        .run();

      return { email: normalized, name: name ?? null };
    } catch {
      // The local preview can run before D1 migrations exist. Fall back so the UI remains reviewable.
    }
  }

  const store = memoryStore();
  const existing = store.participants.find((row) => row.email === normalized);

  if (existing) {
    existing.name = name ?? existing.name;
    existing.updated_at = timestamp;
  } else {
    store.participants.push({
      email: normalized,
      name: name ?? null,
      created_at: timestamp,
      updated_at: timestamp,
    });
  }

  return { email: normalized, name: name ?? null };
}

export async function saveExerciseAnswer(
  participantEmail: string,
  exerciseId: string,
  answer: string
) {
  const email = normalizeEmail(participantEmail);
  const exercise = exercises.find((item) => item.id === exerciseId);
  const timestamp = now();

  if (!exercise || exercise.status === "soon") {
    throw new Error("هذا التمرين غير متاح حالياً.");
  }

  const trimmedAnswer = answer.trim();

  await upsertParticipant(email);

  const database = db();

  if (database) {
    try {
      await database
        .prepare(
          `insert into exercise_answers
            (participant_email, exercise_id, answer, created_at, updated_at)
           values (?, ?, ?, ?, ?)
           on conflict(participant_email, exercise_id) do update set
             answer = excluded.answer,
             updated_at = excluded.updated_at`
        )
        .bind(email, exerciseId, trimmedAnswer, timestamp, timestamp)
        .run();

      await database
        .prepare(
          `insert into progress
            (participant_email, item_type, item_id, status, updated_at)
           values (?, 'exercise', ?, 'completed', ?)
           on conflict(participant_email, item_type, item_id) do update set
             status = excluded.status,
             updated_at = excluded.updated_at`
        )
        .bind(email, exerciseId, timestamp)
        .run();

      return { ok: true };
    } catch {
      // See local preview note above.
    }
  }

  const store = memoryStore();
  const existing = store.exerciseAnswers.find(
    (row) => row.participant_email === email && row.exercise_id === exerciseId
  );

  if (existing) {
    existing.answer = trimmedAnswer;
    existing.updated_at = timestamp;
  } else {
    store.exerciseAnswers.push({
      participant_email: email,
      exercise_id: exerciseId,
      answer: trimmedAnswer,
      created_at: timestamp,
      updated_at: timestamp,
    });
  }

  return { ok: true };
}

function requiredText(value: unknown, fieldName: string) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new Error(`يرجى تعبئة حقل ${fieldName}.`);
  }

  return text;
}

function optionalText(value: unknown) {
  return String(value ?? "").trim();
}

async function ensureParticipantProfileColumns(database: D1DatabaseLike) {
  await database
    .prepare("alter table participant_profiles add column country text not null default ''")
    .run()
    .catch(() => {});
  await database
    .prepare("alter table participant_profiles add column ai_model text not null default ''")
    .run()
    .catch(() => {});
}

export async function saveParticipantProfile(input: {
  email: string;
  name: string;
  country?: string;
  professionalBackground: string;
  aiInterests: string;
  aiModel?: string;
  courseGoals: string;
  funFact: string;
}) {
  const email = normalizeEmail(input.email);
  const name = requiredText(input.name, "الاسم");
  const country = optionalText(input.country);
  const professionalBackground = optionalText(input.professionalBackground);
  const aiInterests = optionalText(input.aiInterests);
  const aiModel = optionalText(input.aiModel);
  const courseGoals = optionalText(input.courseGoals);
  const funFact = optionalText(input.funFact);
  const timestamp = now();

  await upsertParticipant(email, name);

  const database = db();

  if (database) {
    try {
      await ensureParticipantProfileColumns(database);
      await database
        .prepare(
          `insert into participant_profiles
            (participant_email, name, country, professional_background, ai_interests, ai_model, course_goals, fun_fact, created_at, updated_at)
           values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           on conflict(participant_email) do update set
             name = excluded.name,
             country = excluded.country,
             professional_background = excluded.professional_background,
             ai_interests = excluded.ai_interests,
             ai_model = excluded.ai_model,
             course_goals = excluded.course_goals,
             fun_fact = excluded.fun_fact,
             updated_at = excluded.updated_at`
        )
        .bind(
          email,
          name,
          country,
          professionalBackground,
          aiInterests,
          aiModel,
          courseGoals,
          funFact,
          timestamp,
          timestamp
        )
        .run();

      return { ok: true, email };
    } catch {
      // Local preview can run before D1 migrations exist.
    }
  }

  const store = memoryStore();
  const existing = store.participantProfiles.find(
    (profile) => profile.participant_email === email
  );

  if (existing) {
    existing.name = name;
    existing.country = country;
    existing.professional_background = professionalBackground;
    existing.ai_interests = aiInterests;
    existing.ai_model = aiModel;
    existing.course_goals = courseGoals;
    existing.fun_fact = funFact;
    existing.updated_at = timestamp;
  } else {
    store.participantProfiles.push({
      participant_email: email,
      name,
      country,
      professional_background: professionalBackground,
      ai_interests: aiInterests,
      ai_model: aiModel,
      course_goals: courseGoals,
      fun_fact: funFact,
      created_at: timestamp,
      updated_at: timestamp,
    });
  }

  return { ok: true, email };
}

export async function participantProfilesData() {
  const database = db();

  try {
    if (database) {
      await ensureParticipantProfileColumns(database);
    }

    return await readRows<ParticipantProfileRow>(
      `select participant_email, name, coalesce(country, '') as country, professional_background, ai_interests, coalesce(ai_model, '') as ai_model, course_goals, fun_fact, created_at, updated_at
       from participant_profiles
       order by updated_at desc`
    );
  } catch {
    const store = memoryStore();
    return [...store.participantProfiles].sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at)
    );
  }
}

export async function saveAssessmentAnswer(
  participantEmail: string,
  assessmentId: string,
  payload: string,
  scoreOverride?: number
) {
  const email = normalizeEmail(participantEmail);
  const assessment = assessments.find((item) => item.id === assessmentId);
  const timestamp = now();

  if (!assessment || assessment.status === "soon") {
    throw new Error("هذا المقياس غير متاح حالياً.");
  }

  if (!payload.trim()) {
    throw new Error("يرجى إدخال إجابة قبل الحفظ.");
  }

  const score =
    typeof scoreOverride === "number"
      ? scoreOverride
      : assessment.type === "scale"
        ? Number.parseFloat(payload) || null
        : null;

  await upsertParticipant(email);

  const database = db();

  if (database) {
    try {
      await database
        .prepare(
          `insert into assessment_answers
            (participant_email, assessment_id, payload, score, created_at, updated_at)
           values (?, ?, ?, ?, ?, ?)
           on conflict(participant_email, assessment_id) do update set
             payload = excluded.payload,
             score = excluded.score,
             updated_at = excluded.updated_at`
        )
        .bind(email, assessmentId, payload.trim(), score, timestamp, timestamp)
        .run();

      await database
        .prepare(
          `insert into progress
            (participant_email, item_type, item_id, status, updated_at)
           values (?, 'assessment', ?, 'completed', ?)
           on conflict(participant_email, item_type, item_id) do update set
             status = excluded.status,
             updated_at = excluded.updated_at`
        )
        .bind(email, assessmentId, timestamp)
        .run();

      return { ok: true };
    } catch {
      // See local preview note above.
    }
  }

  const store = memoryStore();
  const existing = store.assessmentAnswers.find(
    (row) =>
      row.participant_email === email && row.assessment_id === assessmentId
  );

  if (existing) {
    existing.payload = payload.trim();
    existing.score = score;
    existing.updated_at = timestamp;
  } else {
    store.assessmentAnswers.push({
      participant_email: email,
      assessment_id: assessmentId,
      payload: payload.trim(),
      score,
      created_at: timestamp,
      updated_at: timestamp,
    });
  }

  return { ok: true };
}

async function readRows<T>(query: string) {
  const database = db();

  if (!database) {
    throw new Error("no db");
  }

  const result = await database.prepare(query).all<T>();
  return result.results ?? [];
}

export async function deleteParticipant(email: string) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("يرجى تحديد البريد الإلكتروني للمشارك.");
  }

  const database = db();

  if (database) {
    try {
      await database
        .prepare("delete from exercise_answers where participant_email = ?")
        .bind(normalized)
        .run();
      await database
        .prepare("delete from assessment_answers where participant_email = ?")
        .bind(normalized)
        .run();
      await database
        .prepare("delete from participant_profiles where participant_email = ?")
        .bind(normalized)
        .run();
      await database
        .prepare("delete from progress where participant_email = ?")
        .bind(normalized)
        .run();
      await database
        .prepare("delete from participants where email = ?")
        .bind(normalized)
        .run();

      return { ok: true, email: normalized };
    } catch {
      // Local preview fallback
    }
  }

  const store = memoryStore();
  store.exerciseAnswers = store.exerciseAnswers.filter(
    (row) => row.participant_email !== normalized
  );
  store.assessmentAnswers = store.assessmentAnswers.filter(
    (row) => row.participant_email !== normalized
  );
  store.participantProfiles = store.participantProfiles.filter(
    (row) => row.participant_email !== normalized
  );
  store.participants = store.participants.filter(
    (row) => row.email !== normalized
  );

  return { ok: true, email: normalized };
}

export async function dashboardData() {
  let participants: ParticipantRow[] = [];
  let exerciseAnswers: ExerciseAnswerRow[] = [];
  let assessmentAnswers: AssessmentAnswerRow[] = [];
  let participantProfiles: ParticipantProfileRow[] = [];

  try {
    participants = await readRows<ParticipantRow>(
      "select email, name, created_at, updated_at from participants order by updated_at desc"
    );
    exerciseAnswers = await readRows<ExerciseAnswerRow>(
      "select participant_email, exercise_id, answer, created_at, updated_at from exercise_answers order by updated_at desc"
    );
    assessmentAnswers = await readRows<AssessmentAnswerRow>(
      "select participant_email, assessment_id, payload, score, created_at, updated_at from assessment_answers order by updated_at desc"
    );
    participantProfiles = await participantProfilesData();
  } catch {
    const store = memoryStore();
    participants = [...store.participants].sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at)
    );
    exerciseAnswers = [...store.exerciseAnswers].sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at)
    );
    assessmentAnswers = [...store.assessmentAnswers].sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at)
    );
    participantProfiles = [...store.participantProfiles].sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at)
    );
  }

  const completedExerciseCount = exerciseAnswers.length;
  const completedAssessmentCount = assessmentAnswers.length;
  const availableItems =
    exercises.filter((item) => item.status === "available").length +
    assessments.filter((item) => item.status === "available").length;
  const completionRate =
    participants.length && availableItems
      ? Math.round(
          ((completedExerciseCount + completedAssessmentCount) /
            (participants.length * availableItems)) *
            100
        )
      : 0;
  const scoredAnswers = assessmentAnswers.filter(
    (answer) => typeof answer.score === "number"
  );
  const averageScore = scoredAnswers.length
    ? Number(
        (
          scoredAnswers.reduce((sum, answer) => sum + (answer.score ?? 0), 0) /
          scoredAnswers.length
        ).toFixed(1)
      )
    : 0;

  return {
    participants,
    participantProfiles,
    exerciseAnswers,
    assessmentAnswers,
    stats: {
      participantCount: participants.length,
      profileCount: participantProfiles.length,
      completedExerciseCount,
      completedAssessmentCount,
      completionRate,
      averageScore,
    },
  };
}

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function dashboardCsv() {
  const data = await dashboardData();
  const rows = [
    [
      "participant_email",
      "record_type",
      "item_id",
      "answer",
      "score",
      "updated_at",
    ],
    ...data.participantProfiles.map((profile) => [
      profile.participant_email,
      "participant_profile",
      "introductions",
      [
        `الاسم: ${profile.name}`,
        `البلد: ${profile.country}`,
        `الخلفية المهنية: ${profile.professional_background}`,
        `الاهتمامات: ${profile.ai_interests}`,
        `نموذج الذكاء الاصطناعي: ${profile.ai_model}`,
        `الأهداف: ${profile.course_goals}`,
        `حقيقة ممتعة: ${profile.fun_fact}`,
      ].join(" | "),
      "",
      profile.updated_at,
    ]),
    ...data.exerciseAnswers.map((answer) => [
      answer.participant_email,
      "exercise",
      answer.exercise_id,
      answer.answer,
      "",
      answer.updated_at,
    ]),
    ...data.assessmentAnswers.map((answer) => [
      answer.participant_email,
      "assessment",
      answer.assessment_id,
      answer.payload,
      answer.score ?? "",
      answer.updated_at,
    ]),
  ];

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}
