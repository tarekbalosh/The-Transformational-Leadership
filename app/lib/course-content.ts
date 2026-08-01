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
    id: "leader-impact",
    title: "قائد أثّر فيّ",
    status: "available",
    duration: "5 دقائق",
    prompt:
      "استحضر قائداً واحداً ترك فيك أثراً حقيقياً، واكتب السبب وسلوكين محددين لاحظتهما فيه.",
    outcome:
      "قائد محدد بسلوكين قابلين للقياس كنقطة انطلاق لفهم القيادة التحويلية.",
  },
  {
    id: "leadership-theories",
    title: "نظريات القيادة",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "تمرين تفاعلي يهدف إلى استعراض نظريات القيادة والحكم عليها، ثم اختيار الأقرب لوجهة نظرك بناءً على ملخص ستيفن كوفي.",
    outcome:
      "تقرير مفصل يحلل اختياراتك ويعرض قراءة في نظريات القيادة المتنوعة.",
  },
  {
    id: "change-management-skills",
    title: "اختبار تشخيص مهارات التغيير",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "أجب عن 16 عبارة قصيرة لتقييم مهاراتك في قيادة التغيير، واحصل على نتيجتك الفورية مع تحليل لنقاط قوتك وفرص تطويرك في فهم التغيير والتخطيط له وتطبيقه.",
    outcome:
      "تحليل لنقاط قوتك وفرص تطويرك في مهارات قيادة التغيير.",
  },
  {
    id: "illusion-of-change",
    title: "اختبار التغيير الواهم",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "تمرين تشخيصي جديد لتقييم مهارات التغيير ومعرفة مدى الجاهزية للقيادة التحويلية.",
    outcome:
      "تحليل دقيق لعلامات التغيير وقدرتك على التمييز بين التغيير الحقيقي والواهم.",
  },
  {
    id: "transformational-vs-narcissistic",
    title: "قائد تحويلي أم نمط نرجسي؟",
    status: "available",
    duration: "10 دقائق",
    prompt:
      "تمرين للتفريق بين القيادة التحويلية الحقيقية والنمط النرجسي في القيادة.",
    outcome:
      "تحليل لنمط القيادة ومدى التركيز على الفريق مقابل التركيز على الذات.",
  },
  {
    id: "discover-strengths",
    title: "اكتشاف نقاط القوة",
    status: "available",
    duration: "15 دقيقة",
    prompt:
      "اكتشف نقاط قوتك الفريدة وكيفية توظيفها في القيادة التحويلية عبر مقياس VIA العالمي.",
    outcome:
      "تحديد نقاط القوة الشخصية وكيفية استخدامها في القيادة.",
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
    id: "leader-impact",
    title: "قائد أثّر فيّ",
    category: "تمرين",
    code: "7427",
  },
  {
    id: "introductions",
    title: "تعارف المشاركين",
    category: "تمرين",
    code: "7463",
  },
  {
    id: "leadership-theories",
    title: "نظريات القيادة",
    category: "تمرين",
    code: "7496",
  },
  {
    id: "change-management-skills",
    title: "اختبار تشخيص مهارات التغيير",
    category: "تمرين",
    code: "7425",
  },
  {
    id: "illusion-of-change",
    title: "اختبار التغيير الواهم",
    category: "تمرين",
    code: "7479",
  },
  {
    id: "transformational-vs-narcissistic",
    title: "قائد تحويلي أم نمط نرجسي؟",
    category: "تمرين",
    code: "7472",
  },
  {
    id: "discover-strengths",
    title: "اكتشاف نقاط القوة",
    category: "تمرين",
    code: "7459",
  },
  {
    id: "day-one-concepts-test",
    title: "اختبار اليوم الأول - المفاهيم الأساسية",
    category: "اختبار",
    code: "631041",
  },
  {
    id: "ai-leader-style",
    title: "ما نمط قيادتك للذكاء الاصطناعي؟",
    category: "مقياس",
    code: "739204",
  },
  {
    id: "personality-patterns-scale",
    title: "مقياس أنماط الشخصية",
    category: "مقياس",
    code: "7468",
  },
  {
    id: "leadership-characters",
    title: "تمرين الصفات القيادية",
    category: "تمرين",
    code: "7484",
  },
  {
    id: "leadership-definitions",
    title: "اختبار تعاريف القيادة والإدارة",
    category: "اختبار",
    code: "7438",
  },
  {
    id: "leadership-management-diff",
    title: "تمرين الفرق بين الإدارة والقيادة",
    category: "تمرين",
    code: "7443",
  },
  {
    id: "leadership-signs",
    title: "تمرين علامات القيادة",
    category: "تمرين",
    code: "7416",
  },
  {
    id: "leadership-rules",
    title: "تمرين قوانين القيادة",
    category: "تمرين",
    code: "7491",
  },
  {
    id: "leadership-motive",
    title: "تمرين هل أنت متحفز للقيادة",
    category: "تمرين",
    code: "7441",
  },
  {
    id: "pre-evaluation-transformational",
    title: "اختبار المحور الأول – كاهوت",
    category: "تمرين",
    code: "7485",
  },
  {
    id: "pre-evaluation-transformational-axis2",
    title: "اختبار المحور الثاني – كاهوت",
    category: "تمرين",
    code: "7452",
  },
];

export const courseLinks: CourseLink[] = [];

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
  { href: "/links", label: "روابط الدورة" },
  { href: "/exercises", label: "التمارين و المقاييس" },
];
