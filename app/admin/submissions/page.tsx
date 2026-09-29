"use client";

import * as React from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSub, setSelectedSub] = React.useState<any>(null);
  const [reviewForm, setReviewForm] = React.useState<any>({
    status: "Approved",
    reviewNotes: "",
    scores: {
      problemUnderstanding: 9,
      innovation: 9,
      feasibility: 9,
      technicalApproach: 9,
      userImpact: 9,
    },
  });

  const fetchSubmissions = React.useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleOpenReview = (sub: any) => {
    setSelectedSub(sub);
    setReviewForm({
      status: sub.status === "Pending Review" ? "Approved" : sub.status,
      reviewNotes: sub.reviewNotes || "",
      scores: sub.scores || {
        problemUnderstanding: 9,
        innovation: 9,
        feasibility: 9,
        technicalApproach: 9,
        userImpact: 9,
      },
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSub._id,
          status: reviewForm.status,
          reviewNotes: reviewForm.reviewNotes,
          scores: reviewForm.scores,
        }),
      });

      if (res.ok) {
        setSelectedSub(null);
        fetchSubmissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalScore =
    (Number(reviewForm.scores.problemUnderstanding) || 0) +
    (Number(reviewForm.scores.innovation) || 0) +
    (Number(reviewForm.scores.feasibility) || 0) +
    (Number(reviewForm.scores.technicalApproach) || 0) +
    (Number(reviewForm.scores.userImpact) || 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Milestone Submissions & Evaluation Queue
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {submissions.length} Submissions
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Review ideation slide decks, prototype URLs, evaluate rubric scores, and approve milestone progression.
          </p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {submissions.map((sub) => (
          <div
            key={sub._id}
            className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4 hover:border-accent/40 transition-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono-num font-bold text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {sub.teamName}
                </span>
                <Badge
                  variant={
                    sub.status === "Approved"
                      ? "success"
                      : sub.status === "Pending Review"
                      ? "warning"
                      : "danger"
                  }
                >
                  {sub.status}
                </Badge>
              </div>

              <h3 className="font-bold text-sm text-[#111111]">{sub.title}</h3>
              <div className="flex items-center gap-3 text-xs text-secondary mt-1 font-mono-num">
                <span>Phase: {sub.phase}</span>
                <span>•</span>
                <span>Type: {sub.type}</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Submitted by {sub.submittedByName}</span>
                <span className="font-mono-num font-bold text-[#111111]">
                  Score: {sub.totalScore || 0}/50
                </span>
              </div>

              {sub.reviewNotes && (
                <div className="text-[11px] text-secondary italic bg-surface-subtle p-2 rounded border border-border/50">
                  &ldquo;{sub.reviewNotes}&rdquo;
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                {sub.externalLink ? (
                  <a
                    href={sub.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open Submission Deck</span>
                  </a>
                ) : (
                  <span className="text-xs text-secondary">PDF Attachment</span>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenReview(sub)}
                  className="text-xs h-8"
                >
                  Evaluate & Review
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal (Split View Rubric) */}
      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Evaluate Milestone: ${selectedSub.teamName}`}
          description={`Phase: ${selectedSub.phase} • ${selectedSub.type}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            {/* Rubric Matrix */}
            <div className="p-4 rounded-xl bg-surface-subtle/50 border border-border/80 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-[#111111] pb-2 border-b border-border/60">
                <span>Official Build26 Rubric Criteria</span>
                <span className="font-mono-num text-accent">Total Score: {totalScore} / 50</span>
              </div>

              {[
                { key: "problemUnderstanding", label: "Problem Understanding" },
                { key: "innovation", label: "Innovation & Uniqueness" },
                { key: "feasibility", label: "Technical Feasibility" },
                { key: "technicalApproach", label: "Architectural & Technical Approach" },
                { key: "userImpact", label: "Real-world User Impact" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <span className="text-secondary font-medium">{item.label} (Max 10)</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    required
                    value={reviewForm.scores[item.key] || 0}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        scores: {
                          ...reviewForm.scores,
                          [item.key]: Number(e.target.value),
                        },
                      })
                    }
                    className="w-16 h-7 rounded border border-border px-2 text-center font-mono-num font-bold text-[#111111]"
                  />
                </div>
              ))}
            </div>

            {/* Verdict Status */}
            <div>
              <label className="font-semibold text-secondary">Review Decision</label>
              <select
                value={reviewForm.status}
                onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] font-medium"
              >
                <option value="Approved">Approve Milestone (Advance Team)</option>
                <option value="Changes Requested">Request Revisions & Changes</option>
                <option value="Pending Review">Keep in Pending Review</option>
              </select>
            </div>

            {/* Review Notes */}
            <div>
              <label className="font-semibold text-secondary">Evaluator Feedback Notes</label>
              <textarea
                rows={3}
                required
                placeholder="Specific guidance for the team..."
                value={reviewForm.reviewNotes}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewNotes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setSelectedSub(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Evaluation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
