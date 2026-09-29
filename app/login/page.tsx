"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserCheck, GraduationCap, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleRoleLogin = async (role: "SUPER_ADMIN" | "ADMIN" | "MENTOR" | "PARTICIPANT") => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, demo: true }),
      });

      if (res.ok) {
        if (role === "PARTICIPANT") {
          router.push("/participant");
        } else {
          router.push("/admin");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user?.role === "PARTICIPANT") {
          router.push("/participant");
        } else {
          router.push("/admin");
        }
      } else {
        alert("User not found in seeded database");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#111111] text-white items-center justify-center font-black text-base shadow-sm">
            B26
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">
            BUILD26 Authentication & Role Switcher
          </h1>
          <p className="text-xs text-secondary">
            Select a verified persona to test role-based capabilities and permissions instantly.
          </p>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            One-Click Persona Switcher
          </div>

          <button
            onClick={() => handleRoleLogin("SUPER_ADMIN")}
            disabled={loading}
            className="w-full p-3 rounded-xl border border-border hover:border-accent bg-surface hover:bg-surface-subtle transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#111111] text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#111111]">Thiganth (Super Admin)</div>
                <div className="text-[10px] text-secondary">Full administrative & settings access</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
          </button>

          <button
            onClick={() => handleRoleLogin("ADMIN")}
            disabled={loading}
            className="w-full p-3 rounded-xl border border-border hover:border-accent bg-surface hover:bg-surface-subtle transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-subtle text-[#111111] border border-border/60">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#111111]">Operations Admin</div>
                <div className="text-[10px] text-secondary">Schedule, announcement & submission triage</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
          </button>

          <button
            onClick={() => handleRoleLogin("MENTOR")}
            disabled={loading}
            className="w-full p-3 rounded-xl border border-border hover:border-accent bg-surface hover:bg-surface-subtle transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#111111]">Dr. Kumar Sundaram (Mentor)</div>
                <div className="text-[10px] text-secondary">Architecture feedback & 50-pt rubric grading</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
          </button>

          <button
            onClick={() => handleRoleLogin("PARTICIPANT")}
            disabled={loading}
            className="w-full p-3 rounded-xl border border-border hover:border-accent bg-surface hover:bg-surface-subtle transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent border border-accent/20">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#111111]">Thiganth K. (Team Alpha Lead)</div>
                <div className="text-[10px] text-secondary">Daily work logging, tasks & pitch submission</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
          </button>
        </div>

        {/* Custom Email Form */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Or Login with Registered Email
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              placeholder="e.g. admin@build26.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button variant="primary" size="md" type="submit" className="w-full text-xs" isLoading={loading}>
              Sign In
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-secondary">
          <Link href="/" className="hover:underline">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
