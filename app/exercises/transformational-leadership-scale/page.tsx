import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { TransformationalLeadershipScale } from "@/app/components/transformational-leadership-scale";

export default function TransformationalLeadershipScalePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero prompt-hero">
        <div className="section-kicker">مقياس | تقييم ذاتي</div>
        <h1>مقياس القيادة التحويلية</h1>
        <p>
          أعطِ نفسك درجة من 1 إلى 10 في كل عبارة بحسب واقع ممارستك الفعلية،
          واحصل على تقرير فوري بتصنيفك القيادي وأولويات تطويرك الشخصية.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح المقياس"
        description="سنستخدم البريد لحفظ نتيجتك وربطها باسمك في لوحة المدرب، دون تسجيل دخول أو كلمة مرور."
      >
        <section className="content-band">
          <ActivityCodeGate
            activityId="transformational-leadership-scale"
            activityTitle="مقياس القيادة التحويلية"
          >
            <TransformationalLeadershipScale />
          </ActivityCodeGate>
        </section>
      </EmailGate>
    </main>
  );
}
