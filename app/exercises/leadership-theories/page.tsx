import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { LeadershipTheoriesExercise } from "@/app/components/leadership-theories-exercise";

export default function LeadershipTheoriesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين</div>
        <h1>نظريات القيادة</h1>
        <p>
          لخّص العالم الشهير ستيفن كوفي أهمّ نظريات القيادة في نهاية كتابه «العادة الثامنة». 
          ولأن هذه النظريات متعارضةٌ أحياناً، ومتوافقةٌ أو متكاملةٌ في أحيانٍ أخرى، ستقوم في هذا التمرين بالحكم على العبارات وتحديد الأقرب لرأيك.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمرين"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="leadership-theories"
            activityTitle="نظريات القيادة"
          >
            <LeadershipTheoriesExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
