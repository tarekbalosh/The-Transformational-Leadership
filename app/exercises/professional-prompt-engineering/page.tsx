import { ProfessionalPromptEngineeringExercise } from "@/app/components/professional-prompt-engineering-exercise";
import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export default function ProfessionalPromptEngineeringExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تطبيقي</div>
        <h1>هندسة الأوامر الاحترافية</h1>
        <p>
          أنشئ مشروع هندسة أوامر احترافية وفق الأطر الحديثة التي تم شرحها في
          الدورة، ثم انسخ الصيغة التي تناسب مستوى التفصيل المطلوب.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين هندسة الأوامر الاحترافية"
        description="سنستخدم البريد لحفظ دخولك للتمارين وربط نشاطك باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="professional-prompt-engineering"
            activityTitle="هندسة الأوامر الاحترافية"
          >
            <ProfessionalPromptEngineeringExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
