import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export function AssessmentHub() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero">
        <div className="section-kicker">التمارين و المقاييس</div>
        <h1>أنشطة الدورة الحالية في مساحة واحدة</h1>
        <p>
          تضم هذه المساحة اختبار اليوم الأول، وتمارين التطبيق، ومقياس نمط
          قيادة الذكاء الاصطناعي. أدخل بريدك أولاً حتى تُحفظ إجاباتك ونتائجك
          باسمك في لوحة المدرب.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمارين و المقاييس"
        description="بعد إدخال البريد ستظهر لك أنشطة الدورة الحالية، وسنحفظ إجاباتك ونتائجك حتى يستطيع المدرب متابعتها."
      >
        <section className="content-band">
          <div className="hub-card-grid">
            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">01 | اختبار</div>
                <h2>اختبار اليوم الأول - المفاهيم الأساسية</h2>
                <p>
                  اختبار سريع عبر Kahoot لمراجعة مفاهيم اليوم الأول والتأكد من
                  وضوح الأساسيات قبل الانتقال للأنشطة التالية.
                </p>
              </div>
              <ActivityCodeGate
                activityId="day-one-concepts-test"
                activityTitle="اختبار اليوم الأول"
                compact
              >
                <a
                  href="https://kahoot.it/challenge/06310431?challenge-id=bf0843d2-b155-49ee-b62d-b059a605e472_1781253303544"
                  className="primary-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  فتح الاختبار
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">02 | تمرين</div>
                <h2>تمرين صياغة أمر</h2>
                <p>
                  تمرين تفاعلي لصياغة أمر متكامل من سبعة مكونات، مع تقييم
                  فوري بالذكاء الاصطناعي وتوصيات لتحسين الصياغة.
                </p>
              </div>
              <ActivityCodeGate
                activityId="prompt-writing"
                activityTitle="تمرين صياغة أمر"
                compact
              >
                <a href="/exercises/prompt-writing" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">03 | تمرين</div>
                <h2>عرّف بنفسك للمجموعة</h2>
                <p>
                  أجب عن خمسة أسئلة قصيرة ليتمكن المشاركون من معرفة خلفيتك
                  واهتماماتك وأهدافك من الدورة.
                </p>
              </div>
              <ActivityCodeGate
                activityId="introductions"
                activityTitle="تعارف المشاركين"
                compact
              >
                <a href="/introductions" className="primary-link">
                  فتح التعارف
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">04 | مقياس</div>
                <h2>ما نمط قيادتك للذكاء الاصطناعي؟</h2>
                <p>
                  اختبار تفاعلي من 12 سؤالاً يساعدك على معرفة نمطك القيادي في
                  تبني الذكاء الاصطناعي، مع نتيجة تفصيلية وتوصية عملية.
                </p>
              </div>
              <ActivityCodeGate
                activityId="ai-leader-style"
                activityTitle="مقياس نمط قيادة الذكاء الاصطناعي"
                compact
              >
                <a href="/ai-leader-style.html" className="primary-link">
                  بدء المقياس
                </a>
              </ActivityCodeGate>
            </div>
          </div>
        </section>
      </EmailGate>
    </main>
  );
}
