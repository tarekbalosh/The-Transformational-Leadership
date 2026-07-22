import { AdminDashboard } from "@/app/components/admin-dashboard";
import { SiteHeader } from "@/app/components/site-header";

export default function AdminPage() {
  return (
    <main>
      <SiteHeader />
      <section className="hero-section admin-hero">
        <div className="hero-copy">
          <div className="section-kicker">لوحة التحكم</div>
          <h1>لوحة قيادة الدورة</h1>
          <p className="hero-subtitle">
            قراءة بصرية لتفاعل المشاركين، نتائج المقاييس، إجابات التمارين،
            والاستبيان الختامي، مع تفاصيل كاملة قابلة للتصدير والمراجعة.
          </p>
        </div>
        <div className="hero-media">
          <img src="/images/admin-hero.png" alt="لوحة قيادة الدورة - القيادة التحويلية" />
        </div>
      </section>
      <AdminDashboard />
    </main>
  );
}
