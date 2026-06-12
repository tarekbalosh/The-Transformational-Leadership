import { SiteHeader } from "@/app/components/site-header";
import { PromptWritingExercise } from "@/app/components/prompt-writing-exercise";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export default function PromptWritingExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تفاعلي</div>
        <h1>تمرين صياغة أمر</h1>
        <p>
          صغ أمراً متكاملاً للذكاء الاصطناعي يساعدك على إعداد مسودة خطة تحول
          رقمي لجهة حكومية، ثم احصل على تقييم فوري وتوصيات عملية لتحسينه.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين صياغة الأمر"
        description="سنستخدم البريد لحفظ إجابتك وتقييمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="prompt-writing"
            activityTitle="تمرين صياغة أمر"
          >
            <PromptWritingExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
