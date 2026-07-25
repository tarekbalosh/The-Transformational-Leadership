"use client";

import { useState } from "react";
import { exerciseData } from "@/app/data/transformational-vs-narcissistic";

type Phase = "intro" | "cases" | "review" | "results";

export function TransformationalVsNarcissisticExercise() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [participantName, setParticipantName] = useState(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage.getItem("participantName") || "";
    }
    return "";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage.getItem("participantEmail") || "";
    }
    return "";
  });
  const [emailError, setEmailError] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = exerciseData.questions;
  const totalQuestions = questions.length;

  /* ─── helpers ─── */
  const calculateScore = () => {
    let total = 0;
    Object.entries(answers).forEach(([qi, optId]) => {
      const q = questions[parseInt(qi)];
      const opt = q.options.find((o) => o.id === optId);
      if (opt) total += opt.score;
    });
    return total;
  };

  const getResultFeedback = (score: number) => {
    const r = exerciseData.results.find((r) => score >= r.min && score <= r.max);
    return r?.text ?? "";
  };

  const submitResults = async () => {
    setIsSubmitting(true);
    const storedEmail =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("participantEmail") ?? ""
        : "";
    const score = calculateScore();
    try {
      await fetch("/api/exercise-answers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          exerciseId: "transformational-vs-narcissistic",
          email: storedEmail,
          participantName: participantName.trim() || undefined,
          answer: JSON.stringify({
            exerciseId: "transformational-vs-narcissistic",
            answers,
            evaluation: {
              score: Math.round((score / exerciseData.meta.totalScore) * 100),
              level: getResultFeedback(score),
            },
          }),
        }),
      });
    } catch (e) {
      console.error("Failed to save answers", e);
    } finally {
      setIsSubmitting(false);
      setReviewIndex(0);
      setPhase("review");
      window.scrollTo(0, 0);
    }
  };

  const restartExercise = () => {
    setAnswers({});
    setCurrentIndex(0);
    setReviewIndex(0);
    setPhase("intro");
    window.scrollTo(0, 0);
  };

  /* ─── PHASE: INTRO ─── */
  if (phase === "intro") {
    return (
      <div className="tvn-wrapper">
        <div className="tvn-intro-card">
          {/* Header */}
          <div className="tvn-intro-header">
            <div className="tvn-badge">تمرين تشخيصي تفاعلي</div>
            <h1 className="tvn-intro-title">{exerciseData.title}</h1>
            <p className="tvn-intro-subtitle">{exerciseData.subtitle}</p>
          </div>

          {/* Stats row */}
          <div className="tvn-stats-row">
            <div className="tvn-stat">
              <span className="tvn-stat-num">{exerciseData.meta.totalCases}</span>
              <span className="tvn-stat-label">حالة</span>
            </div>
            <div className="tvn-stat-sep" />
            <div className="tvn-stat">
              <span className="tvn-stat-num">{exerciseData.meta.optionsPerCase}</span>
              <span className="tvn-stat-label">بدائل لكل حالة</span>
            </div>
            <div className="tvn-stat-sep" />
            <div className="tvn-stat">
              <span className="tvn-stat-num">~{exerciseData.meta.estimatedMinutes}</span>
              <span className="tvn-stat-label">دقيقة</span>
            </div>
          </div>

          {/* Concept */}
          <div className="tvn-concept-box">
            <h2 className="tvn-section-title">الفكرة الأساسية</h2>
            <p className="tvn-concept-text">{exerciseData.concept}</p>
            <div className="tvn-concept-grid">
              <div className="tvn-concept-col tvn-col-similar">
                <h3>ما قد يبدو متشابهًا</h3>
                <ul>
                  {exerciseData.conceptPoints.similar.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="tvn-concept-col tvn-col-reveals">
                <h3>ما يكشف النمط</h3>
                <ul>
                  {exerciseData.conceptPoints.reveals.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="tvn-guidelines-box">
            <h2 className="tvn-section-title">إرشادات</h2>
            <p className="tvn-guidelines-text">{exerciseData.guidelines}</p>
          </div>

          {/* Disclaimer */}
          <div className="tvn-disclaimer-box">
            <span className="tvn-disclaimer-icon">⚠️</span>
            <p className="tvn-disclaimer-text">{exerciseData.disclaimer}</p>
          </div>

          {/* Entry form */}
          <div className="tvn-form-section">
            <div className="tvn-form-row">
              <label htmlFor="tvn-email">البريد الإلكتروني</label>
              <input
                id="tvn-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="example@domain.com"
                className={`tvn-input ${emailError ? 'tvn-input-error' : ''}`}
              />
            </div>
            {emailError && <div className="tvn-error-msg">{emailError}</div>}
            
            <div className="tvn-form-row">
              <label htmlFor="tvn-name">الاسم (اختياري)</label>
              <input
                id="tvn-name"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="اكتب اسمك هنا..."
                className="tvn-input"
              />
            </div>
          </div>

          {/* Start button */}
          <button
            className="tvn-start-btn"
            onClick={() => {
              if (!email || !email.includes("@")) {
                setEmailError("يرجى إدخال بريد إلكتروني صحيح لبدء التمرين.");
                return;
              }
              window.sessionStorage.setItem("participantEmail", email);
              window.sessionStorage.setItem("participantName", participantName);
              setPhase("cases");
              window.scrollTo(0, 0);
            }}
          >
            أنا مستعد — ابدأ التمرين ←
          </button>
        </div>

        <Style />
      </div>
    );
  }

  /* ─── PHASE: CASES ─── */
  if (phase === "cases") {
    const q = questions[currentIndex];
    const selected = answers[currentIndex];
    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    const isLast = currentIndex === totalQuestions - 1;

    return (
      <div className="tvn-wrapper">
        {/* Progress bar */}
        <div className="tvn-progress-track">
          <div className="tvn-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="tvn-case-card">
          <div className="tvn-case-counter">
            الحالة {currentIndex + 1} من {totalQuestions}
          </div>

          <div className="tvn-case-body" key={currentIndex}>
            <div className="tvn-case-text-box">
              <p className="tvn-case-text">{q.text}</p>
            </div>
            <p className="tvn-case-question">ما التصنيف الأدق؟</p>

            <div className="tvn-options-list">
              {q.options.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`tvn-option${isSelected ? " tvn-option-selected" : ""}`}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentIndex]: opt.id }))
                    }
                  >
                    <span className="tvn-option-label">{opt.label}</span>
                    <span className="tvn-option-text">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tvn-nav">
            <button
              className="tvn-nav-prev"
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((p) => p - 1);
                  window.scrollTo(0, 0);
                }
              }}
              disabled={currentIndex === 0}
            >
              <span style={{ fontSize: '18px', display: 'inline-block', lineHeight: 1 }}>&rarr;</span> العودة للسؤال السابق
            </button>

            {!isLast ? (
              <button
                className="tvn-nav-next"
                onClick={() => {
                  setCurrentIndex((p) => p + 1);
                  window.scrollTo(0, 0);
                }}
                disabled={!selected}
              >
                التالي
              </button>
            ) : (
              <button
                className="tvn-nav-finish"
                onClick={submitResults}
                disabled={!selected || isSubmitting}
              >
                {isSubmitting ? "جاري الحفظ..." : "عرض المراجعة"}
              </button>
            )}
          </div>
        </div>

        <Style />
      </div>
    );
  }

  /* ─── PHASE: REVIEW ─── */
  if (phase === "review") {
    const q = questions[reviewIndex];
    const userAnswerId = answers[reviewIndex];
    const userOpt = q.options.find((o) => o.id === userAnswerId);
    const bestOpt = q.options.reduce((prev, cur) =>
      cur.score > prev.score ? cur : prev
    );
    const isCorrect = userOpt?.id === bestOpt.id;
    const isLastReview = reviewIndex === totalQuestions - 1;

    return (
      <div className="tvn-wrapper">
        {/* Review progress */}
        <div className="tvn-progress-track">
          <div
            className="tvn-progress-fill tvn-progress-review"
            style={{ width: `${((reviewIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <div className="tvn-review-header-bar">
          <span className="tvn-review-label">مرحلة المراجعة</span>
          <span className="tvn-review-counter">
            {reviewIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="tvn-review-card" key={reviewIndex}>
          <h3 className="tvn-review-case-title">الحالة {q.id}</h3>
          <div className="tvn-review-case-text-box">
            <p className="tvn-review-case-text">{q.text}</p>
          </div>

          {/* All three options with scores */}
          <div className="tvn-review-options">
            {q.options.map((opt) => {
              const isUser = opt.id === userAnswerId;
              const isBest = opt.id === bestOpt.id;
              let cls = "tvn-review-opt";
              if (isUser && isBest) cls += " tvn-review-opt-correct";
              else if (isUser && !isBest) cls += " tvn-review-opt-wrong";
              else if (!isUser && isBest) cls += " tvn-review-opt-best";

              return (
                <div key={opt.id} className={cls}>
                  <div className="tvn-review-opt-header">
                    <span className="tvn-review-opt-label">{opt.label}. {opt.text}</span>
                    <span className="tvn-review-opt-score">{opt.score} / 5</span>
                  </div>
                  {(isUser || isBest) && (
                    <div className="tvn-review-opt-tags">
                      {isUser && (
                        <span className="tvn-tag tvn-tag-user">اختيارك</span>
                      )}
                      {isBest && (
                        <span className="tvn-tag tvn-tag-best">الأدق</span>
                      )}
                    </div>
                  )}
                  <p className="tvn-review-explanation">{opt.explanation}</p>
                  <p className="tvn-review-rule">
                    <strong>{opt.ruleId}:</strong> {opt.ruleText}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Core rule */}
          <div className="tvn-core-rule-box">
            <span className="tvn-core-rule-icon">🔑</span>
            <div>
              <strong>قاعدة السؤال:</strong>
              <p>{q.coreRule}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="tvn-nav">
            <button
              className="tvn-nav-prev"
              onClick={() => {
                if (reviewIndex > 0) {
                  setReviewIndex((p) => p - 1);
                  window.scrollTo(0, 0);
                }
              }}
              disabled={reviewIndex === 0}
            >
              <span style={{ fontSize: '18px', display: 'inline-block', lineHeight: 1 }}>&rarr;</span> العودة للسؤال السابق
            </button>
            {!isLastReview ? (
              <button
                className="tvn-nav-next"
                onClick={() => {
                  setReviewIndex((p) => p + 1);
                  window.scrollTo(0, 0);
                }}
              >
                الحالة التالية
              </button>
            ) : (
              <button
                className="tvn-nav-finish"
                onClick={() => {
                  setPhase("results");
                  window.scrollTo(0, 0);
                }}
              >
                عرض النتيجة النهائية ←
              </button>
            )}
          </div>
        </div>

        <Style />
      </div>
    );
  }

  /* ─── PHASE: RESULTS ─── */
  const finalScore = calculateScore();
  const feedback = getResultFeedback(finalScore);
  const percent = Math.round((finalScore / exerciseData.meta.totalScore) * 100);

  return (
    <div className="tvn-wrapper">
      <div className="tvn-results-card">
        {/* Score hero */}
        <div className="tvn-score-hero">
          <div className="tvn-score-circle">
            <span className="tvn-score-num">{finalScore}</span>
            <span className="tvn-score-denom">/ {exerciseData.meta.totalScore}</span>
          </div>
          <div className="tvn-score-percent">{percent}%</div>
          <h2 className="tvn-results-title">نتيجتك النهائية</h2>
          <p className="tvn-results-feedback">{feedback}</p>
        </div>

        {/* Answers table */}
        <div className="tvn-answers-table-section">
          <h3 className="tvn-table-title">اختياراتك ودرجاتها</h3>
          <table className="tvn-answers-table">
            <thead>
              <tr>
                <th>الحالة</th>
                <th>اختيارك</th>
                <th>درجتك</th>
                <th>الأدق</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => {
                const userOpt = q.options.find((o) => o.id === answers[idx]);
                const bestOpt = q.options.reduce((prev, cur) =>
                  cur.score > prev.score ? cur : prev
                );
                const isCorrect = userOpt?.id === bestOpt.id;
                return (
                  <tr key={idx} className={isCorrect ? "tvn-row-ok" : "tvn-row-miss"}>
                    <td className="tvn-td-center">{idx + 1}</td>
                    <td>
                      <span className="tvn-opt-badge">{userOpt?.label}</span>{" "}
                      <span className="tvn-opt-short">{userOpt?.text}</span>
                    </td>
                    <td className="tvn-td-center">
                      <span className={`tvn-score-chip ${isCorrect ? "tvn-chip-ok" : "tvn-chip-miss"}`}>
                        {userOpt?.score} / 5
                      </span>
                    </td>
                    <td className="tvn-td-center">
                      {isCorrect ? (
                        <span className="tvn-check">✓</span>
                      ) : (
                        <span className="tvn-opt-badge tvn-badge-best">{bestOpt.label}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="tvn-total-label">المجموع الكلي</td>
                <td colSpan={2} className="tvn-total-score">{finalScore} / {exerciseData.meta.totalScore}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action buttons */}
        <div className="tvn-results-actions">
          <button
            className="tvn-action-review"
            onClick={() => {
              setReviewIndex(0);
              setPhase("review");
              window.scrollTo(0, 0);
            }}
          >
            مراجعة الإجابات النموذجية مرة أخرى
          </button>
          <button className="tvn-action-restart" onClick={restartExercise}>
            إعادة التمرين
          </button>
          <button className="tvn-action-print" onClick={() => window.print()}>
            طباعة التقرير
          </button>
        </div>
      </div>

      <Style />
    </div>
  );
}

/* ─── STYLES ─── */
function Style() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* ── Layout ── */
      .tvn-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding-bottom: 4rem;
        font-family: 'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif;
        direction: rtl;
      }

      /* ── Progress bar ── */
      .tvn-progress-track {
        width: 100%;
        max-width: 760px;
        height: 6px;
        background: #e2e8f0;
        border-radius: 99px;
        margin-bottom: 2rem;
        overflow: hidden;
      }
      .tvn-progress-fill {
        height: 100%;
        background: #1a5f5f;
        border-radius: 99px;
        transition: width 0.4s ease;
      }
      .tvn-progress-review {
        background: linear-gradient(90deg, #6366f1, #818cf8);
      }

      /* ── INTRO CARD ── */
      .tvn-intro-card {
        width: 100%;
        max-width: 760px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.09);
        overflow: hidden;
      }

      .tvn-intro-header {
        background: linear-gradient(135deg, #0f2027, #1a3a4a, #203a43);
        padding: 3rem 2.5rem 2.5rem;
        text-align: center;
        color: #fff;
      }

      .tvn-badge {
        display: inline-block;
        background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.3);
        color: #fbbf24;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        padding: 0.3rem 1rem;
        border-radius: 99px;
        margin-bottom: 1rem;
      }

      .tvn-intro-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #fff;
        margin: 0 0 0.5rem;
        line-height: 1.3;
      }

      .tvn-intro-subtitle {
        color: #94a3b8;
        font-size: 1rem;
        margin: 0;
      }

      /* Stats */
      .tvn-stats-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #f1f5f9;
        background: #f8fafc;
      }
      .tvn-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        flex: 1;
      }
      .tvn-stat-num {
        font-size: 2rem;
        font-weight: 800;
        color: #0f172a;
      }
      .tvn-stat-label {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 500;
      }
      .tvn-stat-sep {
        width: 1px;
        height: 40px;
        background: #e2e8f0;
      }

      /* Sections */
      .tvn-concept-box,
      .tvn-guidelines-box {
        padding: 2rem 2.5rem;
        border-bottom: 1px solid #f1f5f9;
      }

      .tvn-section-title {
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .tvn-section-title::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 18px;
        background: #1a5f5f;
        border-radius: 2px;
      }

      .tvn-concept-text {
        color: #334155;
        font-size: 0.97rem;
        line-height: 1.8;
        margin-bottom: 1.25rem;
      }

      .tvn-concept-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .tvn-concept-col {
        background: #f8fafc;
        border-radius: 10px;
        padding: 1rem 1.25rem;
      }
      .tvn-concept-col h3 {
        font-size: 0.82rem;
        font-weight: 700;
        margin: 0 0 0.6rem;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .tvn-concept-col ul {
        margin: 0;
        padding: 0 1rem 0 0;
        list-style: disc;
        color: #334155;
        font-size: 0.93rem;
        line-height: 1.9;
      }
      .tvn-col-similar { border-right: 3px solid #1a5f5f; }
      .tvn-col-reveals { border-right: 3px solid #6366f1; }
      .tvn-col-similar h3 { color: #1a5f5f; }
      .tvn-col-reveals h3 { color: #4f46e5; }

      .tvn-guidelines-text {
        color: #334155;
        font-size: 0.97rem;
        line-height: 1.85;
        margin: 0;
      }

      /* Disclaimer */
      .tvn-disclaimer-box {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        background: #fffbeb;
        border: 1px solid #fde68a;
        margin: 0 2.5rem;
        border-radius: 10px;
        padding: 1rem 1.25rem;
        margin-top: 1.5rem;
      }
      .tvn-disclaimer-icon { font-size: 1.1rem; flex-shrink: 0; }
      .tvn-disclaimer-text {
        color: #78350f;
        font-size: 0.88rem;
        line-height: 1.7;
        margin: 0;
        font-weight: 500;
      }

      /* Form */
      .tvn-form-section {
        padding: 1.5rem 2.5rem 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .tvn-form-row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .tvn-form-row label {
        width: 140px;
        flex-shrink: 0;
        font-weight: 600;
        color: #0f172a;
        font-size: 0.93rem;
      }
      .tvn-input {
        flex: 1;
        padding: 0.65rem 1rem;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;
        background: #f8fafc;
      }
      .tvn-input:focus { border-color: #6366f1; background: #fff; }
      .tvn-input-error { border-color: #ef4444 !important; }
      .tvn-error-msg {
        color: #ef4444;
        font-size: 0.85rem;
        margin: -0.25rem 0 0 160px;
      }

      /* Start button */
      .tvn-start-btn {
        display: block;
        width: calc(100% - 5rem);
        margin: 1.5rem 2.5rem 2.5rem;
        padding: 1rem;
        background: #1a5f5f;
        color: #fff;
        font-size: 1.1rem;
        font-weight: 700;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s;
        box-shadow: 0 4px 16px rgba(26,95,95,0.35);
        letter-spacing: 0.02em;
      }
      .tvn-start-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(26,95,95,0.4);
      }

      /* ── CASE CARD ── */
      .tvn-case-card {
        width: 100%;
        max-width: 760px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.09);
        padding: 2.5rem;
        overflow: hidden;
      }

      .tvn-case-counter {
        text-align: center;
        font-size: 0.9rem;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 1.5rem;
        letter-spacing: 0.02em;
      }

      .tvn-case-body {
        animation: tvnFadeIn 0.35s ease forwards;
      }
      @keyframes tvnFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .tvn-case-text-box {
        background: #f8fafc;
        border-right: 4px solid #6366f1;
        border-radius: 0 10px 10px 0;
        padding: 1.25rem 1.5rem;
        margin-bottom: 1.5rem;
      }
      .tvn-case-text {
        color: #1e293b;
        font-size: 1.05rem;
        line-height: 2;
        margin: 0;
      }

      .tvn-case-question {
        text-align: center;
        font-size: 1.1rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 1.25rem;
      }

      .tvn-options-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 2rem;
      }

      .tvn-option {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        background: #fff;
      }
      .tvn-option:hover {
        border-color: #c7d2fe;
        background: #f5f3ff;
        transform: translateY(-1px);
      }
      .tvn-option-selected {
        border-color: #6366f1 !important;
        background: #eef2ff !important;
        box-shadow: 0 2px 8px rgba(99,102,241,0.15);
      }
      .tvn-option-label {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #e2e8f0;
        font-weight: 700;
        font-size: 0.85rem;
        color: #475569;
        transition: all 0.2s;
      }
      .tvn-option-selected .tvn-option-label {
        background: #6366f1;
        color: #fff;
      }
      .tvn-option-text {
        flex: 1;
        font-size: 1rem;
        color: #334155;
        line-height: 1.6;
        font-weight: 500;
      }
      .tvn-option-selected .tvn-option-text {
        color: #3730a3;
      }

      /* ── Nav buttons ── */
      .tvn-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #f1f5f9;
        padding-top: 1.5rem;
        gap: 1rem;
      }
      .tvn-nav-prev {
        background: #fff;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        color: #64748b;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        transition: all 0.2s ease;
      }
      .tvn-nav-prev:hover:not(:disabled) { 
        background: #f1f5f9;
        color: #0f172a; 
      }
      .tvn-nav-prev:disabled { opacity: 0.4; cursor: not-allowed; }

      .tvn-nav-next {
        padding: 0.7rem 2rem;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(99,102,241,0.25);
      }
      .tvn-nav-next:hover:not(:disabled) { transform: translateY(-1px); }
      .tvn-nav-next:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

      .tvn-nav-finish {
        padding: 0.7rem 2rem;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, #f97316, #ea580c);
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(249,115,22,0.3);
      }
      .tvn-nav-finish:hover:not(:disabled) { transform: translateY(-1px); }
      .tvn-nav-finish:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

      /* ── REVIEW ── */
      .tvn-review-header-bar {
        width: 100%;
        max-width: 760px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .tvn-review-label {
        font-size: 0.85rem;
        font-weight: 700;
        color: #6366f1;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .tvn-review-counter {
        font-size: 0.9rem;
        font-weight: 600;
        color: #64748b;
      }

      .tvn-review-card {
        width: 100%;
        max-width: 760px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.09);
        padding: 2.5rem;
        animation: tvnFadeIn 0.35s ease forwards;
      }

      .tvn-review-case-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: #6366f1;
        margin: 0 0 1rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .tvn-review-case-text-box {
        background: #f8fafc;
        border-right: 4px solid #6366f1;
        border-radius: 0 10px 10px 0;
        padding: 1rem 1.25rem;
        margin-bottom: 1.75rem;
      }
      .tvn-review-case-text {
        color: #334155;
        font-size: 0.97rem;
        line-height: 1.85;
        margin: 0;
      }

      /* Review options */
      .tvn-review-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .tvn-review-opt {
        border: 1.5px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem 1.25rem;
        background: #f8fafc;
      }
      .tvn-review-opt-correct {
        border-color: #22c55e;
        background: #f0fdf4;
      }
      .tvn-review-opt-wrong {
        border-color: #f59e0b;
        background: #fffbeb;
      }
      .tvn-review-opt-best {
        border-color: #22c55e;
        background: #f0fdf4;
        border-style: dashed;
      }

      .tvn-review-opt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .tvn-review-opt-label {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        line-height: 1.5;
        flex: 1;
      }
      .tvn-review-opt-score {
        flex-shrink: 0;
        font-size: 1rem;
        font-weight: 800;
        color: #0f172a;
        background: #fff;
        border: 1.5px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.2rem 0.6rem;
      }
      .tvn-review-opt-correct .tvn-review-opt-score { border-color: #86efac; color: #166534; }
      .tvn-review-opt-wrong .tvn-review-opt-score { border-color: #fcd34d; color: #92400e; }

      .tvn-review-opt-tags {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.6rem;
      }
      .tvn-tag {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.2rem 0.65rem;
        border-radius: 99px;
      }
      .tvn-tag-user {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fcd34d;
      }
      .tvn-tag-best {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #86efac;
      }

      .tvn-review-explanation {
        color: #475569;
        font-size: 0.92rem;
        line-height: 1.75;
        margin: 0.25rem 0 0.5rem;
      }
      .tvn-review-rule {
        color: #334155;
        font-size: 0.9rem;
        line-height: 1.7;
        margin: 0;
        background: #f1f5f9;
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
      }

      /* Core rule */
      .tvn-core-rule-box {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        background: #eff6ff;
        border: 1.5px solid #bfdbfe;
        border-radius: 12px;
        padding: 1rem 1.25rem;
        margin-bottom: 2rem;
        color: #1e3a8a;
        font-size: 0.95rem;
        line-height: 1.7;
      }
      .tvn-core-rule-icon { font-size: 1.2rem; flex-shrink: 0; }
      .tvn-core-rule-box p { margin: 0.25rem 0 0; color: #1e40af; }

      /* ── RESULTS ── */
      .tvn-results-card {
        width: 100%;
        max-width: 760px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.09);
        overflow: hidden;
      }

      .tvn-score-hero {
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        padding: 3rem 2rem;
        text-align: center;
        color: #fff;
      }

      .tvn-score-circle {
        display: inline-flex;
        align-items: baseline;
        gap: 0.25rem;
        background: rgba(255,255,255,0.12);
        border: 2px solid rgba(255,255,255,0.25);
        border-radius: 50%;
        width: 110px;
        height: 110px;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin-bottom: 0.75rem;
      }
      .tvn-score-num {
        font-size: 2.4rem;
        font-weight: 900;
        color: #fbbf24;
        line-height: 1;
      }
      .tvn-score-denom {
        font-size: 1rem;
        color: #94a3b8;
        font-weight: 600;
      }
      .tvn-score-percent {
        font-size: 1.2rem;
        font-weight: 700;
        color: #fbbf24;
        margin-bottom: 0.5rem;
      }
      .tvn-results-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #fff;
        margin: 0 0 1rem;
      }
      .tvn-results-feedback {
        font-size: 1rem;
        color: #cbd5e1;
        line-height: 1.8;
        max-width: 560px;
        margin: 0 auto;
      }

      /* Answers table */
      .tvn-answers-table-section {
        padding: 2rem 2.5rem;
        border-bottom: 1px solid #f1f5f9;
      }
      .tvn-table-title {
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 1.25rem;
      }
      .tvn-answers-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.92rem;
      }
      .tvn-answers-table th {
        background: #f8fafc;
        color: #475569;
        font-weight: 700;
        font-size: 0.82rem;
        padding: 0.6rem 0.75rem;
        text-align: right;
        border-bottom: 2px solid #e2e8f0;
      }
      .tvn-answers-table td {
        padding: 0.65rem 0.75rem;
        border-bottom: 1px solid #f1f5f9;
        color: #334155;
        vertical-align: middle;
      }
      .tvn-td-center { text-align: center; }
      .tvn-row-ok td { background: #f0fdf4; }
      .tvn-row-miss td { background: #fffbeb; }

      .tvn-opt-badge {
        display: inline-flex;
        width: 22px;
        height: 22px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #e2e8f0;
        font-weight: 700;
        font-size: 0.78rem;
        color: #475569;
        flex-shrink: 0;
      }
      .tvn-badge-best { background: #dcfce7; color: #166534; }
      .tvn-opt-short {
        font-size: 0.85rem;
        color: #64748b;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tvn-score-chip {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 99px;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .tvn-chip-ok { background: #dcfce7; color: #166534; }
      .tvn-chip-miss { background: #fef9c3; color: #92400e; }
      .tvn-check { color: #16a34a; font-weight: 800; font-size: 1.1rem; }

      .tvn-answers-table tfoot td {
        font-weight: 700;
        background: #f8fafc;
        border-top: 2px solid #e2e8f0;
        font-size: 1rem;
      }
      .tvn-total-label { color: #0f172a; }
      .tvn-total-score { text-align: center; color: #f97316; font-size: 1.2rem; }

      /* Result action buttons */
      .tvn-results-actions {
        padding: 2rem 2.5rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .tvn-action-review {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: 1.5px solid #6366f1;
        background: #fff;
        color: #4f46e5;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tvn-action-review:hover { background: #eef2ff; }
      .tvn-action-restart {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: 1.5px solid #cbd5e1;
        background: #fff;
        color: #475569;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tvn-action-restart:hover { background: #f1f5f9; }
      .tvn-action-print {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #f97316, #ea580c);
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(249,115,22,0.3);
      }
      .tvn-action-print:hover { transform: translateY(-1px); }

      /* ── Responsive ── */
      @media (max-width: 640px) {
        .tvn-intro-title { font-size: 1.6rem; }
        .tvn-intro-card, .tvn-case-card, .tvn-review-card, .tvn-results-card { border-radius: 12px; }
        .tvn-concept-box, .tvn-guidelines-box { padding: 1.5rem; }
        .tvn-form-section { padding: 1.5rem 1.5rem 0.5rem; }
        .tvn-start-btn { width: calc(100% - 3rem); margin: 1.5rem 1.5rem 2rem; }
        .tvn-case-card, .tvn-review-card { padding: 1.5rem; }
        .tvn-nav { flex-direction: column-reverse; }
        .tvn-nav-prev, .tvn-nav-next, .tvn-nav-finish { width: 100%; text-align: center; }
        .tvn-concept-grid { grid-template-columns: 1fr; }
        .tvn-answers-table-section { padding: 1.5rem; }
        .tvn-results-actions { padding: 1.5rem; }
        .tvn-score-circle { width: 90px; height: 90px; }
        .tvn-score-num { font-size: 2rem; }
        .tvn-disclaimer-box { margin: 0 1.5rem; }
      }

      /* ── Print ── */
      @media print {
        .tvn-results-actions { display: none !important; }
        .tvn-wrapper { box-shadow: none; }
      }
    `}} />
  );
}
