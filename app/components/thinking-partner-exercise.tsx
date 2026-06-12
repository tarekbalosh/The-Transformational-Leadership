"use client";

import { FormEvent, useState } from "react";

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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = fields.filter((field) => answers[field.key].trim()).length;

  function updateField(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const email = window.sessionStorage.getItem("participantEmail");
    if (!email) {
      setMessage("يرجى إدخال البريد من بوابة التمارين أولاً.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      exerciseId: "thinking-partner-crisis",
      title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
      summary: {
        verifiedFact: answers.verifiedFact,
        firstDecision: answers.firstDecision,
        revisedDecision: answers.revisedDecision,
        hallucination: answers.hallucination,
      },
      answers,
      savedAt: new Date().toISOString(),
    };

    const response = await fetch("/api/exercise-answers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        exerciseId: "thinking-partner-crisis",
        answer: JSON.stringify(payload, null, 2),
      }),
    });
    const data = await response.json();

    setIsSubmitting(false);
    setMessage(
      response.ok
        ? "تم حفظ إجابتك في الموقع ولوحة المدرب."
        : data.message ?? "تعذر حفظ الإجابة حالياً."
    );
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
                required
              />
            </label>
          ))}
        </div>

        <div className="prompt-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جار الحفظ" : "حفظ التمرين"}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
