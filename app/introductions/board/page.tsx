import Link from "next/link";
import {
  ProfileBoard,
  type ProfileCard,
} from "@/app/components/introductions/profile-board";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";
import { SiteHeader } from "@/app/components/site-header";
import { participantProfilesData } from "@/app/lib/course-store";

export default async function IntroductionsBoardPage() {
  const profiles = (await participantProfilesData()) as ProfileCard[];

  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero intro-page-hero">
        <div className="section-kicker">لوحة المشاركين</div>
        <h1>بطاقات تعريف واضحة تساعد المشاركين على التعارف</h1>
        <p>
          تصفح إجابات الزملاء، وابحث في الخلفيات المهنية أو الاهتمامات أو
          الأهداف لاكتشاف نقاط التقاطع داخل المجموعة.
        </p>
        <div className="hero-actions">
          <Link href="/introductions/form" className="primary-link">
            إضافة أو تحديث بطاقتي
          </Link>
        </div>
      </section>

      <EmailGate title="أدخل بريدك لاستعراض بطاقات المشاركين">
        <ActivityCodeGate
          activityId="introductions"
          activityTitle="تعارف المشاركين"
        >
          <ProfileBoard profiles={profiles} />
        </ActivityCodeGate>
      </EmailGate>
    </main>
  );
}
