"use client";

import { FormEvent, useState } from "react";

export function LeaderImpactExercise() {
  const [hasStarted, setHasStarted] = useState(false);
  const [participantName, setParticipantName] = useState("");
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
          participantName: participantName.trim() || undefined,
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

  if (!hasStarted) {
    return (
      <div className="start-screen-container" style={{
          width: '100%', maxWidth: '600px', background: 'white', borderRadius: '16px',
          padding: '2.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0', textAlign: 'center', margin: '2rem auto'
      }}>
        <div className="start-card">
          <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1.8rem', textAlign: 'center' }}>قائد أثّر فيّ</h2>
          <p className="exercise-instructions" style={{ marginBottom: '2rem', color: '#475569', fontSize: '1.1rem' }}>
            استحضر — في صمت — قائداً واحداً ترك فيك أثراً حقيقياً.
          </p>
          <div className="name-input-group" style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <label htmlFor="participantName" style={{ fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>الاسم (اختياري):</label>
            <input
              type="text"
              id="participantName"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="اكتب اسمك هنا..."
              className="name-input"
              style={{
                flex: 1, padding: '0.75rem 1rem', border: '1px solid #cbd5e1',
                borderRadius: '8px', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button 
              className="primary-button start-button"
              onClick={() => setHasStarted(true)}
              style={{ padding: '0.75rem 2rem', background: '#1a5f5f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              ابدأ التمرين &larr;
            </button>
          </div>
        </div>
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
