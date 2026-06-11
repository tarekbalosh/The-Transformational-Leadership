"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const fields = [
  {
    id: "professionalBackground",
    label: "الخلفية المهنية",
    placeholder: "مثال: مدير عمليات في قطاع التعليم، أعمل على تحسين تجربة العملاء...",
  },
  {
    id: "aiInterests",
    label: "اهتماماتك في الذكاء الاصطناعي",
    placeholder: "ما المجالات أو التطبيقات التي تثير اهتمامك؟",
  },
  {
    id: "courseGoals",
    label: "أهدافك من الدورة",
    placeholder: "ما الذي تريد الخروج به من هذه التجربة التدريبية؟",
  },
  {
    id: "funFact",
    label: "حقيقة ممتعة عنك",
    placeholder: "شيء خفيف يساعد الآخرين على تذكرك وبدء حديث معك.",
  },
] as const;

type FieldId = (typeof fields)[number]["id"];

type FormState = Record<FieldId, string> & {
  email: string;
  name: string;
};

const initialState: FormState = {
  email: "",
  name: "",
  professionalBackground: "",
  aiInterests: "",
  courseGoals: "",
  funFact: "",
};

export function ProfileForm() {
  const [form, setForm] = useState<FormState>(() => {
    const email =
      typeof window === "undefined"
        ? ""
        : window.sessionStorage.getItem("participantEmail") ?? "";

    return { ...initialState, email };
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/participant-profiles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    setIsSaving(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر حفظ بيانات التعارف.");
      return;
    }

    window.sessionStorage.setItem("participantEmail", data.email);
    setForm((current) => ({ ...current, email: data.email }));
    setSaved(true);
    setMessage("تم حفظ بطاقة التعارف. يستطيع المشاركون الآن استعراضها.");
  }

  return (
    <form className="intro-form" onSubmit={submit}>
      <div className="intro-form-grid">
        <label>
          البريد الإلكتروني
          <input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="name@example.com"
            required
          />
        </label>
        <label>
          الاسم
          <input
            type="text"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="اكتب اسمك كما تحب أن يظهر للمشاركين"
            required
          />
        </label>
      </div>

      {fields.map((field) => (
        <label key={field.id}>
          {field.label}
          <textarea
            value={form[field.id]}
            onChange={(event) => update(field.id, event.target.value)}
            placeholder={field.placeholder}
            rows={4}
            required
          />
        </label>
      ))}

      <div className="intro-form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? "جار الحفظ" : "حفظ بطاقة التعارف"}
        </button>
        <Link href="/introductions/board" className="secondary-link">
          استعراض إجابات المشاركين
        </Link>
      </div>

      {message ? <p className="form-message">{message}</p> : null}
      {saved ? (
        <p className="form-note">
          يمكنك تحديث إجاباتك لاحقاً بإدخال البريد نفسه وإعادة حفظ النموذج.
        </p>
      ) : null}
    </form>
  );
}
