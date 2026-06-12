"use client";

import { FormEvent, useMemo, useState } from "react";

type PromptFieldKey =
  | "role"
  | "context"
  | "task"
  | "format"
  | "constraints"
  | "example"
  | "tone";

type PromptFields = Record<PromptFieldKey, string>;

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingComponents: string[];
  componentScores: Record<PromptFieldKey, number>;
  revisedPrompt: string;
  nextAction: string;
};

const initialFields: PromptFields = {
  role: "",
  context: "",
  task: "",
  format: "",
  constraints: "",
  example: "",
  tone: "",
};

const sections: Array<{
  key: PromptFieldKey;
  title: string;
}> = [
  {
    key: "role",
    title: "الدور (Role)",
  },
  {
    key: "context",
    title: "السياق (Context)",
  },
  {
    key: "task",
    title: "المهمة (Task)",
  },
  {
    key: "format",
    title: "تنسيق المخرجات (Format)",
  },
  {
    key: "constraints",
    title: "القيود (Constraints)",
  },
  {
    key: "example",
    title: "مثال توضيحي لطريقة العرض (Example)",
  },
  {
    key: "tone",
    title: "النبرة والأسلوب (Tone)",
  },
];

const labels: Record<PromptFieldKey, string> = {
  role: "الدور",
  context: "السياق",
  task: "المهمة",
  format: "تنسيق المخرجات",
  constraints: "القيود",
  example: "مثال توضيحي",
  tone: "النبرة والأسلوب",
};

function combinePrompt(fields: PromptFields) {
  return sections
    .map((section) => `${section.title}:\n${fields[section.key].trim()}`)
    .join("\n\n");
}

function scoreLabel(score: number) {
  if (score >= 85) return "متقدم";
  if (score >= 70) return "جيد";
  if (score >= 50) return "بحاجة إلى تحسين";
  return "مسودة أولية";
}

export function PromptWritingExercise() {
  const [fields, setFields] = useState<PromptFields>(initialFields);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const completedCount = sections.filter((section) =>
    fields[section.key].trim()
  ).length;
  const combinedPrompt = useMemo(() => combinePrompt(fields), [fields]);

  function updateField(key: PromptFieldKey, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

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
    const response = await fetch("/api/prompt-writing/evaluate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, fields }),
    });
    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر تقييم الأمر حالياً.");
      return;
    }

    setEvaluation(data.evaluation);
  }

  async function copyResult() {
    if (!evaluation) return;

    const text = [
      "نتيجة تمرين صياغة أمر",
      `الدرجة: ${evaluation.score}/100`,
      `المستوى: ${evaluation.level || scoreLabel(evaluation.score)}`,
      `الملخص: ${evaluation.summary}`,
      "",
      "الأمر المحسّن:",
      evaluation.revisedPrompt,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopyMessage("تم نسخ النتيجة.");
  }

  return (
    <div className="prompt-exercise-layout">
      <section className="prompt-scenario-card" aria-label="سيناريو التمرين">
        <div className="section-kicker">تمرين صياغة أمر</div>
        <h2>السيناريو</h2>
        <p>أنت مدير في هيئة حكومية خدمية تضم 1,200 موظف.</p>
        <p>
          الحكومة أطلقت مبادرة وطنية للتحول الرقمي، وتُلزم جميع الجهات بـ:
        </p>
        <ul>
          <li>أتمتة 60% من الخدمات خلال 18 شهرًا.</li>
          <li>تقليل زمن إنجاز المعاملات بنسبة 40%.</li>
          <li>رفع رضا المستفيدين إلى 90%.</li>
        </ul>
        <p>لكن تواجهك التحديات التالية:</p>
        <ul>
          <li>مقاومة داخلية من الموظفين.</li>
          <li>ضعف المهارات الرقمية لدى 40% من القوى العاملة.</li>
          <li>أنظمة تقنية قديمة.</li>
          <li>ميزانية محدودة للتحول.</li>
        </ul>
        <p>تم تكليفك بإعداد خطة تحول رقمي متكاملة وقابلة للتنفيذ.</p>
        <p>
          المطلوب: قم بإعداد أمر يتضمن المكونات السبعة، تطلب فيه من الذكاء
          الاصطناعي إعداد مسودة خطة تحول رقمي لعرضها على اللجنة الحكومية
          المختصة.
        </p>
        <div className="prompt-progress">
          <span>
            اكتمال المكونات: {completedCount} من {sections.length}
          </span>
          <progress value={completedCount} max={sections.length} />
        </div>
      </section>

      <form className="prompt-builder" onSubmit={submit}>
        <div className="section-heading">
          <div className="section-kicker">المطلوب</div>
          <h2>اكتب الأمر من سبعة مكونات</h2>
        </div>

        <div className="prompt-field-grid">
          {sections.map((section) => (
            <label className="prompt-field" key={section.key}>
              <span>{section.title}</span>
              <textarea
                value={fields[section.key]}
                onChange={(event) =>
                  updateField(section.key, event.target.value)
                }
                aria-label={section.title}
                rows={5}
                required
              />
            </label>
          ))}
        </div>

        <section className="prompt-preview" aria-label="معاينة الأمر">
          <div>
            <div className="section-kicker">معاينة الأمر</div>
            <h3>الصياغة المجمّعة</h3>
          </div>
          <pre>{combinedPrompt}</pre>
        </section>

        <div className="prompt-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جار التقييم" : "قيّم الأمر بالذكاء الاصطناعي"}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </div>
      </form>

      {evaluation ? (
        <section className="evaluation-card" aria-live="polite">
          <div className="evaluation-head">
            <div>
              <div className="section-kicker">نتيجة التقييم</div>
              <h2>{evaluation.level || scoreLabel(evaluation.score)}</h2>
            </div>
            <strong>{Math.round(evaluation.score)}/100</strong>
          </div>
          <p>{evaluation.summary}</p>

          <div className="component-score-grid">
            {sections.map((section) => (
              <article key={section.key}>
                <span>{labels[section.key]}</span>
                <strong>
                  {Math.round(evaluation.componentScores[section.key] ?? 0)}%
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
              <strong>مكونات تحتاج وضوحاً أكبر:</strong>
              <span>{evaluation.missingComponents.join("، ")}</span>
            </div>
          ) : null}

          <section className="revised-prompt">
            <h3>صياغة محسّنة مقترحة</h3>
            <pre>{evaluation.revisedPrompt}</pre>
          </section>

          <div className="next-action">
            <strong>خطوتك التالية</strong>
            <p>{evaluation.nextAction}</p>
          </div>

          <div className="prompt-actions">
            <button type="button" onClick={copyResult}>
              نسخ النتيجة
            </button>
            {copyMessage ? <p className="form-message">{copyMessage}</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
