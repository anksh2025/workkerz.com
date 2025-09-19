import type { Metadata } from "next";
import "./globals.css";
import AppToaster from "../components/AppToaster";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Workkerz.com – Hire Verified Daily Workers in India",
  description: "Find and hire trusted construction, automotive & office workers near you. Workkerz.com connects workers & customers instantly.",
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />   {/* client header */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
          <AppToaster />
          
        </main>
      </body>
    </html>
  );
}
