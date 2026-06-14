"use client";

import { FormEvent, useState } from "react";

type DashboardData = {
  participants: Array<{ email: string; updated_at: string }>;
  participantProfiles: Array<{
    participant_email: string;
    name: string;
    professional_background: string;
    ai_interests: string;
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
  experienceRating?: number;
  usefulnessRating?: number;
  mostUseful?: string;
  application?: string;
  improvement?: string;
  recommendationScore?: number;
  testimonial?: string;
  testimonialConsent?: string;
  submittedAt?: string;
};

type CompletionSurveyRow = CompletionSurveyPayload & {
  participant_email: string;
  updated_at: string;
};

function formatAssessmentPayload(payload: string) {
  try {
    const parsed = JSON.parse(payload) as {
      result?: string;
      distribution?: Record<string, number>;
    };
    const distribution = parsed.distribution
      ? Object.entries(parsed.distribution)
          .map(([name, value]) => `${name}: ${value}%`)
          .join("، ")
      : "";

    return [parsed.result ? `النتيجة: ${parsed.result}` : "", distribution]
      .filter(Boolean)
      .join(" | ");
  } catch {
    return payload;
  }
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

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const completionSurveyRows =
    data?.exerciseAnswers
      .map(parseCompletionSurveyAnswer)
      .filter((row): row is CompletionSurveyRow => row !== null) ?? [];
  const exerciseRows =
    data?.exerciseAnswers.filter(
      (answer) => answer.exercise_id !== "course-completion-survey"
    ) ?? [];

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

      {data ? (
        <>
          <section className="metrics-row" aria-label="مؤشرات عامة">
            <article>
              <span>المشاركون</span>
              <strong>{data.stats.participantCount}</strong>
            </article>
            <article>
              <span>بطاقات التعارف</span>
              <strong>{data.stats.profileCount}</strong>
            </article>
            <article>
              <span>إجابات التمارين</span>
              <strong>{data.stats.completedExerciseCount}</strong>
            </article>
            <article>
              <span>نتائج المقاييس</span>
              <strong>{data.stats.completedAssessmentCount}</strong>
            </article>
            <article>
              <span>معدل الإكمال</span>
              <strong>{data.stats.completionRate}%</strong>
            </article>
            <article>
              <span>متوسط النتائج</span>
              <strong>{data.stats.averageScore}</strong>
            </article>
          </section>

          <div className="admin-actions">
            <button type="button" onClick={exportCsv}>
              تصدير CSV
            </button>
          </div>

          <section className="admin-table-wrap">
            <h2>المشاركون</h2>
            <table>
              <thead>
                <tr>
                  <th>البريد</th>
                  <th>آخر تحديث</th>
                </tr>
              </thead>
              <tbody>
                {data.participants.map((participant) => (
                  <tr key={participant.email}>
                    <td>{participant.email}</td>
                    <td>{new Date(participant.updated_at).toLocaleString("ar")}</td>
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
                  <th>الخلفية المهنية</th>
                  <th>الاهتمامات</th>
                  <th>الأهداف</th>
                  <th>حقيقة ممتعة</th>
                </tr>
              </thead>
              <tbody>
                {data.participantProfiles.map((profile) => (
                  <tr key={profile.participant_email}>
                    <td>{profile.name}</td>
                    <td>{profile.participant_email}</td>
                    <td>{profile.professional_background}</td>
                    <td>{profile.ai_interests}</td>
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
                {exerciseRows.map((answer) => (
                  <tr key={`${answer.participant_email}-${answer.exercise_id}`}>
                    <td>{answer.participant_email}</td>
                    <td>{answer.exercise_id}</td>
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
                {completionSurveyRows.map((row) => (
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
                    <td>{new Date(row.updated_at).toLocaleString("ar")}</td>
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
                    <td>{answer.assessment_id}</td>
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
