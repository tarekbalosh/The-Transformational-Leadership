import { SiteHeader } from "@/app/components/site-header";
import { courseLinks } from "@/app/lib/course-content";

export default function CourseLinksPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero links-hero">
        <div className="section-kicker">روابط الدورة</div>
        <h1>روابط مهمة سيتم إرسالها واستخدامها أثناء الدورة</h1>
        <p>
          هذه الصفحة تجمع الروابط التي يحتاجها المشاركون خلال البرنامج، حتى تبقى
          مرجعاً سريعاً وسهل الوصول من أي جهاز.
        </p>
      </section>

      <section className="content-band">
        <div className="course-links-grid">
          {courseLinks.map((link, index) => (
            <article className="course-link-card" key={link.href}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{link.title}</h2>
                <p>{link.description}</p>
              </div>
              <a
                href={link.href}
                className="primary-link"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
