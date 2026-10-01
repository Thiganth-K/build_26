"use client";

import * as React from "react";
import { BarChart3, Download, CheckCircle2, TrendingUp, Users, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const [data, setData] = React.useState<any>({
    participants: 128,
    teams: 32,
    completedTeams: 29,
    activeTeams: 32,
    finalSubmissions: 24,
    totalWorkLogs: 512,
    totalHours: 1284,
  });

  const milestoneProgress = [
    { day: "DAY 01", bar: "████████████████████", pct: "100%" },
    { day: "DAY 02", bar: "██████████████████░░", pct: "90%" },
    { day: "DAY 03", bar: "█████████████░░░░░░░", pct: "65%" },
    { day: "DAY 04", bar: "░░░░░░░░░░░░░░░░░░░░", pct: "0%" },
    { day: "DAY 05", bar: "░░░░░░░░░░░░░░░░░░░░", pct: "0%" },
    { day: "DAY 06", bar: "░░░░░░░░░░░░░░░░░░░░", pct: "0%" },
  ];

  const handleExport = () => {
    alert("Exporting BUILD26 Comprehensive Bootcamp Report as PDF/CSV...");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="pb-3 border-b border-border">
        <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
          SECTION 47
        </span>
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">
          ADMIN / REPORTS
        </h1>
        <p className="text-xs text-secondary mt-0.5">
          Executive summary of cohort velocity, milestone completion rates, and individual participation metrics.
        </p>
      </div>

      {/* Wireframe Section 47 Master Report Card */}
      <div className="rounded-2xl border-2 border-border bg-surface p-8 shadow-soft space-y-7 font-mono text-xs">
        <div className="text-center pb-4 border-b border-border">
          <h2 className="text-lg font-black text-[#111111] tracking-wider uppercase">
            BUILD26 REPORT
          </h2>
          <div className="text-[11px] text-secondary mt-0.5">
            Cohort Progress & Individual Output Audit
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="divide-y divide-border/60">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-secondary font-medium">PARTICIPANTS</span>
            <span className="font-black text-sm text-[#111111]">{data.participants}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-secondary font-medium">TEAMS</span>
            <span className="font-black text-sm text-[#111111]">{data.teams}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-secondary font-medium">COMPLETED TEAMS</span>
            <span className="font-black text-sm text-emerald-700">{data.completedTeams}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-secondary font-medium">ACTIVE TEAMS</span>
            <span className="font-black text-sm text-accent">{data.activeTeams}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-secondary font-medium">FINAL SUBMISSIONS</span>
            <span className="font-black text-sm text-[#111111]">{data.finalSubmissions}</span>
          </div>
        </div>

        {/* Milestone Completion Progress */}
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="font-bold text-[#111111] text-[11px] uppercase tracking-wider">
            MILESTONE COMPLETION
          </div>

          <div className="space-y-2">
            {milestoneProgress.map((mp) => (
              <div key={mp.day} className="flex items-center justify-between gap-4">
                <span className="font-bold text-[#111111] w-20 shrink-0">{mp.day}</span>
                <span className="text-[#111111] font-mono tracking-tight flex-1 truncate">
                  {mp.bar}
                </span>
                <span className="font-bold text-right w-12 shrink-0">{mp.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Participation Metrics */}
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="font-bold text-[#111111] text-[11px] uppercase tracking-wider">
            INDIVIDUAL PARTICIPATION
          </div>
          <div className="space-y-1 text-secondary">
            <div>Total Work Logs: <span className="font-bold text-[#111111]">{data.totalWorkLogs}</span></div>
            <div>Total Recorded Hours: <span className="font-bold text-[#111111]">{data.totalHours}</span></div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center pt-4 border-t border-border">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleExport}
            className="font-bold text-xs gap-1.5 bg-[#111111] hover:bg-black text-white px-8 shadow-md"
          >
            <Download className="h-3.5 w-3.5" />
            <span>[ EXPORT REPORT ]</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
