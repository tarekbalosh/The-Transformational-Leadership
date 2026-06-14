import { CourseCompletionSurvey } from "@/app/components/course-completion-survey";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { SiteHeader } from "@/app/components/site-header";

export default function CourseCompletionSurveyPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">استبيان ختامي</div>
        <h1>استبيان ما بعد الدورة التدريبية</h1>
        <p>
          شكرًا لمشاركتك في الدورة. نود معرفة رأيك لتطوير التجربة التعليمية
          مستقبلًا، وقد نستخدم بعض الإجابات كاستشهادات بعد الحصول على موافقتك
          الصريحة.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح الاستبيان الختامي"
        description="سنستخدم البريد لحفظ إجابتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="course-completion-survey"
            activityTitle="استبيان ما بعد الدورة التدريبية"
          >
            <CourseCompletionSurvey />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
