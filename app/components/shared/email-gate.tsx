"use client";

import { FormEvent, ReactNode, useState, useSyncExternalStore } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function EmailGate({
  children,
  title = "أدخل بريدك للمتابعة",
  description = "نستخدم البريد فقط لربط إجاباتك ونتائجك بك، دون كلمة مرور أو حساب جديد.",
}: Props) {
  const storedEmail = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("participant-email-change", onStoreChange);
      return () =>
        window.removeEventListener("participant-email-change", onStoreChange);
    },
    () => window.sessionStorage.getItem("participantEmail") ?? "",
    () => ""
  );
  const [email, setEmail] = useState("");
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
      setMessage(data.message ?? "تعذر تسجيل البريد.");
      return;
    }

    window.sessionStorage.setItem("participantEmail", data.participant.email);
    window.dispatchEvent(new Event("participant-email-change"));
    setEmail(data.participant.email);
  }

  if (storedEmail) {
    return <>{children}</>;
  }

  return (
    <section className="email-gate">
      <div className="section-kicker">دخول المشارك</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <form className="entry-form compact" onSubmit={submit}>
        <label htmlFor="gate-email">البريد الإلكتروني للمشارك</label>
        <div className="entry-row">
          <input
            id="gate-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جار الحفظ" : "متابعة"}
          </button>
        </div>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </section>
  );
}
