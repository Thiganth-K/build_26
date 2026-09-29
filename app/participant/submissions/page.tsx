"use client";

import * as React from "react";
import { Plus, UploadCloud, CheckCircle2, AlertTriangle, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubmissionModal } from "@/components/participant/SubmissionModal";

export default function ParticipantSubmissionsPage() {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [team, setTeam] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      const teamsRes = await fetch("/api/teams").then((r) => r.json());
      const firstTeam = teamsRes.teams?.[0];
      if (firstTeam) {
        setTeam(firstTeam);
        const subRes = await fetch(`/api/submissions?teamId=${firstTeam._id}`).then((r) => r.json());
        setSubmissions(subRes.submissions || []);
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

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Milestone Submissions
            </h1>
            <Badge variant="accent">{team?.name || "Team Alpha"}</Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Official delivery gates: Ideation decks, problem analysis, and final pitch demos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Upload Deliverable</span>
        </Button>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub._id}
            className="p-5 rounded-xl border border-border bg-surface shadow-soft space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#111111]">{sub.title}</h3>
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
                <div className="text-xs text-secondary mt-0.5 font-mono-num">
                  Phase: {sub.phase} • Type: {sub.type}
                </div>
              </div>

              {sub.totalScore > 0 && (
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-secondary">
                    Review Score
                  </div>
                  <div className="text-xl font-bold font-mono-num text-accent">
                    {sub.totalScore} / 50
                  </div>
                </div>
              )}
            </div>

            {sub.reviewNotes && (
              <div className="p-3 rounded-lg bg-surface-subtle text-xs text-secondary italic border border-border/60">
                &ldquo;{sub.reviewNotes}&rdquo;
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-secondary">Submitted by {sub.submittedByName}</span>
              {sub.externalLink && (
                <a
                  href={sub.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-semibold text-accent hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Uploaded Deck / Repo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        teamId={team?._id}
        currentPhase={team?.currentPhase}
      />
    </div>
  );
}
