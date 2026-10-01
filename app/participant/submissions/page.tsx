"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  UploadCloud,
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const isFinalTab = searchParams.get("tab") === "final";

  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [team, setTeam] = React.useState<any>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeModalSub, setActiveModalSub] = React.useState<any>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      const user = meRes.participant || meRes.user;
      setCurrentUser(user);

      if (meRes.team) {
        setTeam(meRes.team);
        const subRes = await fetch(`/api/submissions?teamId=${meRes.team._id}`).then((r) => r.json());
        setSubmissions(subRes.submissions || []);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Submissions Center...</div>
      </div>
    );
  }

  const currentMilestoneDay = team?.currentMilestoneDay || 1;

  // Day meta configuration
  const dayConfigs = [
    {
      day: 1,
      title: "DAY 01  TEAM + IDEA",
      subTitle: "Solution Ideation PPT",
    },
    {
      day: 2,
      title: "DAY 02  WIREFRAME",
      subTitle: "Wireframe / User Flow",
    },
    {
      day: 3,
      title: "DAY 03  BUILD",
      subTitle: "GitHub Core MVP Repository",
    },
    {
      day: 4,
      title: "DAY 04  INTEGRATION",
      subTitle: "Integration & DB Proof",
    },
    {
      day: 5,
      title: "DAY 05  TEST + POLISH",
      subTitle: "Testing & Polish Evidence",
    },
    {
      day: 6,
      title: "DAY 06  FINAL DEMO",
      subTitle: "Final Live Demo & Ship It",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Wireframe Section 29 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
              SECTION 29 — SUBMISSION CENTER
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">
              SUBMISSIONS
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              Centralized repository for all 6-day milestone deliverables and verification records.
            </p>
          </div>

          <Link href="/participant/milestones">
            <Button variant="primary" size="sm" className="font-bold text-xs gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Go to Milestone Uploader</span>
            </Button>
          </Link>
        </div>

        {/* Section 18: Empty State Banner if no submissions */}
        {submissions.length === 0 && (
          <div className="p-5 rounded-2xl border border-dashed border-border bg-surface text-center space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-secondary">
              NO SUBMISSION YET
            </div>
            <p className="text-xs text-secondary max-w-md mx-auto">
              Your team has not submitted any milestone deliverables yet. Day 01 is currently open for submission.
            </p>
            <div className="pt-1">
              <Link href="/participant/milestones?day=1">
                <Button variant="primary" size="sm" className="text-xs font-bold uppercase tracking-wider">
                  [ Submit Work ]
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Section 29 Centralized Status Cards */}
        <div className="rounded-2xl border-2 border-border bg-surface divide-y divide-border/70 shadow-soft">
          {dayConfigs.map((cfg) => {
            const existingSub = submissions.find(
              (s) => s.day === cfg.day && s.status?.toUpperCase() === "SUBMITTED"
            );
            const isSubmitted = !!existingSub;
            const isInProgress = cfg.day === currentMilestoneDay && !existingSub;
            const isLocked = cfg.day > currentMilestoneDay && !existingSub;

            const displayTitle = existingSub?.title || cfg.subTitle;
            const displayTime = existingSub
              ? new Date(existingSub.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : isInProgress
              ? "In Progress"
              : "Locked";

            return (
              <div key={cfg.day} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#111111] tracking-wide font-mono-num">
                      {cfg.title}
                    </span>

                    {isSubmitted ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Submitted
                      </span>
                    ) : isInProgress ? (
                      <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        <span>● In Progress</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-secondary bg-surface-subtle px-2 py-0.5 rounded border border-border flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  {isSubmitted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveModalSub(existingSub)}
                      className="text-xs font-bold self-start sm:self-auto"
                    >
                      [ VIEW ]
                    </Button>
                  )}

                  {isInProgress && (
                    <Link href={`/participant/milestones?day=${cfg.day}`}>
                      <Button variant="primary" size="sm" className="text-xs font-bold self-start sm:self-auto">
                        Submit Deliverable →
                      </Button>
                    </Link>
                  )}
                </div>

                {isSubmitted && (
                  <div className="text-xs text-secondary space-y-0.5 pl-0.5">
                    <div className="font-semibold text-[#111111]">{displayTitle}</div>
                    <div className="font-mono-num text-[11px]">Submitted: {displayTime}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Submission Details Modal */}
      {activeModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border-2 border-border bg-surface p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono-num font-bold text-accent uppercase">
                  DELIVERABLE DETAILS
                </span>
                <h3 className="text-lg font-black text-[#111111] mt-0.5">
                  {activeModalSub.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalSub(null)}
                className="text-secondary hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-subtle border border-border">
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold">Milestone</span>
                  <div className="font-bold text-[#111111] mt-0.5 font-mono-num">
                    Day 0{activeModalSub.day}
                  </div>
                </div>
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold">Submitter</span>
                  <div className="font-bold text-[#111111] mt-0.5">
                    {activeModalSub.submittedByName || "Participant"}
                  </div>
                </div>
              </div>

              {activeModalSub.fileUrl && (
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold">Uploaded File</span>
                  <div className="font-mono text-xs text-accent mt-0.5 p-2 rounded bg-surface-subtle border border-border">
                    {activeModalSub.fileUrl}
                  </div>
                </div>
              )}

              {activeModalSub.githubUrl && (
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold">GitHub Repository</span>
                  <a
                    href={activeModalSub.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-accent underline block mt-0.5"
                  >
                    {activeModalSub.githubUrl}
                  </a>
                </div>
              )}

              {activeModalSub.demoUrl && (
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold">Live Demo URL</span>
                  <a
                    href={activeModalSub.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-accent underline block mt-0.5"
                  >
                    {activeModalSub.demoUrl}
                  </a>
                </div>
              )}

              {activeModalSub.projectDescription && (
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold">Notes / Description</span>
                  <p className="text-xs text-secondary mt-0.5 p-3 rounded-lg bg-surface-subtle border border-border leading-relaxed">
                    {activeModalSub.projectDescription}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setActiveModalSub(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmissionsCenterPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-xs text-secondary font-mono">Loading submissions...</div>}>
      <SubmissionsContent />
    </React.Suspense>
  );
}
