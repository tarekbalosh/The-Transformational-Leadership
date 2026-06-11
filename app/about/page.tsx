import { SiteHeader } from "@/app/components/site-header";
import { audience, coursePillars } from "@/app/lib/course-content";

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <div className="section-kicker">تعريف بالدورة</div>
        <h1>تدريب يساعد القادة على استخدام الذكاء الاصطناعي بوعي ونتيجة</h1>
        <p>
          صممت هذه الدورة للقادة والمدراء ورواد الأعمال الذين يريدون تطبيقاً
          عملياً سريعاً، لا عرضاً تقنياً طويلاً. تركيزها على القرار، إدارة
          الفرق، التخطيط، وتحسين المهام القيادية اليومية.
        </p>
      </section>

      <section className="split-section">
        <div>
          <h2>فكرة الدورة</h2>
          <p>
            يتعلم المشارك كيف يختار حالات استخدام مناسبة، يصيغ طلبات واضحة
            للأدوات، يقرأ النتائج بعقلية قيادية، ثم يحول ذلك إلى طريقة عمل
            قابلة للتكرار داخل فريقه أو مؤسسته.
          </p>
        </div>
        <div>
          <h2>الفئات المستهدفة</h2>
          <ul className="clean-list">
            {audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-band muted">
        <div className="section-heading">
          <div className="section-kicker">مخرجات التعلم المتوقعة</div>
          <h2>من معرفة عامة إلى تطبيق إداري واضح</h2>
        </div>
        <div className="feature-grid">
          {coursePillars.map((pillar) => (
            <article key={pillar}>
              <span aria-hidden="true">◆</span>
              <p>{pillar}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="outline-placeholder">
        <div className="section-kicker">مساحة قابلة للتحديث</div>
        <h2>محاور الدورة</h2>
        <p>
          ستضاف المحاور التفصيلية هنا عند اعتماد المحتوى النهائي، مع ربط كل
          محور بتمارينه ومقاييسه داخل البوابة.
        </p>
      </section>
    </main>
  );
}
