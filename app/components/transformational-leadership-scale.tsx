"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCALE_ITEMS = [
  "كم تمارس زرع الثقة عند الأفراد وتنمية الشعور لديهم بالقوة والفخر بالمنظمة؟",
  "كم تُحدّث الأفراد حول القيم الأخلاقية والالتزام بها؟",
  "كم تمارس التحفيز والتشجيع والتحدي عند أفرادك؟",
  "كم تشجع الإبداع والتغيير وإعادة النظر في الأفكار والافتراضات؟",
  "كم تتابع كل شخص على حدة في احتياجاته ومشاعره وتطويره؟",
  "كم تكافئ أفرادك مادياً ومعنوياً عند الأداء المميز من قبلهم؟",
  "كم تراقب الانحراف عن المعايير المتفق عليها في أداء أفرادك؟",
  "كم قدرتك على توقع المشاكل ومنعها قبل حدوثها؟",
  "كم تشارك أفرادك في الحوارات وتنفيذ المشاريع؟",
  "كم تدفع أفرادك لتقديم أداء أعلى مما قدموه سابقاً؟",
  "كم فاعليتك في تحقيق الأهداف الجماعية مع أفرادك؟",
  "كم مستوى الرضا الوظيفي لدى أفرادك؟",
  "كم تقديرك لدرجة فهم أفرادك للرؤية وإيمانهم بها؟",
  "كم مستوى عمل أفرادك كفريق عمل جماعي؟",
  "كم تقديرك لمدى انفتاح أفرادك معك؟",
];

const STORAGE_KEY = "tls-progress";
const SUBMISSION_KEY = "tls-last-submission";
const TOTAL_ITEMS = SCALE_ITEMS.length;
const MAX_SCORE = TOTAL_ITEMS * 10;

type Classification = "excellent" | "average" | "developing";

function classify(total: number): Classification {
  if (total >= 121) return "excellent";
  if (total >= 90) return "average";
  return "developing";
}

function classLabel(c: Classification) {
  if (c === "excellent") return "ممتاز";
  if (c === "average") return "متوسط";
  return "بحاجة إلى تطوير";
}

function classColor(c: Classification) {
  if (c === "excellent") return "#16a34a";
  if (c === "average") return "#d97706";
  return "#2563eb";
}

function classColorBg(c: Classification) {
  if (c === "excellent") return "rgba(22,163,74,0.08)";
  if (c === "average") return "rgba(217,119,6,0.08)";
  return "rgba(37,99,235,0.08)";
}

// ---------------------------------------------------------------------------
// Gauge SVG
// ---------------------------------------------------------------------------

