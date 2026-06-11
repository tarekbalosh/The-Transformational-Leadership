import { SiteHeader } from "@/app/components/site-header";

export function AssessmentHub() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero">
        <div className="section-kicker">التمارين و المقاييس</div>
        <h1>مقياس واحد واضح لتجربة المشارك الحالية</h1>
        <p>
          تم تبسيط هذه المساحة لتضم المقياس المعتمد حالياً فقط: مقياس نمط
          قيادة الذكاء الاصطناعي. يمكنك البدء مباشرة والعودة للصفحة الرئيسية من
          الترويسة في أي وقت.
        </p>
      </section>

      <section className="content-band">
        <div className="assessment-launch-card">
          <div>
            <div className="section-kicker">المقياس المتاح</div>
            <h2>ما نمط قيادتك للذكاء الاصطناعي؟</h2>
            <p>
              اختبار تفاعلي من 12 سؤالاً يساعدك على معرفة نمطك القيادي في
              تبني الذكاء الاصطناعي، مع نتيجة تفصيلية وتوصية عملية.
            </p>
          </div>
          <a href="/ai-leader-style.html" className="primary-link">
            بدء المقياس
          </a>
        </div>
      </section>
    </main>
  );
}
