"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Terminal,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm">
              B26
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#111111]">
                BUILD26
              </span>
              <span className="text-[10px] text-secondary ml-1.5 font-mono-num font-semibold">
                OS 2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Role Switcher
              </Button>
            </Link>
            <Link href="/participant">
              <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                <span>Participant Workspace</span>
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Command Center</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>Bootcamp Live — Day 1: Ideation Sprints Active</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111111] leading-tight">
            The Central Operating System for <span className="text-accent">Build26</span>
          </h1>

          <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto leading-relaxed">
            A high-performance product-building platform orchestrating 40+ student engineers, 10 multidisciplinary teams, real-time work logs, rubric scoring, and the final demo showcase.
          </p>
        </div>

        {/* Dual Portal Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {/* Admin Command Center Card */}
          <Link
            href="/admin"
            className="group rounded-2xl border border-border bg-surface p-8 shadow-soft hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-5 group-hover:bg-accent transition-colors shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Organizers & Jury
                </span>
                <Badge variant="accent">Full Ops Control</Badge>
              </div>
              <h2 className="text-xl font-bold text-[#111111] mt-1 group-hover:text-accent transition-colors">
                Admin Command Center
              </h2>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
                Monitor 10 teams in real time, audit daily work logs, review milestone slide decks, triage flagged inactive squads, and calibrate 100-point jury evaluations.
              </p>
            </div>

            <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between text-xs font-semibold text-[#111111] group-hover:text-accent">
              <span>Launch /admin</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Participant Workspace Card */}
          <Link
            href="/participant"
            className="group rounded-2xl border border-border bg-surface p-8 shadow-soft hover:border-emerald-500 hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:bg-emerald-700 transition-colors shadow-sm">
                <Terminal className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Engineers & Designers
                </span>
                <Badge variant="success">Participant Portal</Badge>
              </div>
              <h2 className="text-xl font-bold text-[#111111] mt-1 group-hover:text-emerald-700 transition-colors">
                Participant Workspace
              </h2>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
                View your team roster and solution architecture, maintain daily work records, manage Kanban tasks, receive mentor feedback, and submit milestone deliverables.
              </p>
            </div>

            <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between text-xs font-semibold text-[#111111] group-hover:text-emerald-700">
              <span>Launch /participant</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Feature Matrix Badges */}
        <div className="max-w-4xl mx-auto w-full pt-8 border-t border-border/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-surface border border-border/60 shadow-xs">
            <div className="text-base font-bold font-mono-num text-[#111111]">10 Teams</div>
            <div className="text-[11px] text-secondary mt-0.5">40+ College Students</div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border/60 shadow-xs">
            <div className="text-base font-bold font-mono-num text-[#111111]">8 Challenge Sets</div>
            <div className="text-[11px] text-secondary mt-0.5">Campus, AI & FinTech</div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border/60 shadow-xs">
            <div className="text-base font-bold font-mono-num text-accent">5 Mentors</div>
            <div className="text-[11px] text-secondary mt-0.5">Industry Advisory</div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border/60 shadow-xs">
            <div className="text-base font-bold font-mono-num text-emerald-600">6 Milestones</div>
            <div className="text-[11px] text-secondary mt-0.5">Zero to Demo Pitch</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111111]">BUILD26</span>
            <span>•</span>
            <span>Build • Ship • Showcase</span>
          </div>
          <div>Next.js 15 • TypeScript • Tailwind CSS • MongoDB</div>
        </div>
      </footer>
    </div>
  );
}
