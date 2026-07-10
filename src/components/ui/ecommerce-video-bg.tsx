"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

interface EcommerceVideoBgProps {
  children: ReactNode;
}

export function EcommerceVideoBg({ children }: EcommerceVideoBgProps) {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [errored, setErrored] = useState(false);

  const isMember = !!session?.user;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  const conn =
    typeof window !== "undefined" && "connection" in navigator
      ? (navigator as Navigator & { connection: { effectiveType: string } }).connection
      : null;
  const isSlowConnection = conn ? ["slow-2g", "2g"].includes(conn.effectiveType) : false;

  const shouldPlay = isMember && !prefersReducedMotion && !isMobile && !isSlowConnection && !errored;

  /* ---------- lazy-load video src after mount ---------- */
  useEffect(() => {
    if (!shouldPlay || !videoRef.current) return;
    videoRef.current.src = "/videos/ecommerce-bg.mp4";
    videoRef.current.load();
  }, [shouldPlay]);

  /* ---------- Page Visibility — pause when tab hidden ---------- */
  useEffect(() => {
    if (!shouldPlay) return;
    const el = videoRef.current;
    if (!el) return;
    const handleVisibility = () => {
      if (document.hidden) { el.pause(); }
      else { el.play().catch(() => {}); }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [shouldPlay]);

  /* ---------- IntersectionObserver — pause when scrolled out of view ---------- */
  useEffect(() => {
    if (!shouldPlay || !containerRef.current) return;
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.play().catch(() => {}); }
        else { el.pause(); }
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldPlay]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* video + overlay */}
      {shouldPlay && (
        <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster="/images/ecommerce-bg-poster.png"
            muted
            loop
            playsInline
            onError={() => setErrored(true)}
            onCanPlay={(e) => { (e.target as HTMLVideoElement).play().catch(() => {}); }}
          />
          {/* dark scrim — keeps content legible */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(53, 64, 38, 0.55)" }}
          />
          {/* soft vignette at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/10" />
        </div>
      )}

      {/* fallback gradient (unauthenticated / slow / mobile / reduced-motion) */}
      {!shouldPlay && (
        <div
          className="fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 0% 0%, rgba(132, 162, 79, 0.35), transparent 60%), " +
              "linear-gradient(135deg, var(--color-avocado-flesh), var(--color-avocado-skin))",
          }}
          aria-hidden="true"
        />
      )}

      {/* content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
