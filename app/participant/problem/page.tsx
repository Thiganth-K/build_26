"use client";

import * as React from "react";
import Link from "next/link";
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Users,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Shield,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProblemStatementsPage() {
  const [problems, setProblems] = React.useState<any[]>([]);
  const [currentTeam, setCurrentTeam] = React.useState<any>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedProblemModal, setSelectedProblemModal] = React.useState<any>(null);
  const [selecting, setSelecting] = React.useState(false);
  const [actionMsg, setActionMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [meRes, probsRes] = await Promise.all([
        fetch("/api/auth/me").then((r) => r.json()),
        fetch("/api/problem-statements").then((r) => r.json()),
      ]);

      const user = meRes.participant || meRes.user;
      setCurrentUser(user);
      setCurrentTeam(meRes.team);

      if (probsRes.problems || probsRes.problemStatements) {
        setProblems(probsRes.problems || probsRes.problemStatements);
      }
    } catch (err) {
      console.error("Error loading problem statements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isLead = Boolean(
    currentTeam &&
    (currentTeam.lead?._id === currentUser?._id ||
      currentTeam.lead === currentUser?._id ||
      currentTeam.members?.some(
        (m: any) =>
          m.isLeader &&
          (m.participant?._id?.toString() === currentUser?._id?.toString() ||
            m.participant?.toString() === (currentUser?._id || currentUser?.id)?.toString() ||
            m.participant === currentUser?._id ||
            m.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
            m.name === currentUser?.name)
      ))
  );

  const handleSelectProblem = async (problemId: string) => {
    if (!currentTeam) {
      alert("You need to be part of a team to select a problem statement.");
      return;
    }
    if (!isLead) {
      alert("Only the Team Lead can select the problem statement for your team (Rule 14).");
      return;
    }

    try {
      setSelecting(true);
      setActionMsg(null);
      const res = await fetch("/api/teams/select-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: currentTeam._id,
          problemStatementId: problemId,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setActionMsg({ type: "error", text: result.error || "Failed to select problem statement" });
      } else {
        setActionMsg({ type: "success", text: result.message || "Problem statement selected!" });
        setSelectedProblemModal(null);
        fetchData();
      }
    } catch (err) {
      setActionMsg({ type: "error", text: "Network error selecting problem statement" });
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Problem Statements...</div>
      </div>
    );
  }

  const selectedProblemId = currentTeam?.problemStatement?._id || currentTeam?.problemStatement;
  const currentSelectedProblem = problems.find(
    (p) => p._id === selectedProblemId || p.title === currentTeam?.problemStatement?.title
  );

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
              SECTION 18 — BUILD26 PROBLEM STATEMENTS
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">
              PROBLEM STATEMENTS
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              Admin published challenge tracks for the 6-day product building bootcamp.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/participant/milestones">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                <span>View Milestones</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {actionMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              actionMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {actionMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span className="font-medium">{actionMsg.text}</span>
          </div>
        )}

        {/* Wireframe Section 20: SELECTED PROBLEM CARD (if already chosen) */}
        {currentSelectedProblem && (
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>✓ PROBLEM STATEMENT SELECTED</span>
              </div>
              <Badge variant="success" size="sm">
                Active Track
              </Badge>
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#111111] tracking-tight">
                {currentSelectedProblem.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-secondary mt-2">
                <div>
                  <span className="font-medium">Selected by:</span>{" "}
                  <span className="font-bold text-[#111111]">
                    👑 {currentTeam?.lead?.name || currentUser?.name || "Team Lead"}
                  </span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div>
                  <span className="font-medium">Team:</span>{" "}
                  <span className="font-bold text-[#111111]">{currentTeam?.name}</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  <span className="font-bold text-accent">{currentSelectedProblem.category}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                ⚠ Once finalized, changing the problem statement may require Team Lead / Admin permission.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProblemModal(currentSelectedProblem)}
                className="gap-1.5 text-xs font-bold"
              >
                <Eye className="h-3 w-3" />
                <span>[ VIEW DETAILS ]</span>
              </Button>
            </div>
          </div>
        )}

        {/* Wireframe Section 18: AVAILABLE STATEMENTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wider">
              AVAILABLE STATEMENTS
            </h3>
            <span className="text-xs text-secondary font-mono-num">
              {problems.length} Challenges Published
            </span>
          </div>

          <div className="space-y-4">
            {problems.map((problem, index) => {
              const isThisSelected =
                currentSelectedProblem?._id === problem._id ||
                currentTeam?.problemStatement?.title === problem.title;
              const statementId = `#0${index + 1}`;

              return (
                <div
                  key={problem._id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isThisSelected
                      ? "border-emerald-400 bg-emerald-50/20 shadow-sm"
                      : "border-border bg-surface hover:border-black/20 shadow-2xs"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono-num font-bold text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
                          {statementId}
                        </span>
                        <h4 className="text-base font-black text-[#111111] tracking-tight">
                          {problem.title.toUpperCase()}
                        </h4>
                      </div>

                      <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                        {problem.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="text-secondary font-medium">Category:</span>
                        <Badge variant="secondary" size="sm">
                          {problem.category}
                        </Badge>

                        {problem.difficulty && (
                          <span className="text-[11px] font-mono-num font-semibold text-secondary px-2 py-0.5 rounded bg-surface-subtle border border-border">
                            Level: {problem.difficulty}
                          </span>
                        )}

                        {isThisSelected && (
                          <Badge variant="success" size="sm" className="gap-1 font-bold">
                            <Check className="h-3 w-3" />
                            <span>Currently Selected</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProblemModal(problem)}
                        className="text-xs font-bold"
                      >
                        [ VIEW ]
                      </Button>

                      <Button
                        variant={isThisSelected ? "secondary" : "primary"}
                        size="sm"
                        disabled={isThisSelected || selecting || !isLead}
                        onClick={() => handleSelectProblem(problem._id)}
                        title={!isLead ? "Only Team Lead can select problem" : ""}
                        className="text-xs font-bold"
                      >
                        {isThisSelected ? "✓ SELECTED" : "[ SELECT ]"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Wireframe Section 19: PROBLEM STATEMENT DETAILS MODAL */}
      {selectedProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-border bg-surface p-7 shadow-2xl space-y-6 animate-in fade-in-50 zoom-in-95">
            <div className="pb-4 border-b border-border/80 flex items-start justify-between">
              <div>
                <span className="font-mono-num text-[11px] font-bold text-accent uppercase tracking-wider">
                  PROBLEM STATEMENT DETAILS
                </span>
                <h3 className="text-xl font-black text-[#111111] tracking-tight mt-1">
                  {selectedProblemModal.title.toUpperCase()}
                </h3>
                <span className="text-xs font-semibold text-secondary">
                  Category: {selectedProblemModal.category}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProblemModal(null)}
                className="text-secondary hover:text-black font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Section 19 Required Content Blocks */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  PROBLEM DESCRIPTION
                </div>
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-secondary leading-relaxed">
                  {selectedProblemModal.description}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  TARGET USERS
                </div>
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-secondary leading-relaxed">
                  {selectedProblemModal.targetUsers || "Students, faculty, researchers, and campus visitors."}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  EXPECTED OUTCOME
                </div>
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-secondary leading-relaxed">
                  {selectedProblemModal.expectedOutcome || "A functional web prototype with interactive workflows and presentation deck."}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  CONSTRAINTS
                </div>
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-secondary leading-relaxed">
                  {selectedProblemModal.constraints || "Modern responsive web stack; must complete milestone gates within 6-day sprint."}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProblemModal(null)}
              >
                Close
              </Button>

              <Button
                variant="primary"
                size="sm"
                disabled={
                  currentSelectedProblem?._id === selectedProblemModal._id ||
                  selecting ||
                  !isLead
                }
                onClick={() => handleSelectProblem(selectedProblemModal._id)}
                className="font-bold text-xs"
              >
                {currentSelectedProblem?._id === selectedProblemModal._id
                  ? "✓ CURRENTLY SELECTED"
                  : isLead
                  ? "[ SELECT THIS PROBLEM ]"
                  : "Lead Only Can Select"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
