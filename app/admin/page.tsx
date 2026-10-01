"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  UploadCloud,
  FileCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TeamTable } from "@/components/admin/TeamTable";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { NeedsAttentionPanel } from "@/components/admin/NeedsAttentionPanel";
import { DeadlinePanel } from "@/components/admin/DeadlinePanel";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { QuickActionModal } from "@/components/admin/QuickActionModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState<any>({
    kpis: {},
    bootcamp: {},
    teams: [],
    activities: [],
    attentionItems: [],
    scheduleEvents: [],
  });
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [quickActionType, setQuickActionType] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      const [analyticsRes, teamsRes, actsRes, attenRes, schedRes] = await Promise.all([
        fetch("/api/analytics").then((r) => r.json()),
        fetch("/api/teams").then((r) => r.json()),
        fetch("/api/activities?limit=15").then((r) => r.json()),
        fetch("/api/attention").then((r) => r.json()),
        fetch("/api/schedule?day=1").then((r) => r.json()),
      ]);

      setData({
        kpis: analyticsRes.kpis || {},
        bootcamp: analyticsRes.bootcamp || {},
        teams: teamsRes.teams || [],
        activities: actsRes.activities || [],
        attentionItems: attenRes.items || [],
        scheduleEvents: schedRes.events || [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const kpis = data.kpis;
  const bootcamp = data.bootcamp;

  // Wireframe Section 37: 6-day bootcamp progress bars
  const dayProgressBars = [
    { day: "DAY 01", percent: 100 },
    { day: "DAY 02", percent: 100 },
    { day: "DAY 03", percent: 65 },
    { day: "DAY 04", percent: 0 },
    { day: "DAY 05", percent: 0 },
    { day: "DAY 06", percent: 0 },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <AdminHeader
        adminName="Thiganth (Super Admin)"
        bootcampStatus={bootcamp.status || "LIVE"}
        onStatusChange={() => {}}
        onOpenSearch={() => setIsSearchOpen(true)}
        onQuickAction={(action) => setQuickActionType(action)}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <main className="px-8 py-6 max-w-7xl mx-auto space-y-8">
        {/* Wireframe Section 37: BOOTCAMP OVERVIEW */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                SECTION 37 — ADMIN DASHBOARD
              </span>
              <h1 className="text-2xl font-black tracking-tight text-[#111111]">
                BOOTCAMP OVERVIEW
              </h1>
              <p className="text-xs text-secondary mt-0.5">
                Central control monitor for participants, teams, daily progress, and submissions.
              </p>
            </div>

            {/* Quick Actions per Section 37 */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/admin/problem-statements">
                <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold bg-[#111111] hover:bg-black text-white">
                  <Plus className="h-3 w-3" />
                  <span>[ + ADD PROBLEM ]</span>
                </Button>
              </Link>
              <Link href="/admin/milestones">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                  <Plus className="h-3 w-3" />
                  <span>[ + CREATE MILESTONE ]</span>
                </Button>
              </Link>
              <Link href="/admin/teams">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-bold">
                  <Briefcase className="h-3 w-3" />
                  <span>[ VIEW TEAMS ]</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Section 37: 4 Primary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                PARTICIPANTS
              </div>
              <div className="text-3xl font-black text-[#111111] font-mono-num">
                {kpis.totalParticipants || 128}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                ● Active enrollments
              </div>
            </div>

            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                TEAMS
              </div>
              <div className="text-3xl font-black text-[#111111] font-mono-num">
                {kpis.totalTeams || 32}
              </div>
              <div className="text-[11px] text-accent font-semibold">
                3 or 4 member teams
              </div>
            </div>

            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                SUBMISSIONS
              </div>
              <div className="text-3xl font-black text-[#111111] font-mono-num">
                {kpis.completedSubmissions || 84}
              </div>
              <div className="text-[11px] text-secondary">
                Milestone deliverable gates
              </div>
            </div>

            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                CURRENT DAY
              </div>
              <div className="text-3xl font-black text-[#111111] font-mono-num">
                DAY 03
              </div>
              <div className="text-[11px] text-accent font-semibold">
                Core Build & MVP Sprint
              </div>
            </div>
          </div>

          {/* Section 37: BOOTCAMP PROGRESS */}
          <div className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                BOOTCAMP PROGRESS
              </div>
              <span className="text-xs font-mono-num text-secondary">
                Aggregate completion across all registered teams
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {dayProgressBars.map((item) => {
                const filledCount = Math.round(item.percent / 5);
                const emptyCount = 20 - filledCount;
                const barStr = "█".repeat(filledCount) + "░".repeat(emptyCount);

                return (
                  <div key={item.day} className="flex items-center justify-between gap-4">
                    <span className="font-bold text-[#111111] w-20 shrink-0">{item.day}</span>
                    <span className="text-[#111111] font-mono tracking-tight flex-1 truncate text-xs sm:text-sm">
                      {barStr}
                    </span>
                    <span className="font-bold text-right w-12 shrink-0">{item.percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Needs Attention Panel */}
        <NeedsAttentionPanel items={data.attentionItems} />

        {/* Section 43: Teams Table */}
        <TeamTable
          teams={data.teams}
          onTeamClick={(teamId) => router.push(`/admin/teams/${teamId}`)}
        />

        {/* Split Row: Activity Stream & Milestone Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={data.activities} />
          <DeadlinePanel events={data.scheduleEvents} />
        </div>
      </main>

      {/* Global Search Modal (⌘K) */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Quick Action Creator Modal */}
      <QuickActionModal
        actionType={quickActionType}
        onClose={() => setQuickActionType(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
