import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { LeaderImpactExercise } from "@/app/components/leader-impact-exercise";

export default function LeaderImpactPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين | نشاط افتتاحي</div>
        <h1>قائد أثّر فيّ</h1>
        <p>
          قبل أن نُعرّف القيادة… لنستدعِها من ذاكرتنا. استحضر قائداً واحداً
          ترك فيك أثراً حقيقياً، واكتب سلوكين جعلاك تثق به.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمرين"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="leader-impact"
            activityTitle="قائد أثّر فيّ"
          >
            <LeaderImpactExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
