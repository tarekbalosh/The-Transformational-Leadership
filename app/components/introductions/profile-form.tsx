"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fields = [
  {
    id: "country",
    label: "من أي بلد تحضر معنا اليوم؟",
    placeholder: "مثال: السعودية، عُمان، الإمارات، ماليزيا...",
    multiline: false,
  },
  {
    id: "professionalBackground",
    label: "الخلفية المهنية",
    placeholder: "مثال: مدير عمليات في قطاع التعليم، أعمل على تحسين تجربة العملاء...",
    multiline: true,
  },
  {
    id: "courseGoals",
    label: "أهدافك من الدورة",
    placeholder: "ما الذي تريد الخروج به من هذه التجربة التدريبية؟",
    multiline: true,
  },
  {
    id: "funFact",
    label: "حقيقة ممتعة عنك",
    placeholder: "شيء خفيف يساعد الآخرين على تذكرك وبدء حديث معك.",
    multiline: true,
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
  country: "",
  professionalBackground: "",
  courseGoals: "",
  funFact: "",
};

export function ProfileForm() {
  const router = useRouter();
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
    setMessage("شكرا لك");
    
    setTimeout(() => {
      router.push('/introductions/board');
    }, 1500);
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
          {field.multiline ? (
            <textarea
              value={form[field.id]}
              onChange={(event) => update(field.id, event.target.value)}
              placeholder={field.placeholder}
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={form[field.id]}
              onChange={(event) => update(field.id, event.target.value)}
              placeholder={field.placeholder}
            />
          )}
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
