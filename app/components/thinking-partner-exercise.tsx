"use client";

import { FormEvent, useState } from "react";
import { downloadExercisePdf } from "@/app/lib/exercise-pdf";

type Answers = {
  compositePrompt: string;
  verifiedFact: string;
  sourceCheck: string;
  firstDecision: string;
  secondDecision: string;
  thirdDecision: string;
  preMortem: string;
  revisedDecision: string;
  rejectedNote: string;
  addedIdea: string;
  hallucination: string;
};

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  hallucinationReview: string;
  nextAction: string;
};

const initialAnswers: Answers = {
  compositePrompt: "",
  verifiedFact: "",
  sourceCheck: "",
  firstDecision: "",
  secondDecision: "",
  thirdDecision: "",
  preMortem: "",
  revisedDecision: "",
  rejectedNote: "",
  addedIdea: "",
  hallucination: "",
};

const fields: Array<{
  key: keyof Answers;
  label: string;
  rows: number;
}> = [
  { key: "compositePrompt", label: "البرومبت المركب الذي استخدمته", rows: 6 },
  { key: "verifiedFact", label: "المعلومة الواقعية التي اخترتها للتحقق", rows: 4 },
  { key: "sourceCheck", label: "المصدر أو نتيجة التحقق التي وصلت إليها", rows: 4 },
  { key: "firstDecision", label: "القرار الأول خلال أول 30 يوماً", rows: 3 },
  { key: "secondDecision", label: "القرار الثاني خلال أول 30 يوماً", rows: 3 },
  { key: "thirdDecision", label: "القرار الثالث خلال أول 30 يوماً", rows: 3 },
  { key: "preMortem", label: "أسباب الفشل الأكثر ترجيحاً بعد تحليل ما قبل الوفاة", rows: 5 },
  { key: "revisedDecision", label: "القرار الذي عدّلته بعد النقد", rows: 4 },
  { key: "rejectedNote", label: "الملاحظة التي رفضتها ولماذا", rows: 4 },
  { key: "addedIdea", label: "الفكرة التي أضافها الذكاء الاصطناعي ولم تكن لتخطر لك وحدك", rows: 4 },
  { key: "hallucination", label: "الهلوسة التي اصطدتها وكيف اكتشفتها", rows: 4 },
];

