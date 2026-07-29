"use client";

import { useState, FormEvent } from "react";


const courseMaterialsData = [
  {
    id: 1,
    name: "اليوم الأول",
    code: "101",
    link: "https://drive.google.com/drive/folders/1-_Ti-w_Mqa6gvR6aNko9dati-E-lymYu?usp=share_link"
  },
  {
    id: 2,
    name: "اليوم الثاني",
    code: "102",
    link: "https://drive.google.com/drive/folders/1caWBgkTU1VKtz1dYaIds8P9cML_7KM2U?usp=share_link"
  },
  {
    id: 3,
    name: "اليوم الثالث",
    code: "103",
    link: "https://drive.google.com/drive/folders/1Z4bZBlOTIAd-WIKsHdEws43zufww1XV4?usp=share_link"
  },
  {
    id: 4,
    name: "اليوم الرابع",
    code: "104",
    link: "https://drive.google.com/drive/folders/1WyplBfYZTZzRaKB4_KpFVYQEDFQBMUVt?usp=share_link"
  }
];

export function CourseMaterials() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      {!isUnlocked ? (
        <article className="course-link-card">
          <div>
            <span>00</span>
            <h2>مواد الدورة</h2>
            <p>الرجاء إدخال الكود للوصول إلى مواد الدورة الخاصة بك.</p>
          </div>
          <button className="primary-link" onClick={() => setIsUnlocked(true)}>
            فتح المواد
          </button>
        </article>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {courseMaterialsData.map((material) => (
            <MaterialItem key={material.id} material={material} />
          ))}
        </div>
      )}
    </div>
  );
}

function MaterialItem({ material }: { material: typeof courseMaterialsData[0] }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleOpen = (e: FormEvent) => {
    e.preventDefault();
    if (code === material.code) {
      setError("");
      window.location.href = material.link;
    } else {
      setError("الكود غير صحيح.");
    }
  };

  return (
    <article className="course-link-card">
      <div>
        <span>{String(material.id).padStart(2, "0")}</span>
        <h2>{material.name}</h2>
        <p>يرجى إدخال الكود الخاص بهذا اليوم لفتح موارده.</p>
      </div>
      <form onSubmit={handleOpen} style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
        <input
          type="text"
          style={{ width: "150px", height: "46px", border: "1px solid var(--line)", background: "var(--surface)", borderRadius: "14px", padding: "10px 14px", color: "var(--navy)", outline: "none" }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="primary-link">
          فتح الرابط
        </button>
        {error ? (
          <span style={{ position: "absolute", bottom: "-24px", right: "0", color: "#ef4444", fontSize: "14px", fontWeight: "bold" }}>
            {error}
          </span>
        ) : null}
      </form>
    </article>
  );
}
