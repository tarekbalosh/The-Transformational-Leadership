const swotCoreFile = {
  href: "/resources/swot-core.md",
  fileName: "swot-core.md",
  size: "16 KB",
};

export function SwotProjectExercise() {
  return (
    <div className="resource-exercise-layout">
      <section className="comparison-intro-card">
        <div className="section-kicker">إنشاء مشروع تحليل SWOT</div>
        <h2>ابنِ مشروعًا يجري التحليل الرباعي للشركات</h2>
        <p>
          استخدم الملف المرفق كبنية معرفية للمشروع. حمّل الملف، ثم ارفعه داخل
          مشروع الذكاء الاصطناعي الذي تستخدمه، واطلب منه بناء مساعد متخصص في
          إجراء التحليل الرباعي للشركات وفق القواعد الموجودة في الملف.
        </p>
      </section>

      <section className="resource-download-card" aria-label="ملف التمرين">
        <div>
          <div className="section-kicker">الملف المرفق</div>
          <h3>{swotCoreFile.fileName}</h3>
          <p>
            مرجع منهجي مكثّف لبناء مشروع تحليل SWOT للشركات الصغيرة والمتوسطة.
            يتضمن قواعد التصنيف، تحويل العناصر إلى أهداف، وصياغة مخرجات قابلة
            للتنفيذ.
          </p>
          <small>ملف Markdown · {swotCoreFile.size}</small>
        </div>

        <div className="resource-actions">
          <a
            href={swotCoreFile.href}
            className="primary-link"
            download={swotCoreFile.fileName}
          >
            تحميل الملف
          </a>
          <a
            href={swotCoreFile.href}
            className="secondary-link"
            target="_blank"
            rel="noreferrer"
          >
            فتح الملف
          </a>
        </div>
      </section>

      <section className="resource-steps-card">
        <div>
          <div className="section-kicker">خطوات التنفيذ</div>
          <h3>استخدم الملف لبناء المشروع</h3>
        </div>
        <ol>
          <li>
            حمّل ملف <strong>swot-core.md</strong> من بطاقة الملف أعلاه.
          </li>
          <li>
            افتح أداة الذكاء الاصطناعي التي تدعم إنشاء المشاريع أو التعليمات
            المخصصة.
          </li>
          <li>
            ارفع الملف داخل المشروع واجعله المرجع المعرفي الأساسي لتحليل SWOT.
          </li>
          <li>
            اطلب من المشروع إجراء تحليل رباعي لشركة محددة، ثم زوّده باسم
            الشركة، نشاطها، السوق الجغرافي، والسؤال الاستراتيجي.
          </li>
        </ol>
      </section>
    </div>
  );
}
