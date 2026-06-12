import Link from "next/link";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { SiteHeader } from "@/app/components/site-header";

export default function IntroductionsWelcomePage() {
  return (
    <main>
      <SiteHeader />
      <section className="intro-hero">
        <div>
          <div className="section-kicker">تعارف المشاركين</div>
          <h1>مساحة قصيرة ليعرف المشاركون بعضهم قبل وأثناء الدورة</h1>
          <p>
            شارك تعريفاً موجزاً عنك، خلفيتك المهنية، ما يهمك في الذكاء
            الاصطناعي، هدفك من الدورة، وحقيقة ممتعة تفتح باب الحديث.
          </p>
          <EmailGate title="أدخل بريدك لفتح تعارف المشاركين">
            <ActivityCodeGate
              activityId="introductions"
              activityTitle="تعارف المشاركين"
            >
              <div className="hero-actions">
                <Link href="/introductions/form" className="primary-link">
                  تعبئة نموذج التعارف
                </Link>
                <Link href="/introductions/board" className="secondary-link">
                  استعراض بطاقات المشاركين
                </Link>
              </div>
            </ActivityCodeGate>
          </EmailGate>
        </div>
        <aside className="intro-hero-panel">
          <strong>خمسة أسئلة فقط</strong>
          <p>
            لا توجد كلمة مرور ولا حساب جديد. البريد يُستخدم فقط لتحديث بطاقتك
            عند الحاجة.
          </p>
        </aside>
      </section>
    </main>
  );
}
