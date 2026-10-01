"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  Shield,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface ParticipantHeaderProps {
  participantName?: string;
  teamName?: string;
  isTeamLead?: boolean;
}

export function ParticipantHeader({
  participantName = "Thiganth K",
  teamName = "NEURAL BUILDERS",
  isTeamLead = true,
}: ParticipantHeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(1);

  // Wireframe Section 34 Canonical Notifications
  const notifications = [
    {
      id: "1",
      icon: Bell,
      iconColor: "text-accent",
      title: "You have been invited to join Neural Builders",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: "2",
      icon: Bell,
      iconColor: "text-blue-500",
      title: "Day 02 milestone is now available",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: "3",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      title: "Your Day 01 submission was received",
      time: "Yesterday",
      unread: false,
    },
    {
      id: "4",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      title: "Day 03 submission deadline approaching",
      time: "Tomorrow",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-md px-6 py-3.5 select-none">
      <div className="flex items-center justify-between">
        {/* Left: Wireframe Section 48 Header: BUILD26 • NEURAL BUILDERS */}
        <div className="flex items-center gap-3">
          <span className="font-black text-sm tracking-tight text-[#111111]">BUILD26</span>
          <span className="text-secondary/40 font-mono text-sm">/</span>
          <span className="text-xs font-bold tracking-wider uppercase text-secondary">
            {teamName}
          </span>
          {isTeamLead && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              👑 LEAD
            </span>
          )}
        </div>

        {/* Right: Notifications Bell (Section 34) & User Profile Dropdown (Section 48) */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </div>

          {/* Section 34: Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
                if (!showNotifications) setUnreadCount(0);
              }}
              title="Notifications"
              className="relative p-2 text-secondary hover:text-[#111111] hover:bg-surface-subtle rounded-lg transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-surface shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-4 py-2 border-b border-border/70 flex items-center justify-between">
                  <div className="font-bold text-xs text-[#111111] uppercase tracking-wide">
                    NOTIFICATIONS
                  </div>
                  <span className="text-[10px] text-secondary">Section 34</span>
                </div>

                <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`p-3 text-xs flex items-start gap-2.5 hover:bg-surface-subtle transition-colors ${
                          n.unread ? "bg-accent/5" : ""
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${n.iconColor}`} />
                        <div className="flex-1 space-y-0.5">
                          <p className="font-medium text-[#111111] leading-snug">{n.title}</p>
                          <span className="text-[10px] text-secondary">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown (Wireframe Section 48: THIGANTH K ▼) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-surface-subtle text-xs font-bold text-[#111111] transition-colors"
            >
              <Avatar name={participantName} size="sm" />
              <span className="truncate max-w-[120px]">{participantName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-secondary" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 text-xs">
                <div className="px-3.5 py-2 border-b border-border/70">
                  <div className="font-bold text-[#111111]">{participantName}</div>
                  <div className="text-[11px] text-secondary truncate">{teamName}</div>
                </div>

                <Link
                  href="/participant/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-secondary hover:text-[#111111] hover:bg-surface-subtle transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/participant/team"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-secondary hover:text-[#111111] hover:bg-surface-subtle transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Team Space</span>
                </Link>

                <div className="my-1 border-t border-border/70" />

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
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
