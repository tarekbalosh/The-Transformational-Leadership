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
