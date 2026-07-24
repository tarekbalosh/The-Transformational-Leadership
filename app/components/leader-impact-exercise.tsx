"use client";

import { FormEvent, useState } from "react";

export function LeaderImpactExercise() {
  const [reason, setReason] = useState("");
  const [behavior1, setBehavior1] = useState("");
  const [behavior2, setBehavior2] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const email =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("participantEmail") ?? ""
          : "";

      const answerPayload = JSON.stringify({
        exerciseId: "leader-impact",
        answers: {
          reason,
          behavior1,
          behavior2,
        },
      });

      const response = await fetch("/api/exercise-answers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          exerciseId: "leader-impact",
          email,
          answer: answerPayload,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(
          (data as { message?: string }).message ?? "تعذر حفظ الإجابة. حاول مرة أخرى."
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("حدث خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="exercise-success-card">
        <div className="exercise-success-icon">✓</div>
        <h2>شكراً على مشاركتك!</h2>
        <p>
          تم حفظ إجابتك. هذا القائد الذي استحضرته هو بداية رحلتنا في فهم القيادة
          التحويلية.
        </p>
      </div>
    );
  }

  return (
    <div className="leader-impact-exercise">
      {/* Hero Banner */}
      <div className="leader-impact-banner">
        <p className="leader-impact-banner-sub">
          قبل أن نُعرّف القيادة… لنستدعِها من ذاكرتنا.
        </p>
        <h2 className="leader-impact-banner-title">قائد أثّر فيّ</h2>
        <p className="leader-impact-banner-desc">
          استحضر — في صمت — قائداً واحداً ترك فيك أثراً حقيقياً (مدير، معلّم،
          أب، ضابط، مدرّب…).
        </p>
      </div>

      {/* Form */}
      <form className="leader-impact-form" onSubmit={handleSubmit}>
        {/* Reason */}
        <div className="leader-impact-field">
          <label className="leader-impact-label">لماذا اخترت هذا القائد؟</label>
          <p className="leader-impact-hint">
            بجملة واحدة — ما الذي جعله يترك فيك أثراً حقيقياً؟
          </p>
          <textarea
            className="leader-impact-textarea"
            placeholder="لأنه…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
          />
        </div>

        {/* Behavior 1 */}
        <div className="leader-impact-field">
          <label className="leader-impact-label">السلوك الأول</label>
          <p className="leader-impact-hint">
            سلوكاً محدداً لا صفة عامة —{" "}
            <span className="hint-good">✅ «اعترف أمامنا بخطئه»</span>{" "}
            <span className="hint-bad">✗ «متواضع»</span>
          </p>
          <textarea
            className="leader-impact-textarea"
            placeholder="ما الذي فعله تحديداً؟"
            value={behavior1}
            onChange={(e) => setBehavior1(e.target.value)}
            rows={2}
            required
          />
        </div>

        {/* Behavior 2 */}
        <div className="leader-impact-field">
          <label className="leader-impact-label">السلوك الثاني</label>
          <textarea
            className="leader-impact-textarea"
            placeholder="سلوك آخر جعلك تثق به…"
            value={behavior2}
            onChange={(e) => setBehavior2(e.target.value)}
            rows={2}
            required
          />
        </div>

        <button
          type="submit"
          className="leader-impact-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جار الإرسال…" : "إرسال"}
        </button>

        {errorMessage && (
          <p
            style={{
              marginTop: "12px",
              color: "#ef4444",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
