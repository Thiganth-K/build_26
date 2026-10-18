"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Compass,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Target,
  Flag,
  FileText,
  Activity,
  Calendar,
} from "lucide-react";
import { ParticipantHeader } from "@/components/participant/ParticipantHeader";
import { TeamOnboardingView } from "@/components/participant/TeamOnboardingView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ParticipantDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [hasTeam, setHasTeam] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const fetchDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      const currentUser = meRes.participant || meRes.user;
      setUserProfile(currentUser);

      const teamId = meRes.team?._id || meRes.user?.teamId || meRes.participant?.team;

      if (!teamId) {
        setHasTeam(false);
        setLoading(false);
        return;
      }

      setHasTeam(true);
      const teamDetailRes = await fetch(`/api/teams/${teamId}`).then((r) => r.json());

      setData({
        team: teamDetailRes.team,
        workLogs: teamDetailRes.workLogs || [],
        tasks: teamDetailRes.tasks || [],
        submissions: teamDetailRes.submissions || [],
        currentUser: meRes.user,
      });
    } catch (err) {
      console.error("Error loading participant workspace:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Checking team membership & bootcamp state...</div>
      </div>
    );
  }

  // Section 04: PARTICIPANT HOME — FIRST LOGIN (No Team)
  if (hasTeam === false) {
    return (
      <div className="min-h-screen bg-background pb-16">
        <TeamOnboardingView
          participant={userProfile || { name: "Participant", email: "" }}
          onTeamAssigned={() => {
            setHasTeam(true);
            fetchDashboard();
          }}
        />
      </div>
    );
  }

  if (!data?.team) {
    return (
      <div className="p-12 text-center text-xs text-secondary">
        Could not load team workspace. Please refresh or contact administrator.
      </div>
    );
  }

  const { team } = data;
  const leadMember = team.members?.find((m: any) => m.isLeader) || (team.lead ? {
    participant: team.lead._id || team.lead,
    name: team.lead.name,
    email: team.lead.email,
    isLeader: true,
  } : null);

  const teamLeadName = leadMember?.name || team.lead?.name || userProfile?.name || "Team Lead";
  const teamSize = team.teamSize || 4;
  const currentMemberCount = team.members?.length || 1;

  const currentUserId = (userProfile?._id || userProfile?.id || userProfile?.participantId)?.toString();
  const currentUserEmail = userProfile?.email?.toLowerCase();

  const isLead = Boolean(
    leadMember && (
      (currentUserId && (
        leadMember.participant?.toString() === currentUserId ||
        leadMember.participant?._id?.toString() === currentUserId ||
        leadMember._id?.toString() === currentUserId
      )) ||
      (currentUserEmail && leadMember.email?.toLowerCase() === currentUserEmail) ||
      (team.lead && (
        team.lead?._id?.toString() === currentUserId ||
        team.lead?.toString() === currentUserId
      ))
    )
  );

  const joinRequests = team.joinRequests?.filter((r: any) => r.status?.toUpperCase() === "PENDING") || [];
  const currentMilestoneDay = team.currentMilestoneDay || 1;
  const submissions = data.submissions || [];

  // 6-day roadmap milestones derived authentically from database submissions (Section 17)
  const roadmapDefs = [
    { num: "01", title: "TEAM + IDEA", desc: "Form team, assign roles, select problem, submit PPT" },
    { num: "02", title: "WIREFRAME", desc: "User flow, low-fidelity wireframe, design submit" },
    { num: "03", title: "BUILD", desc: "Build MVP, core features, GitHub repo submit" },
    { num: "04", title: "INTEGRATION", desc: "APIs, Database, AI integration, connect frontend" },
    { num: "05", title: "TEST + POLISH", desc: "Testing, bug fixing, UI polish, build evidence" },
    { num: "06", title: "FINAL DEMO", desc: "Ship It, final product URL, demo presentation" },
  ];

  const days = roadmapDefs.map((def, idx) => {
    const dayNum = idx + 1;
    const isSubmitted = submissions.some(
      (s: any) => s.day === dayNum && s.status?.toUpperCase() === "SUBMITTED"
    );
    const isActive = dayNum === currentMilestoneDay && !isSubmitted;
    const status = isSubmitted ? "completed" : isActive ? "active" : "upcoming";
    return {
      ...def,
      status,
    };
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      <ParticipantHeader
        participantName={userProfile?.name || "Participant"}
        teamName={team.name || "TEAM SPACE"}
        isTeamLead={isLead}
      />

      <main className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Wireframe Section 05: PARTICIPANT HOME — ALREADY IN TEAM */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono-num font-bold text-accent uppercase tracking-widest">
              Participant Space
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#111111]">YOUR TEAM</h2>
            <p className="text-xs text-secondary">
              Review your team details, problem challenge, and active milestone.
            </p>
          </div>

          {/* Pending Join Requests Alert for Team Lead */}
          {joinRequests.length > 0 && isLead && (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="h-10 w-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0">
                  🔔
                </div>
                <div>
                  <div className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                    <span>{joinRequests.length} Pending Team Join Request{joinRequests.length > 1 ? "s" : ""}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">Action Needed</span>
                  </div>
                  <div className="text-xs text-amber-800 mt-0.5">
                    {joinRequests.map((r: any) => `${r.name} (${r.requestedRole})`).join(", ")} requested to join your team.
                  </div>
                </div>
              </div>
              <Link
                href="/participant/team?tab=invitations"
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
              >
                [ REVIEW & APPROVE ]
              </Link>
            </div>
          )}

          {/* Day 1 PPT Approval Banner */}
          {(() => {
            const day1Sub = submissions.find((s: any) => s.day === 1);
            if (!day1Sub) {
              return (
                <div className="rounded-2xl border-2 border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-lg shrink-0">
                      🚀
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#111111] uppercase tracking-wide flex items-center gap-2">
                        <span>Day 01 Milestone: Solution Ideation PPT</span>
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold">Upload Open</span>
                      </div>
                      <div className="text-xs text-secondary mt-0.5">
                        Upload your squad&apos;s Solution Ideation slide deck with team member approval.
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/participant/milestones?day=1"
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                  >
                    [ UPLOAD PPT ]
                  </Link>
                </div>
              );
            }

            const approvals = day1Sub.memberApprovals || [];
            const userApproval = approvals.find(
              (a: any) =>
                (currentUserEmail && a.email?.toLowerCase() === currentUserEmail) ||
                (currentUserId && a.participant?.toString() === currentUserId) ||
                a.name?.toLowerCase() === userProfile?.name?.toLowerCase()
            );

            const isPendingUserVote = userApproval && userApproval.status === "PENDING";
            const approvedCount = approvals.filter((a: any) => a.status === "APPROVED").length;
            const totalMembers = approvals.length || team.members?.length || 1;

            if (day1Sub.status === "Submitted" || day1Sub.approvalStatus === "APPROVED") {
              return (
                <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                        <span>Day 01 PPT Submitted with 100% Team Approval</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">Consensus Locked</span>
                      </div>
                      <div className="text-xs text-emerald-800 mt-0.5">
                        &ldquo;{day1Sub.title}&rdquo; is currently in the bootcamp evaluator review queue.
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/participant/milestones?day=1"
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                  >
                    [ VIEW PPT &amp; VOTES ]
                  </Link>
                </div>
              );
            }

            if (isPendingUserVote) {
              return (
                <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0">
                      🗳️
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                        <span>Day 01 PPT Awaiting Your Sign-Off!</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">Vote Required</span>
                      </div>
                      <div className="text-xs text-amber-900 mt-0.5">
                        {day1Sub.uploadedByName || "A teammate"} uploaded &ldquo;{day1Sub.title}&rdquo;. {approvedCount} of {totalMembers} members approved so far.
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/participant/milestones?day=1"
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                  >
                    [ REVIEW &amp; APPROVE PPT ]
                  </Link>
                </div>
              );
            }

            return (
              <div className="rounded-2xl border-2 border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-surface-subtle text-[#111111] flex items-center justify-center font-bold text-lg shrink-0">
                    ⏳
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#111111] uppercase tracking-wide flex items-center gap-2">
                      <span>Day 01 PPT Staged — Waiting for Team Consensus</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {approvedCount}/{totalMembers} Approved
                      </span>
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      Waiting for remaining squad members to vote before submitting to evaluators.
                    </div>
                  </div>
                </div>
                <Link
                  href="/participant/milestones?day=1"
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                >
                  [ VIEW STATUS ]
                </Link>
              </div>
            );
          })()}

          {/* Section 05 Master Card */}
          <div className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft hover:border-black/20 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-secondary font-mono-num">
                  REGISTERED TEAM
                </span>
                <h3 className="text-2xl font-black text-[#111111] tracking-tight mt-0.5">
                  {team.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(team.code)}
                title="Click to copy team code"
                className="self-start md:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-subtle border border-border hover:bg-black hover:text-white transition-all group font-mono text-xs font-bold"
              >
                <span className="text-secondary group-hover:text-white/80 font-medium">Team Code:</span>
                <span className="text-[#111111] group-hover:text-white">{team.code}</span>
                {copiedCode ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-secondary group-hover:text-white" />
                )}
              </button>
            </div>

            {/* Key Information Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-border/80">
              <div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Members
                </div>
                <div className="text-base font-bold text-[#111111] font-mono-num mt-1 flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span>
                    {currentMemberCount} / {teamSize}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Team Lead
                </div>
                <div className="text-sm font-bold text-[#111111] mt-1 flex items-center gap-1.5">
                  <span className="text-amber-600">👑</span>
                  <span className="truncate">{teamLeadName}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Problem
                </div>
                {team.problemStatement ? (
                  <div className="text-sm font-bold text-accent truncate mt-1 flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-accent shrink-0" />
                    <span className="truncate">{team.problemStatement.title || team.problemStatement.name}</span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-amber-700 mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Not Selected Yet</span>
                    <Link href="/participant/problem" className="text-accent underline text-[11px] ml-1 font-bold">
                      [ Select Challenge ]
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Current Milestone Highlight */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Current Milestone
                </div>
                <div className="text-lg font-black text-[#111111] font-mono-num tracking-tight flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                  <span>
                    DAY 0{currentMilestoneDay} — {days[currentMilestoneDay - 1]?.title || "MILESTONE SPRINT"}
                  </span>
                </div>
                <p className="text-xs text-secondary">
                  {days[currentMilestoneDay - 1]?.desc || "Sprint towards milestone deliverables."}
                </p>
              </div>

              <Link href="/participant/team">
                <Button variant="primary" size="md" className="gap-2 px-6 font-bold shadow-md">
                  <span>OPEN TEAM</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 22: 6-DAY ROADMAP PREVIEW */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111]">6-DAY JOURNEY ROADMAP</h3>
              <p className="text-xs text-secondary">
                Progress sequentially through all milestones to reach Final Demo.
              </p>
            </div>
            <Link
              href="/participant/milestones"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>View Milestones Engine</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {days.map((d) => (
              <div
                key={d.num}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                  d.status === "completed"
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                    : d.status === "active"
                    ? "bg-white border-[#111111] shadow-sm ring-1 ring-black/10"
                    : "bg-surface-subtle border-border/80 text-secondary opacity-75"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="font-mono-num font-bold text-xs">DAY {d.num}</span>
                  {d.status === "completed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : d.status === "active" ? (
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-secondary">○</span>
                  )}
                </div>

                <div className="py-2">
                  <div className="font-bold text-[11px] truncate">{d.title}</div>
                  <div className="text-[10px] text-secondary line-clamp-2 mt-1 leading-snug">
                    {d.desc}
                  </div>
                </div>

                <Link
                  href={`/participant/milestones?day=${parseInt(d.num)}`}
                  className="mt-2 text-[10px] font-bold text-accent hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Access to Workspace Sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Link
            href="/participant/submissions"
            className="p-5 rounded-xl border border-border bg-surface hover:border-black/30 hover:shadow-soft transition-all group space-y-2"
          >
            <div className="h-8 w-8 rounded-lg bg-surface-subtle flex items-center justify-center text-accent group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#111111]">Submissions Center</div>
              <div className="text-xs text-secondary mt-0.5">
                Upload day-wise decks, repositories, and verify submission gates.
              </div>
            </div>
          </Link>

          <Link
            href="/participant/worklogs"
            className="p-5 rounded-xl border border-border bg-surface hover:border-black/30 hover:shadow-soft transition-all group space-y-2"
          >
            <div className="h-8 w-8 rounded-lg bg-surface-subtle flex items-center justify-center text-blue-600 group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#111111]">My Work Log</div>
              <div className="text-xs text-secondary mt-0.5">
                Log individual contributions with 10 contribution categories and time spent.
              </div>
            </div>
          </Link>

          <Link
            href="/participant/activity"
            className="p-5 rounded-xl border border-border bg-surface hover:border-black/30 hover:shadow-soft transition-all group space-y-2"
          >
            <div className="h-8 w-8 rounded-lg bg-surface-subtle flex items-center justify-center text-emerald-600 group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#111111]">Team Activity</div>
              <div className="text-xs text-secondary mt-0.5">
                Live team timeline, sprint progress bars, and member contribution stats.
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
