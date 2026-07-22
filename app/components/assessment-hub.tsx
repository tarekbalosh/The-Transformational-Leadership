import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

const kahootUrl =
  "https://kahoot.it/challenge/06310431?challenge-id=bf0843d2-b155-49ee-b62d-b059a605e472_1781253303544";

const activityCards = [
  {
    number: "01",
    type: "تمرين",
    title: "عرّف بنفسك للمجموعة",
    description:
      "أجب عن أسئلة قصيرة ليتمكن المشاركون من معرفة بلدك وخلفيتك واهتماماتك والنموذج الذي تستخدمه وأهدافك من الدورة.",
    activityId: "introductions",
    activityTitle: "تعارف المشاركين",
    href: "/introductions",
    linkLabel: "فتح التعارف",
  },
  {
    number: "02",
    type: "تمرين",
    title: "تمرين المفاهيم الأساسية",
    description:
      "تمرين سريع عبر Kahoot لمراجعة مفاهيم اليوم الأول والتأكد من وضوح الأساسيات قبل الانتقال للأنشطة التالية.",
    activityId: "day-one-concepts-test",
    activityTitle: "تمرين المفاهيم الأساسية",
    href: kahootUrl,
    linkLabel: "فتح التمرين",
    external: true,
  },
  {
    number: "03",
    type: "مقياس",
    title: "ما نمط قيادتك للذكاء الاصطناعي؟",
    description:
      "اختبار تفاعلي من 12 سؤالاً يساعدك على معرفة نمطك القيادي في تبني الذكاء الاصطناعي، مع نتيجة تفصيلية وتوصية عملية.",
    activityId: "ai-leader-style",
    activityTitle: "مقياس نمط قيادة الذكاء الاصطناعي",
    href: "/ai-leader-style.html",
    linkLabel: "بدء المقياس",
  },
  {
    number: "04",
    type: "تمرين",
    title: "تمرين حساب الرموز Tokens",
    description:
      "استخدم أداة OpenAI Tokenizer لمقارنة عدد الرموز والمحارف بين جملتين، ثم سجّل ملاحظتك حول الفرق بين النص الواضح والنص غير المألوف.",
    activityId: "token-count",
    activityTitle: "تمرين حساب الرموز Tokens",
    href: "/exercises/token-count",
    linkLabel: "فتح التمرين",
  },
  {
    number: "05",
    type: "تمرين",
    title: "تمرين تشريح الأمر الهندسي",
    description:
      "اقرأ برومبتًا كاملًا ثم صنّف أجزاءه داخل مكونات الأمر السبعة: الدور، السياق، المهمة، القيود، النبرة، المثال، والتنسيق.",
    activityId: "prompt-anatomy",
    activityTitle: "تمرين تشريح الأمر الهندسي",
    href: "/exercises/prompt-anatomy",
    linkLabel: "فتح التمرين",
  },
  {
    number: "06",
    type: "تمرين",
    title: "هندسة الأوامر الاحترافية",
    description:
      "أنشئ مشروع هندسة أوامر احترافية وفق الأطر الحديثة التي تم شرحها في الدورة، مع أمر موسع وآخر مبسط قابلين للنسخ مباشرة.",
    activityId: "professional-prompt-engineering",
    activityTitle: "هندسة الأوامر الاحترافية",
    href: "/exercises/professional-prompt-engineering",
    linkLabel: "فتح التمرين",
  },
  {
    number: "07",
    type: "تمرين",
    title: "إنشاء مشروع تحليل SWOT",
    description:
      "حمّل ملف swot-core المرفق، ثم استخدمه لبناء مشروع ذكاء اصطناعي يجري التحليل الرباعي للشركات بطريقة منهجية.",
    activityId: "swot-project",
    activityTitle: "إنشاء مشروع تحليل SWOT",
    href: "/exercises/swot-project",
    linkLabel: "فتح التمرين",
  },
  {
    number: "08",
    type: "تمرين",
    title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
    description:
      "تمرين سريع يستخدم الذكاء الاصطناعي كشريك تفكير لفهم أزمة Unity، كتابة 3 قرارات أولية، ومهاجمتها بتحليل ما قبل الوفاة.",
    activityId: "thinking-partner-crisis",
    activityTitle: "تمرين شريك التفكير - أزمة منصة مهيمنة",
    href: "/exercises/thinking-partner-crisis",
    linkLabel: "فتح التمرين",
  },
  {
    number: "09",
    type: "تمرين",
    title: "تمرين صياغة أمر",
    description:
      "تمرين تفاعلي لصياغة أمر متكامل من سبعة مكونات، مع تقييم فوري بالذكاء الاصطناعي وتوصيات لتحسين الصياغة.",
    activityId: "prompt-writing",
    activityTitle: "تمرين صياغة أمر",
    href: "/exercises/prompt-writing",
    linkLabel: "فتح التمرين",
  },
  {
    number: "10",
    type: "تمرين",
    title: "تمرين مقارنة أمر بصيغتين",
    description:
      "قارن بين صياغة عامة وأخرى محددة، وانسخ كل أمر مباشرة لتجربته وملاحظة أثر جودة الصياغة على استجابة الذكاء الاصطناعي.",
    activityId: "prompt-comparison",
    activityTitle: "تمرين مقارنة أمر بصيغتين",
    href: "/exercises/prompt-comparison",
    linkLabel: "فتح التمرين",
  },
  {
    number: "11",
    type: "تمرين",
    title: "تمرين بناء استبيان باستخدام الذكاء الاصطناعي",
    description:
      "اكتب برومبتاً يساعد الذكاء الاصطناعي على بناء استبيان عملاء لشركة أزياء قبل اتخاذ قرار الاستثمار في TikTok Shop.",
    activityId: "survey-builder",
    activityTitle: "تمرين بناء استبيان باستخدام الذكاء الاصطناعي",
    href: "/exercises/survey-builder",
    linkLabel: "فتح التمرين",
  },
  {
    number: "12",
    type: "تمرين",
    title: "استبيان ما بعد الدورة التدريبية",
    description:
      "استبيان ختامي قصير لقياس تجربتك، فائدة المحتوى، وما الذي ستطبقه بعد الدورة، مع خيار الموافقة على استخدام شهادتك.",
    activityId: "course-completion-survey",
    activityTitle: "استبيان ما بعد الدورة التدريبية",
    href: "/exercises/course-completion-survey",
    linkLabel: "فتح الاستبيان",
  },
];

