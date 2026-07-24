import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { IllusionOfChangeExercise } from "@/app/components/illusion-of-change-exercise";

export default function IllusionOfChangePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين | اختبار تشخيصي</div>
        <h1>اختبار التغيير الواهم</h1>
        <p>
          اختبار لتشخيص مهارات التغيير ومعرفة مدى الجاهزية للقيادة التحويلية.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمرين"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="illusion-of-change"
            activityTitle="اختبار التغيير الواهم"
          >
            <IllusionOfChangeExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
