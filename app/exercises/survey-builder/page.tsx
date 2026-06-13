import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { SurveyBuilderExercise } from "@/app/components/survey-builder-exercise";

export default function SurveyBuilderExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تفاعلي</div>
        <h1>تمرين بناء استبيان باستخدام الذكاء الاصطناعي</h1>
        <p>
          اكتب برومبتاً يساعد الذكاء الاصطناعي على بناء استبيان عملاء عملي قبل
          اتخاذ قرار استثماري في قناة بيع جديدة.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين بناء الاستبيان"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="survey-builder"
            activityTitle="تمرين بناء استبيان باستخدام الذكاء الاصطناعي"
          >
            <SurveyBuilderExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
