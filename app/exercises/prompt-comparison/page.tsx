import { PromptComparisonExercise } from "@/app/components/prompt-comparison-exercise";
import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export default function PromptComparisonExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تطبيقي</div>
        <h1>تمرين مقارنة أمر بصيغتين</h1>
        <p>
          قارن بين صياغة عامة وصياغة محددة، وانسخ كل أمر مباشرة لتجربته في
          أداة الذكاء الاصطناعي وملاحظة أثر جودة الصياغة.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين مقارنة الأمر"
        description="سنستخدم البريد لحفظ دخولك للتمارين وربط نشاطك باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="prompt-comparison"
            activityTitle="تمرين مقارنة أمر بصيغتين"
          >
            <PromptComparisonExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
