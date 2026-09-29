"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

interface TeamTableProps {
  teams: any[];
  onTeamClick?: (teamId: string) => void;
}

export function TeamTable({ teams = [], onTeamClick }: TeamTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [phaseFilter, setPhaseFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.solutionTitle && t.solutionTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPhase = phaseFilter === "all" || t.currentPhase === phaseFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesPhase && matchesStatus;
  });

  return (
    <div className="rounded-xl border border-border bg-surface shadow-soft overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[#111111]">Team Operations Matrix</h2>
          <Badge variant="secondary" className="font-mono-num text-[11px]">
            {filteredTeams.length} of {teams.length} Teams
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-surface-subtle/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent text-[#111111] placeholder:text-secondary/70 w-44 sm:w-56 transition-all"
            />
          </div>

          {/* Phase Filter */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Phases</option>
            <option value="Problem Understanding">Problem Discovery</option>
            <option value="Ideation">Ideation</option>
            <option value="Validation">Validation</option>
            <option value="Build">Build</option>
            <option value="Testing">Testing</option>
            <option value="Final Demo">Final Demo</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active (On Track)</option>
            <option value="NEEDS_ATTENTION">Needs Attention</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-subtle/60 border-b border-border/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-3">Members</th>
              <th className="py-3 px-4">Problem Challenge</th>
              <th className="py-3 px-3">Phase</th>
              <th className="py-3 px-4 w-32">Progress</th>
              <th className="py-3 px-3">Last Activity</th>
              <th className="py-3 px-3">Mentor</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-secondary">
                  No matching teams found.
                </td>
              </tr>
            ) : (
              filteredTeams.map((team) => {
                const memberCount = team.members?.length || 0;
                const problemTitle =
                  team.problemStatement?.title || team.solutionTitle || "Problem Not Assigned";
                const mentorName = team.mentor?.name || "Unassigned";

                return (
                  <tr
                    key={team._id}
                    className="hover:bg-surface-subtle/40 transition-colors group cursor-pointer"
                    onClick={() => onTeamClick?.(team._id)}
                  >
                    {/* Team Name + Code + Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {team.status === "ACTIVE" ? (
                          <span
                            title="Active: On Track"
                            className="flex items-center text-emerald-600 gap-1 text-[11px] font-medium"
                          >
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          </span>
                        ) : team.status === "NEEDS_ATTENTION" ? (
                          <span
                            title="Needs Attention: Inactivity or missing work"
                            className="flex items-center text-amber-600 gap-1 text-[11px] font-medium"
                          >
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          </span>
                        ) : (
                          <span
                            title="Inactive"
                            className="flex items-center text-rose-600 gap-1 text-[11px] font-medium"
                          >
                            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                          </span>
                        )}

                        <div>
                          <div className="font-semibold text-[#111111] group-hover:text-accent flex items-center gap-1.5 transition-colors">
                            {team.name}
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[10px] font-mono-num text-secondary">
                            {team.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Members */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {team.members?.slice(0, 3).map((m: any, idx: number) => (
                            <Avatar key={idx} name={m.name} size="sm" className="ring-1 ring-white" />
                          ))}
                        </div>
                        <span className="text-[11px] text-secondary font-mono-num">
                          {memberCount}/4
                        </span>
                      </div>
                    </td>

                    {/* Problem Statement */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="truncate font-medium text-[#111111]" title={problemTitle}>
                        {problemTitle}
                      </div>
                      {team.solutionTitle && (
                        <div className="truncate text-[10px] text-secondary">
                          Sol: {team.solutionTitle}
                        </div>
                      )}
                    </td>

                    {/* Phase */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <Badge
                        variant={
                          team.currentPhase === "Build" || team.currentPhase === "Testing"
                            ? "accent"
                            : team.currentPhase === "Final Demo"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {team.currentPhase}
                      </Badge>
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={team.progress || 0} color="accent" className="h-1.5 flex-1" />
                        <span className="font-mono-num font-semibold text-[11px] text-[#111111] w-7 text-right">
                          {team.progress || 0}%
                        </span>
                      </div>
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-3 text-secondary whitespace-nowrap">
                      {formatRelativeTime(team.lastActivityAt)}
                    </td>

                    {/* Mentor */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-secondary font-medium">{mentorName}</span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/teams/${team._id}`}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-border hover:bg-surface-subtle text-[#111111] transition-all"
                        >
                          Command
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
