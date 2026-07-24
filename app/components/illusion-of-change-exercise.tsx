"use client";

import { useState } from "react";

type Category = "حقيقية" | "موهمة" | "مساعدة";

interface Question {
  id: number;
  statement: string;
  correctCategory: Category;
  explanation: string;
}

const questions: Question[] = [
  { id: 1, statement: "تكثيف اجتماعات القيادة", correctCategory: "موهمة", explanation: "كثير من اجتماعات القيادة تدور حول أمور تنفيذية أو هامشية، فتكثيف الاجتماعات لا يدل إطلاقًا على أن تغييرًا جذريًا سوف يحدث." },
  { id: 2, statement: "إعادة صياغة الرؤية", correctCategory: "مساعدة", explanation: "الصياغة نفسها ليس لها قيمة كبيرة، لكن إعادة تشكيل الرؤية قد تعني الاتجاه نحو التغيير، وقد تكون تغييرًا شكليًا." },
  { id: 3, statement: "إعادة صياغة الرسالة", correctCategory: "مساعدة", explanation: "الرسالة هي الإجابة على (من نحن وماذا نريد)، والتغيير الجذري قد يغيّر (من نحن) أو (ماذا نريد)، وفي هذه الحالة ستكون إعادة صياغة الرسالة أمرًا مساعدًا." },
  { id: 4, statement: "إعادة ترتيب الهيكل التنظيمي", correctCategory: "مساعدة", explanation: "يجب تغيير الهيكل كلما تغيرت الخطة الاستراتيجية، والخطة يجب أن تكون انعكاسًا للتغيير الجذري؛ فعندها تكون علامة مساعدة. أما إذا كانت الخطة امتدادًا لما سبق فلا يوجد تغيير جذري." },
  { id: 5, statement: "تغيير فريق التخطيط الاستراتيجي", correctCategory: "مساعدة", explanation: "لا يعني أن تغييرًا جذريًا سيحدث بالضرورة، لكنه سيساعد على إخراج أفكار جديدة لم يطرحها الفريق السابق، فتساهم هذه العلامة في التغيير الجذري لكنها لا تدل وحدها عليه." },
  { id: 6, statement: "استقالة المسؤول وتولي نائبه المخلص", correctCategory: "موهمة", explanation: "تولي النائب المخلص يدل على أنه سيسير على خطى صاحبه من قبله، وبالتالي لن يحدث أي تغيير جذري." },
  { id: 7, statement: "خطة إعلامية جديدة", correctCategory: "مساعدة", explanation: "هذه العلامة وحدها لن تصنع التغيير الجذري، لكنها ستساعده إذا حدث." },
  { id: 8, statement: "خطة علاقات عامة جديدة", correctCategory: "مساعدة", explanation: "لن تُحدث التغيير الجذري لكنها ستساعده إن حدث." },
  { id: 9, statement: "تحسين جذري لخدمة العملاء", correctCategory: "مساعدة", explanation: "علامة تساعد التغيير الجذري إن حدث." },
  { id: 10, statement: "لوائح ونظام أساسي جديد", correctCategory: "مساعدة", explanation: "سنحتاج ذلك إذا أحدثنا تغييرًا جذريًا، لكن هذه العلامة إذا صارت وحدها فهي توهم بالتغيير الجذري." },
  { id: 11, statement: "كتابة خطة استراتيجية جديدة", correctCategory: "مساعدة", explanation: "إن كتبها نفس الفريق السابق تحت نفس القيادة السابقة فغالبًا لا يوجد أي تغيير جذري، أما إن تغيّر الفريق والقيادة فستكون علامة مساعدة." },
  { id: 12, statement: "الانتقال من الاتصال الورقي إلى الإلكتروني", correctCategory: "موهمة", explanation: "انتقال جميل وسيشعر الجميع بالفرق في أدائهم، لكنه لا يُحدث التغيير الجذري إطلاقًا." },
  { id: 13, statement: "تكثيف التدريب (أو التربية)", correctCategory: "موهمة", explanation: "التغيير الجذري تُحدثه القيادات (أو الثورات والانقلابات)، وبالتالي تكثيف التدريب أو التربية في ظل القيادات نفسها سيعزز الوضع الحالي وليس التغيير الجذري." },
  { id: 14, statement: "خطة إعادة تشكيل «الهوية»", correctCategory: "مساعدة", explanation: "إن كان المقصود بالهوية (الشعار المرسوم واللفظي والألوان ونحوها) فهذه العلامة موهمة، وإن كان المقصود تغيير (من نحن، وما هي رسائلنا لجمهورنا) فهي علامة مساعدة." },
  { id: 15, statement: "الدخول في أسواق جديدة", correctCategory: "مساعدة", explanation: "إن كان ضمن الوضع الحالي فهي علامة موهمة بالتغيير، وإن كانت بناءً على التغيير الجذري فهي علامة مساعدة." },
  { id: 16, statement: "طرح منتجات أو خدمات جديدة", correctCategory: "مساعدة", explanation: "ينطبق عليها ما سبق؛ فهي علامة مساعدة إذا كانت بناءً على التغيير الجذري." },
  { id: 17, statement: "الانتقال إلى مقر متطور", correctCategory: "موهمة", explanation: "سيكون هناك شعور جيد عند العاملين والزبائن، لكن هذا يحدث سواء كان هناك تغيير جديد أم استمر الوضع كما هو." },
  { id: 18, statement: "زيادة الوفرة المالية", correctCategory: "موهمة", explanation: "ستساعد الوضع الحالي أو التغيير الجذري، فلا علاقة حقيقية لها بالتغيير الجذري." },
  { id: 19, statement: "صياغة منهج أو منهجية جديدة", correctCategory: "مساعدة", explanation: "كثير من المناهج الجديدة تظهر في ظل أوضاع ثابتة لا تغيير فيها فتكون موهمة، أما إذا تمت بناءً على التغيير الجذري فستساعده ولكنها لا تصنعه." },
  { id: 20, statement: "تغيير في طريقة التفكير لدى القيادة", correctCategory: "حقيقية", explanation: "هذه هي العلامة الوحيدة الدالة على التغيير الجذري؛ فعندها يُتوقع التفكير الإبداعي وتجاوز الطرق التقليدية وحدوث كل العلامات المساندة أعلاه. وتغيير طريقة التفكير يحدث غالبًا باستبدال القيادة جذريًا، ويندر أن تتغير لدى الحاليين." }
];