function GaugeChart({ score, total }: { score: number; total: number }) {
  const pct = Math.min(score / total, 1);
  const cls = classify(score);
  const color = classColor(cls);
  const radius = 80;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference * (1 - pct);

  return (
    <svg
      viewBox="0 0 200 120"
      className="tls-gauge"
      role="img"
      aria-label={`${score} من ${total}`}
    >
      {/* Background arc */}
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Foreground arc */}
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={`${offset}`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      {/* Score text */}
      <text
        x="100"
        y="78"
        textAnchor="middle"
        fill={color}
        fontSize="32"
        fontWeight="700"
        fontFamily="IBM Plex Sans Arabic, sans-serif"
      >
        {score}
      </text>
      <text
        x="100"
        y="100"
        textAnchor="middle"
        fill="#64748b"
        fontSize="14"
        fontFamily="IBM Plex Sans Arabic, sans-serif"
      >
        من {total}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PDF Generation (client-side)
// ---------------------------------------------------------------------------

// PDF generation has been replaced with native browser printing + CSS media queries

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TransformationalLeadershipScale() {
  // Auth state
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined")
      return window.sessionStorage.getItem("participantEmail") || "";
    return "";
  });
  const [participantName, setParticipantName] = useState(() => {
    if (typeof window !== "undefined")
      return window.sessionStorage.getItem("participantName") || "";
    return "";
  });
  const [emailError, setEmailError] = useState("");

  // Flow
  const [hasStarted, setHasStarted] = useState(false);
  const [scores, setScores] = useState<(number | null)[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return Array(TOTAL_ITEMS).fill(null);
  });
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [duplicatePrompt, setDuplicatePrompt] = useState(false);

  // Action plan state
  const [actionPlan, setActionPlan] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Persist progress
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    }
  }, [scores]);

  const answeredCount = scores.filter((s) => s !== null).length;
  const allAnswered = answeredCount === TOTAL_ITEMS;
  const total = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);

  const handleScore = useCallback(
    (index: number, value: number) => {
      setScores((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      // Auto-scroll to next unanswered card
      setTimeout(() => {
        const nextIdx = scores.findIndex(
          (s, i) => i > index && s === null
        );
        if (nextIdx !== -1 && cardRefs.current[nextIdx]) {
          cardRefs.current[nextIdx]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 200);
    },
    [scores]
  );

  // Submit
  async function handleSubmit(e?: FormEvent, forceReplace = false) {
    e?.preventDefault();
    if (!allAnswered) return;
    setIsSubmitting(true);
    setSubmitError("");
    setDuplicatePrompt(false);

    const currentEmail =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("participantEmail") ?? email
        : email;

    // Check for duplicate submission today
    if (!forceReplace) {
      const lastSub = localStorage.getItem(SUBMISSION_KEY);
      if (lastSub) {
        try {
          const parsed = JSON.parse(lastSub);
          const lastDate = new Date(parsed.timestamp).toDateString();
          const today = new Date().toDateString();
          if (parsed.email === currentEmail.toLowerCase() && lastDate === today) {
            setDuplicatePrompt(true);
            setIsSubmitting(false);
            return;
          }
        } catch { /* ignore */ }
      }
    }

    try {
      const answerPayload = JSON.stringify({
        exerciseId: "transformational-leadership-scale",
        scores: scores,
        items: SCALE_ITEMS,
        total,
        classification: classLabel(classify(total)),
      });

      const response = await fetch("/api/exercise-answers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          exerciseId: "transformational-leadership-scale",
          email: currentEmail,
          answer: answerPayload,
          participantName: participantName.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setSubmitError(
          (data as { message?: string }).message ??
            "تعذر حفظ النتيجة. حاول مرة أخرى."
        );
        return;
      }

      // Record submission timestamp
      localStorage.setItem(
        SUBMISSION_KEY,
        JSON.stringify({
          email: currentEmail.toLowerCase(),
          timestamp: new Date().toISOString(),
        })
      );

      setShowResult(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("حدث خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetake() {
    setScores(Array(TOTAL_ITEMS).fill(null));
    setShowResult(false);
    setDuplicatePrompt(false);
    setSubmitError("");
    setActionPlan([
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SUBMISSION_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── START SCREEN ──
  if (!hasStarted) {
    return (
      <div className="tls-wrapper">
        <div className="tls-start-card">
          <div className="tls-start-icon">📊</div>
          <h2>مقياس القيادة التحويلية</h2>
          <p className="tls-start-instructions">
            أعطِ نفسك درجة من 1 إلى 10 في كل عبارة مما يلي، بحسب واقع
            ممارستك الفعلية لا ما تتمناه.
          </p>
          <div className="tls-start-meta">
            <span>15 عبارة</span>
            <span>•</span>
            <span>10 دقائق تقريباً</span>
          </div>

          <div className="tls-start-fields">
            <div className="tls-field-row">
              <label htmlFor="tls-email">البريد الإلكتروني</label>
              <input
                type="email"
                id="tls-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="example@domain.com"
                dir="ltr"
              />
              {emailError && <p className="tls-field-error">{emailError}</p>}
            </div>
            <div className="tls-field-row">
              <label htmlFor="tls-name">الاسم (اختياري)</label>
              <input
                type="text"
                id="tls-name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="اكتب اسمك هنا..."
              />
            </div>
          </div>

          <button
            className="tls-start-btn"
            onClick={() => {
              if (!email || !email.includes("@")) {
                setEmailError("يرجى إدخال بريد إلكتروني صحيح لبدء المقياس.");
                return;
              }
              window.sessionStorage.setItem("participantEmail", email);
              window.sessionStorage.setItem("participantName", participantName);
              setHasStarted(true);
            }}
          >
            ابدأ المقياس ←
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if (showResult) {
    const finalScores = scores as number[];
    const cls = classify(total);
    const color = classColor(cls);

    const sorted = finalScores
      .map((s, i) => ({ index: i, score: s }))
      .sort((a, b) => b.score - a.score);
    const top3 = sorted.slice(0, 3);
    const bottom3 = [...sorted].reverse().slice(0, 3);

    return (
      <div className="tls-wrapper">
        {/* Print-only Header */}
        <div className="tls-print-header">
          <h1>تقرير مقياس القيادة التحويلية</h1>
          <p>
            {participantName ? `الاسم: ${participantName} | ` : ""}البريد: {email} | التاريخ: {new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Score Card */}
        <div className="tls-result-score-card" style={{ borderColor: color }}>
          <GaugeChart score={total} total={MAX_SCORE} />
          <div
            className="tls-classification-badge"
            style={{ background: classColorBg(cls), color }}
          >
            {classLabel(cls)}
          </div>
          <p className="tls-score-fraction">
            {total} <span>/ {MAX_SCORE}</span>
          </p>
        </div>

        {/* Introductory Text */}
        <div className="tls-result-section">
          <p className="tls-result-intro">
            تعكس هذه النتيجة تقديرك الحالي لمدى ممارستك للسلوكيات القيادية
            المرتبطة ببناء الثقة، والالتزام بالقيم، وتحفيز الأفراد، وتشجيع
            الابتكار، وتطوير أعضاء الفريق، وتعزيز العمل الجماعي. هذا المقياس
            أداة للتأمل والتطوير الذاتي، وليس اختباراً للنجاح أو الفشل.
          </p>
        </div>

        {/* What Does Your Score Mean? */}
        <div className="tls-result-section">
          <h3 className="tls-result-heading">ماذا تعني نتيجتك؟</h3>
          {cls === "excellent" && (
            <div className="tls-meaning-card" style={{ borderColor: color }}>
              <p>
                تشير نتيجتك إلى أنك تمارس سلوكيات القيادة التحويلية بدرجة مرتفعة
                ومتكررة. من المرجح أنك تستطيع بناء الثقة مع أفراد فريقك،
                وتوضيح القيم والرؤية، وتحفيز الآخرين لتقديم أداء يتجاوز التوقعات.
              </p>
              <p>
                كما تشير النتيجة إلى اهتمامك بتطوير الأفراد، وتشجيع المبادرة
                والإبداع، وتعزيز الشعور بالمسؤولية والعمل الجماعي. وغالبًا ما
                يراك الآخرون قائدًا ملهمًا ومؤثرًا، وليس مجرد مسؤول عن توزيع
                المهام ومتابعة النتائج.
              </p>

              <h4 style={{ color }}>نقاط القوة المتوقعة:</h4>
              <ul>
                <li>بناء الثقة والاحترام داخل الفريق</li>
                <li>ربط العمل برؤية وهدف واضحين</li>
                <li>تحفيز الأفراد ورفع مستوى طموحهم</li>
                <li>تشجيع الابتكار وتقبّل الأفكار الجديدة</li>
                <li>الاهتمام باحتياجات الأفراد وتطوير قدراتهم</li>
                <li>تعزيز التعاون والانتماء والعمل الجماعي</li>
              </ul>

              <h4 style={{ color }}>نصائح وتوجيهات:</h4>
              <ul>
                <li>
                  حافظ على تواضعك القيادي، وتجنب افتراض أن الأسلوب نفسه يناسب
                  جميع الأفراد والمواقف
                </li>
                <li>
                  اطلب تغذية راجعة دورية من فريقك للتأكد من أن تأثيرك الفعلي
                  يطابق تصورك الذاتي
                </li>
                <li>
                  ركز على البنود التي حصلت فيها على أقل الدرجات، حتى لو كانت
                  نتيجتك الكلية مرتفعة
                </li>
                <li>امنح أعضاء الفريق فرصًا أكبر للتفويض واتخاذ القرار</li>
                <li>
                  ساعد في إعداد قادة جدد داخل الفريق، واجعل تطويرهم جزءًا من
                  مسؤولياتك القيادية
                </li>
                <li>
                  استمر في تقدير الإنجازات، مع الاهتمام بالسلوكيات الإيجابية
                  التي أدت إليها
                </li>
                <li>
                  حوّل خبرتك القيادية إلى ممارسات واضحة يمكن للفريق تعلمها
                  واستمرارها
                </li>
              </ul>
              <div
                className="tls-challenge-box"
                style={{ background: classColorBg(cls), borderColor: color }}
              >
                <strong>التحدي التطويري المقترح:</strong>
                <p style={{ margin: 0 }}>
                  اختر أحد أعضاء فريقك، وضع معه خطة تطوير تمتد من 60 إلى 90
                  يومًا، تتضمن مسؤولية جديدة، ومؤشرات نجاح، ولقاءات متابعة
                  منتظمة.
                </p>
              </div>
            </div>
          )}
          {cls === "average" && (
            <div className="tls-meaning-card" style={{ borderColor: color }}>
              <p>
                تشير نتيجتك إلى امتلاكك أساسًا جيدًا في القيادة التحويلية، إلا أن
                ممارستك لبعض السلوكيات قد تكون غير منتظمة أو تختلف باختلاف
                الموقف وضغوط العمل.
              </p>
              <p>
                قد تكون قويًا في جوانب مثل بناء العلاقات أو متابعة الإنجاز، بينما
                تحتاج إلى تحسين جوانب أخرى مثل إيصال الرؤية، أو تشجيع الابتكار،
                أو تفويض الصلاحيات، أو تقديم الدعم الفردي لأعضاء الفريق.
              </p>
              <p>
                هذه النتيجة تعني أن لديك قابلية واضحة للانتقال إلى مستوى أعلى إذا
                ركزت على عدد محدود من السلوكيات ومارستها بصورة منتظمة.
              </p>

              <h4 style={{ color }}>نقاط القوة المتوقعة:</h4>
              <ul>
                <li>وجود وعي بأهمية التحفيز والتواصل مع الفريق</li>
                <li>القدرة على ممارسة بعض سلوكيات القيادة التحويلية</li>
                <li>وجود علاقة مقبولة مع الأفراد، مع فرصة لتعميق الثقة</li>
                <li>
                  الاهتمام بتحقيق النتائج، مع الحاجة إلى زيادة الاهتمام بتطوير
                  الأفراد
                </li>
                <li>الاستعداد للتغيير والتحسين عند توفر خطة واضحة</li>
              </ul>

              <h4 style={{ color }}>نصائح وتوجيهات:</h4>
              <ul>
                <li>
                  حدد البنود الثلاثة التي حصلت فيها على أقل الدرجات، واجعلها
                  أولوياتك التطويرية
                </li>
                <li>
                  اربط المهام اليومية بهدف واضح، واشرح للفريق لماذا يعد العمل
                  مهمًا
                </li>
                <li>خصص لقاءات فردية قصيرة ومنتظمة مع أعضاء الفريق</li>
                <li>
                  استخدم الأسئلة المفتوحة قبل تقديم الحلول، مثل: «ما الخيارات
                  المتاحة؟» و«ما اقتراحك؟»
                </li>
                <li>قدّم التقدير بصورة محددة وفي الوقت المناسب</li>
                <li>
                  فوّض بعض القرارات، وحدد النتائج المطلوبة دون فرض طريقة
                  التنفيذ بالكامل
                </li>
                <li>شجع الفريق على تجربة تحسين أو فكرة جديدة كل شهر</li>
                <li>
                  راقب مدى ثبات سلوكك القيادي خلال فترات الضغط، وليس فقط في
                  الظروف الاعتيادية
                </li>
                <li>
                  اطلب ملاحظة تطويرية واحدة شهريًا من مديرك أو أحد زملائك أو
                  أفراد فريقك
                </li>
              </ul>
              <div
                className="tls-challenge-box"
                style={{ background: classColorBg(cls), borderColor: color }}
              >
                <strong>التحدي التطويري المقترح:</strong>
                <p style={{ margin: 0 }}>
                  اختر سلوكين من البنود الأقل تقييمًا، وطبقهما أسبوعيًا لمدة ستة
                  أسابيع، مع تسجيل الموقف والسلوك الذي مارسته والنتيجة التي
                  لاحظتها.
                </p>
              </div>
            </div>
          )}
          {cls === "developing" && (
            <div className="tls-meaning-card" style={{ borderColor: color }}>
              <p>
                تشير نتيجتك إلى أن سلوكيات القيادة التحويلية لا تزال بحاجة إلى
                مزيد من الوعي والممارسة المنتظمة. وقد يعتمد أسلوبك الحالي بصورة
                أكبر على التوجيه المباشر، ومتابعة المهام، وتصحيح الأخطاء،
                مقارنة ببناء الرؤية وتحفيز الأفراد وتطوير قدراتهم.
              </p>
              <p>
                لا تعني هذه النتيجة أنك غير قادر على القيادة؛ بل إنها تحدد نقطة
                البداية وتكشف عن فرص واضحة للتطوير. ويمكن أن يتحقق تحسن ملموس
                من خلال التركيز على عدد قليل من الممارسات الأساسية بدلًا من محاولة
                تغيير كل شيء دفعة واحدة.
              </p>

              <h4 style={{ color }}>فرص التطوير المحتملة:</h4>
              <ul>
                <li>تعزيز الثقة والشفافية في العلاقة مع الفريق</li>
                <li>توضيح الرؤية والقيم وربطها بالعمل اليومي</li>
                <li>الانتقال من إعطاء التعليمات إلى الحوار والمشاركة</li>
                <li>تقديم التقدير والتغذية الراجعة بصورة منتظمة</li>
                <li>منح الأفراد مساحة أكبر للمبادرة واتخاذ القرار</li>
                <li>الاهتمام بالفروق الفردية والاحتياجات التطويرية</li>
                <li>
                  تشجيع الأفكار الجديدة وعدم التعامل مع الخطأ غير المتعمد
                  بالعقاب المباشر
                </li>
              </ul>

              <h4 style={{ color }}>نصائح وتوجيهات:</h4>
              <ul>
                <li>
                  ابدأ بسلوكين فقط، مثل الاستماع الفعال وتقدير الإنجازات
                </li>
                <li>
                  اعقد لقاءً أسبوعياً قصيراً مع كل عضو لمناقشة التحديات
                  والاحتياجات، وليس المهام فقط
                </li>
                <li>
                  وضّح للفريق الأهداف والأولويات والسلوكيات المتوقعة
                </li>
                <li>
                  اسأل أعضاء الفريق عن آرائهم قبل اتخاذ القرارات التي تؤثر في
                  عملهم
                </li>
                <li>
                  قدّم ملاحظة إيجابية محددة مقابل كل ملاحظة تصحيحية
                </li>
                <li>
                  تجنب التدخل في جميع التفاصيل، وابدأ بتفويض مهام محدودة مع
                  متابعة متفق عليها
                </li>
                <li>
                  تعامل مع الأخطاء بوصفها فرصاً للتعلم، مع المحافظة على
                  المساءلة
                </li>
                <li>
                  استعِن بمدرب أو مرشد قيادي لمراجعة المواقف العملية الصعبة
                </li>
                <li>
                  أعد تطبيق المقياس بعد فترة من الممارسة، وقارن التغير في البنود
                  لا في المجموع فقط
                </li>
              </ul>

              <div
                className="tls-challenge-box"
                style={{
                  background: classColorBg(cls),
                  borderColor: color,
                }}
              >
                <strong>التحدي التطويري المقترح:</strong>
                <p style={{ marginBottom: 8 }}>
                  طبّق خطة لمدة 30 يوماً تتضمن:
                </p>
                <ul style={{ margin: 0, paddingRight: 20 }}>
                  <li>لقاءً فردياً أسبوعياً مع أحد أعضاء الفريق</li>
                  <li>تقدير إنجاز أو سلوك إيجابي يومياً</li>
                  <li>تفويض قرار واحد على الأقل كل أسبوع</li>
                  <li>طلب تغذية راجعة من الفريق في نهاية الشهر</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Personal Priorities */}
        <div className="tls-result-section">
          <h3 className="tls-result-heading">أولوياتك الشخصية للتطوير</h3>
          <p className="tls-priorities-intro">
            لا يكفي الاعتماد على الدرجة الكلية وحدها؛ فقد تكون النتيجة مرتفعة
            مع وجود جانب قيادي محدد يحتاج إلى الاهتمام. لذلك يُنصح باستخراج
            البنود الأعلى والأدنى لديك:
          </p>
          <div className="tls-priorities-grid">
            <div className="tls-priority-column tls-strengths">
              <h4>
                <span className="tls-priority-icon">💪</span> أعلى ثلاثة بنود
                لديك
              </h4>
              <p className="tls-priority-note">
                تمثل هذه البنود نقاط قوة يمكنك المحافظة عليها واستخدامها لدعم
                فريقك.
              </p>
              {top3.map((item) => (
                <div className="tls-priority-item" key={item.index}>
                  <span className="tls-priority-num">{item.index + 1}</span>
                  <div>
                    <p>{SCALE_ITEMS[item.index]}</p>
                    <span className="tls-priority-score strength">
                      {item.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="tls-priority-column tls-develop">
              <h4>
                <span className="tls-priority-icon">🎯</span> أقل ثلاثة بنود
                لديك
              </h4>
              <p className="tls-priority-note">
                تمثل هذه البنود أولوياتك التطويرية، وليس جوانب فشل أو قصور
                ثابتة.
              </p>
              {bottom3.map((item) => (
                <div className="tls-priority-item" key={item.index}>
                  <span className="tls-priority-num">{item.index + 1}</span>
                  <div>
                    <p>{SCALE_ITEMS[item.index]}</p>
                    <span className="tls-priority-score develop">
                      {item.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Plan Table */}
        <div className="tls-result-section">
          <h3 className="tls-result-heading">خطة العمل الشخصية</h3>
          <div className="tls-action-table-wrapper">
            <table className="tls-action-table">
              <thead>
                <tr>
                  <th>الأولوية التطويرية</th>
                  <th>السلوك الذي سأمارسه</th>
                  <th>موعد التطبيق</th>
                  <th>مؤشر النجاح</th>
                </tr>
              </thead>
              <tbody>
                {actionPlan.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const next = actionPlan.map((r) => [...r]);
                            next[ri][ci] = e.target.value;
                            setActionPlan(next);
                          }}
                          placeholder="اكتب هنا..."
                          className="tls-plan-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closing recommendation */}
        <div className="tls-result-section tls-recommendation">
          <h3 className="tls-result-heading">التوصية الختامية</h3>
          <p>
            القيادة التحويلية ليست صفة ثابتة، بل مجموعة من السلوكيات التي يمكن
            تعلمها وتطويرها. اختر ممارسة قيادية محددة، وطبّقها باستمرار، واطلب
            التغذية الراجعة، ثم أعد تطبيق المقياس بعد{" "}
            <strong>8 إلى 12 أسبوعاً</strong> لمتابعة تطورك.
          </p>
        </div>

        {/* Actions */}
        <div className="tls-result-actions">
          <button
            className="tls-pdf-btn"
            onClick={() => window.print()}
          >
            تحميل التقرير PDF
          </button>
          <button className="tls-retake-btn" onClick={handleRetake}>
            إعادة التطبيق
          </button>
        </div>
      </div>
    );
  }

  // ── SCALE SCREEN ──
  return (
    <div className="tls-wrapper">
      {/* Header */}
      <div className="tls-scale-header">
        <h2>مقياس القيادة التحويلية</h2>
        <p>
          أعطِ نفسك درجة من <strong>1</strong> إلى <strong>10</strong> في كل
          عبارة، بحسب واقع ممارستك الفعلية لا ما تتمناه.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="tls-progress-bar-container">
        <div className="tls-progress-labels">
          <span>
            {answeredCount} / {TOTAL_ITEMS} عبارة
          </span>
          <span className="tls-live-total">
            المجموع: <strong>{total}</strong> / {MAX_SCORE}
          </span>
        </div>
        <div className="tls-progress-track">
          <div
            className="tls-progress-fill"
            style={{
              width: `${(answeredCount / TOTAL_ITEMS) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="tls-cards">
        {SCALE_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`tls-card ${scores[i] !== null ? "tls-card-answered" : ""}`}
          >
            <div className="tls-card-header">
              <span className="tls-card-number">{i + 1}</span>
              <p className="tls-card-text">{item}</p>
            </div>
            <div className="tls-slider-section">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={scores[i] ?? 5}
                onChange={(e) => handleScore(i, parseInt(e.target.value))}
                className="tls-slider"
                aria-label={`تقييم العبارة ${i + 1}`}
                style={
                  {
                    "--slider-pct": `${((scores[i] ?? 5) - 1) / 9 * 100}%`,
                  } as React.CSSProperties
                }
              />
              <div className="tls-slider-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
              <div className="tls-score-display">
                {scores[i] !== null && (
                  <span
                    className="tls-score-pill"
                    style={{
                      background:
                        (scores[i] ?? 0) >= 8
                          ? "rgba(22,163,74,0.1)"
                          : (scores[i] ?? 0) >= 5
                            ? "rgba(217,119,6,0.1)"
                            : "rgba(37,99,235,0.1)",
                      color:
                        (scores[i] ?? 0) >= 8
                          ? "#16a34a"
                          : (scores[i] ?? 0) >= 5
                            ? "#d97706"
                            : "#2563eb",
                    }}
                  >
                    {scores[i]}
                  </span>
                )}
              </div>
            </div>
            {/* Quick buttons for mobile */}
            <div className="tls-quick-btns">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`tls-quick-btn ${scores[i] === v ? "active" : ""}`}
                  onClick={() => handleScore(i, v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="tls-sticky-footer">
        <div className="tls-footer-content">
          <div className="tls-footer-stats">
            <span>
              {answeredCount}/{TOTAL_ITEMS} عبارة
            </span>
            <span className="tls-footer-divider">|</span>
            <span>
              المجموع: <strong>{total}</strong>/{MAX_SCORE}
            </span>
          </div>
          <button
            className="tls-submit-btn"
            disabled={!allAnswered || isSubmitting}
            onClick={() => handleSubmit()}
          >
            {isSubmitting ? "جار الحفظ…" : "عرض نتيجتي"}
          </button>
        </div>
      </div>

      {/* Duplicate Prompt */}
      {duplicatePrompt && (
        <div className="tls-duplicate-overlay">
          <div className="tls-duplicate-card">
            <h3>لقد أكملت المقياس اليوم</h3>
            <p>
              يبدو أنك أرسلت إجابتك مسبقاً اليوم. هل تريد إعادة التطبيق
              واستبدال نتيجتك السابقة؟
            </p>
            <div className="tls-duplicate-actions">
              <button
                className="tls-submit-btn"
                onClick={() => handleSubmit(undefined, true)}
              >
                نعم، استبدال نتيجتي
              </button>
              <button
                className="tls-retake-btn"
                onClick={() => setDuplicatePrompt(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {submitError && (
        <p className="tls-error-msg">{submitError}</p>
      )}
    </div>
  );
}
