import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { ChangeManagementSkillsExercise } from "@/app/components/change-management-skills-exercise";

export default function ChangeManagementSkillsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">تمرين</div>
        <h1>اختبار تشخيص مهارات التغيير</h1>
        <p>
          أجب عن 16 عبارة قصيرة لتقييم مهاراتك في قيادة التغيير، واحصل على نتيجتك الفورية مع تحليل لنقاط قوتك وفرص تطويرك في فهم التغيير والتخطيط له وتطبيقه.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمرين"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="change-management-skills"
            activityTitle="اختبار تشخيص مهارات التغيير"
          >
            <ChangeManagementSkillsExercise />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
