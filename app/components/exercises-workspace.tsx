"use client";

import { FormEvent, useState } from "react";
import { Exercise } from "@/app/lib/course-content";

type Props = {
  exercises: Exercise[];
};

const statusLabels = {
  available: "متاح",
  completed: "مكتمل",
  soon: "قادم",
};

export function ExercisesWorkspace({ exercises }: Props) {
  const firstAvailable = exercises.find((exercise) => exercise.status === "available");
  const [email, setEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem("participantEmail") ?? ""
  );
  const [activeId, setActiveId] = useState(firstAvailable?.id ?? exercises[0]?.id);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const activeExercise = exercises.find((exercise) => exercise.id === activeId);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/exercise-answers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, exerciseId: activeId, answer }),
    });
    const data = await response.json();

    setIsSaving(false);

    if (!response.ok) {
      setMessage(data.message ?? "تعذر حفظ الإجابة.");
      return;
    }

    window.sessionStorage.setItem("participantEmail", email);
    setMessage("تم حفظ إجابة التمرين وربطها ببريدك.");
    setAnswer("");
  }

  return (
    <div className="workspace-grid">
      <aside className="item-list" aria-label="قائمة التمارين">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            className={exercise.id === activeId ? "item-row active" : "item-row"}
            onClick={() => setActiveId(exercise.id)}
          >
            <span>
              <strong>{exercise.title}</strong>
              <small>{exercise.duration}</small>
            </span>
            <em data-status={exercise.status}>{statusLabels[exercise.status]}</em>
          </button>
        ))}
      </aside>

      <section className="work-panel">
        {activeExercise ? (
          <>
            <div className="section-kicker">مساحة الإجابة</div>
            <h2>{activeExercise.title}</h2>
            <p>{activeExercise.prompt}</p>
            <p className="quiet-line">المخرج المتوقع: {activeExercise.outcome}</p>

            <form className="answer-form" onSubmit={submit}>
              <label htmlFor="exercise-email">البريد الإلكتروني</label>
              <input
                id="exercise-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
              />
              <label htmlFor="exercise-answer">إجابة التمرين</label>
              <textarea
                id="exercise-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={8}
                placeholder="اكتب إجابتك العملية هنا..."
                disabled={activeExercise.status === "soon"}
                required
              />
              <button type="submit" disabled={isSaving || activeExercise.status === "soon"}>
                {isSaving ? "جار الحفظ" : "حفظ الإجابة"}
              </button>
              {message ? <p className="form-message">{message}</p> : null}
            </form>
          </>
        ) : null}
      </section>
    </div>
  );
}
