"use client";

import * as React from "react";
import { Award, CheckCircle2, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress";

export default function EvaluationPage() {
  const [evaluations, setEvaluations] = React.useState<any[]>([]);
  const [teams, setTeams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [evalModalOpen, setEvalModalOpen] = React.useState(false);
  const [selectedTeamId, setSelectedTeamId] = React.useState("");

  const defaultCriteria = [
    { criteriaName: "Problem Understanding", weightPercent: 20, score: 9 },
    { criteriaName: "Innovation & Differentiation", weightPercent: 20, score: 9 },
    { criteriaName: "Solution Quality & Feasibility", weightPercent: 20, score: 9 },
    { criteriaName: "Technical Implementation", weightPercent: 20, score: 9 },
    { criteriaName: "Presentation & Pitch Delivery", weightPercent: 10, score: 9 },
    { criteriaName: "Team Collaboration & Discipline", weightPercent: 10, score: 9 },
  ];

  const [criteriaForm, setCriteriaForm] = React.useState(defaultCriteria);
  const [reviewerNotes, setReviewerNotes] = React.useState("");

  const fetchData = React.useCallback(async () => {
    try {
      const [evalRes, teamsRes] = await Promise.all([
        fetch("/api/evaluations").then((r) => r.json()),
        fetch("/api/teams").then((r) => r.json()),
      ]);
      setEvaluations(evalRes.evaluations || []);
      setTeams(teamsRes.teams || []);
      if (teamsRes.teams?.length > 0) {
        setSelectedTeamId(teamsRes.teams[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScoreChange = (index: number, val: number) => {
    const updated = [...criteriaForm];
    updated[index].score = val;
    setCriteriaForm(updated);
  };

  const calculatePreviewScore = () => {
    let total = 0;
    for (const c of criteriaForm) {
      total += (c.score * 10) * (c.weightPercent / 100);
    }
    return Math.round(total * 10) / 10;
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedTeamId,
          round: "Final Evaluation",
          criteriaScores: criteriaForm,
          reviewerNotes,
          status: "Published",
        }),
      });

      if (res.ok) {
        setEvalModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Bootcamp Official Evaluation Matrix
            </h1>
            <Badge variant="accent" className="font-mono-num text-[11px]">
              Weighted 100% Scale
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Standardized judging panel rubric: Technical Architecture (20%), Problem Understanding (20%), Innovation (20%), Solution Feasibility (20%), Pitch (10%), Collaboration (10%).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setEvalModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Record Team Evaluation</span>
        </Button>
      </div>

      {/* Evaluations Leaderboard */}
      <div className="space-y-4">
        {evaluations.map((ev, rank) => (
          <div
            key={ev._id}
            className="p-5 rounded-xl border border-border bg-surface shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-mono-num font-bold text-sm shrink-0">
                #{rank + 1}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#111111]">{ev.teamName}</h3>
                  <Badge variant="success">{ev.status}</Badge>
                </div>
                <div className="text-xs text-secondary mt-0.5">
                  Round: {ev.round} • Evaluated by {ev.evaluatedByName}
                </div>
                {ev.reviewerNotes && (
                  <p className="text-xs text-secondary mt-2 italic max-w-xl">
                    &ldquo;{ev.reviewerNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                {ev.criteriaScores?.slice(0, 3).map((c: any, i: number) => (
                  <div key={i} className="p-2 rounded bg-surface-subtle border border-border/50">
                    <div className="text-[10px] text-secondary font-bold truncate">
                      {c.criteriaName.split(" ")[0]}
                    </div>
                    <div className="text-xs font-mono-num font-bold text-[#111111]">
                      {c.score}/10
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right pl-4 sm:border-l border-border/80">
                <div className="text-[10px] uppercase font-bold text-secondary">
                  Final Composite Score
                </div>
                <div className="text-2xl font-black font-mono-num text-accent">
                  {ev.totalWeightedScore}
                  <span className="text-xs text-secondary font-normal"> / 100</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Modal */}
      <Modal
        isOpen={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        title="Record Final Jury Evaluation"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitEvaluation} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-secondary">Select Team</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            >
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle/50 border border-border space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border font-bold">
              <span>Rubric Dimensions</span>
              <span className="font-mono-num text-accent">
                Composite: {calculatePreviewScore()}/100
              </span>
            </div>

            {criteriaForm.map((c, idx) => (
              <div key={c.criteriaName} className="flex items-center justify-between gap-3">
                <span className="text-secondary font-medium">
                  {c.criteriaName} ({c.weightPercent}%)
                </span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={c.score}
                  onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                  className="w-16 h-7 rounded border border-border px-2 text-center font-mono-num font-bold text-[#111111]"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="font-semibold text-secondary">Jury Deliberation Notes</label>
            <textarea
              rows={3}
              placeholder="Final jury commentary on architecture and market readiness..."
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setEvalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Evaluation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
