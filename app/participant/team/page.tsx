"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Copy,
  Check,
  Crown,
  UserCheck,
  Shield,
  ArrowRightLeft,
  Edit2,
  Mail,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Flag,
  Lightbulb,
  ExternalLink,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const CANONICAL_ROLES = [
  "Team Lead",
  "Product / Ideation",
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI/ML Developer",
  "Data Analyst",
  "Research",
  "Presentation",
  "Testing / QA",
  "Custom Role",
];

function ParticipantTeamContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "members";

  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [data, setData] = React.useState<any>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [copiedCode, setCopiedCode] = React.useState(false);

  // Modals state
  const [transferModalOpen, setTransferModalOpen] = React.useState(false);
  const [selectedNewLead, setSelectedNewLead] = React.useState("");
  const [transferring, setTransferring] = React.useState(false);

  const [editRoleModalOpen, setEditRoleModalOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<any>(null);
  const [newRole, setNewRole] = React.useState("");
  const [savingRole, setSavingRole] = React.useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("Frontend Developer");
  const [inviting, setInviting] = React.useState(false);
  const [inviteMsg, setInviteMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Join Requests action state
  const [requestActionLoading, setRequestActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (searchParams.get("tab")) {
      setActiveTab(searchParams.get("tab") || "members");
    }
  }, [searchParams]);

  const loadTeamData = React.useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      const user = meRes.participant || meRes.user;
      setCurrentUser(user);

      const teamId = meRes.team?._id || meRes.user?.teamId || meRes.participant?.team;
      if (!teamId) {
        setLoading(false);
        return;
      }

      const teamDetail = await fetch(`/api/teams/${teamId}`).then((r) => r.json());
      setData(teamDetail);
    } catch (err) {
      console.error("Error loading team data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Section 17: Confirm Leadership Transfer
  const handleConfirmTransfer = async () => {
    if (!selectedNewLead) return;
    try {
      setTransferring(true);
      const res = await fetch("/api/teams/transfer-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: data.team._id,
          newLeadId: selectedNewLead,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to transfer leadership");
        return;
      }
      setTransferModalOpen(false);
      setSelectedNewLead("");
      loadTeamData();
    } catch (err) {
      console.error("Transfer error:", err);
    } finally {
      setTransferring(false);
    }
  };

  // Section 16: Save Edited Role
  const handleSaveRole = async () => {
    if (!editingMember || !newRole) return;
    try {
      setSavingRole(true);
      const res = await fetch("/api/teams/edit-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: data.team._id,
          participantId: editingMember.id,
          newRole,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to update role");
        return;
      }
      setEditRoleModalOpen(false);
      setEditingMember(null);
      loadTeamData();
    } catch (err) {
      console.error("Role update error:", err);
    } finally {
      setSavingRole(false);
    }
  };

  // Section 13: Handle Join Request (Accept / Reject)
  const handleJoinRequestAction = async (requestId: string, action: "accept" | "reject") => {
    try {
      setRequestActionLoading(requestId);
      const res = await fetch("/api/teams/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: data.team._id,
          requestId,
          participantId: requestId,
          action: action.toUpperCase(),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to process join request");
      }
      await loadTeamData();
    } catch (err) {
      console.error("Join request processing error:", err);
    } finally {
      setRequestActionLoading(null);
    }
  };

  // Section 08 & 09: Send Invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      setInviting(true);
      setInviteMsg(null);
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: data.team._id,
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setInviteMsg({
          type: "error",
          text: result.error || "Failed to send invitation",
        });
      } else {
        setInviteMsg({
          type: "success",
          text: `Invitation sent to ${inviteEmail}`,
        });
        setInviteEmail("");
        // Instantly update local state without requiring manual page reload (Section 9)
        if (result.invitations) {
          setData((prev: any) => ({
            ...prev,
            team: {
              ...prev.team,
              invitations: result.invitations,
            },
          }));
        } else if (result.invitation) {
          setData((prev: any) => ({
            ...prev,
            team: {
              ...prev.team,
              invitations: [...(prev.team.invitations || []), result.invitation],
            },
          }));
        }
        loadTeamData();
      }
    } catch (err) {
      setInviteMsg({ type: "error", text: "Network error sending invitation" });
    } finally {
      setInviting(false);
    }
  };

  // Section 09: Cancel / Revoke Invitation
  const handleCancelInvite = async (email: string) => {
    try {
      const res = await fetch(`/api/teams/invite?teamId=${data.team._id}&email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to cancel invitation");
        return;
      }
      setData((prev: any) => ({
        ...prev,
        team: {
          ...prev.team,
          invitations: (prev.team.invitations || []).filter(
            (i: any) => i.email?.toLowerCase() !== email.toLowerCase()
          ),
        },
      }));
    } catch (err) {
      console.error("Cancel invite error:", err);
    }
  };

  // Section 09: Resend Invitation
  const handleResendInvite = async (email: string, role: string) => {
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: data.team._id,
          email,
          role,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to resend invitation");
      } else {
        setInviteMsg({
          type: "success",
          text: `Invitation resent to ${email}`,
        });
        loadTeamData();
      }
    } catch (err) {
      console.error("Resend invite error:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Team Space...</div>
      </div>
    );
  }

  if (!data?.team) {
    return (
      <div className="p-12 text-center text-xs text-secondary space-y-3">
        <div>No team space found. Please create or join a team first.</div>
        <Link href="/participant">
          <Button variant="primary" size="sm">
            Go to Team Onboarding
          </Button>
        </Link>
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

  const teamLeadName = leadMember?.name || team.lead?.name || currentUser?.name || "Team Lead";

  const currentUserId = (currentUser?._id || currentUser?.id || currentUser?.participantId)?.toString();
  const currentUserEmail = currentUser?.email?.toLowerCase();

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

  const problemTitle = team.problemStatement?.title || "Smart Campus Mobility";
  const teamSize = team.teamSize || 4;
  const members = team.members || [];
  const joinRequests = team.joinRequests?.filter((r: any) => r.status?.toUpperCase() === "PENDING") || [];
  const invitations = team.invitations || [];

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Wireframe Section 15: TEAM DASHBOARD OVERVIEW */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                SECTION 15 — TEAM DASHBOARD
              </span>
              <h1 className="text-2xl font-black tracking-tight text-[#111111] flex items-center gap-2">
                <span>{team.name}</span>
                {isLead && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    👑 LEAD
                  </span>
                )}
              </h1>
            </div>

            {/* Quick tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "members"
                    ? "bg-[#111111] text-white"
                    : "bg-surface border border-border text-secondary hover:text-[#111111]"
                }`}
              >
                [ TEAM MEMBERS ]
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "roles"
                    ? "bg-[#111111] text-white"
                    : "bg-surface border border-border text-secondary hover:text-[#111111]"
                }`}
              >
                [ ROLES ]
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("invitations")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  activeTab === "invitations"
                    ? "bg-[#111111] text-white"
                    : "bg-surface border border-border text-secondary hover:text-[#111111]"
                }`}
              >
                [ INVITATIONS & REQUESTS ]
                {joinRequests.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-bold animate-pulse">
                    {joinRequests.length}
                  </span>
                )}
              </button>
              <Link
                href="/participant/problem"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-border text-secondary hover:text-[#111111] transition-all"
              >
                [ PROBLEM ]
              </Link>
              <Link
                href="/participant/milestones"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-border text-secondary hover:text-[#111111] transition-all"
              >
                [ MILESTONES ]
              </Link>
              <Link
                href="/participant/submissions"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-border text-secondary hover:text-[#111111] transition-all"
              >
                [ SUBMISSIONS ]
              </Link>
            </div>
          </div>

          {/* Section 15: 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                TEAM MEMBERS
              </div>
              <div className="text-2xl font-black text-[#111111] font-mono-num">
                {members.length} / {teamSize}
              </div>
              <div className="text-[11px] text-secondary">
                {teamSize - members.length === 0 ? "Team full" : `${teamSize - members.length} spots open`}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                PROBLEM STATEMENT
              </div>
              {team.problemStatement ? (
                <>
                  <div className="text-sm font-bold text-accent truncate mt-1">
                    Selected ✓
                  </div>
                  <div className="text-[11px] text-secondary truncate">
                    {team.problemStatement.title || team.problemStatement.name || "Challenge Selected"}
                  </div>
                </>
              ) : (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Not Selected
                  </span>
                  <div className="pt-0.5">
                    <Link
                      href="/participant/problem"
                      className="text-[11px] font-bold text-accent hover:underline"
                    >
                      [ Select Challenge → ]
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                CURRENT DAY
              </div>
              <div className="text-2xl font-black text-[#111111] font-mono-num">
                DAY 0{team.currentMilestoneDay || 1}
              </div>
              <div className="text-[11px] text-secondary uppercase font-semibold">
                {team.currentPhase || "Problem Understanding"}
              </div>
            </div>
          </div>

          {/* Section 15: TEAM CODE BAR */}
          <div className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-secondary uppercase">TEAM CODE:</span>
              <span className="font-mono-num font-black text-sm text-[#111111] tracking-wider bg-surface-subtle px-2.5 py-0.5 rounded border border-border">
                {team.code}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyCode(team.code)}
              className="gap-1.5 text-xs font-bold"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>[ COPY ]</span>
                </>
              )}
            </Button>
          </div>

          {/* Day 1 Deliverable Status Card */}
          {(() => {
            const day1Sub = (data.submissions || []).find((s: any) => s.day === 1);
            const approvals = day1Sub?.memberApprovals || [];
            const approvedCount = approvals.filter((a: any) => a.status === "APPROVED").length;
            const totalMembers = approvals.length || team.members?.length || 1;
            const isApproved = day1Sub && (day1Sub.status === "Submitted" || day1Sub.approvalStatus === "APPROVED");

            return (
              <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : day1Sub
                        ? "bg-amber-100 text-amber-900"
                        : "bg-surface-subtle text-secondary"
                    }`}
                  >
                    {isApproved ? "✓" : "📊"}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                        DAY 01 DELIVERABLE
                      </span>
                      {isApproved ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          100% Team Approved
                        </span>
                      ) : day1Sub ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                          Pending Approval ({approvedCount}/{totalMembers})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-secondary bg-surface-subtle px-2 py-0.2 rounded border border-border">
                          Not Uploaded Yet
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#111111]">
                      {day1Sub?.title || "Solution Ideation PPT (Collaborative Sign-Off)"}
                    </div>
                  </div>
                </div>

                <Link
                  href="/participant/milestones?day=1"
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
                >
                  {day1Sub ? "[ REVIEW PPT & VOTES ]" : "[ UPLOAD DAY 1 PPT ]"}
                </Link>
              </div>
            );
          })()}

          {/* Section 15: 6-DAY JOURNEY INDICATOR (Derived from real submissions, Section 17) */}
          <div className="p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-secondary text-center">
              6-DAY JOURNEY
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              {[
                { day: 1, label: "TEAM + IDEA" },
                { day: 2, label: "WIREFRAME" },
                { day: 3, label: "BUILD" },
                { day: 4, label: "INTEGRATE" },
                { day: 5, label: "POLISH" },
                { day: 6, label: "DEMO" },
              ].map((item) => {
                const currentDay = team.currentMilestoneDay || 1;
                const isSubmitted = (data.submissions || []).some(
                  (s: any) => s.day === item.day && s.status?.toUpperCase() === "SUBMITTED"
                );
                const isActive = item.day === currentDay && !isSubmitted;

                if (isSubmitted) {
                  return (
                    <div key={item.day} className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="font-bold text-emerald-800">✓ DAY 0{item.day}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{item.label}</div>
                    </div>
                  );
                }

                if (isActive) {
                  return (
                    <div key={item.day} className="p-2.5 rounded-lg bg-black text-white shadow-xs">
                      <div className="font-bold">● DAY 0{item.day}</div>
                      <div className="text-[10px] text-white/80 font-semibold mt-0.5">{item.label}</div>
                    </div>
                  );
                }

                return (
                  <div key={item.day} className="p-2.5 rounded-lg bg-surface-subtle border border-border/70 text-secondary">
                    <div className="font-medium">○ DAY 0{item.day}</div>
                    <div className="text-[10px] mt-0.5">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wireframe Section 16: TEAM MEMBERS ROSTER */}
        {activeTab === "members" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h2 className="text-lg font-black text-[#111111]">TEAM MEMBERS</h2>
                <p className="text-xs text-secondary">
                  Manage roster assignments, roles, and leadership transfers.
                </p>
              </div>
              <span className="font-mono-num text-xs font-bold px-2.5 py-1 rounded bg-surface-subtle border border-border">
                {members.length} / {teamSize} MEMBERS
              </span>
            </div>

            <div className="divide-y divide-border/70 rounded-xl border border-border bg-surface shadow-2xs">
              {members.map((member: any) => {
                const memberIsLead = Boolean(
                  member.isLeader ||
                  member.isLead ||
                  member._id === team.lead?._id ||
                  member.id === team.lead?._id ||
                  (leadMember && (member.email?.toLowerCase() === leadMember.email?.toLowerCase() || member.name === leadMember.name)) ||
                  member.name === teamLeadName
                );
                return (
                  <div key={member.id || member._id || member.email} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {memberIsLead ? (
                          <span className="text-base text-amber-600">👑</span>
                        ) : (
                          <span className="text-base text-secondary">👤</span>
                        )}
                        <span className="font-black text-sm text-[#111111] uppercase tracking-wide">
                          {member.name}
                        </span>
                        {memberIsLead && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Team Lead
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-secondary pl-6">
                        {member.role || "Full Stack Developer"}
                      </div>
                      <div className="text-[11px] text-emerald-600 pl-6 flex items-center gap-1 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </div>
                    </div>

                    {/* Lead controls (Rules 10 & 11) */}
                    {isLead && (
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMember(member);
                            setNewRole(member.role || "Full Stack Developer");
                            setEditRoleModalOpen(true);
                          }}
                          className="gap-1.5 text-xs font-bold"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>[ EDIT ROLE ]</span>
                        </Button>

                        {memberIsLead && members.length > 1 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedNewLead("");
                              setTransferModalOpen(true);
                            }}
                            className="gap-1.5 text-xs font-bold text-amber-800 border-amber-300 hover:bg-amber-50"
                          >
                            <ArrowRightLeft className="h-3 w-3" />
                            <span>[ TRANSFER LEADERSHIP ]</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 13: Join Requests & Section 08/09: Invitations */}
        {activeTab === "invitations" && (
          <section className="space-y-6">
            {/* Section 13: Team Join Requests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
                    TEAM JOIN REQUESTS
                  </h3>
                  {isLead ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Team Lead Action
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-secondary bg-surface-subtle px-2 py-0.5 rounded border border-border">
                      Lead Approval Required
                    </span>
                  )}
                </div>
                <span className="text-xs text-secondary font-mono-num">
                  {joinRequests.length} Pending
                </span>
              </div>

              {joinRequests.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-border bg-surface text-center text-xs text-secondary">
                  No pending join requests right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map((req: any) => (
                    <div
                      key={req._id}
                      className="p-4 rounded-xl border-2 border-amber-200/80 bg-amber-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-[#111111] flex items-center gap-2">
                          <span>👤</span>
                          <span>{req.name}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                            PENDING APPROVAL
                          </span>
                        </div>
                        <div className="text-xs text-secondary">Email: {req.email}</div>
                        <div className="text-xs font-semibold text-accent">
                          Requested Role: {req.requestedRole}
                        </div>
                        {req.requestedAt && (
                          <div className="text-[10px] text-secondary">
                            Requested on: {new Date(req.requestedAt).toLocaleDateString()} {new Date(req.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </div>

                      {isLead ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={requestActionLoading === req._id}
                            onClick={() => handleJoinRequestAction(req._id, "accept")}
                            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>[ ACCEPT ]</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={requestActionLoading === req._id}
                            onClick={() => handleJoinRequestAction(req._id, "reject")}
                            className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>[ REJECT ]</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-secondary italic">
                          Awaiting Team Lead approval
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 08 & 09: Invite Through Email */}
            <div className="p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
                  INVITE THROUGH EMAIL
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Invited participants must already be registered with a Build26 account (Rule 07).
                </p>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="teammate@college.edu"
                      required
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                      Proposed Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:outline-none focus:border-black font-semibold"
                    >
                      {team.definedRoles && team.definedRoles.length > 0
                        ? team.definedRoles.map((dr: any) => (
                            <option key={dr.role} value={dr.role}>
                              {dr.role}
                            </option>
                          ))
                        : CANONICAL_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                {inviteMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      inviteMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {inviteMsg.type === "error" && <AlertTriangle className="h-4 w-4 shrink-0" />}
                    <span>{inviteMsg.text}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={inviting || members.length >= teamSize}
                  className="gap-1.5 text-xs font-bold"
                >
                  <Send className="h-3 w-3" />
                  <span>{inviting ? "Checking registration..." : "[ SEND INVITATION ]"}</span>
                </Button>
              </form>

              {/* Status of previously sent invitations with Section 09 Resend & Cancel actions */}
              {invitations.length > 0 && (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    PENDING INVITATIONS ({invitations.length})
                  </div>
                  <div className="divide-y divide-border/60 text-xs">
                    {invitations.map((inv: any, idx: number) => {
                      const isPending =
                        !inv.status ||
                        inv.status.toUpperCase() === "INVITED" ||
                        inv.status.toUpperCase() === "PENDING";

                      return (
                        <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-[#111111]">{inv.email}</span>
                            <div className="text-[10px] text-secondary">
                              Role: <span className="font-semibold text-accent">{inv.role || "Team Member"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span
                              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                                inv.status?.toUpperCase() === "ACCEPTED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : inv.status?.toUpperCase() === "DECLINED"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {inv.status ? inv.status.toUpperCase() : "PENDING"}
                            </span>

                            {isLead && isPending && (
                              <div className="flex items-center gap-1.5 ml-1">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleResendInvite(inv.email, inv.role || "Team Member")}
                                  className="text-[11px] font-bold py-1 px-2.5 h-7"
                                >
                                  Resend
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelInvite(inv.email)}
                                  className="text-[11px] font-bold py-1 px-2.5 h-7 text-rose-600 border-rose-200 hover:bg-rose-50"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Roles & Responsibilities Matrix */}
        {activeTab === "roles" && (
          <section className="space-y-4">
            <div className="pb-2 border-b border-border">
              <h2 className="text-lg font-black text-[#111111]">ROLES & RESPONSIBILITIES</h2>
              <p className="text-xs text-secondary">
                Section 07 breakdown of positions and defined duties for {team.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-num text-[10px] font-bold text-secondary uppercase">
                      MEMBER 0{idx + 1}
                    </span>
                    <Badge variant="secondary" size="sm">
                      {m.role || "Team Member"}
                    </Badge>
                  </div>
                  <div className="font-black text-sm text-[#111111]">{m.name}</div>
                  <div className="text-xs text-secondary">
                    {m.isLead || m._id === team.lead?._id
                      ? "Primary sprint coordinator, milestone finalization, and architecture lead."
                      : "Core feature contributor, daily work logging, and component delivery."}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Wireframe Section 17: TRANSFER TEAM LEADERSHIP MODAL */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-border bg-surface p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                SECTION 17
              </span>
              <h3 className="text-lg font-black text-[#111111]">
                TRANSFER TEAM LEADERSHIP
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border text-xs">
              <div className="text-secondary text-[10px] uppercase font-bold">Current Team Lead</div>
              <div className="font-bold text-[#111111] mt-0.5">👑 {teamLeadName}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-secondary uppercase tracking-wider">
                Transfer Leadership To
              </div>
              <div className="space-y-2">
                {members
                  .filter((m: any) =>
                    !m.isLeader &&
                    m.name !== teamLeadName &&
                    (leadMember ? m.email?.toLowerCase() !== leadMember.email?.toLowerCase() : true)
                  )
                  .map((m: any) => {
                    const leadVal = m.participant?.toString() || m._id?.toString() || m.id || m.email;
                    return (
                      <label
                        key={m.id || m._id || m.email}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-subtle cursor-pointer transition-all"
                      >
                        <input
                          type="radio"
                          name="newLead"
                          value={leadVal}
                          checked={selectedNewLead === leadVal}
                          onChange={(e) => setSelectedNewLead(e.target.value)}
                          className="text-black focus:ring-black"
                        />
                        <div className="text-xs font-bold text-[#111111]">{m.name}</div>
                        <span className="text-[11px] text-secondary">({m.role})</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            {/* Wireframe Warning */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                <span>⚠ Important Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The selected member will become the new Team Lead. The current Team Lead will remain a team member.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransferModalOpen(false)}
                disabled={transferring}
              >
                [ CANCEL ]
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedNewLead || transferring}
                onClick={handleConfirmTransfer}
                className="bg-black text-white hover:bg-black/90 font-bold"
              >
                {transferring ? "Transferring..." : "[ CONFIRM TRANSFER ]"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL (Rule 10) */}
      {editRoleModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border-2 border-border bg-surface p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div>
              <h3 className="text-base font-black text-[#111111]">EDIT MEMBER ROLE</h3>
              <p className="text-xs text-secondary mt-0.5">
                Update responsibility for {editingMember.name}.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                Select Canonical Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:outline-none focus:border-black"
              >
                {CANONICAL_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditRoleModalOpen(false)}
                disabled={savingRole}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingRole}
                onClick={handleSaveRole}
                className="font-bold"
              >
                {savingRole ? "Saving..." : "Save Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParticipantTeamPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-xs text-secondary font-mono">Loading team space...</div>}>
      <ParticipantTeamContent />
    </React.Suspense>
  );
}
