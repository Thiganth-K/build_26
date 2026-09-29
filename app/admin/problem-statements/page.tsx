"use client";

import * as React from "react";
import { Plus, Search, Lightbulb, Users, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuickActionModal } from "@/components/admin/QuickActionModal";

export default function ProblemStatementsPage() {
  const [problems, setProblems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchProblems = React.useCallback(async () => {
    try {
      const res = await fetch("/api/problem-statements");
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const categories = [
    "all",
    "Campus",
    "Education",
    "Finance",
    "Accessibility",
    "Sustainability",
    "Healthcare",
    "Productivity",
    "AI",
  ];

  const filteredProblems = problems.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Problem Statements & Challenges
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {problems.length} Statements
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Real-world product challenges curated for Build26 bootcamp teams.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Problem Statement</span>
        </Button>
      </div>

      {/* Toolbar: Category pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#111111] text-white shadow-xs font-semibold"
                  : "bg-surface text-secondary hover:text-[#111111] border border-border/70 hover:bg-surface-subtle"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-surface text-[#111111] placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProblems.map((prob) => {
          const assignedCount = prob.assignedTeams?.length || 0;
          const maxTeams = prob.maxTeams || 3;

          return (
            <div
              key={prob._id}
              className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4 hover:border-accent/40 transition-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="secondary">{prob.category}</Badge>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        prob.difficulty === "Advanced"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : prob.difficulty === "Intermediate"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                    <span className="text-[11px] font-mono-num font-semibold text-secondary">
                      {assignedCount}/{maxTeams} Teams
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#111111] tracking-tight">{prob.title}</h3>
                <p className="text-xs text-secondary mt-1.5 leading-relaxed">{prob.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/60">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-surface-subtle/50 border border-border/50">
                    <span className="text-[10px] font-bold uppercase text-secondary block">
                      Target Audience
                    </span>
                    <span className="font-medium text-[#111111] truncate block mt-0.5">
                      {prob.targetUsers}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-subtle/50 border border-border/50">
                    <span className="text-[10px] font-bold uppercase text-secondary block">
                      Constraints
                    </span>
                    <span className="font-medium text-[#111111] truncate block mt-0.5">
                      {prob.constraints}
                    </span>
                  </div>
                </div>

                {/* Assigned Teams */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-secondary block mb-1">
                    Assigned Bootcamp Teams:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {prob.assignedTeams && prob.assignedTeams.length > 0 ? (
                      prob.assignedTeams.map((team: any) => (
                        <span
                          key={team._id}
                          className="px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold text-[11px] font-mono-num border border-accent/20"
                        >
                          {team.name} ({team.currentPhase})
                        </span>
                      ))
                    ) : (
                      <span className="text-secondary text-[11px] italic">No teams assigned yet</span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {prob.tags && prob.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {prob.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] text-secondary bg-surface-subtle px-1.5 py-0.5 rounded font-mono-num"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <QuickActionModal
        actionType={isModalOpen ? "add_problem" : null}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProblems}
      />
    </div>
  );
}
