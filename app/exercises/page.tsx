import { ExercisesWorkspace } from "@/app/components/exercises-workspace";
import { ParticipantEntry } from "@/app/components/participant-entry";
import { SiteHeader } from "@/app/components/site-header";
import { exercises } from "@/app/lib/course-content";

export default function ExercisesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero">
        <div className="section-kicker">التمارين العملية</div>
        <h1>اختبر أفكارك، واحفظ إجاباتك ببريدك</h1>
        <p>
          هذه نماذج أولية قابلة للتوسع. عند إضافة التمارين النهائية ستستخدم
          البنية نفسها لحفظ الإجابات ومتابعة التقدم.
        </p>
        <ParticipantEntry compact />
      </section>
      <ExercisesWorkspace exercises={exercises} />
    </main>
  );
}
