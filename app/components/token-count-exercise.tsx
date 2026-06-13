"use client";

import { FormEvent, useState } from "react";

const tokenizerUrl = "https://platform.openai.com/tokenizer";

const sentences = [
  {
    id: "first",
    label: "الجملة الأولى",
    note: "جملة عربية واضحة ومألوفة في سياق الإدارة.",
    text: "الذكاء الاصطناعي يساعد المدير في اتخاذ قرار أفضل",
  },
  {
    id: "second",
    label: "الجملة الثانية",
    note: "جملة عربية غير مألوفة تتضمن ألفاظاً مركبة وغريبة.",
    text: "قزحبل مرجفان يطقطق زعنفيخ فوق خرنقوش عسير للغاية",
  },
] as const;

type SentenceId = (typeof sentences)[number]["id"];

type TokenValues = Record<
  SentenceId,
  {
    tokens: string;
    characters: string;
  }
>;

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

export function TokenCountExercise() {
  const [copiedLabel, setCopiedLabel] = useState("");
  const [values, setValues] = useState<TokenValues>({
    first: { tokens: "", characters: "" },
    second: { tokens: "", characters: "" },
  });
  const [reflection, setReflection] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function copySentence(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopiedLabel(label);
  }

  function updateValue(
    sentenceId: SentenceId,
    field: "tokens" | "characters",
    nextValue: string
  ) {
    setValues((current) => ({
      ...current,
      [sentenceId]: {
        ...current[sentenceId],
        [field]: nextValue,
      },
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const participantEmail =
      typeof window === "undefined"
        ? ""
        : window.sessionStorage.getItem("participantEmail") ?? "";

    const answer = JSON.stringify(
      {
        exerciseId: "token-count",
        title: "تمرين حساب الرموز Tokens",
        tokenizerUrl,
        answers: sentences.map((sentence) => ({
          label: sentence.label,
          sentence: sentence.text,
          tokens: values[sentence.id].tokens,
          characters: values[sentence.id].characters,
        })),
        reflection,
      },
      null,
      2
    );

    const response = await fetch("/api/exercise-answers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: participantEmail,
        exerciseId: "token-count",
        answer,
      }),
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر تسليم الإجابة.");
      return;
    }

    setMessage("شكراً لقد تم استلام إجابتك.");
  }

  return (
    <div className="token-count-layout">
      <section className="comparison-intro-card">
        <div className="section-kicker">تمرين حساب الرموز Tokens</div>
        <h2>قارن بين عدد الرموز وعدد المحارف في نصين عربيين</h2>
        <p>
          افتح أداة OpenAI Tokenizer، ثم انسخ كل جملة والصقها في الأداة. سجّل
          عدد الرموز Tokens وعدد المحارف Characters كما يظهران لك، ثم لاحظ كيف
          يمكن أن يتغير عدد الرموز حتى عندما يبدو النص قصيراً.
        </p>
        <a
          href={tokenizerUrl}
          className="primary-link"
          target="_blank"
          rel="noreferrer"
        >
          فتح OpenAI Tokenizer
        </a>
      </section>

      <form className="token-count-form" onSubmit={submit}>
        <section className="token-sentence-grid" aria-label="جمل التمرين">
          {sentences.map((sentence) => (
            <article className="token-sentence-card" key={sentence.id}>
              <div className="comparison-prompt-head">
                <div>
                  <div className="section-kicker">{sentence.label}</div>
                  <h3>{sentence.note}</h3>
                </div>
                <button
                  type="button"
                  className="copy-prompt-button"
                  onClick={() => copySentence(sentence.text, sentence.label)}
                  aria-label={`نسخ ${sentence.label}`}
                  title={`نسخ ${sentence.label}`}
                >
                  <CopyIcon />
                  <span>نسخ الجملة</span>
                </button>
              </div>

              <pre className="prompt-copy-box" dir="rtl">
                {sentence.text}
              </pre>

              <div className="token-input-grid">
                <label>
                  <span>عدد الرموز Tokens</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={values[sentence.id].tokens}
                    onChange={(event) =>
                      updateValue(sentence.id, "tokens", event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  <span>عدد المحارف Characters</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={values[sentence.id].characters}
                    onChange={(event) =>
                      updateValue(
                        sentence.id,
                        "characters",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>
              </div>
            </article>
          ))}
        </section>

        <section className="token-reflection-card">
          <label htmlFor="token-reflection">
            ما الملاحظة الأهم التي خرجت بها من المقارنة؟
          </label>
          <textarea
            id="token-reflection"
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="اكتب ملاحظة قصيرة حول الفرق بين عدد الرموز وعدد المحارف في الجملتين."
            required
          />
        </section>

        <div className="prompt-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جار التسليم" : "تسليم التمرين"}
          </button>
          <span className="comparison-status" aria-live="polite">
            {copiedLabel ? `تم نسخ ${copiedLabel}.` : ""}
          </span>
        </div>

        {message ? (
          <p className="exercise-receipt-message" aria-live="polite">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
