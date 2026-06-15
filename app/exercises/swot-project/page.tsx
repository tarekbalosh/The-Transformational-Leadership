import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { SwotProjectExercise } from "@/app/components/swot-project-exercise";

export default function SwotProjectExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تطبيقي</div>
        <h1>إنشاء مشروع تحليل SWOT</h1>
        <p>
          حمّل ملف swot-core واستخدمه لبناء مشروع ذكاء اصطناعي يساعدك على
          إجراء التحليل الرباعي للشركات وفق قواعد منهجية واضحة.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين إنشاء مشروع تحليل SWOT"
        description="سنستخدم البريد لحفظ دخولك للتمارين وربط نشاطك باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="swot-project"
            activityTitle="إنشاء مشروع تحليل SWOT"
          >
            <SwotProjectExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
