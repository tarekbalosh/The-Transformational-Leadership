"use client";

import { FormEvent, useState } from "react";

type Props = {
  compact?: boolean;
};

export function ParticipantEntry({ compact = false }: Props) {
  const [email, setEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem("participantEmail") ?? ""
  );
  const [savedEmail, setSavedEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem("participantEmail") ?? ""
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/participants", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر تسجيل الدخول.");
      return;
    }

    window.sessionStorage.setItem("participantEmail", data.participant.email);
    setSavedEmail(data.participant.email);
    setMessage("تم تسجيل بريدك. يمكنك الآن حفظ التمارين والنتائج.");
  }

  return (
    <form className={compact ? "entry-form compact" : "entry-form"} onSubmit={submit}>
      <label htmlFor="participant-email">البريد الإلكتروني للمشارك</label>
      <div className="entry-row">
        <input
          id="participant-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جار الحفظ" : savedEmail ? "تحديث البريد" : "الدخول"}
        </button>
      </div>
      {savedEmail ? <p className="form-note">البريد الحالي: {savedEmail}</p> : null}
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
