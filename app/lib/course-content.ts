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

export type EngineeringPrompt = {
  title: string;
  description: string;
  tags: string[];
  variables: Array<{
    token: string;
    label: string;
    placeholder: string;
    inputType?: "text" | "textarea";
  }>;
  text: string;
};

export const partner = {
  name: "أكاديمية الإبداع الخليجي للتدريب الإلكتروني",
  logo: "/brand/ebdaa.png",
  href: "https://egulfinnovation.com/",
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
    id: "prompt-anatomy",
    title: "تمرين تشريح الأمر الهندسي",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "اقرأ برومبتًا كاملًا ثم صنّف أجزاءه داخل جدول مكونات البرومبت: النبرة، المهمة، السياق، الدور، المثال، القيود، والتنسيق.",
    outcome:
      "فهم عملي لبنية الأمر الجيد وقدرة أفضل على تفكيك الأوامر قبل صياغتها.",
  },
  {
    id: "professional-prompt-engineering",
    title: "هندسة الأوامر الاحترافية",
    status: "available",
    duration: "8-10 دقائق",
    prompt:
      "أنشئ مشروع هندسة أوامر احترافية وفق الأطر الحديثة التي تم شرحها في الدورة، ثم انسخ أحد الأمرين الجاهزين حسب مستوى التفصيل المطلوب.",
    outcome:
      "أمر هندسي جاهز لبناء مشروع أوامر احترافية، بصيغة موسعة أو مبسطة قابلة للنسخ والاستخدام مباشرة.",
  },
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
    id: "survey-builder",
    title: "تمرين بناء استبيان باستخدام الذكاء الاصطناعي",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "اكتب برومبتاً يساعد الذكاء الاصطناعي على بناء استبيان عملاء قبل اتخاذ قرار الاستثمار في قناة بيع جديدة.",
    outcome:
      "برومبت عملي لبناء استبيان عملاء قابل للاستخدام، مع تقييم ذكي وصياغة محسنة مقترحة.",
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
    id: "token-count",
    title: "تمرين حساب الرموز Tokens",
    status: "available",
    duration: "5 دقائق",
    prompt:
      "استخدم أداة OpenAI Tokenizer لمقارنة عدد الرموز والمحارف بين جملة عربية واضحة وجملة غير مألوفة.",
    outcome:
      "فهم عملي لفكرة الرموز Tokens ولماذا لا يتطابق عددها دائماً مع عدد الكلمات أو المحارف.",
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
  {
    id: "course-completion-survey",
    title: "استبيان ما بعد الدورة التدريبية",
    status: "available",
    duration: "3-5 دقائق",
    prompt:
      "شارك تقييمك النهائي للدورة، أكثر ما أفادك، ما ستطبقه لاحقاً، وشهادتك الاختيارية لاستخدامها بعد موافقتك.",
    outcome:
      "تغذية راجعة واضحة تساعد على تطوير التجربة التعليمية وتوثيق أثر الدورة.",
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
    id: "prompt-anatomy",
    title: "تمرين تشريح الأمر الهندسي",
    category: "تمرين",
    code: "916472",
  },
  {
    id: "professional-prompt-engineering",
    title: "هندسة الأوامر الاحترافية",
    category: "تمرين",
    code: "638527",
  },
  {
    id: "prompt-writing",
    title: "تمرين صياغة أمر",
    category: "تمرين",
    code: "845219",
  },
  {
    id: "survey-builder",
    title: "تمرين بناء استبيان باستخدام الذكاء الاصطناعي",
    category: "تمرين",
    code: "359812",
  },
  {
    id: "prompt-comparison",
    title: "تمرين مقارنة أمر بصيغتين",
    category: "تمرين",
    code: "528614",
  },
  {
    id: "token-count",
    title: "تمرين حساب الرموز Tokens",
    category: "تمرين",
    code: "274915",
  },
  {
    id: "thinking-partner-crisis",
    title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
    category: "تمرين",
    code: "864531",
  },
  {
    id: "course-completion-survey",
    title: "استبيان ما بعد الدورة التدريبية",
    category: "تمرين",
    code: "517903",
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
    title: "قياس الرموز والسياق",
    description:
      "أدوات تساعد على فهم عدد الرموز داخل النصوص والأوامر قبل استخدامها مع نماذج الذكاء الاصطناعي.",
    items: [
      {
        title: "عداد الرموز Tokenizer",
        description:
          "أداة من OpenAI لحساب عدد الرموز في النص، مفيدة عند تجهيز الأوامر الطويلة وفهم حدود السياق.",
        href: "https://platform.openai.com/tokenizer",
        label: "فتح الأداة",
      },
    ],
  },
  {
    title: "مساحات الابتكار والتعاون",
    description:
      "منصات تساعد الفرق على التفكير البصري، تنظيم الأفكار، وبناء خرائط عمل مشتركة أثناء الورش والاجتماعات.",
    items: [
      {
        title: "Miro Innovation Workspace",
        description:
          "منصة عمل بصري تعاونية مناسبة للعصف الذهني، رسم خرائط الأفكار، تخطيط المبادرات، وتوثيق مخرجات الورش.",
        href: "https://miro.com",
        label: "فتح المنصة",
      },
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

export const skillCommandGroups: ToolGroup[] = [
  {
    title: "مواقع المهارات",
    description:
      "مواقع تساعد في استكشاف المهارات، تصنيفها، وبناء خرائط تطوير مرتبطة بأدوار العمل والذكاء الاصطناعي.",
    items: [
      {
        title: "Skills Bank",
        description:
          "منصة مختصرة لاستكشاف المهارات وتنظيمها، مناسبة لبناء قوائم مهارات قابلة للاستخدام في التدريب والتطوير.",
        href: "https://www.skills.sh",
        label: "فتح الموقع",
      },
      {
        title: "Skills Directory",
        description:
          "دليل واسع للمهارات يساعد على البحث عن المهارات وربطها بالمجالات والأدوار المهنية.",
        href: "https://www.skillsdirectory.com",
        label: "فتح الموقع",
      },
      {
        title: "MCP Directory",
        description:
          "دليل لخوادم وأدوات MCP، مفيد لمن يريد فهم منظومة الأدوات والوصلات التي توسّع قدرات تطبيقات الذكاء الاصطناعي.",
        href: "https://mcp.directory",
        label: "فتح الموقع",
      },
    ],
  },
];

export const engineeringPromptBank: EngineeringPrompt[] = [
  {
    title: "توليد أفكار واسعة",
    description:
      "أمر يساعد القائد على توسيع مساحة التفكير حول تحدٍ مؤسسي، ثم تنظيم الأفكار في فئات قابلة للنقاش والاختيار.",
    tags: ["20 فكرة", "تصنيف الأفكار", "توضيح المتغيرات"],
    variables: [
      {
        token: "[نوع المؤسسة]",
        label: "نوع المؤسسة",
        placeholder: "مثال: هيئة حكومية خدمية",
      },
      {
        token: "[وصف مختصر للتحدي]",
        label: "وصف مختصر للتحدي",
        placeholder: "مثال: ارتفاع زمن إنجاز المعاملات وضعف رضا المستفيدين",
        inputType: "textarea",
      },
      {
        token: "[ميزانية / زمن / أنظمة]",
        label: "القيود",
        placeholder: "مثال: ميزانية محدودة، 90 يوماً، أنظمة قديمة أو لا توجد قيود",
      },
    ],
    text: `أنا قائد/مدير في [نوع المؤسسة].
التحدي: [وصف مختصر للتحدي].
القيود: [ميزانية / زمن / أنظمة].
أعطني 20 فكرة متنوعة وغير تقليدية لحل هذا التحدي.
صنّف كل فكرة إلى: أفكار مبتكرة / أفكار عملية / أفكار منخفضة التكلفة.
إذا كان أي متغير غير واضح، اسألني عنه أولاً قبل البدء.`,
  },
];

export const routeLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الدورة" },
  { href: "/links", label: "روابط الدورة" },
  { href: "/tools", label: "الأدوات و الأوامر" },
  { href: "/exercises", label: "التمارين و المقاييس" },
];
