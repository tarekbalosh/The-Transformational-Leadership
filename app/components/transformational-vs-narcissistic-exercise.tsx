"use client";

import { useState } from "react";
import { exerciseData } from "@/app/data/transformational-vs-narcissistic";

export function TransformationalVsNarcissisticExercise() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleOptionChange = (questionIndex: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exerciseData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.entries(answers).forEach(([qIndex, optId]) => {
      const q = exerciseData.questions[parseInt(qIndex)];
      const opt = q.options.find((o) => o.id === optId);
      if (opt) totalScore += opt.score;
    });
    return totalScore;
  };

  const getResultFeedback = (score: number) => {
    const result = exerciseData.results.find((r) => score >= r.min && score <= r.max);
    return result ? result.text : "";
  };

  const score = isSubmitted ? calculateScore() : 0;
  
  const submitResults = async () => {
    setIsSubmitting(true);
    try {
      const email =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("participantEmail") ?? ""
          : "";

      const currentScore = calculateScore();
      
      const answerPayload = JSON.stringify({
        exerciseId: "transformational-vs-narcissistic",
        answers,
        evaluation: { 
          score: Math.round((currentScore / 70) * 100), 
          level: getResultFeedback(currentScore) 
        }
      });

      await fetch("/api/exercise-answers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          exerciseId: "transformational-vs-narcissistic",
          email,
          answer: answerPayload,
        }),
      });
    } catch (error) {
      console.error("Failed to save answers", error);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }
  };
  const currentQuestion = exerciseData.questions[currentQuestionIndex];

  return (
    <div className="exercise-wrapper">
        {!isSubmitted ? (
          <>
            <p className="exercise-instructions">
              {exerciseData.instructions}
            </p>

            <div className="question-card-container">
              <div className="question-card">
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${((currentQuestionIndex + 1) / exerciseData.questions.length) * 100}%` }}
                  ></div>
                </div>
                
                <p className="question-counter">
                  السؤال {currentQuestionIndex + 1} من {exerciseData.questions.length}
                </p>

                <div className="question-content" key={currentQuestionIndex}>
                  <p className="question-text">{currentQuestion.text}</p>
                  <p className="question-subtext">ما التصنيف الأدق؟</p>
                  
                  <div className="options-grid">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = answers[currentQuestionIndex] === opt.id;
                      return (
                        <div 
                          key={opt.id} 
                          className={`option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleOptionChange(currentQuestionIndex, opt.id)}
                        >
                          <span className="option-text">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="navigation-buttons">
                  <button 
                    className="nav-btn prev-btn" 
                    onClick={handlePrev} 
                    disabled={currentQuestionIndex === 0}
                  >
                    السابق
                  </button>
                  
                  {currentQuestionIndex < exerciseData.questions.length - 1 ? (
                    <button 
                      className="nav-btn next-btn" 
                      onClick={handleNext}
                      disabled={!answers[currentQuestionIndex]}
                    >
                      التالي
                    </button>
                  ) : (
                    <button 
                      className="nav-btn finish-btn" 
                      onClick={submitResults}
                      disabled={!answers[currentQuestionIndex] || isSubmitting}
                    >
                      {isSubmitting ? "جاري الحفظ..." : "إظهار النتيجة"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="print-layout-container">
            <div className="result-container">
              <h2>النتيجة: {score} / 70</h2>
              <p className="result-text">{getResultFeedback(score)}</p>
              
              <div className="detailed-answers">
                <h3>تحليل الإجابات</h3>
                {exerciseData.questions.map((q, index) => {
                  const userAnswerId = answers[index];
                  const userOption = q.options.find(o => o.id === userAnswerId);
                  const bestOption = q.options.reduce((prev, current) => (prev.score > current.score) ? prev : current);
                  const isCorrect = userOption?.id === bestOption.id;

                  return (
                    <div key={index} className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <h4>الحالة {index + 1}</h4>
                      <p className="scenario-text">{q.text}</p>
                      
                      <div className={`feedback-box ${isCorrect ? 'success-box' : 'warning-box'}`}>
                        <p><strong>إجابتك:</strong> {userOption?.text} <span className="score-badge">({userOption?.score} نقاط)</span></p>
                        <p className="explanation"><strong>التحليل:</strong> {userOption?.explanation}</p>
                        <p className="rule"><strong>القاعدة المطبقة ({userOption?.ruleId}):</strong> {userOption?.ruleText}</p>
                      </div>

                      {!isCorrect && (
                        <div className="best-answer-box success-box">
                          <p><strong>البديل الأدق:</strong> {bestOption.text} <span className="score-badge">({bestOption.score} نقاط)</span></p>
                          <p className="explanation"><strong>التحليل:</strong> {bestOption.explanation}</p>
                          <p className="rule"><strong>القاعدة المطبقة ({bestOption.ruleId}):</strong> {bestOption.ruleText}</p>
                        </div>
                      )}

                      <div className="core-rule-box">
                        <p><strong>قاعدة السؤال الجامعة:</strong> {q.coreRule}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="action-buttons no-print">
                <button 
                  className="secondary-button"
                  onClick={() => {
                    setAnswers({});
                    setIsSubmitted(false);
                    setCurrentQuestionIndex(0);
                    window.scrollTo(0, 0);
                  }}
                >
                  إعادة التمرين
                </button>
                <button 
                  className="primary-button"
                  onClick={() => window.print()}
                >
                  طباعة التقرير الكامل
                </button>
              </div>
            </div>
          </div>
        )}
      <style dangerouslySetInnerHTML={{ __html: `
        .exercise-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .exercise-instructions {
          font-size: 1.1rem;
          color: #ef4444;
          background: #fef2f2;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 600;
          width: 100%;
          max-width: 800px;
        }

        .question-card-container {
          width: 100%;
          max-width: 800px;
          perspective: 1000px;
        }

        .question-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .progress-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: #e2e8f0;
        }

        .progress-bar {
          height: 100%;
          background: #f97316;
          transition: width 0.4s ease;
        }

        .question-counter {
          text-align: center;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          margin-top: -0.5rem;
        }

        .question-content {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .question-text {
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
          line-height: 1.6;
          text-align: center;
        }

        .question-subtext {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 2rem;
          font-weight: 600;
          text-align: center;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .option-card {
          background: white;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .option-card:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .option-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .option-text {
          font-weight: 600;
          color: #334155;
          line-height: 1.5;
          font-size: 1.05rem;
        }
        
        .option-card.selected .option-text {
          color: #1e3a8a;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1.5rem;
        }

        .nav-btn {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .prev-btn {
          background: white;
          color: #64748b;
          border: 1px solid #cbd5e1;
        }

        .prev-btn:hover:not(:disabled) {
          background: #f1f5f9;
          color: #334155;
        }

        .prev-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .next-btn, .finish-btn {
          background: #2563eb;
          color: white;
          border: none;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
        }

        .finish-btn {
          background: #f97316;
          box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2);
        }

        .next-btn:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        
        .finish-btn:hover:not(:disabled) {
          background: #ea580c;
          transform: translateY(-1px);
        }

        .next-btn:disabled, .finish-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* Results Page Styles */
        .result-container {
          padding: 1rem 0;
          max-width: 800px;
          margin: 0 auto;
        }

        .result-container h2 {
          color: #0f172a;
          margin-bottom: 1rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .result-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #0f172a;
          background: #f0f9ff;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #bae6fd;
          margin-bottom: 3rem;
          text-align: center;
          font-weight: 600;
        }

        .detailed-answers {
          margin-bottom: 3rem;
        }
        
        .detailed-answers h3 {
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
          color: #1e293b;
        }

        .answer-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .answer-item h4 {
          color: #334155;
          margin-bottom: 0.75rem;
        }

        .scenario-text {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #1e293b;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px dashed #cbd5e1;
        }

        .feedback-box, .best-answer-box {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .success-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .warning-box {
          background: #fffbeb;
          border: 1px solid #fef08a;
        }

        .score-badge {
          background: white;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          color: #475569;
          margin-right: 0.5rem;
          border: 1px solid #e2e8f0;
        }

        .explanation, .rule {
          margin-top: 0.75rem;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #475569;
        }

        .core-rule-box {
          background: #f8fafc;
          border-right: 4px solid #3b82f6;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: #334155;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .primary-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
        }

        .primary-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .secondary-button {
          background: white;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .secondary-button:hover {
          background: #f1f5f9;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .exercise-wrapper {
            box-shadow: none;
            padding: 0;
          }
          .answer-item {
            break-inside: avoid;
          }
        }
        
        @media (max-width: 640px) {
          .question-card {
            padding: 1.5rem;
          }
          .navigation-buttons {
            flex-direction: column-reverse;
            gap: 1rem;
          }
          .nav-btn {
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}

