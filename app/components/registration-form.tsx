"use client";

import { FormEvent, useState } from "react";

export function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "تعذر تسجيل الدخول.");
        setIsSubmitting(false);
        return;
      }

      // Save email to sessionStorage so EmailGate on /exercises recognizes the user
      window.sessionStorage.setItem("participantEmail", data.participant.email);
      window.dispatchEvent(new Event("participant-email-change"));

      // Redirect to exercises & assessments page
      window.location.href = "/exercises";
    } catch {
      setMessage("حدث خطأ في الاتصال. حاول مرة أخرى.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="email-registration-form" onSubmit={submit}>
      <label htmlFor="email" className="email-registration-label">
        البريد الإلكتروني للمشارك
      </label>
      <div className="email-registration-input-group">
        <input
          type="email"
          id="email"
          className="email-registration-input"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="email-registration-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جار التسجيل..." : "الدخول"}
        </button>
      </div>
      {message ? (
        <p className="form-message" style={{ marginTop: "12px", color: "#ef4444" }}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
