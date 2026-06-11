/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { routeLinks } from "@/app/lib/course-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="الصفحة الرئيسية">
        <img src="/brand/dr-mohammad-logo.png" alt="" className="brand-logo" />
        <span>بوابة الدورة</span>
      </Link>
      <nav className="main-nav" aria-label="التنقل الرئيسي">
        {routeLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Link href="/admin" className="admin-nav-link">
          لوحة التحكم
        </Link>
      </nav>
    </header>
  );
}
