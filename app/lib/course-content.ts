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

export type ActivityAccessCode = {
  id: string;
  title: string;
  category: "تمرين" | "مقياس" | "اختبار";
  code: string;
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

export const exercises: Exercise[] = [];

export const assessments: Assessment[] = [
  {
    id: "ai-leader-style",
    title: "ما نمط قيادتك للذكاء الاصطناعي؟",
    type: "scale",
    status: "available",
    prompt: "مقياس تفاعلي يحدد نمط قيادة المشارك للذكاء الاصطناعي.",
  },
];

export const activityAccessCodes: ActivityAccessCode[] = [
  {
    id: "day-one-concepts-test",
    title: "اختبار اليوم الأول - المفاهيم الأساسية",
    category: "اختبار",
    code: "631041",
  },
  {
    id: "introductions",
    title: "تعارف المشاركين",
    category: "تمرين",
    code: "482913",
  },
  {
    id: "ai-leader-style",
    title: "ما نمط قيادتك للذكاء الاصطناعي؟",
    category: "مقياس",
    code: "739204",
  },
];

export const routeLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الدورة" },
  { href: "/exercises", label: "التمارين و المقاييس" },
];
