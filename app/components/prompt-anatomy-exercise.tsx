"use client";

import { FormEvent, useState } from "react";
import { downloadExercisePdf } from "@/app/lib/exercise-pdf";

type AnatomyKey =
  | "tone"
  | "task"
  | "context"
  | "role"
  | "example"
  | "constraints"
  | "format";

type AnatomyAnswers = Record<AnatomyKey, string>;

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  correctComponents: string[];
  needsReview: string[];
  nextAction: string;
};

const promptText = `أنت خبير استراتيجي في إدارة المواهب والموارد البشرية، متخصص في شركات التقنية ذات حجم 200–500 موظف.

شركتنا "تك إنوفيت" (Tech Innovate) هي شركة تطوير برمجيات B2B مقرها الرياض. نواجه معدل استقالة سنوي مرتفع يبلغ 23% (مقابل متوسط 18% في القطاع). أغلب من يتركون الشركة هم من المطورين والمهندسين ذوي الخبرة 5–10 سنوات. أظهر استطلاع Exit Interview أن أهم الأسباب: نقص فرص التطوير المهني، الرواتب أقل من متوسط السوق بـ 15%، وغياب برامج واضحة للتقدير والتحفيز.

طوّر استراتيجية شاملة لخفض معدل الاستقالة إلى 15% خلال 12 شهرًا.

أريد منك:

* ملخص تنفيذي (حوالي 100 كلمة).
* تحليل للأسباب الجذرية للمشكلة (في 3–5 نقاط محددة).
* استراتيجية تتألف من 3 محاور رئيسية؛ كل محور يشمل:
  * الهدف المنشود لهذا المحور.
  * خطوات التنفيذ (3–5 خطوات عملية).
  * مؤشرات قياس الأداء (KPIs) لمتابعة التقدم.
  * الميزانية التقديرية.
  * الإطار الزمني للتنفيذ.
* قسم أخير: المخاطر المتوقعة والحلول البديلة لكل محور إن وجدت.

علماً أن الميزانية السنوية المتاحة لتنفيذ الاستراتيجية: 800,000 ريال، ولا يمكن زيادة الرواتب بأكثر من 10% هذا العام، أيضا يجب تنفيذ المحور الأول خلال 3 أشهر كحد أقصى لتحقيق إنجازات سريعة (Quick Wins)، مع مراعاة الالتزام بأنظمة وقوانين العمل السعودية.

عند كتابة تفاصيل أحد المحاور يمكن أن يكون الأسلوب بالشكل التالي: "المحور 1: برنامج التطوير المهني المتسارع — الهدف: زيادة رضا الموظفين عن فرص التطوير من 42% إلى 75%. الخطوات: إطلاق منصة تعليمية داخلية تركز على تطوير المهارات التقنية والقيادية للموظفين..."

اكتب بلغة احترافية مبنية على البيانات وواقعية. تجنّب الحلول العامة أو المكررة. نريد أفكارًا مبتكرة وقابلة للتطبيق عمليًا، ومراعية للسياق السعودي وثقافة الشركة.`;

const fields: Array<{ key: AnatomyKey; label: string }> = [
  { key: "tone", label: "النبرة" },
  { key: "task", label: "المهمة" },
  { key: "context", label: "السياق" },
  { key: "role", label: "الدور" },
  { key: "example", label: "الأمثلة التوضيحية" },
  { key: "constraints", label: "القيود" },
  { key: "format", label: "التنسيق المطلوب" },
];

const emptyAnswers = fields.reduce((accumulator, field) => {
  accumulator[field.key] = "";
  return accumulator;
}, {} as AnatomyAnswers);

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="copy-icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function answersToText(answers: AnatomyAnswers) {
  return fields
    .map((field) => `${field.label}: ${answers[field.key] || "غير مكتمل"}`)
    .join("\n\n");
}

