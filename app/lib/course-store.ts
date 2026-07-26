import { assessments, exercises } from "./course-content";
import { getSQL, ensureSchema } from "./db";

// ---------------------------------------------------------------------------
// Exported row types — kept identical to the original API
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function now() {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------

export function adminToken() {
  return process.env.ADMIN_ACCESS_TOKEN || "710208";
}

export function assertAdmin(request: Request) {
  const token =
    request.headers.get("x-admin-token") ||
    new URL(request.url).searchParams.get("token");

  return token === adminToken();
}

// ---------------------------------------------------------------------------
// Participants
// ---------------------------------------------------------------------------

export async function upsertParticipant(email: string, name?: string) {
  const normalized = normalizeEmail(email);
  const timestamp = now();

  if (!normalized || !normalized.includes("@")) {
    throw new Error("يرجى إدخال بريد إلكتروني صحيح.");
  }

  try {
    await ensureSchema();
    const sql = getSQL();

    await sql`
      INSERT INTO participants (email, name, created_at, updated_at)
      VALUES (${normalized}, ${name ?? null}, ${timestamp}, ${timestamp})
      ON CONFLICT (email) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, participants.name),
        updated_at = EXCLUDED.updated_at
    `;

    return { email: normalized, name: name ?? null };
  } catch (error) {
    console.error("[course-store] upsertParticipant failed:", error);
    throw new Error("تعذر تسجيل المشارك. يرجى المحاولة مرة أخرى.");
  }
}

// ---------------------------------------------------------------------------
// Exercise answers
// ---------------------------------------------------------------------------

export async function saveExerciseAnswer(
  participantEmail: string,
  exerciseId: string,
  answer: string,
  participantName?: string
) {
  const email = normalizeEmail(participantEmail);
  const exercise = exercises.find((item) => item.id === exerciseId);
  const timestamp = now();

  if (!exercise || exercise.status === "soon") {
    throw new Error("هذا التمرين غير متاح حالياً.");
  }

  const trimmedAnswer = answer.trim();

  await upsertParticipant(email, participantName);

  try {
    await ensureSchema();
    const sql = getSQL();

    await sql`
      INSERT INTO exercise_answers
        (participant_email, exercise_id, answer, created_at, updated_at)
      VALUES (${email}, ${exerciseId}, ${trimmedAnswer}, ${timestamp}, ${timestamp})
      ON CONFLICT (participant_email, exercise_id) DO UPDATE SET
        answer = EXCLUDED.answer,
        updated_at = EXCLUDED.updated_at
    `;

    await sql`
      INSERT INTO progress
        (participant_email, item_type, item_id, status, updated_at)
      VALUES (${email}, 'exercise', ${exerciseId}, 'completed', ${timestamp})
      ON CONFLICT (participant_email, item_type, item_id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
    `;

    return { ok: true };
  } catch (error) {
    console.error("[course-store] saveExerciseAnswer failed:", error);
    throw new Error("تعذر حفظ الإجابة. يرجى المحاولة مرة أخرى.");
  }
}

// ---------------------------------------------------------------------------
// Participant profiles
// ---------------------------------------------------------------------------

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

export async function saveParticipantProfile(input: {
  email: string;
  name: string;
  country?: string;
  professionalBackground: string;
  courseGoals: string;
  funFact: string;
}) {
  const email = normalizeEmail(input.email);
  const name = requiredText(input.name, "الاسم");
  const country = optionalText(input.country);
  const professionalBackground = optionalText(input.professionalBackground);
  const aiInterests = "";
  const aiModel = "";
  const courseGoals = optionalText(input.courseGoals);
  const funFact = optionalText(input.funFact);
  const timestamp = now();

  await upsertParticipant(email, name);

  try {
    await ensureSchema();
    const sql = getSQL();

    await sql`
      INSERT INTO participant_profiles
        (participant_email, name, country, professional_background, ai_interests, ai_model, course_goals, fun_fact, created_at, updated_at)
      VALUES (${email}, ${name}, ${country}, ${professionalBackground}, ${aiInterests}, ${aiModel}, ${courseGoals}, ${funFact}, ${timestamp}, ${timestamp})
      ON CONFLICT (participant_email) DO UPDATE SET
        name = EXCLUDED.name,
        country = EXCLUDED.country,
        professional_background = EXCLUDED.professional_background,
        ai_interests = EXCLUDED.ai_interests,
        ai_model = EXCLUDED.ai_model,
        course_goals = EXCLUDED.course_goals,
        fun_fact = EXCLUDED.fun_fact,
        updated_at = EXCLUDED.updated_at
    `;

    return { ok: true, email };
  } catch (error) {
    console.error("[course-store] saveParticipantProfile failed:", error);
    throw new Error("تعذر حفظ بيانات التعارف. يرجى المحاولة مرة أخرى.");
  }
}

export async function participantProfilesData() {
  try {
    await ensureSchema();
    const sql = getSQL();

    const rows = await sql`
      SELECT
        participant_email,
        name,
        COALESCE(country, '') AS country,
        professional_background,
        ai_interests,
        COALESCE(ai_model, '') AS ai_model,
        course_goals,
        fun_fact,
        created_at,
        updated_at
      FROM participant_profiles
      ORDER BY updated_at DESC
    `;

    return rows as ParticipantProfileRow[];
  } catch (error) {
    console.error("[course-store] participantProfilesData failed:", error);
    throw new Error("تعذر تحميل بطاقات المشاركين.");
  }
}

// ---------------------------------------------------------------------------
// Assessment answers
// ---------------------------------------------------------------------------

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

  try {
    await ensureSchema();
    const sql = getSQL();

    await sql`
      INSERT INTO assessment_answers
        (participant_email, assessment_id, payload, score, created_at, updated_at)
      VALUES (${email}, ${assessmentId}, ${payload.trim()}, ${score}, ${timestamp}, ${timestamp})
      ON CONFLICT (participant_email, assessment_id) DO UPDATE SET
        payload = EXCLUDED.payload,
        score = EXCLUDED.score,
        updated_at = EXCLUDED.updated_at
    `;

    await sql`
      INSERT INTO progress
        (participant_email, item_type, item_id, status, updated_at)
      VALUES (${email}, 'assessment', ${assessmentId}, 'completed', ${timestamp})
      ON CONFLICT (participant_email, item_type, item_id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
    `;

    return { ok: true };
  } catch (error) {
    console.error("[course-store] saveAssessmentAnswer failed:", error);
    throw new Error("تعذر حفظ النتيجة. يرجى المحاولة مرة أخرى.");
  }
}

