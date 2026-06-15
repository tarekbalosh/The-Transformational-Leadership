"use client";

import { FormEvent, ReactNode, useState, useSyncExternalStore } from "react";

type Props = {
  activityId: string;
  activityTitle: string;
  children: ReactNode;
  compact?: boolean;
  redirectTo?: string;
};

export function ActivityCodeGate({
  activityId,
  activityTitle,
  children,
  compact = false,
  redirectTo,
}: Props) {
  const storageKey = `activityCode:${activityId}`;
  const accessState = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("activity-code-change", onStoreChange);
      return () =>
        window.removeEventListener("activity-code-change", onStoreChange);
    },
    () => window.sessionStorage.getItem(storageKey) ?? "",
    () => ""
  );
  const [code, setCode] = useState("");
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
    window.dispatchEvent(new Event("activity-code-change"));

    if (redirectTo) {
      window.location.assign(redirectTo);
    }
  }

  if (accessState === "ok") {
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
