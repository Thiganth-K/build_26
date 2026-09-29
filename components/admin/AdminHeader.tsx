"use client";

import * as React from "react";
import {
  Search,
  Bell,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  adminName?: string;
  bootcampStatus?: "LIVE" | "UPCOMING" | "COMPLETED";
  onStatusChange?: (status: "LIVE" | "UPCOMING" | "COMPLETED") => void;
  onOpenSearch?: () => void;
  onQuickAction?: (action: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminHeader({
  adminName = "Admin",
  bootcampStatus = "LIVE",
  onStatusChange,
  onOpenSearch,
  onQuickAction,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);
  const [showQuickMenu, setShowQuickMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title & Greeting */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Good morning, {adminName.split(" ")[0]}
            </h1>
            <Badge variant="accent" className="font-mono-num text-[10px] tracking-wide uppercase">
              Command Center
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Monitor teams, track progress and keep the bootcamp moving.
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border bg-surface-subtle/80 hover:bg-surface-subtle text-xs text-secondary hover:text-[#111111] transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-secondary" />
              <span>Search teams, students, logs...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono-num font-semibold text-secondary bg-white rounded border border-border shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Quick Action Dropdown */}
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Quick Action</span>
            </Button>

            {showQuickMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowQuickMenu(false)} />
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-surface border border-border shadow-elevated py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary/70 border-b border-border/50">
                    Create & Allocate
                  </div>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction?.("create_team");
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-surface-subtle flex items-center gap-2"
                  >
                    <span>Create Team</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction?.("add_participant");
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-surface-subtle flex items-center gap-2"
                  >
                    <span>Add Participant</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction?.("add_problem");
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-surface-subtle flex items-center gap-2"
                  >
                    <span>Add Problem Statement</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction?.("broadcast_announcement");
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-surface-subtle flex items-center gap-2"
                  >
                    <span>Broadcast Announcement</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction?.("add_schedule");
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-surface-subtle flex items-center gap-2"
                  >
                    <span>Add Schedule Event</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction?.("add_mentor");
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-surface-subtle flex items-center gap-2"
                  >
                    <span>Add Mentor</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Refresh Data button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Refresh Dashboard Data"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-secondary", isRefreshing && "animate-spin text-accent")} />
          </Button>

          {/* Bootcamp Status Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-[#111111] transition-all shadow-xs"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  bootcampStatus === "LIVE"
                    ? "bg-emerald-500"
                    : bootcampStatus === "UPCOMING"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                )}
              />
              <span>{bootcampStatus}</span>
              <SlidersHorizontal className="h-3 w-3 text-secondary ml-1" />
            </button>

            {showStatusMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowStatusMenu(false)} />
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-surface border border-border shadow-elevated py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {(["LIVE", "UPCOMING", "COMPLETED"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange?.(status);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#111111] hover:bg-surface-subtle flex items-center justify-between"
                    >
                      <span className="capitalize">{status.toLowerCase()}</span>
                      {bootcampStatus === status && <Check className="h-3.5 w-3.5 text-accent" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Admin Avatar Profile */}
          <Avatar name={adminName} size="md" />
        </div>
      </div>
    </header>
  );
}
