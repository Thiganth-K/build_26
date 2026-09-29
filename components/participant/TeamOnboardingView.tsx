"use client";

import * as React from "react";
import {
  Users,
  PlusCircle,
  LogIn,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Hash,
  Lightbulb,
  Cpu,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TeamOnboardingViewProps {
  participant: {
    _id?: string;
    name: string;
    email: string;
    admissionNumber?: string;
    department?: string;
    yearOfStudy?: string;
    year?: string;
  };
  onTeamAssigned: (team: any) => void;
}

export function TeamOnboardingView({ participant, onTeamAssigned }: TeamOnboardingViewProps) {
  const [mode, setMode] = React.useState<"CREATE" | "JOIN">("CREATE");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Problem statements list for selection
  const [problems, setProblems] = React.useState<any[]>([]);

  // Create form state
  const [createForm, setCreateForm] = React.useState({
    name: "",
    problemStatementId: "",
    solutionTitle: "",
    solutionDescription: "",
    techStack: "Next.js, TypeScript, Tailwind CSS",
  });

  // Join form state
  const [joinForm, setJoinForm] = React.useState({
    teamIdOrCode: "",
    roleInTeam: "Full-Stack Developer",
  });

  React.useEffect(() => {
    fetch("/api/problem-statements")
      .then((r) => r.json())
      .then((data) => {
        if (data.problemStatements) {
          setProblems(data.problemStatements);
          if (data.problemStatements.length > 0) {
            setCreateForm((prev) => ({
              ...prev,
              problemStatementId: data.problemStatements[0]._id,
            }));
          }
        }
      })
      .catch((err) => console.error("Error loading problem statements:", err));
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!createForm.name.trim()) {
      setErrorMessage("Please enter a team name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name.trim(),
          problemStatementId: createForm.problemStatementId || undefined,
          solutionTitle: createForm.solutionTitle.trim() || undefined,
          solutionDescription: createForm.solutionDescription.trim() || undefined,
          techStack: createForm.techStack.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create team.");
        return;
      }

      setSuccessMessage(`Team "${data.team.name}" created successfully! Code: ${data.team.code}`);
      setTimeout(() => {
        onTeamAssigned(data.team);
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error while creating team.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!joinForm.teamIdOrCode.trim()) {
      setErrorMessage("Please enter the Team Code or Team ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamIdOrCode: joinForm.teamIdOrCode.trim(),
          roleInTeam: joinForm.roleInTeam,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Could not join team.");
        return;
      }

      setSuccessMessage(data.message || `Successfully joined ${data.team.name}!`);
      setTimeout(() => {
        onTeamAssigned(data.team);
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error while joining team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Student Identity */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono-num font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent">
                Team Setup Required
              </span>
              {participant.admissionNumber && (
                <span className="text-[10px] font-mono-num font-semibold px-2 py-0.5 rounded bg-surface-subtle border border-border text-secondary">
                  {participant.admissionNumber}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">
              Welcome, {participant.name}
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              {participant.department || "Engineering"} • {participant.yearOfStudy || participant.year || "Student"}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 max-w-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
            <div className="leading-snug text-[11px]">
              You are not currently in a team. Create a new team as Team Lead or join an existing team by code to unlock the full Command Center.
            </div>
          </div>
        </div>

        {/* Action Toggle Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              setMode("CREATE");
              setErrorMessage(null);
            }}
            className={`p-5 rounded-xl border text-left transition-all relative ${
              mode === "CREATE"
                ? "border-accent bg-accent/5 ring-1 ring-accent"
                : "border-border bg-surface hover:bg-surface-subtle"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-[#111111] text-white">
                <PlusCircle className="h-5 w-5" />
              </div>
              <Badge variant={mode === "CREATE" ? "accent" : "secondary"}>Option 1</Badge>
            </div>
            <div className="font-bold text-sm text-[#111111]">Create a New Team</div>
            <div className="text-[11px] text-secondary mt-1">
              Start a fresh project squad, pick your challenge statement, receive an exclusive Team Code, and invite teammates.
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("JOIN");
              setErrorMessage(null);
            }}
            className={`p-5 rounded-xl border text-left transition-all relative ${
              mode === "JOIN"
                ? "border-accent bg-accent/5 ring-1 ring-accent"
                : "border-border bg-surface hover:bg-surface-subtle"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-accent text-white">
                <LogIn className="h-5 w-5" />
              </div>
              <Badge variant={mode === "JOIN" ? "accent" : "secondary"}>Option 2</Badge>
            </div>
            <div className="font-bold text-sm text-[#111111]">Join by Team Code</div>
            <div className="text-[11px] text-secondary mt-1">
              Have an invite code from your team lead? Enter the code (e.g. B26-ALPHA) to join your team workspace.
            </div>
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Selected Action Form */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft">
        {mode === "CREATE" ? (
          <form onSubmit={handleCreateTeam} className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Create Team & Become Team Lead</span>
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Define your team identity and select your challenge statement to initialize your workspace.
              </p>
            </div>

            {/* Team Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111]">
                Team Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Team Phoenix, Team Nexus, Team Spark"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <span className="text-[11px] text-secondary">
                A unique team join code (e.g. B26-PHOENIX-102) will be generated automatically.
              </span>
            </div>

            {/* Problem Statement Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                <span>Problem Challenge Statement</span>
              </label>
              <select
                value={createForm.problemStatementId}
                onChange={(e) =>
                  setCreateForm({ ...createForm, problemStatementId: e.target.value })
                }
                className="w-full h-9 px-2.5 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {problems.map((prob) => (
                  <option key={prob._id} value={prob._id}>
                    [{prob.category}] {prob.title} ({prob.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* Proposed Solution Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111]">
                Target Solution Title / Concept (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. NaviCampus 3D Routing Engine"
                value={createForm.solutionTitle}
                onChange={(e) =>
                  setCreateForm({ ...createForm, solutionTitle: e.target.value })
                }
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-secondary" />
                <span>Primary Tech Stack (Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="Next.js, TypeScript, Tailwind CSS, MongoDB"
                value={createForm.techStack}
                onChange={(e) =>
                  setCreateForm({ ...createForm, techStack: e.target.value })
                }
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="w-full text-xs font-semibold gap-2"
                isLoading={loading}
              >
                <span>Create Team & Launch Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleJoinTeam} className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <LogIn className="h-4 w-4 text-accent" />
                <span>Join an Existing Team</span>
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Enter your squad&apos;s unique Team Code or 24-character Team ID to connect.
              </p>
            </div>

            {/* Team Code or ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-secondary" />
                <span>Team Code or Team ID</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B26-ALPHA or B26-NOVA or 6abbd777..."
                value={joinForm.teamIdOrCode}
                onChange={(e) =>
                  setJoinForm({ ...joinForm, teamIdOrCode: e.target.value.toUpperCase() })
                }
                className="w-full h-9 px-3 text-xs font-mono-num rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent uppercase"
              />
              <span className="text-[11px] text-secondary">
                Ask your team leader for your squad&apos;s team code (e.g. B26-ALPHA).
              </span>
            </div>

            {/* Role in Team */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-secondary" />
                <span>Your Role in the Team</span>
              </label>
              <select
                value={joinForm.roleInTeam}
                onChange={(e) =>
                  setJoinForm({ ...joinForm, roleInTeam: e.target.value })
                }
                className="w-full h-9 px-2.5 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Mobile Web Developer">Mobile Web Developer</option>
                <option value="Product & QA">Product & QA</option>
                <option value="System Architect">System Architect</option>
              </select>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="w-full text-xs font-semibold gap-2"
                isLoading={loading}
              >
                <span>Verify Code & Join Team</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
