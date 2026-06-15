"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";

import { assessments, exercises } from "@/app/lib/course-content";

type DashboardData = {
  participants: Array<{ email: string; name?: string | null; updated_at: string }>;
  participantProfiles: Array<{
    participant_email: string;
    name: string;
    country: string;
    professional_background: string;
    ai_interests: string;
    ai_model: string;
    course_goals: string;
    fun_fact: string;
    updated_at: string;
  }>;
  exerciseAnswers: Array<{
    participant_email: string;
    exercise_id: string;
    answer: string;
    updated_at: string;
  }>;
  assessmentAnswers: Array<{
    participant_email: string;
    assessment_id: string;
    payload: string;
    score?: number | null;
    updated_at: string;
  }>;
  stats: {
    participantCount: number;
    profileCount: number;
    completedExerciseCount: number;
    completedAssessmentCount: number;
    completionRate: number;
    averageScore: number;
  };
};

type CompletionSurveyPayload = {
  exerciseId?: string;
  participantEmail?: string;
  name?: string;
  affiliation?: string;
  experienceRating?: number | null;
  usefulnessRating?: number | null;
  mostUseful?: string;
  application?: string;
  improvement?: string;
  recommendationScore?: number | null;
  testimonial?: string;
  testimonialConsent?: string;
  submittedAt?: string;
};

type CompletionSurveyRow = CompletionSurveyPayload & {
  participant_email: string;
  updated_at: string;
};

type AssessmentPayload = {
  result?: string;
  distribution?: Record<string, number>;
};

type ActivityBar = {
  label: string;
  type: string;
  count: number;
  percent: number;
};

type RecentActivity = {
  participant: string;
  type: string;
  title: string;
  detail: string;
  updated_at: string;
};

const exerciseTitleById = new Map(exercises.map((item) => [item.id, item.title]));
const assessmentTitleById = new Map(
  assessments.map((item) => [item.id, item.title])
);

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function percent(part: number, total: number) {
  return total ? clampPercent((part / total) * 100) : 0;
}

