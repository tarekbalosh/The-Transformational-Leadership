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
            <button
              type="button"
              className="copy-prompt-button engineering-copy-button"
              onClick={() => copyPrompt(prompt.text, prompt.title)}
              aria-label={`نسخ أمر ${prompt.title}`}
              title={`نسخ أمر ${prompt.title}`}
            >
              <CopyIcon />
              <span>نسخ الأمر</span>
            </button>
          </div>

          <div className="engineering-prompt-badges" aria-label="خصائص الأمر">
            {prompt.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <pre className="engineering-prompt-box" dir="rtl">
            {prompt.text}
          </pre>
        </article>
      ))}

      <div className="comparison-status" aria-live="polite">
        {copiedTitle ? `تم نسخ أمر ${copiedTitle}.` : ""}
      </div>
    </div>
  );
}
