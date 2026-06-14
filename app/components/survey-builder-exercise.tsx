"use client";

import { FormEvent, useState } from "react";
import { downloadExercisePdf } from "@/app/lib/exercise-pdf";

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingComponents: string[];
  criteriaScores: {
    context: number;
    audience: number;
    surveyDesign: number;
    questionQuality: number;
    outputFormat: number;
  };
  revisedPrompt: string;
  nextAction: string;
};

const criteria = [
  { key: "context", label: "السياق" },
  { key: "audience", label: "الجمهور" },
  { key: "surveyDesign", label: "تصميم الاستبيان" },
  { key: "questionQuality", label: "جودة الأسئلة" },
  { key: "outputFormat", label: "تنسيق المخرجات" },
] as const;

const defaultPrompt = `بصفتك خبيراً في أبحاث العملاء والتسويق الرقمي، ساعدني في بناء استبيان موجه لعملاء شركة "الأناقة".

السياق:
شركة "الأناقة" متخصصة في تجارة الألبسة والأزياء في السوق السعودي. تأسست قبل 5 سنوات، ولديها قاعدة عملاء قوية ومبيعات شهرية مستقرة. معدل رضا العملاء الحالي 4.2 من 5.

الموقف:
لاحظت الإدارة أن عدداً من المنافسين بدأوا يحققون نتائج قوية عبر TikTok Shop والبيع المباشر من خلال البثوث داخل التطبيق. قبل الاستثمار في هذه القناة، تريد الشركة جمع بيانات حقيقية من عملائها الحاليين.

المطلوب:
أنشئ استبياناً عملياً يساعد الإدارة على فهم استعداد العملاء للشراء عبر TikTok Shop، وتفضيلاتهم في مشاهدة المنتجات عبر البث المباشر، والعوامل التي تزيد ثقتهم في قرار الشراء.

تنسيق المخرجات:
قدّم الاستبيان في جدول يحتوي على: رقم السؤال، السؤال، نوع السؤال، خيارات الإجابة إن وجدت، والهدف من السؤال.

القيود:
اجعل الاستبيان مختصراً ومناسباً للعملاء، ولا يتجاوز 10 أسئلة. استخدم لغة عربية واضحة ومهنية.`;

function scoreLabel(score: number) {
  if (score >= 85) return "متقدم";
  if (score >= 70) return "جيد";
  if (score >= 50) return "بحاجة إلى تحسين";
  return "مسودة أولية";
}

