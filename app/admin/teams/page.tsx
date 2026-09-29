"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Briefcase, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { QuickActionModal } from "@/components/admin/QuickActionModal";
import { formatRelativeTime } from "@/lib/utils";

export default function TeamsListPage() {
  const router = useRouter();
  const [teams, setTeams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchTeams = React.useCallback(async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      (t.solutionTitle && t.solutionTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Bootcamp Teams
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {teams.length} Registered
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Manage multidisciplinary teams, review roster allocations, track solutions, and assign mentors.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Team</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams by name, code, or solution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-border bg-surface text-[#111111] placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team._id}
            onClick={() => router.push(`/admin/teams/${team._id}`)}
            className="rounded-xl border border-border bg-surface p-5 shadow-soft hover:border-accent/40 transition-card cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono-num text-[11px] font-semibold text-secondary px-2 py-0.5 rounded bg-surface-subtle border border-border/60">
                  {team.code}
                </span>
                <Badge variant={team.status === "ACTIVE" ? "success" : "warning"}>
                  {team.status === "ACTIVE" ? "Active" : "Needs Attention"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#111111] tracking-tight group-hover:text-accent">
                  {team.name}
                </h3>
                <ArrowUpRight className="h-3.5 w-3.5 text-secondary opacity-60" />
              </div>

              <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                {team.solutionTitle || team.problemStatement?.title || "Challenge in progress"}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-medium">Phase: {team.currentPhase}</span>
                <span className="font-mono-num font-bold text-accent">{team.progress}%</span>
              </div>
              <ProgressBar value={team.progress} color="accent" className="h-1.5" />

              <div className="flex items-center justify-between pt-1">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {team.members?.slice(0, 4).map((m: any, idx: number) => (
                    <Avatar key={idx} name={m.name} size="sm" className="ring-1 ring-white" />
                  ))}
                </div>
                <span className="text-[11px] text-secondary font-mono-num">
                  {team.members?.length || 0}/4 Members
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickActionModal
        actionType={isModalOpen ? "create_team" : null}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTeams}
      />
    </div>
  );
}