export function ThinkingPartnerExercise() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const completedCount = fields.filter((field) => answers[field.key].trim()).length;

  function updateField(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setEvaluation(null);

    const email = window.sessionStorage.getItem("participantEmail");
    if (!email) {
      setMessage("يرجى إدخال البريد من بوابة التمارين أولاً.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/thinking-partner/evaluate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, answers }),
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر حفظ الإجابة حالياً.");
      return;
    }

    setEvaluation(data.evaluation ?? null);
    setMessage(data.message ?? "شكراً، لقد تم استلام إجابتك.");
  }

  async function downloadPdf() {
    const email = window.sessionStorage.getItem("participantEmail") || "غير متاح";
    setIsDownloading(true);

    try {
      await downloadExercisePdf({
        fileName: "thinking-partner-crisis-exercise.pdf",
        title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
        subtitle: "إجابة المشارك وتقييمها",
        participantEmail: email,
        statusLine: message || "شكراً، لقد تم استلام إجابتك.",
        sections: [
          {
            title: "البرومبت المركب",
            body: answers.compositePrompt,
          },
          {
            title: "القرارات الثلاثة",
            body: [answers.firstDecision, answers.secondDecision, answers.thirdDecision]
              .filter(Boolean)
              .join("\n"),
          },
          {
            title: "تحليل ما قبل الوفاة والقرار المعدل",
            body: `أسباب الفشل: ${answers.preMortem}\n\nالقرار المعدل: ${answers.revisedDecision}`,
          },
          {
            title: "الفكرة المضافة والهلوسة المرصودة",
            body: `الفكرة المضافة: ${answers.addedIdea}\n\nالهلوسة: ${answers.hallucination}`,
          },
          {
            title: "ملخص التقييم",
            body: evaluation
              ? `الدرجة: ${evaluation.score}/100\nالمستوى: ${evaluation.level}\n${evaluation.summary}\n\nالمراجعة: ${evaluation.hallucinationReview}\n\nالخطوة التالية: ${evaluation.nextAction}`
              : "تم حفظ الإجابة في الموقع.",
          },
        ],
      });
      setMessage("شكراً، لقد تم استلام إجابتك. وتم تنزيل ملف PDF.");
    } catch {
      setMessage("شكراً، لقد تم استلام إجابتك، لكن تعذر تنزيل ملف PDF حالياً.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="thinking-exercise-layout">
      <section className="thinking-brief-card" aria-label="ملخص التمرين">
        <div className="section-kicker">تمرين سريع</div>
        <h2>الذكاء الاصطناعي شريكاً في التفكير</h2>
        <p className="thinking-context-title">
          أزمة منصة مهيمنة: حالة Unity الحقيقية
        </p>

        <div className="thinking-meta-grid">
          <article>
            <strong>المدة</strong>
            <span>15 دقيقة</span>
          </article>
          <article>
            <strong>التشكيل</strong>
            <span>ثنائيات أو فردي</span>
          </article>
          <article>
            <strong>الأدوات</strong>
            <span>أداة ذكاء اصطناعي مفعّلة البحث</span>
          </article>
          <article>
            <strong>المخرج</strong>
            <span>3 قرارات + هلوسة واحدة مُصطادة</span>
          </article>
        </div>

        <div className="thinking-section-block">
          <h3>السياق ودورك</h3>
          <p>
            في سبتمبر 2023، أعلنت شركة Unity فرض رسوم تشغيل عن كل عملية تثبيت
            للعبة، وبأثر يشمل ألعاباً منشورة من قبل. خلال ساعات اشتعلت أزمة
            واسعة في الصناعة.
          </p>
          <p>
            دورك: مدير استوديو ألعاب صغير يضم 20 موظفاً، جميع ألعابه مبنية على
            Unity، وأغلبها مجانية بهوامش ربح ضيقة. مهمتك أن تكتشف ما حدث وتقرر
            كيف تتصرف.
          </p>
        </div>

        <div className="thinking-section-block">
          <h3>خطوات التنفيذ</h3>
          <ol className="thinking-steps-list">
            <li>افهم الأزمة ببرومبت مركب واحد، ثم تحقق من معلومة واقعية واحدة.</li>
            <li>اكتب 3 قرارات بنفسك، ثم اطلب تحليلاً من نوع Pre-mortem.</li>
            <li>عدّل قراراً واحداً، وارصد فكرة مضافة وهلوسة واحدة على الأقل.</li>
          </ol>
        </div>

        <div className="prompt-progress">
          <span>
            اكتمال الإجابة: {completedCount} من {fields.length}
          </span>
          <progress value={completedCount} max={fields.length} />
        </div>
      </section>

      <form className="thinking-form-card" onSubmit={submit}>
        <div className="section-heading">
          <div className="section-kicker">سجّل إجابتك</div>
          <h2>حوّل التمرين إلى مخرجات قابلة للمراجعة</h2>
          <p>
            اكتب ما قمت به فعلاً أثناء التمرين: برومبتك، قراراتك، وما الذي
            تأكدت منه أو رفضته.
          </p>
        </div>

        <div className="thinking-field-stack">
          {fields.map((field) => (
            <label className="thinking-field" key={field.key}>
              <span>{field.label}</span>
              <textarea
                value={answers[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
                rows={field.rows}
              />
            </label>
          ))}
        </div>

        <div className="prompt-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جار التسليم والتقييم" : "تسليم التمرين"}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </div>
      </form>

      {evaluation || message ? (
        <section className="evaluation-card" aria-live="polite">
          <div className="prompt-actions">
            <p className="exercise-receipt-message">
              {message || "شكراً، لقد تم استلام إجابتك."}
            </p>
          </div>

          {evaluation ? (
            <>
              <div className="evaluation-head">
                <div>
                  <div className="section-kicker">نتيجة التقييم</div>
                  <h2>{evaluation.level}</h2>
                </div>
                <strong>{Math.round(evaluation.score)}/100</strong>
              </div>
              <p>{evaluation.summary}</p>

              <div className="feedback-grid">
                <article>
                  <h3>نقاط القوة</h3>
                  <ul>
                    {evaluation.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
                <article>
                  <h3>فرص التحسين</h3>
                  <ul>
                    {evaluation.improvements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="missing-components">
                <strong>مراجعة التحقق من الهلوسة</strong>
                <span>{evaluation.hallucinationReview}</span>
              </div>

              <div className="next-action">
                <strong>خطوتك التالية</strong>
                <p>{evaluation.nextAction}</p>
              </div>
            </>
          ) : null}

          <div className="prompt-actions">
            <button type="button" onClick={downloadPdf} disabled={isDownloading}>
              {isDownloading ? "جار تجهيز PDF" : "تحميل الإجابة PDF"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
