import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { TransformationalVsNarcissisticExercise } from "@/app/components/transformational-vs-narcissistic-exercise";

export default function TransformationalVsNarcissisticPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين | اختبار تشخيصي</div>
        <h1>قائد تحويلي أم نمط نرجسي؟</h1>
        <p>
          تمرين للتفريق بين القيادة التحويلية الحقيقية والنمط النرجسي في القيادة.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمرين"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="transformational-vs-narcissistic"
            activityTitle="قائد تحويلي أم نمط نرجسي؟"
          >
            <TransformationalVsNarcissisticExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
