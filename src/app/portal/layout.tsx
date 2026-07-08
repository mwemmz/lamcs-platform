"use client";

import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <header className="sticky top-0 z-40 glass-strong border-b border-avocado-skin/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/portal/dashboard" className="font-serif text-xl font-bold text-avocado-skin">
            LAMCS Portal
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/portal/dashboard" className="hover:text-pit transition-colors">Dashboard</Link>
            <Link href="/portal/profile" className="hover:text-pit transition-colors">Profile</Link>
            <Link href="/portal/contributions" className="hover:text-pit transition-colors">Contributions</Link>
            <Link href="/portal/payments" className="hover:text-pit transition-colors">Payments</Link>
            <Link href="/api/auth/signout" className="text-pit hover:underline transition-colors">
              Sign Out
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </SessionProvider>
  );
}
