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
              الانتقال إلى التمارين و المقاييس
            </Link>
            <Link href="/links" className="secondary-link">
              روابط الدورة
            </Link>
          </div>
        </div>

        <a
          href="#trainer-profile"
          className="hero-media trainer-photo-link"
          aria-label="استعراض معلومات د. محمد أبو زيد"
        >
          <img src="/brand/dr-mohammad.jpg" alt="د. محمد أبو زيد" />
          <div className="trainer-name-card">
            <span>مدرب الدورة</span>
            <strong>د. محمد أبو زيد</strong>
            <small>اضغط لاستعراض السيرة المختصرة</small>
          </div>
          <div className="hero-badge">
            <span>موقع مشاركين</span>
            <strong>تمارين، مقاييس، وتقدم محفوظ</strong>
          </div>
        </a>
      </section>

      <section
        id="trainer-profile"
        className="trainer-profile-modal"
        aria-label="معلومات د. محمد أبو زيد"
      >
        <a href="#" className="modal-backdrop" aria-label="إغلاق"></a>
        <article className="trainer-profile-card">
          <a href="#" className="modal-close" aria-label="إغلاق">
            إغلاق
          </a>
          <div className="trainer-profile-head">
            <img src="/brand/dr-mohammad.jpg" alt="" />
            <div>
              <div className="section-kicker">مدرب الدورة</div>
              <h2>د. محمد أبو زيد</h2>
              <p>خبير استراتيجي ومدرب قيادي</p>
            </div>
          </div>

          <div className="trainer-profile-body">
            <p>
              خبير استراتيجي ومدرب قيادي في تطوير القيادات وبناء الكفاءات
              المؤسسية، يمتلك خبرة واسعة في القطاعين الحكومي والخاص داخل
              ماليزيا والعالم العربي.
            </p>
            <p>
              قدّم برامج نوعية في القيادة والتخطيط الاستراتيجي وقيادة التغيير،
              ويجمع بين الخبرة الإدارية والخلفية الهندسية في هندسة الحاسوب
              والاتصالات.
            </p>
            <p>
              يمتلك فهماً عميقاً لآليات الذكاء الاصطناعي وتطبيقاته العملية في
              المؤسسات، ويوظّفه في تطوير الأداء القيادي والإداري ورفع كفاءة
              العمل المؤسسي.
            </p>

            <div className="trainer-profile-section">
              <h3>تعاون مع جهات رائدة منها</h3>
              <ul>
                <li>المراسم الملكية السعودية</li>
                <li>وزارة الاقتصاد العُمانية</li>
                <li>جامعة الإمارات</li>
                <li>الجامعة الإسلامية العالمية بماليزيا</li>
              </ul>
            </div>

            <div className="trainer-profile-highlight">
              <strong>يركّز في برامجه على التمكين القيادي عبر الاستخدام العملي للذكاء الاصطناعي.</strong>
              <p>
                ويسعى إلى تحويل الذكاء الاصطناعي إلى أداة فعّالة لتسريع الإنجاز
                وتحقيق التحول الذكي في المؤسسات.
              </p>
            </div>
          </div>
        </article>
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
