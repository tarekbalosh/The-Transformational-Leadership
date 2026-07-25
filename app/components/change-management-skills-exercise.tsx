"use client";

import { useState } from "react";

export function ChangeManagementSkillsExercise() {
  const [hasStarted, setHasStarted] = useState(false);
  const [participantName, setParticipantName] = useState(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage.getItem("participantName") || "";
    }
    return "";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage.getItem("participantEmail") || "";
    }
    return "";
  });
  const [emailError, setEmailError] = useState("");

  if (!hasStarted) {
    return (
      <div className="exercise-wrapper" style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px 0" }}>
        <div className="start-screen-container" style={{
            width: '100%', maxWidth: '600px', background: 'white', borderRadius: '16px',
            padding: '2.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0', textAlign: 'center', margin: '2rem auto'
        }}>
          <div className="start-card">
            <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1.8rem', textAlign: 'center' }}>اختبار تشخيص مهارات التغيير</h2>
            <p className="exercise-instructions" style={{ marginBottom: '2rem', color: '#475569', fontSize: '1.1rem' }}>
              أجب عن الأسئلة التالية لتشخيص مهاراتك في إدارة التغيير.
            </p>
            <div className="name-input-group" style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label htmlFor="participantEmail" style={{ fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', width: '120px' }}>البريد الإلكتروني:</label>
                <input
                  type="email"
                  id="participantEmail"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="example@domain.com"
                  className="name-input"
                  style={{
                    flex: 1, padding: '0.75rem 1rem', border: emailError ? '1px solid red' : '1px solid #cbd5e1',
                    borderRadius: '8px', fontSize: '1rem', outline: 'none'
                  }}
                />
              </div>
              {emailError && <p style={{ color: 'red', margin: '-0.5rem 0 0.5rem', fontSize: '0.9rem', textAlign: 'right', paddingRight: '136px' }}>{emailError}</p>}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label htmlFor="participantName" style={{ fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', width: '120px' }}>الاسم (اختياري):</label>
                <input
                  type="text"
                  id="participantName"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  className="name-input"
                  style={{
                    flex: 1, padding: '0.75rem 1rem', border: '1px solid #cbd5e1',
                    borderRadius: '8px', fontSize: '1rem', outline: 'none'
                  }}
                />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <button 
                className="primary-button start-button"
                onClick={() => {
                  if (!email || !email.includes("@")) {
                    setEmailError("يرجى إدخال بريد إلكتروني صحيح لبدء التمرين.");
                    return;
                  }
                  window.sessionStorage.setItem("participantEmail", email);
                  window.sessionStorage.setItem("participantName", participantName);
                  setHasStarted(true);
                }}
                style={{ padding: '0.75rem 2rem', background: '#1a5f5f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ابدأ التمرين &larr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <iframe
        src={`/tests/change-management-skills/index.html${participantName.trim() ? `?name=${encodeURIComponent(participantName.trim())}` : ''}`}
        style={{ width: "100%", height: "900px", border: 0, borderRadius: "12px" }}
        title="تمرين مهارات التغيير"
      />
    </div>
  );
}
