"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { routeLinks } from "@/app/lib/course-content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  /* lock body scroll while sidebar is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand-link" aria-label="الصفحة الرئيسية">
          <img
            src="/brand/dr-mohammad-logo.png"
            alt=""
            className="brand-logo"
          />
          <span>بوابة الدورة</span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="main-nav desktop-nav" aria-label="التنقل الرئيسي">
          {routeLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="admin-nav-link">
            لوحة التحكم
          </Link>
        </nav>

        {/* Hamburger button — visible on mobile */}
        <button
          className={`hamburger-btn${open ? " active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${open ? " visible" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        className={`sidebar-drawer${open ? " open" : ""}`}
        aria-label="القائمة الجانبية"
      >
        <div className="sidebar-header">
          <Link
            href="/"
            className="brand-link"
            onClick={close}
            aria-label="الصفحة الرئيسية"
          >
            <img
              src="/brand/dr-mohammad-logo.png"
              alt=""
              className="brand-logo"
            />
            <span>بوابة الدورة</span>
          </Link>
          <button
            className="sidebar-close-btn"
            onClick={close}
            aria-label="إغلاق القائمة"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="18" y2="18" />
              <line x1="18" y1="4" x2="4" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="التنقل الرئيسي">
          {routeLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={close}>
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="sidebar-admin-link" onClick={close}>
            لوحة التحكم
          </Link>
        </nav>
      </aside>
    </>
  );
}