export function SurveyBuilderExercise() {
  const [prompt, setPrompt] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setCopyMessage("");
    setEvaluation(null);

    const email = window.sessionStorage.getItem("participantEmail");
    if (!email) {
      setMessage("يرجى إدخال البريد من بوابة التمارين أولاً.");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/survey-builder/evaluate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, prompt }),
    });
    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر تقييم التمرين حالياً.");
      return;
    }

    setEvaluation(data.evaluation ?? null);
    setMessage(data.message ?? "شكراً، لقد تم استلام إجابتك.");
  }

  async function copyStarterPrompt() {
    await navigator.clipboard.writeText(defaultPrompt);
    setCopyMessage("تم نسخ نموذج البرومبت.");
  }

  async function copyResult() {
    if (!evaluation) return;

    await navigator.clipboard.writeText(
      [
        "نتيجة تمرين بناء استبيان باستخدام الذكاء الاصطناعي",
        `الدرجة: ${evaluation.score}/100`,
        `المستوى: ${evaluation.level || scoreLabel(evaluation.score)}`,
        `الملخص: ${evaluation.summary}`,
        "",
        "الصياغة المحسنة:",
        evaluation.revisedPrompt,
      ].join("\n")
    );
    setCopyMessage("تم نسخ النتيجة.");
  }

  async function downloadPdf() {
    const email = window.sessionStorage.getItem("participantEmail") || "غير متاح";
    setIsDownloading(true);

    try {
      await downloadExercisePdf({
        fileName: "survey-builder-exercise.pdf",
        title: "تمرين بناء استبيان باستخدام الذكاء الاصطناعي",
        subtitle: "إجابة المشارك وتقييمها",
        participantEmail: email,
        statusLine: message || "شكراً، لقد تم استلام إجابتك.",
        sections: [
          {
            title: "البرومبت الذي كتبه المشارك",
            body: prompt,
          },
          {
            title: "ملخص التقييم",
            body: evaluation
              ? `الدرجة: ${evaluation.score}/100\nالمستوى: ${evaluation.level}\n${evaluation.summary}`
              : "تم حفظ الإجابة في الموقع.",
          },
          {
            title: "نقاط القوة",
            body: evaluation
              ? evaluation.strengths.join("\n")
              : "لا يوجد تقييم معروض حالياً.",
          },
          {
            title: "فرص التحسين",
            body: evaluation
              ? evaluation.improvements.join("\n")
              : "لا يوجد تقييم معروض حالياً.",
          },
          {
            title: "الصياغة المحسنة المقترحة",
            body:
              evaluation?.revisedPrompt ||
              "تم حفظ الإجابة في الموقع دون صياغة محسنة معروضة حالياً.",
          },
        ],
      });
      setCopyMessage("تم تنزيل ملف PDF.");
    } catch {
      setCopyMessage("تعذر تنزيل ملف PDF حالياً.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="prompt-exercise-layout">
      <section className="prompt-scenario-card" aria-label="سيناريو التمرين">
        <div className="section-kicker">تمرين بناء استبيان</div>
        <h2>السيناريو</h2>
        <p>
          شركة «الأناقة» متخصصة في تجارة الألبسة والأزياء في السوق السعودي.
          تأسست قبل 5 سنوات، وتمتلك قاعدة عملاء قوية ومبيعات شهرية مستقرة.
        </p>
        <ul>
          <li>المبيعات والأداء المالي: مستقر.</li>
          <li>معدل رضا العملاء: 4.2 من 5.</li>
        </ul>
        <p>
          خلال اجتماع الإدارة الأسبوعي، عرض مدير التسويق تقريراً يوضح أن ثلاثة
          من أبرز المنافسين بدأوا يحققون نتائج استثنائية من خلال TikTok Shop
          والبيع المباشر داخل التطبيق، خصوصاً عبر البثوث المباشرة.
        </p>
        <p>
          قررت الإدارة إعداد استبيان موجه لعملائها الحاليين لجمع بيانات حقيقية
          قبل اتخاذ أي قرار بالاستثمار في متجر تيك توك.
        </p>
        <p>
          المطلوب منك: اكتب برومبتاً مناسباً يطلب من الذكاء الاصطناعي بناء
          استبيان عملاء واضح وقابل للاستخدام.
        </p>
      </section>

      <form className="prompt-builder" onSubmit={submit}>
        <div className="section-heading">
          <div className="section-kicker">المطلوب</div>
          <h2>اكتب برومبت بناء الاستبيان</h2>
          <p>
            ركّز على وضوح السياق، الجمهور المستهدف، هدف الاستبيان، نوع الأسئلة،
            وتنسيق المخرجات الذي تحتاجه الإدارة.
          </p>
        </div>

        <label className="prompt-field">
          <span>البرومبت النهائي</span>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={14}
            placeholder="اكتب هنا البرومبت الذي ستستخدمه لبناء استبيان العملاء..."
          />
        </label>

        <section className="prompt-preview" aria-label="نموذج برومبت مساعد">
          <div>
            <div className="section-kicker">نموذج قابل للتطوير</div>
            <h3>يمكنك الاستفادة من هذا البناء دون نسخه حرفياً</h3>
          </div>
          <pre>{defaultPrompt}</pre>
          <div className="prompt-actions">
            <button type="button" onClick={copyStarterPrompt}>
              نسخ النموذج
            </button>
            {copyMessage ? <p className="form-message">{copyMessage}</p> : null}
          </div>
        </section>

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
                  <h2>{evaluation.level || scoreLabel(evaluation.score)}</h2>
                </div>
                <strong>{Math.round(evaluation.score)}/100</strong>
              </div>
              <p>{evaluation.summary}</p>

              <div className="component-score-grid">
                {criteria.map((item) => (
                  <article key={item.key}>
                    <span>{item.label}</span>
                    <strong>
                      {Math.round(evaluation.criteriaScores[item.key] ?? 0)}%
                    </strong>
                  </article>
                ))}
              </div>

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

              {evaluation.missingComponents.length ? (
                <div className="missing-components">
                  <strong>عناصر تحتاج وضوحاً أكبر:</strong>
                  <span>{evaluation.missingComponents.join("، ")}</span>
                </div>
              ) : null}

              <section className="revised-prompt">
                <h3>صياغة محسنة مقترحة</h3>
                <pre>{evaluation.revisedPrompt}</pre>
              </section>

              <div className="next-action">
                <strong>خطوتك التالية</strong>
                <p>{evaluation.nextAction}</p>
              </div>
            </>
          ) : null}

          <div className="prompt-actions">
            {evaluation ? (
              <button type="button" onClick={copyResult}>
                نسخ النتيجة
              </button>
            ) : null}
            <button type="button" onClick={downloadPdf} disabled={isDownloading}>
              {isDownloading ? "جار تجهيز PDF" : "تحميل الإجابة PDF"}
            </button>
            {copyMessage ? <p className="form-message">{copyMessage}</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
