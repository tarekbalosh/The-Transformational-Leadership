import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { TokenCountExercise } from "@/app/components/token-count-exercise";

export default function TokenCountExercisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين تطبيقي</div>
        <h1>تمرين حساب الرموز Tokens</h1>
        <p>
          تمرين سريع لفهم الفرق بين عدد الرموز وعدد المحارف عند استخدام النصوص
          العربية داخل أدوات الذكاء الاصطناعي.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح تمرين حساب الرموز"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="token-count"
            activityTitle="تمرين حساب الرموز Tokens"
          >
            <TokenCountExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
