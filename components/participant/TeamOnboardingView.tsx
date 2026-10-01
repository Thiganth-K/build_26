"use client";

import * as React from "react";
import {
  Users,
  PlusCircle,
  LogIn,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Crown,
  Copy,
  Check,
  Mail,
  UserCheck,
  UserPlus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const TEAM_ROLES = [
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

interface TeamOnboardingViewProps {
  participant: {
    _id?: string;
    name: string;
    email: string;
    college?: string;
    admissionNumber?: string;
    department?: string;
    yearOfStudy?: string;
  };
  onTeamAssigned: (team: any) => void;
}

export function TeamOnboardingView({ participant, onTeamAssigned }: TeamOnboardingViewProps) {
  // Navigation mode: "HOME" | "CREATE_STEP1" | "CREATE_STEP2" | "CREATE_STEP3" | "CREATE_SUCCESS" | "JOIN" | "JOIN_FOUND"
  const [viewState, setViewState] = React.useState<
    "HOME" | "CREATE_STEP1" | "CREATE_STEP2" | "CREATE_STEP3" | "CREATE_SUCCESS" | "JOIN" | "JOIN_FOUND"
  >("HOME");

  const [loading, setLoading] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Modal state for Section 2: Create New Member modal
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [modalInviteEmail, setModalInviteEmail] = React.useState("");
  const [modalInviteRole, setModalInviteRole] = React.useState("");
  const [sendingModalInvite, setSendingModalInvite] = React.useState(false);
  const [inviteModalError, setInviteModalError] = React.useState<string | null>(null);

  // Pending invitations for this participant (Section 14)
  const [pendingInvitations, setPendingInvitations] = React.useState<any[]>([]);

  // Create Team State
  const [teamName, setTeamName] = React.useState("");
  const [nameAvailability, setNameAvailability] = React.useState<{
    checked: boolean;
    available: boolean;
    message?: string;
  }>({ checked: false, available: false });
  const [checkingName, setCheckingName] = React.useState(false);

  const [teamSize, setTeamSize] = React.useState<3 | 4>(4); // Rule 04: 3 or 4, fixed after creation
  const [leadRole, setLeadRole] = React.useState("Full Stack Developer");
  const [memberRoles, setMemberRoles] = React.useState<Record<number, string>>({
    2: "UI/UX Designer",
    3: "Frontend Developer",
    4: "Backend Developer",
  });

  // Generated team code for Step 3
  const [generatedTeamCode, setGeneratedTeamCode] = React.useState("");
  const [createdTeamData, setCreatedTeamData] = React.useState<any>(null);

  // Invite by email in Step 3
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("Frontend Developer");
  const [invitedMembers, setInvitedMembers] = React.useState<
    Array<{ email: string; role: string; status: string; name?: string }>
  >([]);
  const [inviteError, setInviteError] = React.useState<string | null>(null);

  // Join Team State
  const [joinCodeInput, setJoinCodeInput] = React.useState("");
  const [foundTeam, setFoundTeam] = React.useState<any>(null);
  const [selectedJoinRole, setSelectedJoinRole] = React.useState("UI/UX Designer");

  // Configured roles available for invitations
  const configuredMemberRoles = React.useMemo(() => {
    const roles = [memberRoles[2] || "UI/UX Designer", memberRoles[3] || "Frontend Developer"];
    if (teamSize === 4) {
      roles.push(memberRoles[4] || "Backend Developer");
    }
    return Array.from(new Set(roles));
  }, [memberRoles, teamSize]);

  const handleOpenInviteModal = (defaultRole?: string) => {
    setModalInviteEmail("");
    setInviteModalError(null);
    setModalInviteRole(defaultRole || configuredMemberRoles[0] || "UI/UX Designer");
    setShowInviteModal(true);
  };

  const handleSendModalInvite = async () => {
    setInviteModalError(null);
    if (!modalInviteEmail.trim()) {
      setInviteModalError("Please enter an email address.");
      return;
    }
    const email = modalInviteEmail.trim().toLowerCase();
    if (email === participant.email.toLowerCase()) {
      setInviteModalError("You cannot invite yourself.");
      return;
    }
    if (invitedMembers.some((m) => m.email === email)) {
      setInviteModalError("This member has already been invited.");
      return;
    }
    if (1 + invitedMembers.length >= teamSize) {
      setInviteModalError(`Team capacity reached (${teamSize} members maximum).`);
      return;
    }

    try {
      setSendingModalInvite(true);
      const checkRes = await fetch(`/api/auth/check?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();
      if (!checkData.exists) {
        setInviteModalError("⚠ PARTICIPANT NOT REGISTERED. Ask them to sign up first.");
        return;
      }

      setInvitedMembers((prev) => [
        ...prev,
        {
          email,
          role: modalInviteRole || configuredMemberRoles[0] || "Team Member",
          status: "INVITED",
          name: checkData.user?.name || email,
        },
      ]);
      setShowInviteModal(false);
      setModalInviteEmail("");
    } catch {
      setInviteModalError("Network error checking participant registration.");
    } finally {
      setSendingModalInvite(false);
    }
  };

  const handleRemoveInvitedMember = (emailToRemove: string) => {
    setInvitedMembers((prev) => prev.filter((m) => m.email !== emailToRemove));
  };

  // Load user's pending invitations
  const fetchInvitations = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.invitations && Array.isArray(data.invitations)) {
        setPendingInvitations(data.invitations);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  React.useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  // Live team name availability check (Section 06)
  const handleTeamNameChange = async (name: string) => {
    setTeamName(name);
    setErrorMessage(null);
    if (!name.trim()) {
      setNameAvailability({ checked: false, available: false });
      return;
    }

    setCheckingName(true);
    try {
      const res = await fetch(`/api/teams/check-name?name=${encodeURIComponent(name.trim())}`);
      const data = await res.json();
      if (data.available) {
        setNameAvailability({ checked: true, available: true, message: "✓ Team name available" });
      } else {
        setNameAvailability({
          checked: true,
          available: false,
          message: "⚠ TEAM NAME ALREADY EXISTS. Please choose another team name.",
        });
      }
    } catch {
      setNameAvailability({ checked: false, available: false });
    } finally {
      setCheckingName(false);
    }
  };

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = () => {
    if (!teamName.trim()) {
      setErrorMessage("Please enter your team name.");
      return;
    }
    if (nameAvailability.checked && !nameAvailability.available) {
      setErrorMessage("Please choose a unique team name.");
      return;
    }
    // Generate code in format B26-X7K9
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let rnd = "";
    for (let i = 0; i < 4; i++) rnd += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedTeamCode(`B26-${rnd}`);
    setErrorMessage(null);
    setViewState("CREATE_STEP2");
  };

  // Step 2 -> Step 3
  const handleProceedToStep3 = () => {
    setErrorMessage(null);
    setViewState("CREATE_STEP3");
  };

  // Step 3: Send email invitation with registered participant check (Section 09 & Rule 07)
  const handleSendEmailInvite = async () => {
    setInviteError(null);
    if (!inviteEmail.trim()) {
      setInviteError("Please enter an email address.");
      return;
    }

    const email = inviteEmail.trim().toLowerCase();
    if (invitedMembers.some((m) => m.email === email)) {
      setInviteError("This email has already been invited.");
      return;
    }

    try {
      // Check if user is registered in Build26 (Section 09 & Rule 07)
      const checkRes = await fetch(`/api/auth/check?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();

      if (!checkData.exists) {
        // Wireframe Section 09 exact feedback:
        setInviteError("⚠ PARTICIPANT NOT REGISTERED. Ask them to sign up first.");
        return;
      }

      setInvitedMembers((prev) => [
        ...prev,
        {
          email,
          role: inviteRole,
          status: "INVITED",
          name: checkData.user?.name || email,
        },
      ]);
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      setInviteError("Error checking registered user. Please try again.");
    }
  };

  // Finish Team Creation
  const handleFinishTeamCreation = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const definedRolesArray = [
        { slot: 1, role: leadRole },
        { slot: 2, role: memberRoles[2] || "UI/UX Designer" },
        { slot: 3, role: memberRoles[3] || "Frontend Developer" },
      ];
      if (teamSize === 4) {
        definedRolesArray.push({ slot: 4, role: memberRoles[4] || "Backend Developer" });
      }

      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          code: generatedTeamCode,
          teamSize,
          leadRole,
          definedRoles: definedRolesArray,
          invitations: invitedMembers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create team.");
        return;
      }

      setCreatedTeamData(data.team);
      setViewState("CREATE_SUCCESS");
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error while creating team.");
    } finally {
      setLoading(false);
    }
  };

  // Join Team: Find team by code (Section 11)
  const handleFindTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!joinCodeInput.trim()) {
      setErrorMessage("Please enter the team code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/teams/find?code=${encodeURIComponent(joinCodeInput.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "No team found with this code.");
        return;
      }

      setFoundTeam(data.team);
      if (data.team.availableRoles && data.team.availableRoles.length > 0) {
        setSelectedJoinRole(data.team.availableRoles[0]);
      }
      setViewState("JOIN_FOUND");
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error finding team.");
    } finally {
      setLoading(false);
    }
  };

  // Join Team: Submit join request (Section 12 & 13)
  const handleRequestToJoin = async () => {
    if (!foundTeam) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamIdOrCode: foundTeam.code,
          roleInTeam: selectedJoinRole,
          requestOnly: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Could not submit join request.");
        return;
      }

      if (data.requested) {
        setSuccessMessage("Join request submitted! Your Team Lead will review and approve your request.");
        setTimeout(() => {
          setViewState("HOME");
          setSuccessMessage(null);
        }, 2200);
      } else {
        // Direct join
        setSuccessMessage(`✓ Successfully joined ${data.team.name}!`);
        setTimeout(() => {
          onTeamAssigned(data.team);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error submitting join request.");
    } finally {
      setLoading(false);
    }
  };

  // Respond to pending invitation (Section 14)
  const handleInvitationResponse = async (teamId: string, action: "ACCEPT" | "DECLINE") => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to process invitation.");
        return;
      }

      if (action === "ACCEPT") {
        setSuccessMessage(`✓ Accepted invitation! Opening team space...`);
        setTimeout(() => {
          onTeamAssigned(data.team);
        }, 1000);
      } else {
        setPendingInvitations((prev) => prev.filter((i) => i.teamId !== teamId));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error responding to invitation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      {/* Participant Online Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            B26
          </div>
          <span className="font-bold text-sm text-[#111111] tracking-tight">BUILD26</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              {participant.name}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-secondary hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 04. PARTICIPANT HOME — FIRST LOGIN (NO TEAM YET)                */}
      {/* ============================================================== */}
      {viewState === "HOME" && (
        <div className="space-y-8">
          {/* Pending Invitations Banner (Wireframe Section 14) */}
          {pendingInvitations.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <span>🔔 You Have Pending Team Invitations</span>
              </div>
              {pendingInvitations.map((inv) => (
                <div
                  key={inv.teamId}
                  className="rounded-2xl border border-accent/30 bg-accent/5 p-6 shadow-soft space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                      TEAM INVITATION
                    </span>
                    <h3 className="text-lg font-bold text-[#111111]">
                      👑 {inv.leadName} has invited you to join
                    </h3>
                    <div className="text-xl font-black text-accent tracking-tight">
                      {inv.teamName}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 text-xs border-y border-accent/20">
                    <div>
                      <span className="text-secondary text-[11px] block">Team Size</span>
                      <span className="font-bold text-[#111111]">{inv.teamSize}</span>
                    </div>
                    <div>
                      <span className="text-secondary text-[11px] block">Members</span>
                      <span className="font-bold text-[#111111]">{inv.memberCount} / {inv.teamSize}</span>
                    </div>
                    <div>
                      <span className="text-secondary text-[11px] block">Proposed Role</span>
                      <span className="font-bold text-accent">{inv.proposedRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleInvitationResponse(inv.teamId, "ACCEPT")}
                      isLoading={loading}
                      className="text-xs font-bold uppercase tracking-wider px-5"
                    >
                      ACCEPT INVITATION
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleInvitationResponse(inv.teamId, "DECLINE")}
                      className="text-xs font-bold uppercase tracking-wider px-4 text-secondary hover:text-rose-600"
                    >
                      DECLINE
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Welcome Title */}
          <div className="text-center space-y-2 py-4">
            <h1 className="text-3xl font-black tracking-tight text-[#111111]">
              WELCOME TO BUILD26
            </h1>
            <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
              Your 6-day product building journey starts here.
            </p>
          </div>

          {/* Primary Action Choice Cards — Section 04 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Create Team Card */}
            <div
              onClick={() => {
                setViewState("CREATE_STEP1");
                setErrorMessage(null);
              }}
              className="cursor-pointer group rounded-2xl border border-border bg-surface p-8 shadow-card hover:border-accent hover:shadow-lg transition-all flex flex-col justify-between text-center space-y-4"
            >
              <div className="h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto group-hover:scale-105 group-hover:bg-accent group-hover:text-white transition-all">
                <PlusCircle className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider">
                  ＋ CREATE TEAM
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  Start a new squad, choose team size (3 or 4), assign initial roles, and lead your product build.
                </p>
              </div>
              <Button variant="primary" size="sm" className="w-full text-xs font-bold uppercase tracking-wider mt-2">
                Create Team
              </Button>
            </div>

            {/* Join Team Card */}
            <div
              onClick={() => {
                setViewState("JOIN");
                setErrorMessage(null);
              }}
              className="cursor-pointer group rounded-2xl border border-border bg-surface p-8 shadow-card hover:border-accent hover:shadow-lg transition-all flex flex-col justify-between text-center space-y-4"
            >
              <div className="h-14 w-14 rounded-2xl bg-surface-subtle text-secondary flex items-center justify-center mx-auto group-hover:scale-105 group-hover:bg-[#111111] group-hover:text-white transition-all">
                <LogIn className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider">
                  ⇥ JOIN TEAM
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  Enter the team code shared by your Team Lead to review open roles and request to join.
                </p>
              </div>
              <Button variant="secondary" size="sm" className="w-full text-xs font-bold uppercase tracking-wider mt-2">
                Join Team
              </Button>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-secondary">
              No team yet — Create your own team or join an existing team.
            </span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 06. CREATE TEAM — STEP 1                                       */}
      {/* ============================================================== */}
      {viewState === "CREATE_STEP1" && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                CREATE TEAM
              </span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                CREATE YOUR TEAM
              </h2>
            </div>
            <Badge variant="accent">STEP 1/3</Badge>
          </div>

          {/* Team Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Team Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neural Builders"
              value={teamName}
              onChange={(e) => handleTeamNameChange(e.target.value)}
              className="w-full h-11 px-4 text-xs font-semibold rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
            />

            {/* Validation Message */}
            {checkingName && (
              <span className="text-[11px] text-secondary">Checking team name...</span>
            )}
            {nameAvailability.checked && (
              <div
                className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                  nameAvailability.available ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {nameAvailability.available ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
                <span>{nameAvailability.message}</span>
              </div>
            )}
          </div>

          {/* Team Size Selection (Rule 04: 3 or 4, fixed after creation) */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              TEAM SIZE
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTeamSize(3)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  teamSize === 3
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-surface hover:border-accent/40"
                }`}
              >
                <div className="text-2xl font-black text-[#111111]">3</div>
                <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                  MEMBERS
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTeamSize(4)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  teamSize === 4
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-surface hover:border-accent/40"
                }`}
              >
                <div className="text-2xl font-black text-[#111111]">4</div>
                <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                  MEMBERS
                </div>
              </button>
            </div>
            <p className="text-[11px] text-secondary italic">
              Fixed after team creation
            </p>
          </div>

          {/* Team Lead Display (Rule 05) */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              TEAM LEAD
            </label>
            <div className="p-3.5 rounded-xl border border-border bg-surface-subtle flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-[#111111]">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>{participant.name} — You</span>
              </div>
              <span className="text-[10px] font-mono-num font-semibold text-secondary">
                Auto-assigned Lead
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/70">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewState("HOME")}
              className="text-xs font-bold uppercase tracking-wider"
            >
              [ CANCEL ]
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleProceedToStep2}
              className="text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm"
            >
              <span>CONTINUE →</span>
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 07. CREATE TEAM — STEP 2 — DEFINE ROLES                        */}
      {/* ============================================================== */}
      {viewState === "CREATE_STEP2" && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                CREATE TEAM
              </span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                DEFINE TEAM ROLES
              </h2>
            </div>
            <Badge variant="accent">STEP 2/3</Badge>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-center justify-between text-xs">
            <div>
              <span className="text-secondary">Team:</span>{" "}
              <span className="font-bold text-[#111111]">{teamName}</span>
            </div>
            <div>
              <span className="text-secondary">Team Size:</span>{" "}
              <span className="font-bold text-accent">{teamSize}</span>
            </div>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            Define the initial responsibility for every team position. These can be modified after the team is created.
          </p>

          {/* Member Slots */}
          <div className="space-y-3">
            {/* Member 01: You (Lead) */}
            <div className="p-4 rounded-xl border border-accent/40 bg-accent/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-num font-bold text-accent uppercase">
                  MEMBER 01
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Team Lead
                </span>
              </div>
              <div className="font-bold text-sm text-[#111111]">
                👑 {participant.name.toUpperCase()}
              </div>
              <div className="pt-1">
                <label className="text-[11px] text-secondary block mb-1">Role</label>
                <select
                  value={leadRole}
                  onChange={(e) => setLeadRole(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-medium"
                >
                  {TEAM_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member 02 */}
            <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-num font-bold text-secondary uppercase">
                  MEMBER 02
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenInviteModal(memberRoles[2] || "UI/UX Designer")}
                  className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>[ INVITE PARTICIPANT ]</span>
                </button>
              </div>
              <div>
                <label className="text-[11px] text-secondary block mb-1">Role</label>
                <select
                  value={memberRoles[2] || "UI/UX Designer"}
                  onChange={(e) =>
                    setMemberRoles((prev) => ({ ...prev, 2: e.target.value }))
                  }
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-medium"
                >
                  {TEAM_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member 03 */}
            <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-num font-bold text-secondary uppercase">
                  MEMBER 03
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenInviteModal(memberRoles[3] || "Frontend Developer")}
                  className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>[ INVITE PARTICIPANT ]</span>
                </button>
              </div>
              <div>
                <label className="text-[11px] text-secondary block mb-1">Role</label>
                <select
                  value={memberRoles[3] || "Frontend Developer"}
                  onChange={(e) =>
                    setMemberRoles((prev) => ({ ...prev, 3: e.target.value }))
                  }
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-medium"
                >
                  {TEAM_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member 04 (if teamSize === 4) */}
            {teamSize === 4 && (
              <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-num font-bold text-secondary uppercase">
                    MEMBER 04
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenInviteModal(memberRoles[4] || "Backend Developer")}
                    className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="h-3 w-3" />
                    <span>[ INVITE PARTICIPANT ]</span>
                  </button>
                </div>
                <div>
                  <label className="text-[11px] text-secondary block mb-1">Role</label>
                  <select
                    value={memberRoles[4] || "Backend Developer"}
                    onChange={(e) =>
                      setMemberRoles((prev) => ({ ...prev, 4: e.target.value }))
                    }
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-medium"
                  >
                    {TEAM_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action: Create New Member (Section 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-accent/40 bg-accent/5">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                INVITE TEAM MEMBERS
              </div>
              <div className="text-[11px] text-secondary">
                {invitedMembers.length} of {teamSize - 1} invited positions assigned
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleOpenInviteModal()}
              disabled={1 + invitedMembers.length >= teamSize}
              className="text-xs font-bold uppercase tracking-wider gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Create New Member</span>
            </Button>
          </div>

          {/* Pending Invitations list with Cancel option (Section 2 & 9) */}
          {invitedMembers.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                PENDING INVITATIONS ({invitedMembers.length})
              </span>
              <div className="space-y-1.5">
                {invitedMembers.map((inv) => (
                  <div
                    key={inv.email}
                    className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-bold text-[#111111]">{inv.email}</div>
                        <div className="text-[10px] text-secondary font-medium">Role: {inv.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="accent">INVITED</Badge>
                      <button
                        type="button"
                        onClick={() => handleRemoveInvitedMember(inv.email)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                      >
                        [ Cancel ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/70">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewState("CREATE_STEP1")}
              className="text-xs font-bold uppercase tracking-wider"
            >
              [ ← BACK ]
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleProceedToStep3}
              className="text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm"
            >
              <span>CONTINUE →</span>
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 08. CREATE TEAM — STEP 3 — INVITE                              */}
      {/* ============================================================== */}
      {viewState === "CREATE_STEP3" && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                CREATE TEAM
              </span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                INVITE YOUR TEAM
              </h2>
            </div>
            <Badge variant="accent">STEP 3/3</Badge>
          </div>

          <div>
            <span className="text-xs text-secondary uppercase font-bold">TEAM</span>
            <div className="text-lg font-black text-[#111111]">{teamName}</div>
          </div>

          {/* Team Code Display Box */}
          <div className="p-6 rounded-2xl border border-accent/30 bg-accent/5 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              TEAM CODE
            </span>
            <div className="text-3xl font-black font-mono-num tracking-widest text-[#111111]">
              {generatedTeamCode}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleCopyCode(generatedTeamCode)}
              className="text-xs font-bold uppercase tracking-wider gap-1.5 mx-auto"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? "CODE COPIED!" : "COPY TEAM CODE"}</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-border/70 pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                  INVITE TEAM MEMBERS
                </span>
                <p className="text-[11px] text-secondary">
                  Send invitations to registered participants with their assigned team role.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleOpenInviteModal()}
                disabled={1 + invitedMembers.length >= teamSize}
                className="text-xs font-bold uppercase tracking-wider gap-1.5 shrink-0"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>+ Create New Member</span>
              </Button>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="teammate@college.edu"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setInviteError(null);
                }}
                className="flex-1 h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="h-10 px-2.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-medium"
              >
                {configuredMemberRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSendEmailInvite}
                disabled={1 + invitedMembers.length >= teamSize}
                className="text-xs font-bold uppercase tracking-wider px-4"
              >
                SEND
              </Button>
            </div>

            {/* Error checking email (Rule 07) */}
            {inviteError && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span className="font-semibold">{inviteError}</span>
              </div>
            )}

            {/* Pending Invitations list with Cancel option (Section 2 & 9) */}
            {invitedMembers.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  PENDING INVITATIONS ({invitedMembers.length})
                </span>
                <div className="space-y-1.5">
                  {invitedMembers.map((inv) => (
                    <div
                      key={inv.email}
                      className="p-3 rounded-xl border border-border bg-surface-subtle flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-accent" />
                        <div>
                          <div className="font-bold text-[#111111]">{inv.email}</div>
                          <div className="text-[10px] text-secondary font-medium">Role: {inv.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="accent">INVITED</Badge>
                        <button
                          type="button"
                          onClick={() => handleRemoveInvitedMember(inv.email)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                        >
                          [ Cancel ]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-secondary italic">
              Or share the team code directly with your teammates.
            </div>
          </div>

          {/* Navigation / Finish Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border/70">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewState("CREATE_STEP2")}
              className="text-xs font-bold uppercase tracking-wider"
            >
              [ ← BACK ]
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleFinishTeamCreation}
              isLoading={loading}
              className="text-xs font-bold uppercase tracking-wider shadow-sm px-5"
            >
              [ FINISH TEAM CREATION ]
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. TEAM CREATED SUCCESS                                       */}
      {/* ============================================================== */}
      {viewState === "CREATE_SUCCESS" && createdTeamData && (
        <div className="rounded-2xl border border-emerald-200 bg-surface p-8 shadow-card text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              ✓ SUCCESS
            </span>
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              TEAM CREATED
            </h2>
            <div className="text-xl font-bold text-accent pt-1">
              {createdTeamData.name}
            </div>
            <div className="text-sm font-mono-num font-bold text-secondary">
              Team Code: {createdTeamData.code}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle border border-border text-left space-y-3 max-w-md mx-auto text-xs">
            <p className="font-bold text-[#111111]">
              👑 You are currently the Team Lead.
            </p>
            <p className="text-secondary">You can now:</p>
            <ul className="space-y-1.5 text-secondary">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Invite participants</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Assign responsibilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Select problem statement</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Manage team members</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Transfer team leadership</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onTeamAssigned(createdTeamData)}
              className="text-xs font-bold uppercase tracking-wider px-8 shadow-sm"
            >
              [ OPEN TEAM SPACE ]
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 11. JOIN TEAM                                                  */}
      {/* ============================================================== */}
      {viewState === "JOIN" && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                BUILD26
              </span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                JOIN AN EXISTING TEAM
              </h2>
            </div>
            <Badge variant="secondary">JOIN TEAM</Badge>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            Enter the Team Code shared by your Team Lead.
          </p>

          <form onSubmit={handleFindTeam} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Team Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B26-X7K9"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                className="w-full h-12 px-4 text-center text-lg font-mono-num font-bold tracking-widest rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent uppercase"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={loading}
              className="w-full text-xs font-bold uppercase tracking-wider py-3 shadow-sm"
            >
              [ FIND TEAM ]
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setViewState("HOME")}
              className="text-xs text-secondary hover:text-[#111111] underline"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 12. TEAM FOUND                                                 */}
      {/* ============================================================== */}
      {viewState === "JOIN_FOUND" && foundTeam && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                BUILD26
              </span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                {foundTeam.name}
              </h2>
            </div>
            <Badge variant="accent">TEAM FOUND</Badge>
          </div>

          {/* Team Details Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-subtle border border-border text-xs">
            <div>
              <span className="text-secondary text-[11px] block">Team Code</span>
              <span className="font-mono-num font-bold text-[#111111]">{foundTeam.code}</span>
            </div>
            <div>
              <span className="text-secondary text-[11px] block">Team Lead</span>
              <span className="font-bold text-[#111111]">👑 {foundTeam.leadName}</span>
            </div>
            <div>
              <span className="text-secondary text-[11px] block">Team Size</span>
              <span className="font-bold text-[#111111]">{foundTeam.teamSize}</span>
            </div>
            <div>
              <span className="text-secondary text-[11px] block">Current Members</span>
              <span className="font-bold text-accent">
                {foundTeam.currentMemberCount} / {foundTeam.teamSize}
              </span>
            </div>
          </div>

          {/* Section 4 & 5: Configured Team Roles with assignment validation */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
              CONFIGURED TEAM ROLES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(foundTeam.teamRoles || []).map((r: any) => {
                const isSelected = selectedJoinRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => {
                      if (!r.isAssigned) {
                        setSelectedJoinRole(r.role);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      r.isAssigned
                        ? "border-border/60 bg-surface-subtle opacity-75 cursor-not-allowed"
                        : isSelected
                        ? "border-accent bg-accent/5 ring-1 ring-accent cursor-pointer"
                        : "border-border bg-surface hover:border-accent/40 cursor-pointer"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#111111]">{r.role}</div>
                      {r.isAssigned ? (
                        <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>Assigned to: {r.assignedTo || "Member"}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>Available</span>
                        </div>
                      )}
                    </div>
                    {!r.isAssigned && (
                      <span className={`text-[11px] font-bold ${isSelected ? "text-accent" : "text-secondary"}`}>
                        {isSelected ? "● Selected" : "○ Select"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Select Your Role Dropdown - Strictly from Available Roles */}
          {foundTeam.availableRoles && foundTeam.availableRoles.length > 0 ? (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                Select Your Role
              </label>
              <select
                value={selectedJoinRole}
                onChange={(e) => setSelectedJoinRole(e.target.value)}
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
              >
                {foundTeam.availableRoles.map((role: string) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold">
              ⚠ This team is full or all configured roles have already been assigned.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/70">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewState("JOIN")}
              className="text-xs font-bold uppercase tracking-wider"
            >
              [ ← BACK ]
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRequestToJoin}
              isLoading={loading}
              disabled={foundTeam.isFull || !foundTeam.availableRoles?.length}
              className="text-xs font-bold uppercase tracking-wider px-6 shadow-sm"
            >
              {foundTeam.isFull || !foundTeam.availableRoles?.length ? "TEAM FULL" : "[ REQUEST TO JOIN ]"}
            </Button>
          </div>
        </div>
      )}

      {/* SECTION 2: CREATE NEW MEMBER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border-2 border-border bg-surface p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div>
                <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                  SECTION 02
                </span>
                <h3 className="text-lg font-black text-[#111111]">
                  INVITE TEAM MEMBER
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteModalError(null);
                }}
                className="text-secondary hover:text-[#111111] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  Email
                </label>
                <input
                  type="email"
                  value={modalInviteEmail}
                  onChange={(e) => {
                    setModalInviteEmail(e.target.value);
                    setInviteModalError(null);
                  }}
                  placeholder="member@example.com"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  Role
                </label>
                <select
                  value={modalInviteRole}
                  onChange={(e) => setModalInviteRole(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                >
                  {configuredMemberRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-secondary">
                  Role options correspond to your team configuration.
                </p>
              </div>

              {inviteModalError && (
                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{inviteModalError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteModalError(null);
                }}
                className="text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={sendingModalInvite}
                onClick={handleSendModalInvite}
                className="text-xs font-bold uppercase tracking-wider px-5"
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
