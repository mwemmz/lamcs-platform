"use client";

import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <header
          className="sticky top-0 z-40 backdrop-blur-md border-b border-white/10 text-white"
          style={{ backgroundColor: "rgba(35, 43, 28, 0.90)" }}
        >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin/dashboard" className="font-serif text-lg font-bold">
            LAMCS Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/dashboard" className="hover:text-surface/80 transition-colors">Dashboard</Link>
            <Link href="/admin/members" className="hover:text-surface/80 transition-colors">Members</Link>
            <Link href="/admin/listings" className="hover:text-surface/80 transition-colors">Listings</Link>
            <Link href="/admin/orders" className="hover:text-surface/80 transition-colors">Orders</Link>
            <Link href="/admin/payments" className="hover:text-surface/80 transition-colors">Payments</Link>
            <Link href="/admin/content" className="hover:text-surface/80 transition-colors">Content</Link>
            <Link href="/admin/reports" className="hover:text-surface/80 transition-colors">Reports</Link>
            <Link href="/" className="text-white/50 hover:text-white transition-colors text-xs">
              ← Shop
            </Link>
            <Link href="/api/auth/signout" className="text-white/80 hover:text-white transition-colors">
              Sign Out
            </Link>
          </div>
        </nav>
      </header>
      <main
          className="min-h-[60vh]"
          style={{
            backgroundColor: "rgba(35, 43, 28, 0.60)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </SessionProvider>
  );
}
