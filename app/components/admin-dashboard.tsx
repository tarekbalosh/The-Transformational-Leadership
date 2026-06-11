"use client";

import { FormEvent, useState } from "react";

type DashboardData = {
  participants: Array<{ email: string; updated_at: string }>;
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
    completedExerciseCount: number;
    completedAssessmentCount: number;
    completionRate: number;
    averageScore: number;
  };
};

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
        <p className="form-note">الرمز الافتراضي للنسخة الأولى: ai-leaders-admin-2026</p>
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
                    <td>{answer.answer}</td>
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
                    <td>{answer.payload}</td>
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
