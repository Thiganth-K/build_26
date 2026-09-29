"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Lightbulb,
  Megaphone,
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  FileText,
  UploadCloud,
  MessageSquare,
  Award,
  Trophy,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface AdminSidebarProps {
  adminName?: string;
  adminEmail?: string;
  bootcampPhase?: string;
  dayNumber?: number;
}

export function AdminSidebar({
  adminName = "Thiganth (Admin)",
  adminEmail = "admin@build26.org",
  bootcampPhase = "Ideation",
  dayNumber = 1,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navSections = [
    {
      title: null,
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "Bootcamp",
      items: [
        { label: "Schedule", href: "/admin/schedule", icon: CalendarDays },
        { label: "Problem Statements", href: "/admin/problem-statements", icon: Lightbulb },
        { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
      ],
    },
    {
      title: "People",
      items: [
        { label: "Participants", href: "/admin/participants", icon: Users },
        { label: "Teams", href: "/admin/teams", icon: Briefcase },
        { label: "Mentors", href: "/admin/mentors", icon: GraduationCap },
      ],
    },
    {
      title: "Execution",
      items: [
        { label: "Team Progress", href: "/admin/progress", icon: TrendingUp },
        { label: "Work Logs", href: "/admin/worklogs", icon: FileText },
        { label: "Submissions", href: "/admin/submissions", icon: UploadCloud },
        { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
      ],
    },
    {
      title: "Evaluation",
      items: [
        { label: "Evaluation", href: "/admin/evaluation", icon: Award },
        { label: "Leaderboard & Showcase", href: "/admin/showcase", icon: Trophy },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-border/70 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-accent transition-colors">
            B26
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[#111111] flex items-center gap-1.5">
              BUILD26
              <span className="text-[10px] font-mono-num font-semibold px-1.5 py-0.2 bg-accent/10 text-accent rounded">
                OPS
              </span>
            </div>
            <div className="text-[11px] text-secondary">Build • Ship • Showcase</div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary/70">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[#111111] text-white shadow-sm font-semibold"
                      : "text-secondary hover:text-[#111111] hover:bg-surface-subtle"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-secondary group-hover:text-[#111111]"
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Participant Switcher Quick Link */}
        <div className="pt-2 border-t border-border/60">
          <Link
            href="/participant"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-accent bg-accent/5 hover:bg-accent/10 border border-accent/15 transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Participant View</span>
            </div>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Link>
        </div>
      </div>

      {/* Bottom Status & Admin Profile */}
      <div className="p-3 border-t border-border/70 bg-surface space-y-2">
        {/* Bootcamp Status Pill */}
        <div className="px-3 py-2 rounded-lg bg-surface-subtle border border-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[11px] text-[#111111]">
              Day {dayNumber} — {bootcampPhase}
            </span>
          </div>
          <span className="text-[10px] font-mono-num font-semibold text-secondary uppercase bg-white px-1.5 py-0.5 rounded border border-border/60">
            Live
          </span>
        </div>

        {/* Admin User Footer */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5 truncate">
            <Avatar name={adminName} size="sm" />
            <div className="truncate">
              <div className="text-xs font-semibold text-[#111111] truncate">{adminName}</div>
              <div className="text-[10px] text-secondary truncate">{adminEmail}</div>
            </div>
          </div>
          <Link
            href="/login"
            title="Switch User / Logout"
            className="p-1.5 text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
