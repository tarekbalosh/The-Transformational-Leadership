import { PromptAnatomyExercise } from "@/app/components/prompt-anatomy-exercise";
import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export default function PromptAnatomyExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تطبيقي</div>
        <h1>تمرين تشريح الأمر الهندسي</h1>
        <p>
          اقرأ برومبتًا كاملًا، ثم صنّف أجزاءه داخل مكونات الأمر السبعة لفهم
          بنية الأمر الجيد قبل صياغته.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين تشريح الأمر"
        description="سنستخدم البريد لحفظ إجابتك وتقييمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="prompt-anatomy"
            activityTitle="تمرين تشريح الأمر الهندسي"
          >
            <PromptAnatomyExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
