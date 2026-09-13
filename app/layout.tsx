import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./extended.css";
import "./coach.css";
import "./data.css";
import { RegisterServiceWorker } from "./register-sw";

export const metadata: Metadata = {
  title: "MyFit AI",
  description: "Your calm, intelligent health companion.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#213d32", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><RegisterServiceWorker />{children}</body>
    </html>
  );
}
