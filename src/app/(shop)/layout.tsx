"use client";

import { SessionProvider } from "next-auth/react";
import { EcommerceVideoBg } from "@/components/ui/ecommerce-video-bg";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EcommerceVideoBg>{children}</EcommerceVideoBg>
    </SessionProvider>
  );
}
