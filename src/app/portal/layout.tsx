"use client";

import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <header className="sticky top-0 z-40 glass-strong border-b border-avocado-skin/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/portal/dashboard" className="font-serif text-xl font-bold text-surface">
            LAMCS Portal
          </Link>
          <div className="flex items-center gap-4 text-sm text-surface/80">
            <Link href="/portal/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/portal/profile" className="hover:text-white transition-colors">Profile</Link>
            <Link href="/portal/contributions" className="hover:text-white transition-colors">Contributions</Link>
            <Link href="/portal/payments" className="hover:text-white transition-colors">Payments</Link>
            <Link href="/" className="text-surface/50 hover:text-white transition-colors text-xs">
              ← Shop
            </Link>
            <Link href="/api/auth/signout" className="text-surface/70 hover:text-white transition-colors">
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
