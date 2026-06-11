"use client";

import { FormEvent, useState } from "react";
import { Assessment } from "@/app/lib/course-content";

type Props = {
  assessments: Assessment[];
};

export function AssessmentsWorkspace({ assessments }: Props) {
  const [email, setEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem("participantEmail") ?? ""
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>, assessment: Assessment) {
    event.preventDefault();
    setSavingId(assessment.id);
    setMessage("");

    const response = await fetch("/api/assessment-answers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        assessmentId: assessment.id,
        payload: values[assessment.id] ?? "",
      }),
    });
    const data = await response.json();

    setSavingId("");

    if (!response.ok) {
      setMessage(data.message ?? "تعذر حفظ النتيجة.");
      return;
    }

    window.sessionStorage.setItem("participantEmail", email);
    setMessage("تم حفظ إجابتك في سجل المشارك.");
  }

  return (
    <div className="assessment-stack">
      <div className="email-strip">
        <label htmlFor="assessment-email">البريد الإلكتروني</label>
        <input
          id="assessment-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
        />
      </div>

      {assessments.map((assessment) => (
        <form
          key={assessment.id}
          className="assessment-panel"
          onSubmit={(event) => submit(event, assessment)}
        >
          <div>
            <div className="section-kicker">
              {assessment.type === "scale"
                ? "تقييم ذاتي"
                : assessment.type === "choice"
                  ? "اختيار من متعدد"
                  : "سؤال مفتوح"}
            </div>
            <h2>{assessment.title}</h2>
            <p>{assessment.prompt}</p>
          </div>

          {assessment.type === "open" ? (
            <textarea
              value={values[assessment.id] ?? ""}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [assessment.id]: event.target.value,
                }))
              }
              rows={4}
              placeholder="اكتب إجابتك المختصرة..."
              required
            />
          ) : (
            <div className="choice-grid">
              {assessment.options?.map((option) => (
                <label key={option} className="choice-option">
                  <input
                    type="radio"
                    name={assessment.id}
                    value={option}
                    checked={values[assessment.id] === option}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [assessment.id]: event.target.value,
                      }))
                    }
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          <button type="submit" disabled={savingId === assessment.id}>
            {savingId === assessment.id ? "جار الحفظ" : "حفظ النتيجة"}
          </button>
        </form>
      ))}

      {message ? <p className="form-message">{message}</p> : null}
    </div>
  );
}