export function IllusionOfChangeExercise() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  
  // Store user answers for all questions
  const [answers, setAnswers] = useState<Category[]>(Array(questions.length).fill(null));

  const currentQuestion = questions[currentQuestionIndex];

  const handleStart = () => setStarted(true);

  const handleSelect = (category: Category) => {
    // Record the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = category;
    setAnswers(newAnswers);

    // Immediately go to the next question, or finish if it's the last one
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setFinished(true);
      
      // Save data to backend
      const email = typeof window !== "undefined" ? window.sessionStorage.getItem("participantEmail") : null;
      if (email) {
        const finalScore = newAnswers.filter((ans, idx) => ans === questions[idx].correctCategory).length;
        let textAnswer = `النتيجة: ${finalScore} من ${questions.length}\n\n`;
        newAnswers.forEach((ans, idx) => {
          const q = questions[idx];
          const isCorrect = ans === q.correctCategory;
          textAnswer += `${idx + 1}. ${q.statement}\nإجابة المشارك: ${ans} (${isCorrect ? "صحيحة" : "خاطئة"})\n\n`;
        });

        fetch("/api/exercise-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            exerciseId: "illusion-of-change",
            answer: textAnswer.trim()
          }),
        }).catch(err => console.error("Failed to save exercise result:", err));
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setStarted(false);
    setFinished(false);
    setAnswers(Array(questions.length).fill(null));
  };

  // Calculate score
  const score = answers.filter((ans, idx) => ans === questions[idx].correctCategory).length;

  if (!started) {
    return (
      <div className="exercise-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 32px', backgroundColor: 'var(--bg-1)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', color: 'var(--navy)', marginBottom: '16px', fontWeight: '800' }}>تمرين التغيير الواهم</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto' }}>
            التغيير المقصود هنا هو التغيير الجذري الكبير طويل المدى. هناك علامات تشير إلى أن المنظمة المتعثرة قد بدأت تتغير فعلًا في اتجاهها نحو التصحيح، بينما هناك علامات أخرى تُوهم القائمين بأنهم قد بدأوا فعلًا بالتغيير، وهي في الحقيقة لا قيمة لها.
          </p>
        </div>
        
        <div style={{ backgroundColor: 'var(--bg-2)', padding: '32px', borderRadius: '16px', marginBottom: '40px', borderRight: '4px solid var(--primary)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--navy)', fontWeight: 'bold' }}>المطلوب منك:</h3>
          <p style={{ color: 'var(--text-1)', marginBottom: '16px', fontSize: '16px' }}>سنعرض عليك 20 علامة، وعليك تصنيفها إلى واحدة من ثلاث فئات:</p>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ color: 'var(--green)', fontSize: '20px', marginTop: '-2px' }}>✓</span>
              <div>
                <strong style={{ color: 'var(--navy)', display: 'block' }}>علامة حقيقية للتغيير:</strong>
                <span style={{ color: 'var(--text-2)', fontSize: '15px' }}>تدل فعلًا على التغيير الجذري.</span>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ color: 'var(--red)', fontSize: '20px', marginTop: '-2px' }}>✗</span>
              <div>
                <strong style={{ color: 'var(--navy)', display: 'block' }}>علامة موهمة بالتغيير:</strong>
                <span style={{ color: 'var(--text-2)', fontSize: '15px' }}>لا قيمة لها ولن تصنع التغيير.</span>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '20px', marginTop: '-2px' }}>-</span>
              <div>
                <strong style={{ color: 'var(--navy)', display: 'block' }}>علامة مساعدة:</strong>
                <span style={{ color: 'var(--text-2)', fontSize: '15px' }}>لا تصنع التغيير وحدها، لكنها تساعد إذا صاحبت العلامات الحقيقية.</span>
              </div>
            </li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button className="primary-button" onClick={handleStart} style={{ padding: '16px 48px', fontSize: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            ابدأ التمرين
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px', backgroundColor: 'var(--bg-1)', padding: '48px 32px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom: '24px', fontSize: '72px', animation: 'bounce 1s ease' }}>
            🎯
          </div>
          <h2 style={{ fontSize: '32px', color: 'var(--navy)', marginBottom: '16px', fontWeight: 'bold' }}>اكتمل التمرين!</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontSize: '20px', color: 'var(--text-2)' }}>نتيجتك النهائية:</span>
            <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--primary)' }}>
              {score} <span style={{ fontSize: '24px', color: 'var(--text-3)' }}>/ 20</span>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '24px', borderRadius: '16px', textAlign: 'right', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>💡</span> خلاصة الدرس
            </h3>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-1)', margin: 0 }}>
              العلامة الحقيقية الوحيدة للتغيير الجذري هي <strong>تغيير طريقة التفكير لدى القيادة</strong>، وأن أغلب ما نظنه تغييرًا هو إما علامات موهمة أو علامات مساعدة لا تصنع التغيير وحدها.
            </p>
          </div>
        </div>

        {/* Review Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--navy)', margin: 0 }}>مراجعة الإجابات</h3>
            <button className="secondary-button" onClick={handleRestart} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '15px' }}>
              <span>🔄</span> إعادة التمرين
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {questions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correctCategory;
              return (
                <div key={q.id} style={{ 
                  padding: '24px', 
                  borderRadius: '16px', 
                  backgroundColor: 'var(--bg-1)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  borderRight: `6px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
                  transition: 'transform 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '20px', color: 'var(--navy)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                      <span style={{ color: 'var(--text-3)', marginRight: '8px', fontSize: '16px' }}>{idx + 1}.</span>
                      {q.statement}
                    </h4>
                    <div style={{ padding: '8px 16px', borderRadius: '30px', backgroundColor: isCorrect ? 'var(--green-light)' : 'var(--red-light)', color: isCorrect ? 'var(--green-dark)' : 'var(--red-dark)', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isCorrect ? '✅ إجابة صحيحة' : '❌ إجابة خاطئة'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: 'var(--bg-2)', padding: '12px 16px', borderRadius: '12px', flex: '1 1 200px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '4px' }}>إجابتك</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: isCorrect ? 'var(--green-dark)' : 'var(--red-dark)' }}>{answers[idx]}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-2)', padding: '12px 16px', borderRadius: '12px', flex: '1 1 200px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '4px' }}>الإجابة الصحيحة</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--navy)' }}>{q.correctCategory}</div>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: 'var(--bg-2)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '15px', color: 'var(--text-1)', lineHeight: '1.8', margin: 0 }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--navy)', marginLeft: '8px' }}>التوضيح:</span>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '48px', paddingBottom: '48px' }}>
          <button className="primary-button" onClick={handleRestart} style={{ padding: '16px 48px', fontSize: '18px', borderRadius: '12px' }}>
            <span>🔄</span> التدرب مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--navy)' }}>
            العلامة {currentQuestionIndex + 1} <span style={{ color: 'var(--text-3)', fontWeight: 'normal' }}>من {questions.length}</span>
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${progressPercentage}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Question Card */}
      <div style={{ backgroundColor: 'var(--bg-1)', padding: '48px 32px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', marginBottom: '32px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '28px', color: 'var(--navy)', lineHeight: '1.6', margin: 0, fontWeight: 'bold' }}>
          {currentQuestion.statement}
        </h3>
      </div>

      {/* Choices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <button 
          onClick={() => handleSelect("حقيقية")}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px', 
            borderRadius: '16px', 
            border: '2px solid transparent',
            backgroundColor: 'var(--bg-1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            color: 'var(--navy)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--green)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
          }}
        >
          <span>علامة حقيقية للتغيير</span>
          <span style={{ fontSize: '24px', color: 'var(--green)' }}>✓</span>
        </button>
        
        <button 
          onClick={() => handleSelect("موهمة")}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px', 
            borderRadius: '16px', 
            border: '2px solid transparent',
            backgroundColor: 'var(--bg-1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            color: 'var(--navy)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--red)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
          }}
        >
          <span>علامة موهمة بالتغيير</span>
          <span style={{ fontSize: '24px', color: 'var(--red)' }}>✗</span>
        </button>

        <button 
          onClick={() => handleSelect("مساعدة")}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px', 
            borderRadius: '16px', 
            border: '2px solid transparent',
            backgroundColor: 'var(--bg-1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            color: 'var(--navy)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
          }}
        >
          <span>علامة مساعدة</span>
          <span style={{ fontSize: '24px', color: 'var(--primary)' }}>-</span>
        </button>
      </div>
    </div>
  );
}
