const fs = require('fs');
const path = require('path');

const files = [
  'change-management-skills-exercise.tsx',
  'illusion-of-change-exercise.tsx',
  'leader-impact-exercise.tsx',
  'leadership-theories-exercise.tsx',
  'transformational-vs-narcissistic-exercise.tsx'
];

const basePath = path.join(__dirname, 'app/components');

files.forEach(file => {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Add state variables
  if (!content.includes('const [hasStarted, setHasStarted]')) {
    content = content.replace(
      /const \[answers, setAnswers\] = useState[^\n]+;\n/,
      match => `const [hasStarted, setHasStarted] = useState(false);\n  const [participantName, setParticipantName] = useState("");\n  ` + match
    );
  }

  // Update fetch payload
  if (!content.includes('participantName: participantName.trim()')) {
    content = content.replace(
      /body: JSON\.stringify\(\{\n\s*exerciseId: (.*?),\n\s*email,\n\s*answer: answerPayload,?\n\s*\}\)/,
      `body: JSON.stringify({\n          exerciseId: $1,\n          email,\n          answer: answerPayload,\n          participantName: participantName.trim() || undefined,\n        })`
    );
  }

  // Add Start Screen HTML
  if (!content.includes('!hasStarted ?')) {
    content = content.replace(
      /<div className="exercise-wrapper">\n\s*\{!isSubmitted \? \(/,
      `<div className="exercise-wrapper">\n        {!hasStarted ? (\n          <div className="start-screen-container">\n            <div className="start-card">\n              <h2>{exerciseData.title || "التمرين"}</h2>\n              <p className="exercise-instructions">\n                {exerciseData.instructions}\n              </p>\n              <div className="name-input-group">\n                <label htmlFor="participantName">الاسم (اختياري):</label>\n                <input\n                  type="text"\n                  id="participantName"\n                  value={participantName}\n                  onChange={(e) => setParticipantName(e.target.value)}\n                  placeholder="اكتب اسمك هنا..."\n                  className="name-input"\n                />\n              </div>\n              <div style={{display: 'flex', justifyContent: 'flex-start'}}>\n                <button \n                  className="primary-button start-button"\n                  onClick={() => setHasStarted(true)}\n                >\n                  ابدأ التمرين &larr;\n                </button>\n              </div>\n            </div>\n          </div>\n        ) : !isSubmitted ? (`
    );
  }

  // Add CSS
  if (!content.includes('.start-screen-container {')) {
    content = content.replace(
      /\.exercise-wrapper \{/,
      `.start-screen-container {\n          width: 100%;\n          max-width: 600px;\n          background: white;\n          border-radius: 16px;\n          padding: 2.5rem;\n          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);\n          border: 1px solid #e2e8f0;\n          text-align: right;\n          margin-top: 2rem;\n        }\n        .start-card h2 {\n          color: #0f172a;\n          margin-bottom: 1rem;\n          font-size: 1.8rem;\n          text-align: center;\n        }\n        .name-input-group {\n          margin: 2rem 0;\n          display: flex;\n          align-items: center;\n          gap: 1rem;\n        }\n        .name-input-group label {\n          font-weight: 600;\n          color: #0f172a;\n          white-space: nowrap;\n        }\n        .name-input {\n          flex: 1;\n          padding: 0.75rem 1rem;\n          border: 1px solid #cbd5e1;\n          border-radius: 8px;\n          font-size: 1rem;\n          outline: none;\n          transition: border-color 0.2s;\n        }\n        .name-input:focus {\n          border-color: #2563eb;\n        }\n        .start-button {\n          display: flex;\n          align-items: center;\n          gap: 0.5rem;\n          background-color: #1a5f5f;\n        }\n        .start-button:hover {\n          background-color: #134545;\n        }\n        .exercise-wrapper {`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
