"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Briefcase,
  Lightbulb,
  FileText,
  Megaphone,
  UploadCloud,
  GraduationCap,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<{
    teams: any[];
    participants: any[];
    problems: any[];
    submissions: any[];
  }>({
    teams: [],
    participants: [],
    problems: [],
    submissions: [],
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults({ teams: [], participants: [], problems: [], submissions: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [teamsRes, partsRes, probsRes] = await Promise.all([
          fetch(`/api/teams?search=${encodeURIComponent(query)}`).then((r) => r.json()),
          fetch(`/api/participants?search=${encodeURIComponent(query)}`).then((r) => r.json()),
          fetch(`/api/problem-statements?search=${encodeURIComponent(query)}`).then((r) => r.json()),
        ]);

        setResults({
          teams: teamsRes.teams?.slice(0, 4) || [],
          participants: partsRes.participants?.slice(0, 4) || [],
          problems: probsRes.problems?.slice(0, 4) || [],
          submissions: [],
        });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    router.push(url);
    onClose();
  };

  const totalResults =
    results.teams.length + results.participants.length + results.problems.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl bg-surface border border-border shadow-elevated overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border/80">
          <Search className="h-4 w-4 text-secondary shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type to search teams, participants, problems, work logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-3 pr-2 text-sm bg-transparent focus:outline-none text-[#111111] placeholder:text-secondary/70"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="text-[10px] font-mono-num px-1.5 py-0.5 rounded border border-border text-secondary bg-surface-subtle">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {loading && (
            <div className="py-6 text-center text-xs text-secondary">
              Searching bootcamp database...
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-secondary">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {!query && (
            <div className="py-6 text-xs text-secondary space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary/70 px-2">
                Quick Navigation
              </div>
              <button
                onClick={() => navigateTo("/admin/teams")}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-subtle text-[#111111] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-secondary" />
                  <span>Browse All 10 Teams</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-secondary" />
              </button>
              <button
                onClick={() => navigateTo("/admin/problem-statements")}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-subtle text-[#111111] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-secondary" />
                  <span>Explore Problem Statements</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-secondary" />
              </button>
              <button
                onClick={() => navigateTo("/admin/schedule")}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-subtle text-[#111111] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary" />
                  <span>Bootcamp Timeline & Milestones</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-secondary" />
              </button>
            </div>
          )}

          {/* Teams Results */}
          {results.teams.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-secondary/70 px-2 pb-1">
                Teams
              </div>
              <div className="space-y-1">
                {results.teams.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => navigateTo(`/admin/teams/${t._id}`)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-subtle text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#111111]">{t.name}</div>
                      <div className="text-[10px] text-secondary font-mono-num">
                        {t.code} • Phase: {t.currentPhase} • {t.progress}%
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-secondary" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Participants Results */}
          {results.participants.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-secondary/70 px-2 pb-1">
                Participants
              </div>
              <div className="space-y-1">
                {results.participants.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => navigateTo(`/admin/participants`)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-subtle text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#111111]">{p.name}</div>
                      <div className="text-[10px] text-secondary">
                        {p.roleInTeam} • {p.department} ({p.year})
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-secondary" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Problems Results */}
          {results.problems.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-secondary/70 px-2 pb-1">
                Problem Statements
              </div>
              <div className="space-y-1">
                {results.problems.map((pr) => (
                  <button
                    key={pr._id}
                    onClick={() => navigateTo(`/admin/problem-statements`)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-subtle text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#111111]">{pr.title}</div>
                      <div className="text-[10px] text-secondary">
                        Category: {pr.category} • Difficulty: {pr.difficulty}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-secondary" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
