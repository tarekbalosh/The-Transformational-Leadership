import { SiteHeader } from "@/app/components/site-header";
import { ThinkingPartnerExercise } from "@/app/components/thinking-partner-exercise";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export default function ThinkingPartnerExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero thinking-hero">
        <div className="section-kicker">تمرين تفاعلي</div>
        <h1>تمرين شريك التفكير - أزمة منصة مهيمنة</h1>
        <p>
          استخدم الذكاء الاصطناعي كشريك في البحث والتفكير، ثم اختبر قراراتك
          بنفسك وهاجمها قبل أن تعتمدها.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين شريك التفكير"
        description="سنستخدم البريد لحفظ إجابتك في لوحة المدرب، وربط ما كتبته بك دون تسجيل دخول إضافي."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="thinking-partner-crisis"
            activityTitle="تمرين شريك التفكير - أزمة منصة مهيمنة"
          >
            <ThinkingPartnerExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
