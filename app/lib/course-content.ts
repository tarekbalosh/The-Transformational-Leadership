export type ItemStatus = "available" | "completed" | "soon";

export type Exercise = {
  id: string;
  title: string;
  status: ItemStatus;
  duration: string;
  prompt: string;
  outcome: string;
};

export type Assessment = {
  id: string;
  title: string;
  type: "choice" | "open" | "scale";
  status: ItemStatus;
  prompt: string;
  options?: string[];
};

export const partner = {
  name: "شركة الإبداع الخليجي للتدريب والاستشارات",
  logo: "/brand/ebdaa.png",
  note: "تنفذ الدورة بالتعاون مع شريك تدريبي متخصص في تطوير القادة والمؤسسات.",
};

export const coursePillars = [
  "تحديد فرص استخدام الذكاء الاصطناعي في القرار اليومي.",
  "تحويل المهام الإدارية المتكررة إلى سير عمل أذكى.",
  "تصميم مطالبات عملية تناسب دور القائد والمدير.",
  "قراءة النتائج بوعي وتجنب الاعتماد غير النقدي على الأدوات.",
];

export const audience = [
  "القادة التنفيذيون الذين يريدون استخدام الذكاء الاصطناعي في التوجيه والمتابعة.",
  "المدراء الذين يحتاجون إلى تحسين التخطيط، التفويض، وتحليل المعلومات.",
  "رواد الأعمال الذين يبحثون عن سرعة أكبر في اختبار الأفكار وبناء القرارات.",
];

export const exercises: Exercise[] = [
  {
    id: "leadership-decision-map",
    title: "خريطة قرار قيادي",
    status: "available",
    duration: "12 دقيقة",
    prompt:
      "اختر قراراً إدارياً قريباً منك، ثم اكتب كيف يمكن للذكاء الاصطناعي أن يساعد في جمع المعطيات، صياغة البدائل، وتحديد المخاطر.",
    outcome: "مخطط أولي لطريقة استخدام الذكاء الاصطناعي قبل اتخاذ القرار.",
  },
  {
    id: "meeting-reframe",
    title: "إعادة تصميم اجتماع أسبوعي",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "اكتب وصفاً مختصراً لاجتماع متكرر، ثم اقترح ثلاث مهام يمكن للذكاء الاصطناعي تسريعها قبل الاجتماع أو بعده.",
    outcome: "قائمة تحسينات عملية لاجتماع إداري قائم.",
  },
  {
    id: "team-prompt",
    title: "مطالبة لفريق العمل",
    status: "soon",
    duration: "قريباً",
    prompt:
      "سيضاف هذا التمرين لاحقاً لاختبار بناء مطالبات مناسبة لأعضاء الفريق.",
    outcome: "قالب مطالبة قابل للمشاركة مع الفريق.",
  },
];

export const assessments: Assessment[] = [
  {
    id: "ai-readiness",
    title: "مقياس جاهزية الاستخدام القيادي",
    type: "scale",
    status: "available",
    prompt:
      "قيّم جاهزيتك الحالية لاستخدام الذكاء الاصطناعي في عملك القيادي اليومي.",
    options: ["1", "2", "3", "4", "5"],
  },
  {
    id: "use-case-choice",
    title: "اختيار حالة استخدام أولى",
    type: "choice",
    status: "available",
    prompt: "ما المجال الأنسب لتبدأ منه في تطبيق الذكاء الاصطناعي؟",
    options: ["تحليل معلومات", "تحضير اجتماعات", "متابعة أداء", "توليد أفكار"],
  },
  {
    id: "reflection-note",
    title: "تأمل قصير",
    type: "open",
    status: "available",
    prompt:
      "اكتب جملة واحدة عن أكبر فرصة تراها للذكاء الاصطناعي في دورك الحالي.",
  },
];

export const routeLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الدورة" },
  { href: "/exercises", label: "التمارين" },
  { href: "/assessments", label: "الاختبارات والمقاييس" },
];
