import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "الذكاء الاصطناعي للقادة والمدراء",
  description:
    "بوابة تدريبية عربية لتطبيقات الذكاء الاصطناعي في المهام القيادية والإدارية.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
