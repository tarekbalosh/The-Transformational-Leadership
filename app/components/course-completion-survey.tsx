"use client";

import { FormEvent, useMemo, useState } from "react";

const ratingScale = [1, 2, 3, 4, 5];
const recommendationScale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const consentOptions = [
  "نعم، مع اسمي ومسماي الوظيفي",
  "نعم، مع اسمي فقط",
  "نعم، بدون ذكر اسمي",
  "لا، لا أوافق على استخدامها كاستشهاد",
];

type FormState = {
  name: string;
  affiliation: string;
  experienceRating: string;
  usefulnessRating: string;
  mostUseful: string;
  application: string;
  improvement: string;
  recommendationScore: string;
  testimonial: string;
  testimonialConsent: string;
};

const initialForm: FormState = {
  name: "",
  affiliation: "",
  experienceRating: "",
  usefulnessRating: "",
  mostUseful: "",
  application: "",
  improvement: "",
  recommendationScore: "",
  testimonial: "",
  testimonialConsent: "",
};

function buildSurveyPayload(form: FormState, participantEmail: string) {
  return {
    exerciseId: "course-completion-survey",
    title: "استبيان ما بعد الدورة التدريبية",
    participantEmail,
    name: form.name.trim(),
    affiliation: form.affiliation.trim(),
    experienceRating: Number(form.experienceRating),
    usefulnessRating: Number(form.usefulnessRating),
    mostUseful: form.mostUseful.trim(),
    application: form.application.trim(),
    improvement: form.improvement.trim(),
    recommendationScore: Number(form.recommendationScore),
    testimonial: form.testimonial.trim(),
    testimonialConsent: form.testimonialConsent,
    consentNote: "قد يتم تحرير الشهادة لغويًا دون تغيير المعنى.",
    submittedAt: new Date().toISOString(),
  };
}

export function CourseCompletionSurvey() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const participantEmail = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : window.sessionStorage.getItem("participantEmail") ?? "",
    []
  );

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const payload = buildSurveyPayload(form, participantEmail);
    const response = await fetch("/api/exercise-answers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: participantEmail,
        exerciseId: "course-completion-survey",
        answer: JSON.stringify(payload),
      }),
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر حفظ الاستبيان.");
      return;
    }

    setMessage("شكراً لقد تم استلام اجابتك");
  }

  return (
    <form className="completion-survey-form" onSubmit={submit}>
      <section className="completion-survey-card">
        <div className="section-kicker">بيانات اختيارية</div>
        <div className="completion-survey-grid two-columns">
          <label>
            <span>ما اسمك؟</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="اختياري"
            />
          </label>
          <label>
            <span>ما مسماك الوظيفي أو جهتك؟</span>
            <input
              type="text"
              value={form.affiliation}
              onChange={(event) =>
                updateField("affiliation", event.target.value)
              }
              placeholder="اختياري"
            />
          </label>
        </div>
      </section>

      <section className="completion-survey-card">
        <div className="section-kicker">تقييم التجربة</div>
        <div className="completion-survey-grid">
          <fieldset className="rating-field">
            <legend>كيف تقيّم تجربتك العامة في الدورة؟</legend>
            <div className="rating-options five">
              {ratingScale.map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="experienceRating"
                    value={value}
                    checked={form.experienceRating === String(value)}
                    onChange={(event) =>
                      updateField("experienceRating", event.target.value)
                    }
                    required
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rating-field">
            <legend>ما مدى فائدة محتوى الدورة بالنسبة لك؟</legend>
            <div className="rating-options five">
              {ratingScale.map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="usefulnessRating"
                    value={value}
                    checked={form.usefulnessRating === String(value)}
                    onChange={(event) =>
                      updateField("usefulnessRating", event.target.value)
                    }
                    required
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="completion-survey-card">
        <div className="section-kicker">الأثر والتطوير</div>
        <div className="completion-survey-grid">
          <label>
            <span>ما أكثر جزء أو فكرة وجدتها مفيدة؟</span>
            <textarea
              value={form.mostUseful}
              onChange={(event) => updateField("mostUseful", event.target.value)}
              required
            />
          </label>
          <label>
            <span>ما الشيء الذي ستطبقه بعد هذه الدورة؟</span>
            <textarea
              value={form.application}
              onChange={(event) => updateField("application", event.target.value)}
              required
            />
          </label>
          <label>
            <span>ما الذي يمكن تحسينه في الدورة القادمة؟</span>
            <textarea
              value={form.improvement}
              onChange={(event) => updateField("improvement", event.target.value)}
              required
            />
          </label>
        </div>
      </section>

      <section className="completion-survey-card">
        <div className="section-kicker">الترشيح والشهادة</div>
        <fieldset className="rating-field">
          <legend>هل تنصح غيرك بحضور هذه الدورة؟</legend>
          <div className="rating-options eleven">
            {recommendationScale.map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="recommendationScore"
                  value={value}
                  checked={form.recommendationScore === String(value)}
                  onChange={(event) =>
                    updateField("recommendationScore", event.target.value)
                  }
                  required
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label>
          <span>اكتب شهادة قصيرة عن تجربتك في الدورة يمكن استخدامها كاستشهاد.</span>
          <textarea
            className="testimonial-field"
            value={form.testimonial}
            onChange={(event) => updateField("testimonial", event.target.value)}
            placeholder="ساعدتني الدورة على..."
            required
          />
        </label>

        <fieldset className="consent-field">
          <legend>
            هل توافق على استخدام شهادتك في المواد التعريفية أو التسويقية للدورة؟
          </legend>
          <div className="consent-options">
            {consentOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="testimonialConsent"
                  value={option}
                  checked={form.testimonialConsent === option}
                  onChange={(event) =>
                    updateField("testimonialConsent", event.target.value)
                  }
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <p>قد يتم تحرير الشهادة لغويًا دون تغيير المعنى.</p>
        </fieldset>
      </section>

      <div className="prompt-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جار الحفظ" : "إرسال الاستبيان"}
        </button>
        {message ? <p className="exercise-receipt-message">{message}</p> : null}
      </div>
    </form>
  );
}
