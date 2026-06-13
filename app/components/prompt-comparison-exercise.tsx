"use client";

import { useState } from "react";

const prompts = [
  {
    label: "الصيغة الأولى",
    tone: "صياغة عامة وغير محددة",
    text: "لو سمحت يا جيبتي عندي شغلة محتاج اياها ضروري وهي انه ابي تسوي لي شي يخص الموظفين يعني زي خطة او شي من هالقبيل عشان نحسن الأداء بشكل عام يعني الوضع مو اوكي حاليا والمدير طالب مني شي قبل الاجتماع الجاي وياليت تخلي الموضوع حلو ومرتب ومنيح إذا ما عليك كلافة",
  },
  {
    label: "الصيغة الثانية",
    tone: "صياغة واضحة قابلة للتنفيذ",
    text: `بصفتك خبير موارد بشرية، أنشئ مقترح خطة تحسين أداء لفريق مبيعات مكوّن من 20 موظفاً.

المشكلة: انخفاض الأداء بنسبة 15% خلال الربع الأخير.

المطلوب:
- تحديد 3 أسباب محتملة لانخفاض الأداء.
- اقتراح إجراءات تصحيحية لكل سبب.
- جدول زمني للتنفيذ خلال 30 يوماً.

الصيغة: تقرير مختصر من صفحة واحدة مناسب للعرض على الإدارة العليا.`,
  },
];

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

export function PromptComparisonExercise() {
  const [copiedLabel, setCopiedLabel] = useState("");

  async function copyPrompt(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopiedLabel(label);
    }
  }

  return (
    <div className="prompt-comparison-layout">
      <section className="comparison-intro-card">
        <div className="section-kicker">تمرين مقارنة أمر بصيغتين</div>
        <h2>انسخ الصيغتين وجرب الفرق في أداة الذكاء الاصطناعي</h2>
        <p>
          الهدف من التمرين هو ملاحظة أثر الوضوح والسياق والمخرجات المطلوبة على
          جودة استجابة الذكاء الاصطناعي. انسخ كل صيغة كما هي، ثم قارن الفرق بين
          النتائج.
        </p>
      </section>

      <section className="comparison-prompt-grid" aria-label="صيغ الأوامر">
        {prompts.map((prompt) => (
          <article className="comparison-prompt-card" key={prompt.label}>
            <div className="comparison-prompt-head">
              <div>
                <div className="section-kicker">{prompt.label}</div>
                <h3>{prompt.tone}</h3>
              </div>
              <button
                type="button"
                className="copy-prompt-button"
                onClick={() => copyPrompt(prompt.text, prompt.label)}
                aria-label={`نسخ ${prompt.label}`}
                title={`نسخ ${prompt.label}`}
              >
                <CopyIcon />
                <span>نسخ الأمر</span>
              </button>
            </div>

            <pre className="prompt-copy-box" dir="rtl">{prompt.text}</pre>
          </article>
        ))}
      </section>

      <div className="comparison-status" aria-live="polite">
        {copiedLabel ? `تم نسخ ${copiedLabel}.` : ""}
      </div>
    </div>
  );
}