function average(values: Array<number | undefined>) {
  const valid = values.filter((value): value is number => typeof value === "number");

  if (!valid.length) {
    return 0;
  }

  return Number((valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(1));
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ar");
}

function truncate(text: string, max = 150) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function parseAssessmentPayload(payload: string): AssessmentPayload {
  try {
    return JSON.parse(payload) as AssessmentPayload;
  } catch {
    return {};
  }
}

function formatAssessmentPayload(payload: string) {
  const parsed = parseAssessmentPayload(payload);
  const distribution = parsed.distribution
    ? Object.entries(parsed.distribution)
        .map(([name, value]) => `${name}: ${value}%`)
        .join("، ")
    : "";

  return [parsed.result ? `النتيجة: ${parsed.result}` : "", distribution]
    .filter(Boolean)
    .join(" | ");
}

function parseCompletionSurveyAnswer(answer: {
  participant_email: string;
  exercise_id: string;
  answer: string;
  updated_at: string;
}): CompletionSurveyRow | null {
  if (answer.exercise_id !== "course-completion-survey") {
    return null;
  }

  try {
    const parsed = JSON.parse(answer.answer) as CompletionSurveyPayload;

    return {
      ...parsed,
      participant_email: answer.participant_email,
      updated_at: answer.updated_at,
    };
  } catch {
    return {
      participant_email: answer.participant_email,
      updated_at: answer.updated_at,
    };
  }
}

function formatExerciseAnswer(answer: string) {
  try {
    const parsed = JSON.parse(answer) as {
      exerciseId?: string;
      combinedPrompt?: string;
      answers?:
        | Record<string, string>
        | Array<{
            label?: string;
            sentence?: string;
            tokens?: string;
            characters?: string;
          }>;
      reflection?: string;
      summary?: {
        verifiedFact?: string;
        firstDecision?: string;
        revisedDecision?: string;
        hallucination?: string;
      };
      evaluation?: {
        score?: number;
        level?: string;
        summary?: string;
        missingComponents?: string[];
        nextAction?: string;
      };
    };

    if (parsed.exerciseId === "course-completion-survey") {
      const survey = parsed as CompletionSurveyPayload;

      return [
        survey.experienceRating
          ? `تقييم التجربة: ${survey.experienceRating} / 5`
          : "",
        survey.usefulnessRating
          ? `فائدة المحتوى: ${survey.usefulnessRating} / 5`
          : "",
        typeof survey.recommendationScore === "number"
          ? `الترشيح: ${survey.recommendationScore} / 10`
          : "",
        survey.mostUseful ? `الأكثر فائدة: ${survey.mostUseful}` : "",
        survey.application ? `سيطبق: ${survey.application}` : "",
        survey.improvement ? `تحسين مقترح: ${survey.improvement}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    if (!parsed.evaluation) {
      if (parsed.exerciseId === "prompt-anatomy") {
        const anatomyAnswers =
          parsed.answers && !Array.isArray(parsed.answers)
            ? parsed.answers
            : undefined;

        return anatomyAnswers
          ? [
              anatomyAnswers.tone ? `النبرة: ${anatomyAnswers.tone}` : "",
              anatomyAnswers.task ? `المهمة: ${anatomyAnswers.task}` : "",
              anatomyAnswers.context
                ? `السياق: ${anatomyAnswers.context}`
                : "",
              anatomyAnswers.role ? `الدور: ${anatomyAnswers.role}` : "",
            ]
              .filter(Boolean)
              .join(" | ")
          : answer;
      }

      if (parsed.exerciseId === "thinking-partner-crisis") {
        return [
          parsed.summary?.verifiedFact
            ? `المعلومة المتحقق منها: ${parsed.summary.verifiedFact}`
            : "",
          parsed.summary?.firstDecision
            ? `أول قرار: ${parsed.summary.firstDecision}`
            : "",
          parsed.summary?.revisedDecision
            ? `القرار المعدل: ${parsed.summary.revisedDecision}`
            : "",
          parsed.summary?.hallucination
            ? `الهلوسة المرصودة: ${parsed.summary.hallucination}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ");
      }

      if (parsed.exerciseId === "token-count") {
        const rows = Array.isArray(parsed.answers)
          ? parsed.answers.map((item) =>
              [
                item.label ?? "جملة",
                item.tokens ? `الرموز: ${item.tokens}` : "",
                item.characters ? `المحارف: ${item.characters}` : "",
              ]
                .filter(Boolean)
                .join(" - ")
            )
          : [];

        return [
          ...rows,
          parsed.reflection ? `الملاحظة: ${parsed.reflection}` : "",
        ]
          .filter(Boolean)
          .join(" | ");
      }

      return answer;
    }

    if (parsed.exerciseId === "thinking-partner-crisis") {
      return [
        `الدرجة: ${parsed.evaluation.score ?? "-"} / 100`,
        parsed.evaluation.level ? `المستوى: ${parsed.evaluation.level}` : "",
        parsed.evaluation.summary ? `الملخص: ${parsed.evaluation.summary}` : "",
        parsed.summary?.firstDecision
          ? `أول قرار: ${parsed.summary.firstDecision}`
          : "",
        parsed.summary?.revisedDecision
          ? `القرار المعدل: ${parsed.summary.revisedDecision}`
          : "",
        parsed.summary?.hallucination
          ? `الهلوسة المرصودة: ${parsed.summary.hallucination}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    if (parsed.exerciseId === "prompt-anatomy") {
      const anatomyAnswers =
        parsed.answers && !Array.isArray(parsed.answers)
          ? parsed.answers
          : undefined;

      return [
        `الدرجة: ${parsed.evaluation.score ?? "-"} / 100`,
        parsed.evaluation.level ? `المستوى: ${parsed.evaluation.level}` : "",
        parsed.evaluation.summary ? `الملخص: ${parsed.evaluation.summary}` : "",
        anatomyAnswers?.tone ? `النبرة: ${anatomyAnswers.tone}` : "",
        anatomyAnswers?.task ? `المهمة: ${anatomyAnswers.task}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    return [
      `الدرجة: ${parsed.evaluation.score ?? "-"} / 100`,
      parsed.evaluation.level ? `المستوى: ${parsed.evaluation.level}` : "",
      parsed.evaluation.summary ? `الملخص: ${parsed.evaluation.summary}` : "",
      parsed.evaluation.missingComponents?.length
        ? `مكونات تحتاج تحسيناً: ${parsed.evaluation.missingComponents.join("، ")}`
        : "",
      parsed.evaluation.nextAction
        ? `الخطوة التالية: ${parsed.evaluation.nextAction}`
        : "",
      parsed.combinedPrompt ? `الأمر الأصلي: ${parsed.combinedPrompt}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  } catch {
    return answer;
  }
}

function RingMetric({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <article className="admin-ring-card">
      <div
        className="admin-ring"
        style={{ "--ring-value": `${clampPercent(value) * 3.6}deg` } as CSSProperties}
      >
        <span>{clampPercent(value)}%</span>
      </div>
      <div>
        <strong>{label}</strong>
        <p>{caption}</p>
      </div>
    </article>
  );
}

function HorizontalBar({ item }: { item: ActivityBar }) {
  return (
    <article className="admin-bar-row">
      <div>
        <strong>{item.label}</strong>
        <span>{item.type}</span>
      </div>
      <div className="admin-bar-track" aria-label={`${item.percent}%`}>
        <span style={{ width: `${item.percent}%` }} />
      </div>
      <em>
        {item.count} / {item.percent}%
      </em>
    </article>
  );
}

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dashboard = useMemo(() => {
    if (!data) {
      return null;
    }

    const participantTotal = data.stats.participantCount;
    const completionSurveyRows = data.exerciseAnswers
      .map(parseCompletionSurveyAnswer)
      .filter((row): row is CompletionSurveyRow => row !== null);
    const exerciseRows = data.exerciseAnswers.filter(
      (answer) => answer.exercise_id !== "course-completion-survey"
    );
    const profilesByEmail = new Map(
      data.participantProfiles.map((profile) => [
        profile.participant_email,
        profile,
      ])
    );
    const surveysByEmail = new Map(
      completionSurveyRows.map((survey) => [survey.participant_email, survey])
    );
    const exerciseCountsByEmail = countBy(
      exerciseRows.map((answer) => answer.participant_email)
    );
    const assessmentCountsByEmail = countBy(
      data.assessmentAnswers.map((answer) => answer.participant_email)
    );
    const surveyCount = completionSurveyRows.length;
    const testimonialRows = completionSurveyRows.filter((row) =>
      row.testimonial?.trim()
    );
    const consentedTestimonials = testimonialRows.filter(
      (row) => !row.testimonialConsent?.startsWith("لا")
    );
    const averageExperience = average(
      completionSurveyRows.map((row) => row.experienceRating)
    );
    const averageUsefulness = average(
      completionSurveyRows.map((row) => row.usefulnessRating)
    );
    const averageRecommendation = average(
      completionSurveyRows.map((row) => row.recommendationScore)
    );
    const promoters = completionSurveyRows.filter(
      (row) => typeof row.recommendationScore === "number" && row.recommendationScore >= 9
    ).length;
    const detractors = completionSurveyRows.filter(
      (row) => typeof row.recommendationScore === "number" && row.recommendationScore <= 6
    ).length;
    const nps = surveyCount
      ? Math.round(((promoters - detractors) / surveyCount) * 100)
      : 0;
    const consentBreakdown = Object.entries(
      countBy(
        completionSurveyRows.map(
          (row) => row.testimonialConsent || "لم يتم تحديد الموافقة"
        )
      )
    ).map(([label, count]) => ({
      label,
      count,
      percent: percent(count, surveyCount),
    }));
    const activityBars: ActivityBar[] = [
      {
        label: "بطاقات تعارف المشاركين",
        type: "تعارف",
        count: data.stats.profileCount,
        percent: percent(data.stats.profileCount, participantTotal),
      },
      ...exercises.map((exercise) => {
        const count = data.exerciseAnswers.filter(
          (answer) => answer.exercise_id === exercise.id
        ).length;

        return {
          label: exercise.title,
          type: "تمرين",
          count,
          percent: percent(count, participantTotal),
        };
      }),
      ...assessments.map((assessment) => {
        const count = data.assessmentAnswers.filter(
          (answer) => answer.assessment_id === assessment.id
        ).length;

        return {
          label: assessment.title,
          type: "مقياس",
          count,
          percent: percent(count, participantTotal),
        };
      }),
    ];
    const leaderStyleCounts = Object.entries(
      countBy(
        data.assessmentAnswers
          .filter((answer) => answer.assessment_id === "ai-leader-style")
          .map((answer) => parseAssessmentPayload(answer.payload).result ?? "غير محدد")
      )
    ).map(([label, count]) => ({
      label,
      count,
      percent: percent(count, data.assessmentAnswers.length),
    }));
    const participantRows = data.participants.map((participant) => {
      const profile = profilesByEmail.get(participant.email);
      const survey = surveysByEmail.get(participant.email);
      const lastUpdated = [
        participant.updated_at,
        profile?.updated_at,
        survey?.updated_at,
      ]
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1);

      return {
        email: participant.email,
        name: profile?.name || survey?.name || participant.name || "-",
        affiliation: survey?.affiliation || "-",
        hasProfile: Boolean(profile),
        exerciseCount: exerciseCountsByEmail[participant.email] ?? 0,
        assessmentCount: assessmentCountsByEmail[participant.email] ?? 0,
        hasSurvey: Boolean(survey),
        lastUpdated: lastUpdated ?? participant.updated_at,
      };
    });
    const recentActivity: RecentActivity[] = [
      ...data.participantProfiles.map((profile) => ({
        participant: profile.participant_email,
        type: "تعارف",
        title: "بطاقة تعارف المشاركين",
        detail: profile.name,
        updated_at: profile.updated_at,
      })),
      ...exerciseRows.map((answer) => ({
        participant: answer.participant_email,
        type: "تمرين",
        title: exerciseTitleById.get(answer.exercise_id) ?? answer.exercise_id,
        detail: truncate(formatExerciseAnswer(answer.answer)),
        updated_at: answer.updated_at,
      })),
      ...completionSurveyRows.map((survey) => ({
        participant: survey.participant_email,
        type: "استبيان",
        title: "استبيان ما بعد الدورة التدريبية",
        detail: survey.testimonial || survey.mostUseful || "تم استلام الاستبيان",
        updated_at: survey.updated_at,
      })),
      ...data.assessmentAnswers.map((answer) => ({
        participant: answer.participant_email,
        type: "مقياس",
        title: assessmentTitleById.get(answer.assessment_id) ?? answer.assessment_id,
        detail: truncate(formatAssessmentPayload(answer.payload)),
        updated_at: answer.updated_at,
      })),
    ]
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 8);

    return {
      activityBars,
      averageExperience,
      averageRecommendation,
      averageUsefulness,
      completionSurveyRows,
      consentBreakdown,
      consentedTestimonials,
      exerciseRows,
      leaderStyleCounts,
      nps,
      participantRows,
      profileCoverage: percent(data.stats.profileCount, participantTotal),
      recentActivity,
      surveyCoverage: percent(surveyCount, participantTotal),
      surveyCount,
      testimonialRows,
    };
  }, [data]);

  async function load(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/dashboard", {
      headers: { "x-admin-token": token },
    });
    const nextData = await response.json();

    setIsLoading(false);

    if (!response.ok) {
      setMessage(nextData.message ?? "تعذر فتح لوحة التحكم.");
      return;
    }

    setData(nextData);
  }

  function exportCsv() {
    const url = `/api/admin/export?token=${encodeURIComponent(token)}`;
    window.location.href = url;
  }

  return (
    <div className="admin-layout">
      <form className="admin-access" onSubmit={load}>
        <label htmlFor="admin-token">رمز دخول المسؤول</label>
        <div className="entry-row">
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="أدخل الرمز"
            required
          />
          <button type="submit">{isLoading ? "جار الفتح" : "فتح اللوحة"}</button>
        </div>
        <p className="form-note">
          استخدم رمز المسؤول الذي تم تزويدك به لعرض بيانات المشاركين.
        </p>
        {message ? <p className="form-message">{message}</p> : null}
      </form>

      {data && dashboard ? (
        <>
          <section className="admin-command-center">
            <div>
              <div className="section-kicker">ملخص تنفيذي</div>
              <h2>صورة الدورة في لمحة واحدة</h2>
              <p>
                تجمع هذه اللوحة بين الحضور، المشاركة، نتائج المقاييس،
                والاستبيان الختامي حتى تظهر حالة الدورة بسرعة قبل الرجوع
                للتفاصيل.
              </p>
            </div>
            <button type="button" onClick={exportCsv}>
              تصدير CSV
            </button>
          </section>

          <section className="metrics-row infographic" aria-label="مؤشرات عامة">
            <article>
              <span>المشاركون</span>
              <strong>{data.stats.participantCount}</strong>
              <small>بريد مسجل</small>
            </article>
            <article>
              <span>بطاقات التعارف</span>
              <strong>{data.stats.profileCount}</strong>
              <small>{dashboard.profileCoverage}% من المشاركين</small>
            </article>
            <article>
              <span>إجابات التمارين</span>
              <strong>{dashboard.exerciseRows.length}</strong>
              <small>لا تشمل الاستبيان الختامي</small>
            </article>
            <article>
              <span>نتائج المقاييس</span>
              <strong>{data.stats.completedAssessmentCount}</strong>
              <small>متوسط {data.stats.averageScore || "-"}</small>
            </article>
            <article>
              <span>الاستبيان الختامي</span>
              <strong>{dashboard.surveyCount}</strong>
              <small>{dashboard.surveyCoverage}% من المشاركين</small>
            </article>
            <article>
              <span>شهادات قابلة للاستخدام</span>
              <strong>{dashboard.consentedTestimonials.length}</strong>
              <small>حسب موافقة المشارك</small>
            </article>
          </section>

          <section className="admin-visual-grid">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">مؤشرات الإكمال</div>
                  <h2>تغطية الأنشطة الأساسية</h2>
                </div>
              </div>
              <div className="admin-ring-grid">
                <RingMetric
                  label="معدل الإكمال العام"
                  value={data.stats.completionRate}
                  caption="إجابات التمارين والمقاييس مقارنة بعدد المشاركين"
                />
                <RingMetric
                  label="تغطية التعارف"
                  value={dashboard.profileCoverage}
                  caption="من أكمل بطاقة التعارف"
                />
                <RingMetric
                  label="تغطية الاستبيان"
                  value={dashboard.surveyCoverage}
                  caption="من أرسل استبيان ما بعد الدورة"
                />
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">رضا المشاركين</div>
                  <h2>قراءة الاستبيان الختامي</h2>
                </div>
              </div>
              <div className="admin-score-grid">
                <article>
                  <span>تقييم التجربة</span>
                  <strong>{dashboard.averageExperience || "-"}</strong>
                  <em>من 5</em>
                </article>
                <article>
                  <span>فائدة المحتوى</span>
                  <strong>{dashboard.averageUsefulness || "-"}</strong>
                  <em>من 5</em>
                </article>
                <article>
                  <span>متوسط الترشيح</span>
                  <strong>{dashboard.averageRecommendation || "-"}</strong>
                  <em>من 10</em>
                </article>
                <article>
                  <span>NPS</span>
                  <strong>{dashboard.nps}</strong>
                  <em>مروجون ناقص منتقدين</em>
                </article>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="section-kicker">خريطة المشاركة</div>
                <h2>اكتمال كل نشاط</h2>
              </div>
            </div>
            <div className="admin-bar-list">
              {dashboard.activityBars.map((item) => (
                <HorizontalBar item={item} key={`${item.type}-${item.label}`} />
              ))}
            </div>
          </section>

          <section className="admin-visual-grid">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">مقياس القيادة</div>
                  <h2>توزيع أنماط قيادة الذكاء الاصطناعي</h2>
                </div>
              </div>
              <div className="admin-mini-chart-list">
                {dashboard.leaderStyleCounts.length ? (
                  dashboard.leaderStyleCounts.map((item) => (
                    <HorizontalBar
                      item={{ ...item, type: "نمط", percent: item.percent }}
                      key={item.label}
                    />
                  ))
                ) : (
                  <p className="admin-empty-state">لا توجد نتائج مقياس بعد.</p>
                )}
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">موافقات الشهادات</div>
                  <h2>قابلية استخدام الاستشهادات</h2>
                </div>
              </div>
              <div className="admin-mini-chart-list">
                {dashboard.consentBreakdown.length ? (
                  dashboard.consentBreakdown.map((item) => (
                    <HorizontalBar
                      item={{ ...item, type: "موافقة", percent: item.percent }}
                      key={item.label}
                    />
                  ))
                ) : (
                  <p className="admin-empty-state">لا توجد موافقات مسجلة بعد.</p>
                )}
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="section-kicker">الشهادات</div>
                <h2>اقتباسات المشاركين</h2>
              </div>
            </div>
            {dashboard.testimonialRows.length ? (
              <div className="testimonial-card-grid">
                {dashboard.testimonialRows.map((row) => (
                  <article key={`${row.participant_email}-${row.updated_at}`}>
                    <blockquote>{row.testimonial}</blockquote>
                    <div>
                      <strong>{row.name || row.participant_email}</strong>
                      <span>{row.affiliation || row.participant_email}</span>
                      <em>{row.testimonialConsent || "لم يتم تحديد الموافقة"}</em>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="admin-empty-state">لا توجد شهادات مكتوبة بعد.</p>
            )}
          </section>

          <section className="admin-visual-grid">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">النشاط الأخير</div>
                  <h2>آخر التحديثات</h2>
                </div>
              </div>
              <div className="admin-timeline">
                {dashboard.recentActivity.map((item) => (
                  <article key={`${item.type}-${item.participant}-${item.updated_at}`}>
                    <span>{item.type}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail || item.participant}</p>
                      <small>
                        {item.participant} - {formatDate(item.updated_at)}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">ملفات المشاركين</div>
                  <h2>حالة كل مشارك</h2>
                </div>
              </div>
              <div className="participant-status-list">
                {dashboard.participantRows.map((participant) => (
                  <article key={participant.email}>
                    <div>
                      <strong>{participant.name}</strong>
                      <span>{participant.email}</span>
                    </div>
                    <div className="participant-status-badges">
                      <em data-active={participant.hasProfile}>تعارف</em>
                      <em data-active={participant.exerciseCount > 0}>
                        {participant.exerciseCount} تمرين
                      </em>
                      <em data-active={participant.assessmentCount > 0}>
                        {participant.assessmentCount} مقياس
                      </em>
                      <em data-active={participant.hasSurvey}>استبيان</em>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-table-wrap">
            <h2>المشاركون</h2>
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد</th>
                  <th>الجهة أو المسمى</th>
                  <th>التعارف</th>
                  <th>التمارين</th>
                  <th>المقاييس</th>
                  <th>الاستبيان</th>
                  <th>آخر تحديث</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.participantRows.map((participant) => (
                  <tr key={participant.email}>
                    <td>{participant.name}</td>
                    <td>{participant.email}</td>
                    <td>{participant.affiliation}</td>
                    <td>{participant.hasProfile ? "مكتمل" : "-"}</td>
                    <td>{participant.exerciseCount}</td>
                    <td>{participant.assessmentCount}</td>
                    <td>{participant.hasSurvey ? "مكتمل" : "-"}</td>
                    <td>{formatDate(participant.lastUpdated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-table-wrap">
            <h2>بطاقات تعارف المشاركين</h2>
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد</th>
                  <th>البلد</th>
                  <th>الخلفية المهنية</th>
                  <th>الاهتمامات</th>
                  <th>النموذج المستخدم</th>
                  <th>الأهداف</th>
                  <th>حقيقة ممتعة</th>
                </tr>
              </thead>
              <tbody>
                {data.participantProfiles.map((profile) => (
                  <tr key={profile.participant_email}>
                    <td>{profile.name}</td>
                    <td>{profile.participant_email}</td>
                    <td>{profile.country || "-"}</td>
                    <td>{profile.professional_background}</td>
                    <td>{profile.ai_interests}</td>
                    <td>{profile.ai_model || "-"}</td>
                    <td>{profile.course_goals}</td>
                    <td>{profile.fun_fact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-table-wrap">
            <h2>إجابات التمارين</h2>
            <table>
              <thead>
                <tr>
                  <th>المشارك</th>
                  <th>التمرين</th>
                  <th>الإجابة</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.exerciseRows.map((answer) => (
                  <tr key={`${answer.participant_email}-${answer.exercise_id}`}>
                    <td>{answer.participant_email}</td>
                    <td>{exerciseTitleById.get(answer.exercise_id) ?? answer.exercise_id}</td>
                    <td>{formatExerciseAnswer(answer.answer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-table-wrap">
            <h2>استبيان ما بعد الدورة التدريبية</h2>
            <table>
              <thead>
                <tr>
                  <th>المشارك</th>
                  <th>الاسم</th>
                  <th>المسمى أو الجهة</th>
                  <th>تقييم التجربة</th>
                  <th>فائدة المحتوى</th>
                  <th>أكثر جزء مفيد</th>
                  <th>ما سيطبقه</th>
                  <th>التحسين المقترح</th>
                  <th>الترشيح</th>
                  <th>الشهادة</th>
                  <th>الموافقة</th>
                  <th>آخر تحديث</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.completionSurveyRows.map((row) => (
                  <tr key={`${row.participant_email}-${row.updated_at}`}>
                    <td>{row.participant_email}</td>
                    <td>{row.name || "-"}</td>
                    <td>{row.affiliation || "-"}</td>
                    <td>{row.experienceRating ?? "-"}</td>
                    <td>{row.usefulnessRating ?? "-"}</td>
                    <td>{row.mostUseful || "-"}</td>
                    <td>{row.application || "-"}</td>
                    <td>{row.improvement || "-"}</td>
                    <td>{row.recommendationScore ?? "-"}</td>
                    <td>{row.testimonial || "-"}</td>
                    <td>{row.testimonialConsent || "-"}</td>
                    <td>{formatDate(row.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-table-wrap">
            <h2>نتائج الاختبارات والمقاييس</h2>
            <table>
              <thead>
                <tr>
                  <th>المشارك</th>
                  <th>المقياس</th>
                  <th>الإجابة</th>
                  <th>الدرجة</th>
                </tr>
              </thead>
              <tbody>
                {data.assessmentAnswers.map((answer) => (
                  <tr key={`${answer.participant_email}-${answer.assessment_id}`}>
                    <td>{answer.participant_email}</td>
                    <td>
                      {assessmentTitleById.get(answer.assessment_id) ??
                        answer.assessment_id}
                    </td>
                    <td>{formatAssessmentPayload(answer.payload)}</td>
                    <td>{answer.score ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}
    </div>
  );
}
