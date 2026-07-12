import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { withSiteBasePath } from "../src/site-path";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "海洋板与不锈钢之家 | 交互式 3D 设计",
  description: "厨卫互换、开放式厨房、独立中岛与客厅储物的一室一厅交互式装修设计。",
  icons: {
    icon: withSiteBasePath("/favicon.svg"),
    shortcut: withSiteBasePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
