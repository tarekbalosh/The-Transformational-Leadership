import { SiteHeader } from "@/app/components/site-header";
import { EngineeringPromptBank } from "@/app/components/engineering-prompt-bank";
import { skillCommandGroups, toolGroups } from "@/app/lib/course-content";

export default function ToolsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="hero-section">
        <div className="hero-copy">
          <div className="section-kicker">الأدوات و الأوامر</div>
          <h1>أدوات ومواقع وأوامر تساعدك على استخدام الذكاء الاصطناعي بفاعلية</h1>
          <p className="hero-subtitle">
            هذه الصفحة تجمع الأدوات والمواقع المهمة التي يمكن الرجوع إليها أثناء
            الدورة، إضافة إلى مواقع المهارات ومصادر الإضافات والأوامر.
          </p>
        </div>
        <div className="hero-media">
          <img src="/images/tools-hero.png" alt="القيادة التحويلية - أدوات وأوامر الذكاء الاصطناعي" />
        </div>
      </section>

      <section className="content-band">
        <div className="tools-section-heading">
          <div className="section-kicker">القسم الأول</div>
          <h2>بنك الأدوات</h2>
          <p>
            روابط عملية تساعد المشاركين على حل مشكلات الاستخدام، تنظيم العمل،
            وفهم بعض المفاهيم التشغيلية أثناء تطبيقات الدورة.
          </p>
        </div>
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

      <section className="content-band">
        <div className="tools-section-heading">
          <div className="section-kicker">القسم الثاني</div>
          <h2>بنك الإضافات و المهارات</h2>
          <p>
            مصادر تساعد على استكشاف المهارات وبناء مكتبات أوامر قابلة لإعادة
            الاستخدام في العمل والتدريب.
          </p>
        </div>
        <div className="tools-group-stack">
          {skillCommandGroups.map((group, index) => (
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

      <section className="content-band">
        <div className="tools-section-heading">
          <div className="section-kicker">القسم الثالث</div>
          <h2>بنك الأوامر الهندسية</h2>
          <p>
            أوامر جاهزة ومنظمة تساعد المشاركين على تحويل الأفكار والتحديات إلى
            مطالبات واضحة قابلة للاستخدام مباشرة مع أدوات الذكاء الاصطناعي.
          </p>
        </div>
        <EngineeringPromptBank />
      </section>
    </main>
  );
}
