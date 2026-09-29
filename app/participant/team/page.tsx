"use client";

import * as React from "react";
import { Users, Lightbulb, Cpu, Code2, ExternalLink, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

export default function ParticipantTeamPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((res) => {
        const team = res.teams?.[0];
        if (team) {
          fetch(`/api/teams/${team._id}`)
            .then((r) => r.json())
            .then((detail) => setData(detail));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data?.team) {
    return <div className="p-8 text-center text-xs text-secondary">Loading team space...</div>;
  }

  const { team } = data;
  const problem = team.problemStatement;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">{team.name}</h1>
            <Badge variant="accent">{team.code}</Badge>
            <Badge variant="success">Phase: {team.currentPhase}</Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Participant collaboration space for roster roles, challenge problem, and solution architecture.
          </p>
        </div>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Assigned Problem Challenge
            </h3>
          </div>
          <h4 className="font-bold text-sm text-[#111111]">
            {problem?.title || "Problem Statement"}
          </h4>
          <p className="text-xs text-secondary leading-relaxed">{problem?.description}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Cpu className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Solution Architecture
            </h3>
          </div>
          <h4 className="font-bold text-sm text-[#111111]">
            {team.solutionTitle || "Solution Concept"}
          </h4>
          <p className="text-xs text-secondary leading-relaxed">{team.solutionDescription}</p>

          <div className="flex flex-wrap gap-1 pt-2">
            {team.techStack?.map((t: string) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-[11px] font-mono-num text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Roster Members */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
          Team Roster & Specializations ({team.members?.length || 0}/4)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.members?.map((m: any, i: number) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-border bg-surface-subtle/40 flex items-start gap-3"
            >
              <Avatar name={m.name} size="md" />
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#111111]">{m.name}</div>
                <div className="text-[11px] font-semibold text-accent mt-0.5">{m.role}</div>
                <div className="text-[10px] text-secondary truncate mt-0.5">{m.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
