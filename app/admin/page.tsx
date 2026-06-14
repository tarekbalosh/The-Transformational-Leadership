import { AdminDashboard } from "@/app/components/admin-dashboard";
import { SiteHeader } from "@/app/components/site-header";

export default function AdminPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero admin-hero">
        <div className="section-kicker">لوحة التحكم</div>
        <h1>لوحة قيادة الدورة</h1>
        <p>
          قراءة بصرية لتفاعل المشاركين، نتائج المقاييس، إجابات التمارين،
          والاستبيان الختامي، مع تفاصيل كاملة قابلة للتصدير والمراجعة.
        </p>
      </section>
      <AdminDashboard />
    </main>
  );
}
