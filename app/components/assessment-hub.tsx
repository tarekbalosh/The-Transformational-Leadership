import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

const activityCards = [
  {
    number: "01",
    type: "تمرين",
    title: "قائد أثّر فيّ",
    description:
      "نشاط افتتاحي: قبل أن نُعرّف القيادة… لنستدعِها من ذاكرتنا. استحضر قائداً واحداً ترك فيك أثراً حقيقياً، واكتب سلوكين جعلاك تثق به.",
    activityId: "leader-impact",
    activityTitle: "قائد أثّر فيّ",
    href: "/exercises/leader-impact",
    linkLabel: "فتح التمرين",
  },
  {
    number: "02",
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
    number: "03",
    type: "تمرين",
    title: "نظريات القيادة",
    description:
      "لخّص العالم الشهير ستيفن كوفي أهمّ نظريات القيادة في نهاية كتابه «العادة الثامنة». احكم على العبارات وتعرف على أقرب النظريات لوجهة نظرك.",
    activityId: "leadership-theories",
    activityTitle: "نظريات القيادة",
    href: "/exercises/leadership-theories",
    linkLabel: "فتح التمرين",
  },
  {
    number: "04",
    type: "تمرين",
    title: "اختبار تشخيص مهارات التغيير",
    description: "أجب عن 16 عبارة قصيرة لتقييم مهاراتك في قيادة التغيير، واحصل على نتيجتك الفورية مع تحليل لنقاط قوتك وفرص تطويرك في فهم التغيير والتخطيط له وتطبيقه.",
    activityId: "change-management-skills",
    activityTitle: "اختبار تشخيص مهارات التغيير",
    href: "/exercises/change-management-skills",
    linkLabel: "فتح التمرين",
  },
  {
    number: "05",
    type: "تمرين",
    title: "اختبار التغيير الواهم",
    description: "تمرين تشخيصي جديد لتقييم مهارات التغيير ومعرفة مدى الجاهزية للقيادة التحويلية.",
    activityId: "illusion-of-change",
    activityTitle: "اختبار التغيير الواهم",
    href: "/exercises/illusion-of-change",
    linkLabel: "فتح التمرين",
  },
  {
    number: "06",
    type: "تمرين",
    title: "قائد تحويلي أم نمط نرجسي؟",
    description: "تمرين للتفريق بين القيادة التحويلية الحقيقية والنمط النرجسي في القيادة.",
    activityId: "transformational-vs-narcissistic",
    activityTitle: "قائد تحويلي أم نمط نرجسي؟",
    href: "/exercises/transformational-vs-narcissistic",
    linkLabel: "فتح التمرين",
  },
  {
    number: "07",
    type: "تمرين",
    title: "اكتشاف نقاط القوة",
    description: "اكتشف نقاط قوتك الفريدة وكيفية توظيفها في القيادة التحويلية عبر مقياس VIA العالمي.",
    activityId: "discover-strengths",
    activityTitle: "اكتشاف نقاط القوة",
    href: "https://www.viacharacter.org/",
    linkLabel: "فتح التمرين",
  },
  {
    number: "08",
    type: "مقياس",
    title: "مقياس أنماط الشخصية",
    description: "اكتشف نمط شخصيتك القيادية عبر مقياس متخصص يحلل أبرز سماتك ويساعدك على فهم كيف تؤثر في أسلوبك مع الفريق واتخاذ القرار.",
    activityId: "personality-patterns-scale",
    activityTitle: "مقياس أنماط الشخصية",
    href: "https://egulfinnovation.com/Tests/Leadership-Styles/login.php",
    linkLabel: "فتح المقياس",
  },
  {
    number: "09",
    type: "تمرين",
    title: "تمرين الصفات القيادية",
    description: "تعرّف على أبرز الصفات التي يمتلكها القادة المؤثرون، وقيّم مدى تجسيدك لها في بيئة عملك اليومية.",
    activityId: "leadership-characters",
    activityTitle: "تمرين الصفات القيادية",
    href: "https://www.egulfinnovation.com/Tests/Leadership-Characters/login.php",
    linkLabel: "فتح التمرين",
  },
  {
    number: "10",
    type: "اختبار",
    title: "اختبار تعاريف القيادة والإدارة",
    description: "اختبر فهمك للفروق الجوهرية بين مفاهيم القيادة والإدارة، وعزّز وضوحك المفاهيمي في أساسيات علم القيادة.",
    activityId: "leadership-definitions",
    activityTitle: "اختبار تعاريف القيادة والإدارة",
    href: "https://www.egulfinnovation.com/Tests/Leadership-Definitions/login.php",
    linkLabel: "فتح الاختبار",
  },
  {
    number: "11",
    type: "تمرين",
    title: "تمرين الفرق بين الإدارة والقيادة",
    description: "تمرين تطبيقي يساعدك على التمييز بوضوح بين دور المدير ودور القائد من خلال مواقف وسيناريوهات واقعية.",
    activityId: "leadership-management-diff",
    activityTitle: "تمرين الفرق بين الإدارة والقيادة",
    href: "https://www.egulfinnovation.com/Tests/Leadership-Management/login.php",
    linkLabel: "فتح التمرين",
  },
  {
    number: "12",
    type: "تمرين",
    title: "تمرين علامات القيادة",
    description: "تعلّم كيف تُميّز علامات القيادة الحقيقية وتفرّق بينها وبين المظاهر السطحية، وطوّر حسّك في قراءة المشهد القيادي.",
    activityId: "leadership-signs",
    activityTitle: "تمرين علامات القيادة",
    href: "https://www.egulfinnovation.com/Tests/Leadership-Signs/login.php",
    linkLabel: "فتح التمرين",
  },
  {
    number: "13",
    type: "تمرين",
    title: "تمرين قوانين القيادة",
    description: "تعرّف على أهم قوانين القيادة الفعّالة واختبر مدى تطبيقها في تجربتك القيادية اليومية.",
    activityId: "leadership-rules",
    activityTitle: "تمرين قوانين القيادة",
    href: "https://www.egulfinnovation.com/Tests/Leadership-Rules/login.php",
    linkLabel: "فتح التمرين",
  },
  {
    number: "14",
    type: "تمرين",
    title: "هل أنت متحفز للقيادة؟",
    description: "اكتشف مستوى دافعيتك نحو القيادة وتعرّف على العوامل التي تشعل فيك الرغبة في التأثير وقيادة الآخرين نحو الهدف.",
    activityId: "leadership-motive",
    activityTitle: "هل أنت متحفز للقيادة؟",
    href: "https://www.egulfinnovation.com/Tests/Leadership-Motive/login.php",
    linkLabel: "فتح التمرين",
  },
  {
    number: "15",
    type: "تمرين",
    title: "التقييم القبلي — المحور الأول: القيادة التحويلية",
    description: "تقييم قبلي لمدى معرفتك بمفاهيم القيادة التحويلية وتطبيقاتها العملية قبل البدء في المحور الأول.",
    activityId: "pre-evaluation-transformational",
    activityTitle: "التقييم القبلي — المحور الأول: القيادة التحويلية",
    href: "https://kahoot.it/challenge/05273318?challenge-id=bf0843d2-b155-49ee-b62d-b059a605e472_1785263569642",
    linkLabel: "فتح التمرين",
    external: true,
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
