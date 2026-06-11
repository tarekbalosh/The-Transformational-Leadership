import { AssessmentsWorkspace } from "@/app/components/assessments-workspace";
import { SiteHeader } from "@/app/components/site-header";
import { assessments } from "@/app/lib/course-content";

export default function AssessmentsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero">
        <div className="section-kicker">الاختبارات والمقاييس</div>
        <h1>بنية أولية لقياس الجاهزية والتقدم</h1>
        <p>
          تدعم هذه الصفحة اختياراً من متعدد، أسئلة مفتوحة، ومقاييس تقييم ذاتي.
          المحتوى الحالي توضيحي وسيستبدل بالمقاييس النهائية لاحقاً.
        </p>
      </section>
      <AssessmentsWorkspace assessments={assessments} />
    </main>
  );
}
