import { SiteHeader } from "@/app/components/site-header";
import { toolGroups } from "@/app/lib/course-content";

export default function ToolsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero tools-hero">
        <div className="section-kicker">الأدوات</div>
        <h1>أدوات مساعدة لاستخدام الذكاء الاصطناعي بشكل أسهل وأسرع</h1>
        <p>
          هذه الصفحة تجمع الأدوات والإضافات التي يمكن الرجوع إليها أثناء
          الدورة. قد تحتوي كل مجموعة على أداة واحدة أو عدة أدوات بحسب الحاجة.
        </p>
      </section>

      <section className="content-band">
        <div className="tools-group-stack">
          {toolGroups.map((group, index) => (
            <section className="tools-group-card" key={group.title}>
              <div className="tools-group-head">
                <div className="section-kicker">
                  المجموعة {String(index + 1).padStart(2, "0")}
                </div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>

              <div className="tools-item-list">
                {group.items.map((item, itemIndex) => (
                  <article className="tool-item-card" key={item.href}>
                    <div>
                      <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <a
                      href={item.href}
                      className="primary-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
