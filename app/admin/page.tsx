import { AdminDashboard } from "@/app/components/admin-dashboard";
import { SiteHeader } from "@/app/components/site-header";

export default function AdminPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero admin-hero">
        <div className="section-kicker">لوحة التحكم</div>
        <h1>متابعة المشاركين والإجابات والتقدم</h1>
        <p>
          هذه الصفحة منفصلة عن تجربة المشارك وتحتاج رمز دخول أولي. يمكن استبدال
          ذلك لاحقاً بتحقق أقوى عند اعتماد بيئة التشغيل النهائية.
        </p>
      </section>
      <AdminDashboard />
    </main>
  );
}
