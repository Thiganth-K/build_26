"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Flag,
  CheckCircle2,
  Lock,
  Clock,
  UploadCloud,
  FileText,
  Code2,
  Globe,
  Layers,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Day1PptApprovalHub } from "@/components/participant/Day1PptApprovalHub";

function MilestonesContent() {
  const searchParams = useSearchParams();
  const dayParam = parseInt(searchParams.get("day") || "1");

  const [selectedDay, setSelectedDay] = React.useState<number>(isNaN(dayParam) ? 1 : dayParam);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Day Form States - Initialized cleanly without fake prefilled data (Section 17)
  // Day 1
  const [day1FileName, setDay1FileName] = React.useState("");
  // Day 2
  const [day2FileName, setDay2FileName] = React.useState("");
  const [day2FigmaLink, setDay2FigmaLink] = React.useState("");
  // Day 3
  const [day3GithubUrl, setDay3GithubUrl] = React.useState("");
  // Day 4
  const [day4RepoUrl, setDay4RepoUrl] = React.useState("");
  const [day4Evidence, setDay4Evidence] = React.useState("");
  // Day 5
  const [day5Evidence, setDay5Evidence] = React.useState("");
  // Day 6
  const [day6ProductUrl, setDay6ProductUrl] = React.useState("");
  const [day6GithubUrl, setDay6GithubUrl] = React.useState("");
  const [day6PresentationUrl, setDay6PresentationUrl] = React.useState("");
  const [day6Description, setDay6Description] = React.useState("");

  // Populate from actual database submission if exists
  React.useEffect(() => {
    const existing = submissions.find((s) => s.day === selectedDay);
    if (existing) {
      if (selectedDay === 1) setDay1FileName(existing.fileUrl || "");
      if (selectedDay === 2) {
        setDay2FileName(existing.fileUrl || "");
        setDay2FigmaLink(existing.figmaUrl || existing.demoUrl || "");
      }
      if (selectedDay === 3) setDay3GithubUrl(existing.githubUrl || "");
      if (selectedDay === 4) {
        setDay4RepoUrl(existing.githubUrl || "");
        setDay4Evidence(existing.projectDescription || "");
      }
      if (selectedDay === 5) setDay5Evidence(existing.projectDescription || "");
      if (selectedDay === 6) {
        setDay6ProductUrl(existing.demoUrl || "");
        setDay6GithubUrl(existing.githubUrl || "");
        setDay6PresentationUrl(existing.fileUrl || "");
        setDay6Description(existing.projectDescription || "");
      }
    } else {
      if (selectedDay === 1) setDay1FileName("");
      if (selectedDay === 2) {
        setDay2FileName("");
        setDay2FigmaLink("");
      }
      if (selectedDay === 3) setDay3GithubUrl("");
      if (selectedDay === 4) {
        setDay4RepoUrl("");
        setDay4Evidence("");
      }
      if (selectedDay === 5) setDay5Evidence("");
      if (selectedDay === 6) {
        setDay6ProductUrl("");
        setDay6GithubUrl("");
        setDay6PresentationUrl("");
        setDay6Description("");
      }
    }
  }, [selectedDay, submissions]);

  const fetchMilestoneState = React.useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      const user = meRes.participant || meRes.user;
      setCurrentUser(user);

      if (meRes.team) {
        setTeam(meRes.team);
        const subRes = await fetch(`/api/submissions?teamId=${meRes.team._id}`).then((r) => r.json());
        if (subRes.submissions) {
          setSubmissions(subRes.submissions);
        }
      }
    } catch (err) {
      console.error("Error loading milestones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMilestoneState();
  }, [fetchMilestoneState]);

  const handleSubmitDay = async (dayNum: number, payload: any) => {
    if (!team) {
      alert("You need to be in a team to submit milestone deliverables.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage(null);

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: team._id,
          day: dayNum,
          submittedByName: currentUser?.name || "Participant",
          ...payload,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setSubmitMessage({ type: "error", text: result.error || "Submission failed" });
      } else {
        setSubmitMessage({
          type: "success",
          text: `Day 0${dayNum} milestone submitted successfully!`,
        });
        fetchMilestoneState();
      }
    } catch (err) {
      setSubmitMessage({ type: "error", text: "Network error submitting milestone" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Milestone Engine...</div>
      </div>
    );
  }

  // Check which days are submitted
  const submittedDays = new Set(
    submissions.filter((s) => s.status?.toUpperCase() === "SUBMITTED").map((s) => s.day)
  );
  const currentActiveDay = team?.currentMilestoneDay || 1;

  const milestoneMeta = [
    {
      day: 1,
      title: "TEAM + IDEATION",
      objective: "Form your team, assign responsibilities, select a problem statement, and submit your initial solution idea.",
      required: "PPT — Solution Ideation",
    },
    {
      day: 2,
      title: "WIREFRAME",
      objective: "Convert your solution idea into a structured user experience.",
      required: "Wireframe / Design / Figma Link",
    },
    {
      day: 3,
      title: "BUILD",
      objective: "Start implementing the actual product.",
      required: "GitHub Repository",
    },
    {
      day: 4,
      title: "INTEGRATION",
      objective: "Integrate the major components of the product.",
      required: "Repository + Progress Evidence",
    },
    {
      day: 5,
      title: "TEST + POLISH",
      objective: "Make the product stable, usable, and presentation-ready.",
      required: "Product progress / build evidence",
    },
    {
      day: 6,
      title: "FINAL DEMO",
      objective: "Ship the final working product with live demo and presentation.",
      required: "Final Product URL + GitHub + PPT + Description",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Wireframe Section 21: MILESTONE ENGINE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
              SECTION 21 & 22 — 6-DAY BOOTCAMP MILESTONE ENGINE
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">
              BUILD26 JOURNEY
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              Duration: 6 DAYS • Strict sequential milestone gates from Ideation to Final Ship It.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/participant/submissions">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                <span>Submission Center</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {submitMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              submitMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {submitMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span className="font-medium">{submitMessage.text}</span>
          </div>
        )}

        {/* Wireframe Section 22: MILESTONE ROADMAP (Grid of Day 01 - 06) */}
        <section className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-secondary">
            BOOTCAMP TIMELINE
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {milestoneMeta.map((m) => {
              const isSubmitted = submittedDays.has(m.day);
              const isActive = m.day === currentActiveDay && !isSubmitted;
              const isSelected = selectedDay === m.day;
              const isLocked = m.day > currentActiveDay;

              return (
                <button
                  key={m.day}
                  type="button"
                  onClick={() => setSelectedDay(m.day)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-black border-black bg-white shadow-md"
                      : isSubmitted
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:bg-emerald-50"
                      : isActive
                      ? "bg-white border-[#111111] shadow-2xs"
                      : "bg-surface-subtle border-border text-secondary hover:text-black"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="font-mono-num font-bold text-xs">
                      DAY 0{m.day}
                    </span>
                    {isSubmitted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : isActive ? (
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    ) : (
                      <span className="text-[10px] text-secondary">○</span>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="font-black text-[11px] truncate tracking-tight">
                      {m.title}
                    </div>
                    <div className="text-[10px] text-secondary mt-0.5 truncate">
                      {isSubmitted ? "✓ Submitted" : isActive ? "● Active Now" : "Upcoming"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Wireframe Sections 23 - 28: Interactive Day-Specific Views */}
        <section className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-6">
          {/* Day 1: TEAM + IDEATION (Section 23) */}
          {selectedDay === 1 && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                    SECTION 23 — SPRINT GATEWAY
                  </span>
                  <h2 className="text-xl font-black text-[#111111] tracking-tight">
                    DAY 01 — TEAM + IDEATION
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {submissions.find((s) => s.day === 1)?.status === "Submitted" ? (
                    <Badge variant="success">✓ Submitted to Mentors</Badge>
                  ) : submissions.find((s) => s.day === 1)?.approvalStatus === "CHANGES_REQUESTED" ? (
                    <Badge variant="secondary" className="border-rose-300 text-rose-700 bg-rose-50">
                      Revisions Requested
                    </Badge>
                  ) : submissions.find((s) => s.day === 1)?.status === "Pending Team Approval" ? (
                    <Badge variant="accent">Waiting for Team Sign-Off</Badge>
                  ) : (
                    <Badge variant="secondary">Open for Submission</Badge>
                  )}
                </div>
              </div>

              {/* Problem statement status alert */}
              {!team?.problemStatement && (
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎯</span>
                    <span>
                      <strong>Problem Challenge Not Selected:</strong> Your squad should lock in an official problem statement to align your PPT ideation deck.
                    </span>
                  </div>
                  <Link
                    href="/participant/problem"
                    className="px-3 py-1.5 rounded-lg bg-[#111111] text-white font-bold text-[11px] whitespace-nowrap self-start sm:self-auto"
                  >
                    Select Challenge →
                  </Link>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  OBJECTIVE
                </div>
                <p className="text-xs text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border">
                  Form your squad, allocate multidisciplinary engineering roles, claim your problem statement challenge, and prepare &amp; submit your Solution Ideation PPT with 100% team member consensus.
                </p>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  CHECKLIST PROGRESS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Create team roster</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                    (team?.members?.length || 0) >= (team?.teamSize || 3)
                      ? "text-emerald-800 bg-emerald-50/50 border-emerald-100"
                      : "text-secondary bg-surface-subtle border-border"
                  }`}>
                    {(team?.members?.length || 0) >= (team?.teamSize || 3) ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-secondary font-mono">○</span>
                    )}
                    <span>Complete team membership ({team?.members?.length || 1}/{team?.teamSize || 4})</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Assign engineering roles</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                    team?.problemStatement
                      ? "text-emerald-800 bg-emerald-50/50 border-emerald-100"
                      : "text-secondary bg-surface-subtle border-border"
                  }`}>
                    {team?.problemStatement ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-secondary font-mono">○</span>
                    )}
                    <span>Select problem challenge</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                    submissions.some((s) => s.day === 1)
                      ? "text-emerald-800 bg-emerald-50/50 border-emerald-100"
                      : "text-secondary bg-surface-subtle border-border"
                  }`}>
                    {submissions.some((s) => s.day === 1) ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-secondary font-mono">○</span>
                    )}
                    <span>Prepare Solution Ideation deck</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                    submissions.find((s) => s.day === 1)?.status === "Submitted"
                      ? "text-emerald-800 bg-emerald-50/50 border-emerald-100"
                      : "text-secondary bg-surface-subtle border-border"
                  }`}>
                    {submissions.find((s) => s.day === 1)?.status === "Submitted" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-secondary font-mono">○</span>
                    )}
                    <span>All team members approve PPT</span>
                  </div>
                </div>
              </div>

              {/* Day 1 PPT Upload & Team Approval Hub */}
              <div className="pt-2">
                <Day1PptApprovalHub
                  team={team}
                  currentUser={currentUser}
                  submission={submissions.find((s) => s.day === 1)}
                  onRefresh={fetchMilestoneState}
                />
              </div>
            </div>
          )}

          {/* Day 2: WIREFRAME (Section 24) */}
          {selectedDay === 2 && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="pb-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                    SECTION 24
                  </span>
                  <h2 className="text-xl font-black text-[#111111] tracking-tight">
                    DAY 02 — WIREFRAME
                  </h2>
                </div>
                <Badge variant={submittedDays.has(2) ? "success" : "secondary"}>
                  {submittedDays.has(2) ? "✓ Submitted" : "Open for Submission"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  OBJECTIVE
                </div>
                <p className="text-xs text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border">
                  Convert your solution idea into a structured user experience.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  TASKS
                </div>
                <div className="space-y-2 text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Define target user</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Define user journey</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Identify application screens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Create low-fidelity wireframe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Review wireframe as a team</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  REQUIRED SUBMISSION: Wireframe / Design
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-border bg-surface-subtle/50 space-y-2">
                    <div className="font-bold text-xs text-[#111111]">📎 UPLOAD FILE</div>
                    <input
                      type="text"
                      value={day2FileName}
                      onChange={(e) => setDay2FileName(e.target.value)}
                      placeholder="wireframe_flow.pdf"
                      className="w-full h-8 px-3 rounded border border-border bg-surface text-xs font-mono"
                    />
                  </div>

                  <div className="p-5 rounded-xl border border-border bg-surface-subtle/50 space-y-2">
                    <div className="font-bold text-xs text-[#111111]">Optional Figma / Design Link</div>
                    <input
                      type="url"
                      value={day2FigmaLink}
                      onChange={(e) => setDay2FigmaLink(e.target.value)}
                      placeholder="https://figma.com/..."
                      className="w-full h-8 px-3 rounded border border-border bg-surface text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    onClick={() =>
                      handleSubmitDay(2, {
                        title: "Wireframe / Design",
                        fileUrl: day2FileName,
                        externalLink: day2FigmaLink,
                        type: "Wireframe",
                      })
                    }
                    className="font-bold text-xs"
                  >
                    {submitting ? "Submitting..." : "[ SUBMIT DAY 2 ]"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Day 3: BUILD (Section 25) */}
          {selectedDay === 3 && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="pb-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                    SECTION 25
                  </span>
                  <h2 className="text-xl font-black text-[#111111] tracking-tight">
                    DAY 03 — BUILD
                  </h2>
                </div>
                <Badge variant={submittedDays.has(3) ? "success" : "secondary"}>
                  {submittedDays.has(3) ? "✓ Submitted" : "Open for Submission"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  OBJECTIVE
                </div>
                <p className="text-xs text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border">
                  Start implementing the actual product.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  TASKS
                </div>
                <div className="space-y-2 text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Project setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Repository creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Frontend implementation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Backend implementation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Core feature implementation</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  REQUIRED SUBMISSION: GitHub Repository
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-secondary">GitHub Repository Link</label>
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-secondary shrink-0" />
                    <input
                      type="url"
                      value={day3GithubUrl}
                      onChange={(e) => setDay3GithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-mono focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    onClick={() =>
                      handleSubmitDay(3, {
                        title: "GitHub Repository Setup",
                        githubUrl: day3GithubUrl,
                        type: "Repository",
                      })
                    }
                    className="font-bold text-xs"
                  >
                    {submitting ? "Submitting..." : "[ SUBMIT DAY 3 ]"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Day 4: INTEGRATION (Section 26) */}
          {selectedDay === 4 && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="pb-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                    SECTION 26
                  </span>
                  <h2 className="text-xl font-black text-[#111111] tracking-tight">
                    DAY 04 — INTEGRATION
                  </h2>
                </div>
                <Badge variant={submittedDays.has(4) ? "success" : "secondary"}>
                  {submittedDays.has(4) ? "✓ Submitted" : "Open for Submission"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  OBJECTIVE
                </div>
                <p className="text-xs text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border">
                  Integrate the major components of the product.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  TASKS
                </div>
                <div className="space-y-2 text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Backend integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Database integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>API integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>AI / ML integration if applicable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Connect frontend + backend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Test core workflow</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  REQUIRED SUBMISSION: Repository + Progress Evidence
                </div>

                <div className="space-y-3">
                  <input
                    type="url"
                    value={day4RepoUrl}
                    onChange={(e) => setDay4RepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-mono"
                  />
                  <textarea
                    rows={3}
                    value={day4Evidence}
                    onChange={(e) => setDay4Evidence(e.target.value)}
                    placeholder="Document integration proof, endpoints, and database connection status..."
                    className="w-full p-3 rounded-lg border border-border bg-surface text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    onClick={() =>
                      handleSubmitDay(4, {
                        title: "Repository + Progress Evidence",
                        githubUrl: day4RepoUrl,
                        projectDescription: day4Evidence,
                        type: "Integration",
                      })
                    }
                    className="font-bold text-xs"
                  >
                    {submitting ? "Submitting..." : "[ SUBMIT DAY 4 ]"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Day 5: TEST + POLISH (Section 27) */}
          {selectedDay === 5 && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="pb-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                    SECTION 27
                  </span>
                  <h2 className="text-xl font-black text-[#111111] tracking-tight">
                    DAY 05 — TEST + POLISH
                  </h2>
                </div>
                <Badge variant={submittedDays.has(5) ? "success" : "secondary"}>
                  {submittedDays.has(5) ? "✓ Submitted" : "Open for Submission"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  OBJECTIVE
                </div>
                <p className="text-xs text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border">
                  Make the product stable, usable, and presentation-ready.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  TASKS
                </div>
                <div className="space-y-2 text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Functional testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Bug fixing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>UI/UX refinement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Responsive testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Performance check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>□</span>
                    <span>Final feature verification</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  REQUIRED SUBMISSION: Product progress / build evidence
                </div>

                <textarea
                  rows={3}
                  value={day5Evidence}
                  onChange={(e) => setDay5Evidence(e.target.value)}
                  placeholder="Record test results, fixed bugs, and UI responsiveness benchmarks..."
                  className="w-full p-3 rounded-lg border border-border bg-surface text-xs"
                />

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    onClick={() =>
                      handleSubmitDay(5, {
                        title: "Test + Polish Verification",
                        projectDescription: day5Evidence,
                        type: "Testing",
                      })
                    }
                    className="font-bold text-xs"
                  >
                    {submitting ? "Submitting..." : "[ SUBMIT DAY 5 ]"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Day 6: FINAL DEMO (Section 28) */}
          {selectedDay === 6 && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="pb-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                    SECTION 28 — 🚀 SHIP IT
                  </span>
                  <h2 className="text-xl font-black text-[#111111] tracking-tight">
                    DAY 06 — FINAL DEMO
                  </h2>
                </div>
                <Badge variant={submittedDays.has(6) ? "success" : "secondary"}>
                  {submittedDays.has(6) ? "✓ Shipped" : "Final Stage"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                    FINAL PRODUCT URL
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-secondary shrink-0" />
                    <input
                      type="url"
                      value={day6ProductUrl}
                      onChange={(e) => setDay6ProductUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                    GITHUB REPOSITORY
                  </label>
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-secondary shrink-0" />
                    <input
                      type="url"
                      value={day6GithubUrl}
                      onChange={(e) => setDay6GithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                    FINAL PRESENTATION (URL / PPT)
                  </label>
                  <div className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-secondary shrink-0" />
                    <input
                      type="text"
                      value={day6PresentationUrl}
                      onChange={(e) => setDay6PresentationUrl(e.target.value)}
                      placeholder="https://slides.google.com/..."
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                    PROJECT DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    value={day6Description}
                    onChange={(e) => setDay6Description(e.target.value)}
                    placeholder="Comprehensive summary of your 6-day product, architectural decisions, and impact..."
                    className="w-full p-3 rounded-lg border border-border bg-surface text-xs"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    onClick={() =>
                      handleSubmitDay(6, {
                        title: "Day 06 — Final Demo Ship It",
                        demoUrl: day6ProductUrl,
                        githubUrl: day6GithubUrl,
                        presentationUrl: day6PresentationUrl,
                        projectDescription: day6Description,
                        type: "Final Demo",
                      })
                    }
                    className="bg-[#111111] hover:bg-black text-white font-bold text-xs px-8 shadow-lg"
                  >
                    {submitting ? "Shipping..." : "[ FINAL SUBMISSION ]"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function MilestonesPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-xs text-secondary font-mono">Loading milestones...</div>}>
      <MilestonesContent />
    </React.Suspense>
  );
}