// ---------------------------------------------------------------------------
// Delete participant
// ---------------------------------------------------------------------------

export async function deleteParticipant(email: string) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("يرجى تحديد البريد الإلكتروني للمشارك.");
  }

  try {
    await ensureSchema();
    const sql = getSQL();

    await sql`DELETE FROM exercise_answers WHERE participant_email = ${normalized}`;
    await sql`DELETE FROM assessment_answers WHERE participant_email = ${normalized}`;
    await sql`DELETE FROM participant_profiles WHERE participant_email = ${normalized}`;
    await sql`DELETE FROM progress WHERE participant_email = ${normalized}`;
    await sql`DELETE FROM participants WHERE email = ${normalized}`;

    return { ok: true, email: normalized };
  } catch (error) {
    console.error("[course-store] deleteParticipant failed:", error);
    throw new Error("تعذر حذف المشارك. يرجى المحاولة مرة أخرى.");
  }
}

// ---------------------------------------------------------------------------
// Dashboard (admin)
// ---------------------------------------------------------------------------

export async function dashboardData() {
  try {
    await ensureSchema();
    const sql = getSQL();

    const participants = (await sql`
      SELECT email, name, created_at, updated_at
      FROM participants
      ORDER BY updated_at DESC
    `) as ParticipantRow[];

    const exerciseAnswers = (await sql`
      SELECT participant_email, exercise_id, answer, created_at, updated_at
      FROM exercise_answers
      ORDER BY updated_at DESC
    `) as ExerciseAnswerRow[];

    const assessmentAnswers = (await sql`
      SELECT participant_email, assessment_id, payload, score, created_at, updated_at
      FROM assessment_answers
      ORDER BY updated_at DESC
    `) as AssessmentAnswerRow[];

    const participantProfiles = await participantProfilesData();

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
            scoredAnswers.reduce(
              (sum, answer) => sum + (answer.score ?? 0),
              0
            ) / scoredAnswers.length
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
  } catch (error) {
    console.error("[course-store] dashboardData failed:", error);
    throw new Error("تعذر تحميل لوحة القيادة.");
  }
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

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
