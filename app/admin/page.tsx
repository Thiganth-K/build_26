"use client";

import * as React from "react";
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
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { BootcampPhaseTimeline } from "@/components/admin/BootcampPhaseTimeline";
import { TeamTable } from "@/components/admin/TeamTable";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { NeedsAttentionPanel } from "@/components/admin/NeedsAttentionPanel";
import { DeadlinePanel } from "@/components/admin/DeadlinePanel";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { QuickActionModal } from "@/components/admin/QuickActionModal";
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

    // Subtle 30-second live polling for real-time feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleStatusChange = async (newStatus: "LIVE" | "UPCOMING" | "COMPLETED") => {
    try {
      await fetch("/api/bootcamp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handlePhaseSelect = async (newPhase: string) => {
    try {
      await fetch("/api/bootcamp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPhase: newPhase }),
      });
      fetchData();
    } catch (err) {
      console.error("Phase update error:", err);
    }
  };

  const kpis = data.kpis;
  const bootcamp = data.bootcamp;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <AdminHeader
        adminName="Thiganth (Super Admin)"
        bootcampStatus={bootcamp.status || "LIVE"}
        onStatusChange={handleStatusChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onQuickAction={(action) => setQuickActionType(action)}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <main className="px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* Command Center Banner */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-surface via-surface to-accent/[0.04] p-6 shadow-soft relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono-num text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                  System Operational • Bootcamp Live
                </span>
                <span className="text-secondary text-xs">•</span>
                <span className="text-xs text-secondary font-medium">BUILD26 2026</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#111111]">
                BUILD26 COMMAND CENTER
              </h2>
              <p className="text-xs text-secondary mt-1 max-w-xl leading-relaxed">
                Central operating plane orchestrating 40+ engineering participants, 10 multidisciplinary teams, and 5 industry mentors through 6 rigorous product milestones.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-surface p-3 rounded-xl border border-border/70 shadow-xs">
              <div className="px-3 border-r border-border/70">
                <div className="text-[10px] uppercase font-bold text-secondary">Current Phase</div>
                <div className="text-sm font-bold text-accent font-mono-num">
                  {bootcamp.currentPhase || "Ideation"}
                </div>
              </div>
              <div className="px-3 border-r border-border/70">
                <div className="text-[10px] uppercase font-bold text-secondary">Active Day</div>
                <div className="text-sm font-bold text-[#111111] font-mono-num">
                  Day 0{bootcamp.dayNumber || 1}
                </div>
              </div>
              <div className="px-3">
                <div className="text-[10px] uppercase font-bold text-secondary">Next Due Milestone</div>
                <div className="text-sm font-bold text-rose-600 font-mono-num">
                  PPT Due 06:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Row (8 Metric Points) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <KpiCard
            label="Participants"
            value={kpis.totalParticipants || 40}
            trend="+8 enrolled"
            icon={Users}
            color="default"
          />
          <KpiCard
            label="Total Teams"
            value={kpis.totalTeams || 10}
            trend="10 formed"
            icon={Briefcase}
            color="default"
          />
          <KpiCard
            label="Active Teams"
            value={kpis.activeTeams || 7}
            trend="High velocity"
            icon={CheckCircle2}
            color="emerald"
          />
          <KpiCard
            label="Mentors"
            value={kpis.mentors || 5}
            trend="5 assigned"
            icon={GraduationCap}
            color="default"
          />
          <KpiCard
            label="Problem Sets"
            value={kpis.problemStatements || 8}
            trend="8 active"
            icon={Lightbulb}
            color="default"
          />
          <KpiCard
            label="Pending Review"
            value={kpis.pendingSubmissions || 1}
            trend="Action needed"
            trendPositive={false}
            icon={UploadCloud}
            color="amber"
          />
          <KpiCard
            label="Submissions"
            value={kpis.completedSubmissions || 2}
            trend="2 approved"
            icon={FileCheck}
            color="emerald"
          />
          <KpiCard
            label="Avg Progress"
            value={`${kpis.overallProgress || 48}%`}
            trend="On target"
            icon={TrendingUp}
            color="accent"
          />
        </div>

        {/* Large Bootcamp Phase Timeline */}
        <BootcampPhaseTimeline
          currentPhase={bootcamp.currentPhase || "Ideation"}
          overallProgress={kpis.overallProgress || 48}
          teamsCompletedCount={4}
          teamsPendingCount={6}
          onPhaseSelect={handlePhaseSelect}
        />

        {/* Needs Attention System */}
        <NeedsAttentionPanel items={data.attentionItems} />

        {/* Team Operations Matrix */}
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
