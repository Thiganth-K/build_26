"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  Lightbulb,
  Flag,
  UploadCloud,
  FileText,
  BarChart3,
  ChevronRight,
  LogOut,
  Sparkles,
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
  bootcampPhase = "Build MVP",
  dayNumber = 3,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Strict Section 00 & 36 Admin Structure
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Bootcamp Configuration", href: "/admin/bootcamp", icon: Settings },
    { label: "Participants", href: "/admin/participants", icon: Users },
    { label: "Teams", href: "/admin/teams", icon: Briefcase },
    { label: "Problem Statements", href: "/admin/problem-statements", icon: Lightbulb },
    { label: "Milestones", href: "/admin/milestones", icon: Flag },
    { label: "Submissions", href: "/admin/submissions", icon: UploadCloud },
    { label: "Work Logs", href: "/admin/worklogs", icon: FileText },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-border/70 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm group-hover:bg-accent transition-colors">
            B26
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-[#111111] flex items-center gap-1.5">
              BUILD26
              <span className="text-[9px] font-mono-num font-bold px-1.5 py-0.5 bg-accent/10 text-accent rounded border border-accent/20">
                ADMIN
              </span>
            </div>
            <div className="text-[10px] text-secondary tracking-wide uppercase font-medium">
              Command Center
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-secondary uppercase font-mono-num">
          ADMIN NAVIGATION
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

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

        {/* Quick Link to Participant View */}
        <div className="pt-3 border-t border-border/60">
          <Link
            href="/participant"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-accent bg-accent/5 hover:bg-accent/10 border border-accent/20 transition-all"
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
        <div className="px-3 py-2 rounded-lg bg-surface-subtle border border-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[11px] text-[#111111]">
              Day 0{dayNumber} — {bootcampPhase}
            </span>
          </div>
          <span className="text-[10px] font-mono-num font-semibold text-secondary uppercase bg-white px-1.5 py-0.5 rounded border border-border/60">
            Live
          </span>
        </div>

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
