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

export type CourseLink = {
  title: string;
  description: string;
  href: string;
  label: string;
};

export type ToolResource = {
  title: string;
  description: string;
  href: string;
  label: string;
};

export type ToolGroup = {
  title: string;
  description: string;
  items: ToolResource[];
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
    id: "prompt-writing",
    title: "تمرين صياغة أمر",
    status: "available",
    duration: "10-15 دقيقة",
    prompt:
      "صغ أمراً متكاملاً من سبعة مكونات يطلب من الذكاء الاصطناعي إعداد مسودة خطة تحول رقمي لجهة حكومية.",
    outcome:
      "أمر عملي واضح قابل للاستخدام، مع تغذية راجعة فورية تساعدك على تحسين الصياغة.",
  },
  {
    id: "prompt-comparison",
    title: "تمرين مقارنة أمر بصيغتين",
    status: "available",
    duration: "5-8 دقائق",
    prompt:
      "قارن بين أمر عام غير محدد وأمر مهني واضح، وانسخ كل صيغة لتجربة الفرق في الاستجابة.",
    outcome:
      "فهم عملي لأثر السياق، الدور، المشكلة، والمخرجات المطلوبة على جودة إجابة الذكاء الاصطناعي.",
  },
  {
    id: "thinking-partner-crisis",
    title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
    status: "available",
    duration: "15 دقيقة",
    prompt:
      "استخدم الذكاء الاصطناعي كشريك تفكير لفهم أزمة Unity، اختبار قراراتك، واكتشاف هلوسة واحدة على الأقل.",
    outcome:
      "3 قرارات عملية، قرار واحد مُعدّل بوعي، وهلوسة واحدة تم التحقق منها وتوثيقها.",
  },
];

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
    id: "prompt-writing",
    title: "تمرين صياغة أمر",
    category: "تمرين",
    code: "845219",
  },
  {
    id: "prompt-comparison",
    title: "تمرين مقارنة أمر بصيغتين",
    category: "تمرين",
    code: "528614",
  },
  {
    id: "thinking-partner-crisis",
    title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
    category: "تمرين",
    code: "864531",
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

export const courseLinks: CourseLink[] = [
  {
    title: "وكلاء الذكاء الاصطناعي",
    description:
      "رابط مرئي مساعد لفهم فكرة وكلاء الذكاء الاصطناعي ودورهم في تنفيذ المهام ودعم العمل المؤسسي.",
    href: "https://youtu.be/WVzNoXBqNSY?si=uwgvWnQoMtYuBo4G",
    label: "فتح الرابط",
  },
];

export const toolGroups: ToolGroup[] = [
  {
    title: "حل مشكلة اللغة العربية (من اليمين لليسار)",
    description:
      "إضافات مساعدة لتحسين عرض العربية واتجاه النص عند استخدام بعض أدوات الذكاء الاصطناعي داخل المتصفح.",
    items: [
      {
        title: "إصلاح العربي RTL لـ Claude",
        description:
          "إضافة مخصصة لتحسين اتجاه النص العربي داخل Claude عندما يظهر بمحاذاة أو ترتيب غير مناسب.",
        href: "https://chromewebstore.google.com/detail/ieieplkakgjbjldkngbfoakgihdfoddl?utm_source=item-share-cb",
        label: "فتح الأداة",
      },
      {
        title: "RTL toggle",
        description:
          "أداة سريعة لتبديل اتجاه الواجهة والنص بين اليمين واليسار عند الحاجة أثناء العمل.",
        href: "https://chromewebstore.google.com/detail/diimdfmlegodnjbcgajllidffehegdbc?utm_source=item-share-cb",
        label: "فتح الأداة",
      },
      {
        title: "Claude Arabic Fix",
        description:
          "إضافة أخرى موجهة لمعالجة مشكلات العربية في Claude وتحسين القراءة والتنقل داخل المحادثة.",
        href: "https://chromewebstore.google.com/detail/fbigmifidpomomfafkacnefbaingljok?utm_source=item-share-cb",
        label: "فتح الأداة",
      },
    ],
  },
  {
    title: "إدارة الأوامر الهندسية",
    description:
      "أدوات تساعد في جمع الأوامر المفيدة وتنظيمها وتسريع الوصول إليها أثناء العمل والتجريب.",
    items: [
      {
        title: "Right Click Prompt",
        description:
          "منصة لتجميع الأوامر واستخدامها بسرعة، مناسبة لمن يريد بناء مكتبة Prompts عملية قابلة لإعادة الاستخدام.",
        href: "https://rightclickprompt.com/",
        label: "فتح الأداة",
      },
    ],
  },
];

export const routeLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الدورة" },
  { href: "/links", label: "روابط الدورة" },
  { href: "/tools", label: "الأدوات" },
  { href: "/exercises", label: "التمارين و المقاييس" },
];
