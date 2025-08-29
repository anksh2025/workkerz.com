"use client"; // ✅ make this a client component

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react"; // ✅ import useState
import { Menu, X } from "lucide-react"; // ✅ import icons

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="/logo.png"
                alt="Workkerz Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-800">Workkerz</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/admin/login"
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {open && (
            <div className="md:hidden border-t bg-white">
              <nav className="flex flex-col p-4 space-y-3">
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                  Contact
                </Link>
                <Link
                  href="/admin/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  Admin
                </Link>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}
