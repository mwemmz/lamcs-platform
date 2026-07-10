"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Input } from "@/components/ui";

export default function PortalLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await signIn("member-login", {
        phone,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid phone or password");
      } else {
        window.location.href = "/portal/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface/70 backdrop-blur-xl border border-white/20 p-8 shadow-lg">
        <h1 className="font-serif text-2xl text-surface text-center">Member Login</h1>
        <p className="mt-1 text-center text-sm text-surface/50">
          Sign in with your phone number
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Phone Number"
            id="phone"
            type="tel"
            placeholder="+260 XXX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
          <a href="/portal/reset" className="block text-center text-sm text-surface underline">
            Forgot password?
          </a>
        </form>
      </div>
    </div>
  );
}
