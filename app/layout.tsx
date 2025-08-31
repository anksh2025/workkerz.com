"use client"; // ✅ make this a client component

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react"; // ✅ import useState
import { Menu, X } from "lucide-react"; // ✅ import icons
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Workkerz Logo"
                width={45}
                height={45}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-800">Workkerz</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors
                    after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition"
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
            <div className="md:hidden bg-white border-t shadow-lg animate-slideDown">
              <nav className="flex flex-col p-5 space-y-4 font-medium text-gray-700">
                <Link href="/" onClick={() => setOpen(false)} className="hover:text-blue-600">Home</Link>
                <Link href="/about" onClick={() => setOpen(false)} className="hover:text-blue-600">About</Link>
                <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-blue-600">Contact</Link>
                <Link
                  href="/admin/login"
                  className="hidden md:block px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition"
                >
                  Admin
                </Link>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
          <Toaster position="top-left" reverseOrder={false} />
        </main>
      </body>
    </html>
  );
}
