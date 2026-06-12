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

function formatExerciseAnswer(answer: string) {
  try {
    const parsed = JSON.parse(answer) as {
      combinedPrompt?: string;
      evaluation?: {
        score?: number;
        level?: string;
        summary?: string;
        missingComponents?: string[];
        nextAction?: string;
      };
    };

    if (!parsed.evaluation) {
      return answer;
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
                {data.exerciseAnswers.map((answer) => (
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
