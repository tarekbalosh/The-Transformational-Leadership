"use client";

import { FormEvent, ReactNode, useState } from "react";

type Props = {
  activityId: string;
  activityTitle: string;
  children: ReactNode;
  compact?: boolean;
};

export function ActivityCodeGate({
  activityId,
  activityTitle,
  children,
  compact = false,
}: Props) {
  const storageKey = `activityCode:${activityId}`;
  const [code, setCode] = useState("");
  const [isAllowed, setIsAllowed] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.sessionStorage.getItem(storageKey) === "ok"
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/activity-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ activityId, code }),
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "كود الدخول غير صحيح.");
      return;
    }

    window.sessionStorage.setItem(storageKey, "ok");
    setIsAllowed(true);
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <form
      className={compact ? "activity-code-form compact" : "activity-code-form"}
      onSubmit={submit}
    >
      <label htmlFor={`activity-code-${activityId}`}>
        كود دخول {activityTitle}
      </label>
      <div className="entry-row">
        <input
          id={`activity-code-${activityId}`}
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="أدخل الكود"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جار التحقق" : "فتح"}
        </button>
      </div>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