export function PromptAnatomyExercise() {
  const [answers, setAnswers] = useState<AnatomyAnswers>(emptyAnswers);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  function updateAnswer(key: AnatomyKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopyMessage("تم نسخ نص البرومبت.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopyMessage("تم نسخ نص البرومبت.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = window.sessionStorage.getItem("participantEmail") || "";
    setIsSubmitting(true);
    setMessage("");
    setEvaluation(null);

    const response = await fetch("/api/prompt-anatomy/evaluate", {
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
        fileName: "prompt-anatomy-exercise.pdf",
        title: "تمرين تشريح الأمر الهندسي",
        subtitle: "إجابة المشارك وتقييمها",
        participantEmail: email,
        statusLine: message || "شكراً، لقد تم استلام إجابتك.",
        sections: [
          {
            title: "تشريح المكونات",
            body: answersToText(answers),
          },
          {
            title: "ملخص التقييم",
            body: evaluation
              ? `الدرجة: ${evaluation.score}/100\nالمستوى: ${evaluation.level}\n${evaluation.summary}`
              : "تم حفظ الإجابة في الموقع.",
          },
          {
            title: "المكونات الصحيحة",
            body: evaluation?.correctComponents.length
              ? evaluation.correctComponents.join("\n")
              : "لا يوجد تقييم معروض حالياً.",
          },
          {
            title: "مكونات تحتاج مراجعة",
            body: evaluation?.needsReview.length
              ? evaluation.needsReview.join("\n")
              : "لا يوجد تقييم معروض حالياً.",
          },
          {
            title: "الخطوة التالية",
            body: evaluation?.nextAction || "راجع مواضع المكونات داخل البرومبت ثم صحّح الجدول.",
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
    <div className="prompt-anatomy-layout">
      <section className="comparison-intro-card">
        <div className="section-kicker">تمرين تشريح الأمر الهندسي</div>
        <h2>صنّف أجزاء البرومبت داخل مكونات الأمر السبعة</h2>
        <p>
          اقرأ البرومبت بعناية، ثم انسخ الجزء المناسب من النص وضعه أمام المكون
          الصحيح في الجدول. الهدف هو تدريب عينك على رؤية بنية الأمر قبل كتابته.
        </p>
      </section>

      <section className="comparison-prompt-card" aria-label="نص البرومبت">
        <div className="comparison-prompt-head">
          <div>
            <div className="section-kicker">نص البرومبت</div>
            <h3>استراتيجية خفض معدل الاستقالة في شركة تقنية</h3>
          </div>
          <button
            type="button"
            className="copy-prompt-button"
            onClick={copyPrompt}
            aria-label="نسخ نص البرومبت"
            title="نسخ نص البرومبت"
          >
            <CopyIcon />
            <span>نسخ البرومبت</span>
          </button>
        </div>
        <pre className="prompt-copy-box" dir="rtl">{promptText}</pre>
        {copyMessage ? <p className="form-message">{copyMessage}</p> : null}
      </section>

      <form className="anatomy-table-card" onSubmit={submit}>
        <div>
          <div className="section-kicker">جدول التشريح</div>
          <h3>ضع النص المقابل لكل مكون</h3>
        </div>

        <div className="anatomy-field-grid">
          {fields.map((field) => (
            <label className="anatomy-field" key={field.key}>
              <span>{field.label}</span>
              <textarea
                value={answers[field.key]}
                onChange={(event) => updateAnswer(field.key, event.target.value)}
                rows={3}
                placeholder="الصق النص المقابل من البرومبت هنا..."
                required
              />
            </label>
          ))}
        </div>

        <div className="prompt-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جار التسليم والتقييم" : "تسليم التمرين"}
          </button>
          <button type="button" onClick={downloadPdf} disabled={isDownloading}>
            {isDownloading ? "جار تجهيز PDF" : "تحميل PDF"}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </div>
      </form>

      {evaluation ? (
        <section className="evaluation-card">
          <div className="evaluation-head">
            <div>
              <div className="section-kicker">نتيجة التقييم</div>
              <h2>{evaluation.level}</h2>
            </div>
            <strong>{evaluation.score}/100</strong>
          </div>
          <p>{evaluation.summary}</p>
          <div className="feedback-grid">
            <article>
              <h3>مكونات صحيحة</h3>
              <ul>
                {evaluation.correctComponents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>تحتاج مراجعة</h3>
              <ul>
                {evaluation.needsReview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <article className="next-action">
            <strong>الخطوة التالية</strong>
            <p>{evaluation.nextAction}</p>
          </article>
        </section>
      ) : null}
    </div>
  );
}
