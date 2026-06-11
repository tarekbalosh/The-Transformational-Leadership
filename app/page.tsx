/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ParticipantEntry } from "@/app/components/participant-entry";
import { SiteHeader } from "@/app/components/site-header";
import { coursePillars, partner } from "@/app/lib/course-content";

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero-section">
        <div className="hero-copy">
          <div className="section-kicker">تجربة تدريبية عملية للقادة</div>
          <h1>الذكاء الاصطناعي للقادة والمدراء</h1>
          <p className="hero-subtitle">
            تطبيقات الذكاء الاصطناعي في المهام القيادية والإدارية، بصياغة
            عملية تساعدك على تحويل الأدوات إلى رافعة للقرار والإنتاجية.
          </p>
          <ParticipantEntry />
          <div className="hero-actions">
            <Link href="/exercises" className="primary-link">
              الانتقال إلى التمارين
            </Link>
            <Link href="/about" className="secondary-link">
              التعرف على الدورة
            </Link>
          </div>
        </div>

        <div className="hero-media" aria-label="صورة المدرب وهوية الدورة">
          <img src="/brand/dr-mohammad.jpg" alt="د. محمد أبوزيد" />
          <div className="hero-badge">
            <span>موقع مشاركين</span>
            <strong>تمارين، مقاييس، وتقدم محفوظ</strong>
          </div>
        </div>
      </section>

      <section className="partner-band">
        <div>
          <span>بالتعاون مع</span>
          <strong>{partner.name}</strong>
          <p>{partner.note}</p>
        </div>
        <img src={partner.logo} alt={partner.name} />
      </section>

      <section className="content-band">
        <div className="section-heading">
          <div className="section-kicker">ما سيجده المشارك</div>
          <h2>بوابة واحدة للتعلم والتطبيق والمتابعة</h2>
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
    </main>
  );
}
