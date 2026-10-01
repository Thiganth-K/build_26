"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Layers,
  Calendar,
  Code2,
  CheckCircle2,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setSession(d);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-accent selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-sm">
              B26
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-[#111111]">
                BUILD26
              </span>
              <span className="text-[10px] text-secondary ml-1.5 font-mono-num font-semibold">
                BUILD • COLLABORATE • SHIP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {session?.user ? (
              <>
                <Link href={session.user.role === "PARTICIPANT" ? "/participant" : "/admin"}>
                  <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-sm">
                    <span>Open {session.user.role === "PARTICIPANT" ? "Participant Space" : "Admin Command"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs text-secondary">
                    Switch Account
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="text-xs font-semibold px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="text-xs font-semibold px-4 shadow-sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Entry Hero — 1:1 Matching Wireframe Section 01 */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center space-y-10">
        {/* Banner badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>A 6-Day Product Building Bootcamp</span>
        </div>

        {/* Brand Headline */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#111111] leading-none">
            BUILD26
          </h1>
          <p className="text-xs sm:text-sm font-mono-num font-bold tracking-widest uppercase text-accent">
            BUILD • COLLABORATE • SHIP
          </p>
          <p className="text-sm sm:text-base text-secondary max-w-xl mx-auto leading-relaxed pt-2">
            The complete operating system for collegiate product creators. Form multidisciplinary teams, tackle verified problem statements, deliver 6 daily milestones, and ship your working MVP to the world.
          </p>
        </div>

        {/* Central Entry Action Box — Wireframe Section 01 */}
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono-num font-bold uppercase tracking-wider text-secondary">
              APPLICATION ENTRY
            </span>
            <h2 className="text-base font-bold text-[#111111]">
              Get Started with BUILD26
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href="/login" className="w-full">
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-xs font-bold py-3 uppercase tracking-wider"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/signup" className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-xs font-bold py-3 uppercase tracking-wider shadow-sm"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="pt-3 border-t border-border/70 text-center">
            <p className="text-[11px] text-secondary">
              Participant / Admin access handled according to authenticated role.
            </p>
          </div>
        </div>

        {/* 6-Day Milestone Roadmap Preview */}
        <div className="w-full max-w-3xl pt-8 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              The 6-Day Product Journey
            </span>
            <span className="text-[11px] text-accent font-semibold">
              Live Sprints Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { day: "Day 01", title: "TEAM + IDEA", desc: "Form team & ideate" },
              { day: "Day 02", title: "WIREFRAME", desc: "User flows & Figma" },
              { day: "Day 03", title: "BUILD", desc: "Core implementation" },
              { day: "Day 04", title: "INTEGRATION", desc: "APIs & database" },
              { day: "Day 05", title: "TEST & POLISH", desc: "Bug fixes & QA" },
              { day: "Day 06", title: "FINAL DEMO", desc: "Ship it & present" },
            ].map((d, i) => (
              <div
                key={d.day}
                className="p-3 rounded-xl border border-border bg-surface shadow-xs space-y-1 hover:border-accent/50 transition-colors"
              >
                <div className="text-[10px] font-mono-num font-bold text-accent">
                  {d.day}
                </div>
                <div className="text-xs font-bold text-[#111111] leading-tight">
                  {d.title}
                </div>
                <div className="text-[10px] text-secondary">
                  {d.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Command Center Quick Access */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-secondary">
          <span>Are you a bootcamp organizer or mentor?</span>
          <Link
            href="/admin"
            className="text-xs font-semibold text-[#111111] hover:text-accent flex items-center gap-1 underline"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            <span>Admin Command Center</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/50 py-6 text-center text-xs text-secondary">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111111]">BUILD26</span>
            <span>•</span>
            <span>Collegiate Tech Bootcamp Platform</span>
          </div>
          <div className="text-[11px] text-secondary">
            Built for Students, Mentors & Organizers
          </div>
        </div>
      </footer>
    </div>
  );
}
