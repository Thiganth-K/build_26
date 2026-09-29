"use client";

import * as React from "react";
import { Trophy, ExternalLink, Code2, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default function ShowcasePage() {
  const [teams, setTeams] = React.useState<any[]>([]);
  const [evaluations, setEvaluations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      const [teamsRes, evalRes] = await Promise.all([
        fetch("/api/teams").then((r) => r.json()),
        fetch("/api/evaluations").then((r) => r.json()),
      ]);
      setTeams(teamsRes.teams || []);
      setEvaluations(evalRes.evaluations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTeamScore = (teamId: string) => {
    const ev = evaluations.find((e) => (e.team?._id || e.team) === teamId);
    return ev ? ev.totalWeightedScore : null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#111111]">
            Build26 Product Showcase & Hall of Fame
          </h1>
          <Badge variant="accent" className="font-mono-num text-[11px]">
            Final Demos
          </Badge>
        </div>
        <p className="text-xs text-secondary mt-1">
          Graduated solutions built from scratch during Build26. Fully functional, verified software products with source code and live previews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t) => {
          const score = getTeamScore(t._id);
          return (
            <div
              key={t._id}
              className="rounded-2xl border border-border bg-surface p-6 shadow-soft hover:border-accent/40 transition-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-num font-bold text-xs text-secondary bg-surface-subtle px-2 py-0.5 rounded border border-border/60">
                    {t.code}
                  </span>
                  {score !== null ? (
                    <span className="text-xs font-black font-mono-num text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      ★ {score}/100
                    </span>
                  ) : (
                    <Badge variant="secondary">In Build</Badge>
                  )}
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  {t.name}
                </div>
                <h3 className="font-black text-base text-[#111111] mt-0.5">
                  {t.solutionTitle || t.name}
                </h3>

                <p className="text-xs text-secondary mt-2 line-clamp-3 leading-relaxed">
                  {t.solutionDescription ||
                    "A high-impact technology solution engineered during the intensive Build26 sprint."}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {t.techStack?.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-surface-subtle border border-border/60 text-[10px] text-secondary font-mono-num"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 space-y-4">
                {/* Team Members */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {t.members?.slice(0, 4).map((m: any, idx: number) => (
                      <Avatar key={idx} name={m.name} size="sm" className="ring-1 ring-white" />
                    ))}
                  </div>
                  <span className="text-[11px] text-secondary font-mono-num">
                    {t.members?.length || 0} Engineers
                  </span>
                </div>

                {/* Links */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-3">
                    {t.githubUrl && (
                      <a
                        href={t.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary hover:text-[#111111]"
                        title="GitHub Repository"
                      >
                        <Code2 className="h-4 w-4" />
                      </a>
                    )}
                    {t.presentationUrl && (
                      <a
                        href={t.presentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary hover:text-[#111111]"
                        title="Presentation Slides"
                      >
                        <FileText className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {t.demoUrl ? (
                    <a
                      href={t.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#111111] hover:bg-accent transition-colors"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-secondary text-[11px] italic">Building Demo</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
