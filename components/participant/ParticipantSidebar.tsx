"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Compass,
  Users,
  Briefcase,
  Mail,
  Settings,
  HelpCircle,
  Flag,
  UploadCloud,
  CheckCircle2,
  FileText,
  Activity,
  User,
  LogOut,
  ChevronRight,
  Copy,
  Check,
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
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "";

  const [profile, setProfile] = React.useState<any>(null);
  const [copiedCode, setCopiedCode] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile({
            name: data.participant?.name || data.user.name,
            teamName: data.team?.name || (data.hasTeam ? "My Team" : "No Team"),
            teamCode: data.team?.code || (data.hasTeam ? "B26-X7K9" : "NO TEAM"),
            role: data.participant?.roleInTeam || "Full Stack Developer",
            isTeamLead: data.team?.lead?.toString() === (data.participant?._id || data.user?._id),
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

  // Exact Wireframe Section 48 Navigation Groups
  const navSections = [
    {
      group: "OVERVIEW",
      items: [
        { label: "Overview", href: "/participant", icon: Compass, exact: true },
      ],
    },
    {
      group: "TEAM",
      items: [
        { label: "Team Members", href: "/participant/team", icon: Users, exact: true, checkTab: false },
        { label: "Roles & Responsibilities", href: "/participant/team?tab=roles", icon: Briefcase, checkTab: true, tabValue: "roles" },
        { label: "Invitations", href: "/participant/team?tab=invitations", icon: Mail, checkTab: true, tabValue: "invitations" },
        { label: "Team Settings", href: "/participant/team?tab=settings", icon: Settings, checkTab: true, tabValue: "settings" },
      ],
    },
    {
      group: "BUILD",
      items: [
        { label: "Problem Statement", href: "/participant/problem", icon: HelpCircle },
        { label: "Milestones", href: "/participant/milestones", icon: Flag },
        { label: "Submissions", href: "/participant/submissions", icon: UploadCloud, exact: true },
        { label: "Final Submission", href: "/participant/submissions?tab=final", icon: CheckCircle2, checkTab: true, tabValue: "final" },
      ],
    },
    {
      group: "CONTRIBUTION",
      items: [
        { label: "My Work Log", href: "/participant/worklogs", icon: FileText },
        { label: "Team Activity", href: "/participant/activity", icon: Activity },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        { label: "Profile", href: "/participant/profile", icon: User },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-border/70 flex items-center justify-between">
        <Link href="/participant" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm group-hover:bg-accent transition-colors">
            B26
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-[#111111] flex items-center gap-1.5">
              BUILD26
              <span className="text-[9px] font-mono-num font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-secondary tracking-wide uppercase font-medium">Bootcamp Workspace</div>
          </div>
        </Link>
      </div>

      {/* Team Badge Card (Wireframe Section 48 Header: BUILD26 NEURAL BUILDERS) */}
      {hasTeam && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-surface-subtle/80 border border-border space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-secondary flex items-center justify-between">
            <span className="truncate">{teamName}</span>
            {teamCode && teamCode !== "NO TEAM" && (
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(teamCode);
                  }
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                title="Copy team code"
                className="text-[10px] text-accent hover:text-[#111111] font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-num font-bold text-[#111111] bg-white px-2 py-0.5 rounded border border-border/80">
              {teamCode}
            </span>
            {profile?.isTeamLead && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                👑 Lead
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation List grouped strictly per Wireframe Section 48 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 custom-scrollbar">
        {navSections.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold tracking-wider text-secondary/80 uppercase font-mono-num">
              {group.group === "OVERVIEW" ? "◉ OVERVIEW" : group.group}
            </div>

            <div className="space-y-0.5">
              {group.items.map((item: any) => {
                const Icon = item.icon;
                let isActive = false;

                if (item.checkTab) {
                  isActive = pathname.startsWith(item.href.split("?")[0]) && currentTab === item.tabValue;
                } else if (item.exact) {
                  isActive = pathname === item.href && !currentTab;
                } else {
                  isActive = pathname === item.href;
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-[#111111] text-white shadow-sm font-semibold"
                        : "text-secondary hover:text-[#111111] hover:bg-surface-subtle"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-secondary group-hover:text-[#111111]"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Account Section & Logout */}
      <div className="p-3 border-t border-border/70 bg-surface">
        <div className="flex items-center justify-between px-1.5">
          <Link href="/participant/profile" className="flex items-center gap-2 truncate group">
            <Avatar name={participantName} size="sm" />
            <div className="truncate">
              <div className="text-xs font-semibold text-[#111111] truncate group-hover:text-accent transition-colors">
                {participantName}
              </div>
              <div className="text-[10px] text-secondary truncate flex items-center gap-1">
                {profile?.role || "Full Stack Developer"}
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch (e) {
                console.error("Logout error:", e);
              } finally {
                window.location.href = "/login";
              }
            }}
            title="Sign Out"
            className="p-1.5 text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
