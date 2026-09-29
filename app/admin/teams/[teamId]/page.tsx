"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Lightbulb,
  Cpu,
  TrendingUp,
  FileText,
  UploadCloud,
  MessageSquare,
  Award,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Edit3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.teamId as string;

  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [feedbackForm, setFeedbackForm] = React.useState({
    mentorName: "Dr. Kumar Sundaram",
    rating: 5,
    generalFeedback: "",
    strengths: "",
    areasOfImprovement: "",
    actionItems: "",
  });

  const fetchTeam = React.useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  React.useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          mentorName: feedbackForm.mentorName,
          rating: feedbackForm.rating,
          generalFeedback: feedbackForm.generalFeedback,
          strengths: feedbackForm.strengths,
          areasOfImprovement: feedbackForm.areasOfImprovement,
          actionItems: feedbackForm.actionItems,
        }),
      });

      if (res.ok) {
        setFeedbackModalOpen(false);
        fetchTeam();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProgress = async (newProgress: number, newPhase?: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: any = { progress: newProgress };
      if (newPhase) body.currentPhase = newPhase;

      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchTeam();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-secondary text-sm">
        Loading team command workspace...
      </div>
    );
  }

  if (!data?.team) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="text-sm font-semibold text-rose-600">Team not found</div>
        <Link href="/admin/teams">
          <Button variant="outline" size="sm">
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  const { team, workLogs = [], tasks = [], submissions = [], feedback = [], evaluation } = data;
  const problem = team.problemStatement;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/teams"
          className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Teams</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/participant">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-secondary" />
              <span>View Participant Workspace</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setFeedbackModalOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Mentor Feedback</span>
          </Button>
        </div>
      </div>

      {/* Team Command Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono-num text-[11px] font-bold px-2 py-0.5 rounded bg-surface-subtle border border-border text-secondary uppercase">
                {team.code}
              </span>
              <Badge variant={team.status === "ACTIVE" ? "success" : "warning"}>
                {team.status === "ACTIVE" ? "🟢 Active & On Track" : "🟡 Needs Attention"}
              </Badge>
              <Badge variant="accent">{team.currentPhase}</Badge>
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">{team.name}</h1>
            <p className="text-xs text-secondary mt-1 max-w-xl">
              {team.solutionTitle ? `${team.solutionTitle} — ` : ""}
              {team.solutionDescription || "Autonomous product engineering sprint."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 bg-surface-subtle/50 p-4 rounded-xl border border-border/80">
            <div>
              <div className="text-[10px] uppercase font-bold text-secondary">Roster</div>
              <div className="text-base font-bold text-[#111111] font-mono-num">
                {team.members?.length || 0} Members
              </div>
            </div>
            <div className="h-8 w-px bg-border/70" />
            <div>
              <div className="text-[10px] uppercase font-bold text-secondary">Assigned Mentor</div>
              <div className="text-sm font-semibold text-[#111111]">
                {team.mentor?.name || "Unassigned"}
              </div>
            </div>
            <div className="h-8 w-px bg-border/70" />
            <div>
              <div className="text-[10px] uppercase font-bold text-secondary">Milestone Progress</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-accent font-mono-num">{team.progress}%</span>
                <ProgressBar value={team.progress} color="accent" className="w-20 h-1.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links & Stack */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-medium">Stack:</span>
            {team.techStack?.map((t: string) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border/60 text-secondary font-mono-num text-[11px]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {team.githubUrl && (
              <a
                href={team.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-secondary hover:text-[#111111] font-medium"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>GitHub Repo</span>
              </a>
            )}
            {team.presentationUrl && (
              <a
                href={team.presentationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-secondary hover:text-[#111111] font-medium"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Pitch Deck</span>
              </a>
            )}
            {team.demoUrl && (
              <a
                href={team.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-accent font-semibold hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live Prototype</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Problem & Solution Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Statement Card */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Challenge Statement
            </h3>
            {problem && <Badge variant="secondary">{problem.category}</Badge>}
          </div>

          {problem ? (
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold text-sm text-[#111111]">{problem.title}</div>
                <p className="text-secondary mt-1 leading-relaxed">{problem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-surface-subtle/50 border border-border/60">
                  <div className="text-[10px] font-bold uppercase text-secondary">Target Users</div>
                  <div className="text-xs font-medium text-[#111111] mt-0.5">
                    {problem.targetUsers}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle/50 border border-border/60">
                  <div className="text-[10px] font-bold uppercase text-secondary">Constraints</div>
                  <div className="text-xs font-medium text-[#111111] mt-0.5">
                    {problem.constraints}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-secondary py-4">No challenge assigned yet.</div>
          )}
        </div>

        {/* Proposed Solution Card */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Cpu className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Architected Solution
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="font-semibold text-sm text-[#111111]">
                {team.solutionTitle || "Solution Architecture in Progress"}
              </div>
              <p className="text-secondary mt-1 leading-relaxed">
                {team.solutionDescription ||
                  "The team is synthesizing user needs into a concrete engineering proposal."}
              </p>
            </div>

            {team.coreFeatures && team.coreFeatures.length > 0 && (
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase text-secondary mb-1.5">
                  Core Differentiators & Features
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {team.coreFeatures.map((feat: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs text-[#111111] bg-surface-subtle/40 p-1.5 rounded-md border border-border/50"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Members Roster */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Team Members & Allocated Roles ({team.members?.length || 0}/4)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.members?.map((member: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border bg-surface-subtle/30 flex items-start gap-3"
            >
              <Avatar name={member.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111] truncate">{member.name}</span>
                  {member.isLeader && (
                    <Badge variant="accent" size="sm" className="text-[9px]">
                      Lead
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] font-medium text-accent mt-0.5">{member.role}</div>
                <div className="text-[10px] text-secondary truncate mt-0.5">{member.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions & Mentor Feedback Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions History */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Milestone Submissions ({submissions.length})
              </h3>
            </div>
            <Link
              href="/admin/submissions"
              className="text-[11px] text-accent font-semibold hover:underline"
            >
              Review Queue
            </Link>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-xs text-secondary">
                No submissions uploaded yet.
              </div>
            ) : (
              submissions.map((sub: any) => (
                <div
                  key={sub._id}
                  className="p-3 rounded-lg border border-border/80 bg-surface-subtle/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#111111]">{sub.title}</span>
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
                  <div className="text-[11px] text-secondary flex items-center gap-3">
                    <span>Type: {sub.type}</span>
                    {sub.totalScore > 0 && (
                      <span className="font-mono-num font-semibold text-[#111111]">
                        Score: {sub.totalScore}/50
                      </span>
                    )}
                  </div>
                  {sub.reviewNotes && (
                    <p className="text-[11px] text-secondary bg-surface p-2 rounded border border-border/50 italic">
                      &ldquo;{sub.reviewNotes}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mentor Feedback Feed */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Mentor Feedback History ({feedback.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {feedback.length === 0 ? (
              <div className="text-center py-8 text-xs text-secondary">
                No mentor feedback logged yet.
              </div>
            ) : (
              feedback.map((fb: any) => (
                <div
                  key={fb._id}
                  className="p-3 rounded-lg border border-border/80 bg-surface-subtle/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#111111]">{fb.mentorName}</span>
                    <span className="text-[11px] font-bold text-amber-600 font-mono-num">
                      ★ {fb.rating}/5
                    </span>
                  </div>
                  <p className="text-[11px] text-[#111111] leading-relaxed">
                    {fb.generalFeedback}
                  </p>
                  {fb.actionItems && fb.actionItems.length > 0 && (
                    <div className="pt-1 text-[10px] text-secondary space-y-0.5">
                      <div className="font-semibold uppercase tracking-wider text-secondary">
                        Action Items:
                      </div>
                      {fb.actionItems.map((item: string, i: number) => (
                        <div key={i}>• {item}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Work Logs Section */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Daily Work Logs ({workLogs.length})
            </h3>
          </div>
          <Link
            href="/admin/worklogs"
            className="text-[11px] text-accent font-semibold hover:underline"
          >
            All Work Logs
          </Link>
        </div>

        <div className="space-y-3">
          {workLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-secondary">
              No daily work logs recorded for this team yet.
            </div>
          ) : (
            workLogs.map((log: any) => (
              <div
                key={log._id}
                className="p-3.5 rounded-lg border border-border bg-surface-subtle/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#111111]">{log.participantName}</span>
                    <Badge variant="secondary" size="sm">
                      {log.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-mono-num text-[11px]">
                    <span>{log.timeSpentHours}h logged</span>
                    <span>•</span>
                    <span>{formatDate(log.date)}</span>
                  </div>
                </div>
                <div className="text-secondary leading-relaxed">{log.workDone}</div>
                {log.blockers && log.blockers !== "None" && (
                  <div className="text-[11px] text-amber-700 bg-amber-50/60 p-2 rounded border border-amber-200/50">
                    <span className="font-semibold">Blockers: </span>
                    {log.blockers}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Mentor Feedback Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title={`Add Mentor Feedback for ${team.name}`}
      >
        <form onSubmit={handleAddFeedback} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-secondary">Mentor Name</label>
            <input
              type="text"
              required
              value={feedbackForm.mentorName}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, mentorName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
          </div>
          <div>
            <label className="font-semibold text-secondary">Rating (1 to 5 Stars)</label>
            <input
              type="number"
              min={1}
              max={5}
              required
              value={feedbackForm.rating}
              onChange={(e) =>
                setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
          </div>
          <div>
            <label className="font-semibold text-secondary">General Evaluation</label>
            <textarea
              required
              rows={3}
              placeholder="What is the team doing well? Architectural feedback..."
              value={feedbackForm.generalFeedback}
              onChange={(e) =>
                setFeedbackForm({ ...feedbackForm, generalFeedback: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
          </div>
          <div>
            <label className="font-semibold text-secondary">Action Items (one per line)</label>
            <textarea
              rows={2}
              placeholder="e.g. Optimize WebGL bundle size"
              value={feedbackForm.actionItems}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, actionItems: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
