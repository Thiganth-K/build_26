"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Kanban,
  UploadCloud,
  Calendar,
  MessageSquare,
  Sparkles,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface ParticipantSidebarProps {
  participantName?: string;
  teamName?: string;
  teamCode?: string;
}

export function ParticipantSidebar({
  participantName: initialName = "Participant",
  teamName: initialTeamName = "Loading...",
  teamCode: initialTeamCode = "...",
}: ParticipantSidebarProps) {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile({
            name: data.participant?.name || data.user.name,
            teamName: data.team?.name || (data.hasTeam ? "My Team" : "No Team Assigned"),
            teamCode: data.team?.code || (data.hasTeam ? "ASSIGNED" : "UNASSIGNED"),
            role: data.participant?.roleInTeam || "Participant",
            hasTeam: data.hasTeam,
          });
        }
      })
      .catch((err) => console.error("Error loading sidebar profile:", err));
  }, [pathname]);

  const participantName = profile?.name || initialName;
  const teamName = profile ? profile.teamName : initialTeamName;
  const teamCode = profile ? profile.teamCode : initialTeamCode;
  const hasTeam = profile ? profile.hasTeam : true;

  const navItems = [
    { label: "Overview", href: "/participant", icon: LayoutDashboard },
    { label: "My Team", href: "/participant/team", icon: Users },
    { label: "Log Daily Work", href: "/participant/worklogs", icon: FileText },
    { label: "Sprint Tasks", href: "/participant/tasks", icon: Kanban },
    { label: "Submissions", href: "/participant/submissions", icon: UploadCloud },
    { label: "Schedule & Deadlines", href: "/participant/schedule", icon: Calendar },
    { label: "Mentor Feedback", href: "/participant/feedback", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-border/70 flex items-center justify-between">
        <Link href="/participant" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#111111] transition-colors">
            B26
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[#111111] flex items-center gap-1.5">
              BUILD26
              <span className="text-[10px] font-mono-num font-semibold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                STUDENT
              </span>
            </div>
            <div className="text-[11px] text-secondary">Participant Workspace</div>
          </div>
        </Link>
      </div>

      {/* Team Badge Card */}
      <div className="mx-3 mt-4 p-3 rounded-xl bg-surface-subtle/70 border border-border space-y-1">
        <div className="text-[10px] uppercase font-bold text-secondary">My Assigned Team</div>
        <div className="text-xs font-bold text-[#111111] flex items-center justify-between">
          <span className="truncate max-w-[130px]">{teamName}</span>
          <span
            className={cn(
              "text-[10px] font-mono-num px-1.5 py-0.5 rounded",
              hasTeam
                ? "text-accent bg-accent/10"
                : "text-amber-700 bg-amber-50 border border-amber-200"
            )}
          >
            {teamCode}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
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

        {/* Switch to Admin link */}
        <div className="pt-3 border-t border-border/60">
          <Link
            href="/admin"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-secondary hover:text-[#111111] hover:bg-surface-subtle transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Admin Command View</span>
            </div>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="p-3 border-t border-border/70 bg-surface">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 truncate">
            <Avatar name={participantName} size="sm" />
            <div className="truncate">
              <div className="text-xs font-semibold text-[#111111] truncate">{participantName}</div>
              <div className="text-[10px] text-secondary truncate">Frontend Lead</div>
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
