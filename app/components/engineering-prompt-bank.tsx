"use client";

import { useState } from "react";

import { engineeringPromptBank } from "@/app/lib/course-content";

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

export function EngineeringPromptBank() {
  const [copiedTitle, setCopiedTitle] = useState("");
  const [variableValues, setVariableValues] = useState<
    Record<string, Record<string, string>>
  >({});

  function generatedPrompt(prompt: (typeof engineeringPromptBank)[number]) {
    return prompt.variables.reduce((text, variable) => {
      const value = variableValues[prompt.title]?.[variable.token]?.trim();
      return text.replaceAll(variable.token, value || variable.token);
    }, prompt.text);
  }

  function updateVariable(promptTitle: string, token: string, value: string) {
    setVariableValues((current) => ({
      ...current,
      [promptTitle]: {
        ...current[promptTitle],
        [token]: value,
      },
    }));
  }

  function clearVariables(promptTitle: string) {
    setVariableValues((current) => ({
      ...current,
      [promptTitle]: {},
    }));
    setCopiedTitle("");
  }

  async function copyPrompt(text: string, title: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(title);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopiedTitle(title);
    }
  }

  return (
    <div className="engineering-prompt-bank">
      {engineeringPromptBank.map((prompt, index) => (
        <article className="engineering-prompt-card" key={prompt.title}>
          <div className="engineering-prompt-head">
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{prompt.title}</h3>
              <p>{prompt.description}</p>
            </div>
          </div>

          <div className="engineering-prompt-badges" aria-label="خصائص الأمر">
            {prompt.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <pre className="engineering-prompt-box" dir="rtl">
            {generatedPrompt(prompt)}
          </pre>

          <div className="engineering-prompt-actions">
            <button
              type="button"
              className="copy-prompt-button engineering-copy-button"
              onClick={() => copyPrompt(generatedPrompt(prompt), prompt.title)}
              aria-label={`نسخ أمر ${prompt.title}`}
              title={`نسخ أمر ${prompt.title}`}
            >
              <CopyIcon />
              <span>نسخ الأمر</span>
            </button>
          </div>

          <section
            className="engineering-variable-panel"
            aria-label={`متغيرات أمر ${prompt.title}`}
          >
            <div className="section-kicker">المتغيرات</div>
            <div className="engineering-variable-grid">
              {prompt.variables.map((variable) => {
                const value =
                  variableValues[prompt.title]?.[variable.token] ?? "";

                return (
                  <label className="engineering-variable-field" key={variable.token}>
                    <span>{variable.label}</span>
                    {variable.inputType === "textarea" ? (
                      <textarea
                        value={value}
                        onChange={(event) =>
                          updateVariable(
                            prompt.title,
                            variable.token,
                            event.target.value
                          )
                        }
                        placeholder={variable.placeholder}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(event) =>
                          updateVariable(
                            prompt.title,
                            variable.token,
                            event.target.value
                          )
                        }
                        placeholder={variable.placeholder}
                      />
                    )}
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              className="secondary-link engineering-clear-button"
              onClick={() => clearVariables(prompt.title)}
            >
              تفريغ المتغيرات
            </button>
          </section>
        </article>
      ))}

      <div className="comparison-status" aria-live="polite">
        {copiedTitle ? `تم نسخ أمر ${copiedTitle}.` : ""}
      </div>
    </div>
  );
}
