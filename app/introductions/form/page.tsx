import Link from "next/link";
import { ProfileForm } from "@/app/components/introductions/profile-form";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { SiteHeader } from "@/app/components/site-header";

export default function IntroductionsFormPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero intro-page-hero">
        <div className="section-kicker">نموذج التعارف</div>
        <h1>عرّف بنفسك للمشاركين في خمس إجابات قصيرة</h1>
        <p>
          اكتب إجابات عملية وواضحة. ستظهر للزملاء في لوحة بطاقات المشاركين
          لتسهيل التعارف وبدء الحوارات.
        </p>
        <div className="hero-actions">
          <Link href="/introductions/board" className="secondary-link">
            مشاهدة بطاقات المشاركين
          </Link>
        </div>
      </section>

      <section className="intro-form-section">
        <EmailGate title="أدخل بريدك لتعبئة نموذج التعارف">
          <ActivityCodeGate
            activityId="introductions"
            activityTitle="تعارف المشاركين"
          >
            <ProfileForm />
          </ActivityCodeGate>
        </EmailGate>
      </section>
    </main>
  );
}
