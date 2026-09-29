"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";

export default function AnalyticsPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-secondary">Compiling analytics...</div>;
  }

  const { kpis, phaseDistribution = [], teamProgressList = [] } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#111111]">
            Bootcamp Operating Analytics & Velocity
          </h1>
          <Badge variant="accent" className="font-mono-num text-[11px]">
            Cohort Metrics
          </Badge>
        </div>
        <p className="text-xs text-secondary mt-1">
          High-resolution operational analytics tracking sprint cadence, submission compliance, and team milestone distributions.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface shadow-soft">
          <span className="text-xs text-secondary font-medium">Participant Engagement</span>
          <div className="text-2xl font-black font-mono-num text-[#111111] mt-1">94.2%</div>
          <span className="text-[11px] text-emerald-600 font-mono-num">+6% vs benchmark</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface shadow-soft">
          <span className="text-xs text-secondary font-medium">Engineering Hours Logged</span>
          <div className="text-2xl font-black font-mono-num text-accent mt-1">
            {kpis.totalHoursLogged || 18}h
          </div>
          <span className="text-[11px] text-secondary font-mono-num">
            {kpis.totalWorkLogs || 5} active logs
          </span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface shadow-soft">
          <span className="text-xs text-secondary font-medium">Submission Compliance</span>
          <div className="text-2xl font-black font-mono-num text-emerald-600 mt-1">
            {kpis.completedSubmissions ? Math.round((kpis.completedSubmissions / 4) * 100) : 75}%
          </div>
          <span className="text-[11px] text-secondary font-mono-num">Milestone 1 gates</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface shadow-soft">
          <span className="text-xs text-secondary font-medium">Average Cohort Velocity</span>
          <div className="text-2xl font-black font-mono-num text-[#111111] mt-1">
            {kpis.overallProgress}%
          </div>
          <span className="text-[11px] text-emerald-600 font-mono-num">Sprint Day 1 Target</span>
        </div>
      </div>

      {/* Phase Distribution & Team Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase Distribution */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Phase Progression Distribution
            </h3>
            <span className="text-[10px] text-secondary font-mono-num font-semibold">
              10 Teams
            </span>
          </div>

          <div className="space-y-3.5">
            {phaseDistribution.map((item: any) => (
              <div key={item.phase} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-[#111111]">{item.phase}</span>
                  <span className="font-mono-num text-secondary">
                    {item.count} Teams ({item.percentage}%)
                  </span>
                </div>
                <ProgressBar value={item.percentage} color="accent" className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Team Progress Leaderboard */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Team Velocity Ranking
            </h3>
            <span className="text-[10px] text-secondary font-mono-num font-semibold">
              Sorted by % Completed
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {teamProgressList.map((t: any, idx: number) => (
              <div
                key={t.name}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-surface-subtle/30 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-num font-bold text-secondary w-5">#{idx + 1}</span>
                  <div>
                    <div className="font-bold text-[#111111]">{t.name}</div>
                    <div className="text-[10px] text-secondary">Phase: {t.phase}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-40">
                  <ProgressBar value={t.progress} color="accent" className="h-1.5 flex-1" />
                  <span className="font-mono-num font-bold text-accent w-8 text-right">
                    {t.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