export function AssessmentHub() {
  return (
    <main>
      <SiteHeader />
      <section className="hero-section assessments-hero">
        <div className="hero-copy">
          <div className="section-kicker">التمارين و المقاييس</div>
          <h1>أنشطة الدورة الحالية في مساحة واحدة</h1>
          <p className="hero-subtitle">
            تضم هذه المساحة اختبار اليوم الأول، وتمارين التطبيق، ومقياس نمط
            قيادة الذكاء الاصطناعي. أدخل بريدك أولاً حتى تُحفظ إجاباتك ونتائجك
            باسمك في لوحة المدرب.
          </p>
        </div>
        <div className="hero-media">
          <img src="/images/assessments-hero.png" alt="أنشطة الدورة - التمارين والمقاييس" />
        </div>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمارين و المقاييس"
        description="بعد إدخال البريد ستظهر لك أنشطة الدورة الحالية، وسنحفظ إجاباتك ونتائجك حتى يستطيع المدرب متابعتها."
      >
        <section className="content-band">
          <div className="hub-card-grid">
            {activityCards.map((activity) => (
              <div className="assessment-launch-card" key={activity.activityId}>
                <div>
                  <div className="section-kicker">
                    {activity.number} | {activity.type}
                  </div>
                  <h2>{activity.title}</h2>
                  <p>{activity.description}</p>
                </div>
                <ActivityCodeGate
                  activityId={activity.activityId}
                  activityTitle={activity.activityTitle}
                  compact
                  redirectTo={activity.href}
                >
                  <a
                    href={activity.href}
                    className="primary-link"
                    target={activity.external ? "_blank" : undefined}
                    rel={activity.external ? "noreferrer" : undefined}
                  >
                    {activity.linkLabel}
                  </a>
                </ActivityCodeGate>
              </div>
            ))}
          </div>
        </section>
      </EmailGate>
    </main>
  );
}
