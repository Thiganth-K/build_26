"use client";

import * as React from "react";
import Link from "next/link";
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  ExternalLink,
  Crown,
  RefreshCw,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Check,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Day1PptApprovalHubProps {
  team: any;
  currentUser: any;
  submission: any;
  onRefresh: () => void;
}

export function Day1PptApprovalHub({
  team,
  currentUser,
  submission,
  onRefresh,
}: Day1PptApprovalHubProps) {
  const [deckTitle, setDeckTitle] = React.useState(
    submission?.title || `${team?.name || "Team"} — Solution Ideation Deck`
  );
  const [externalDeckUrl, setExternalDeckUrl] = React.useState(
    submission?.externalLink || submission?.presentationUrl || ""
  );
  const [deckDescription, setDeckDescription] = React.useState(
    submission?.projectDescription || ""
  );

  const [uploadedFile, setUploadedFile] = React.useState<{
    url: string;
    fileName: string;
    fileSize: string;
  } | null>(
    submission?.fileUrl
      ? {
          url: submission.fileUrl,
          fileName: submission.fileName || "solution_ideation.pptx",
          fileSize: submission.fileSize || "Uploaded",
        }
      : null
  );

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVoting, setIsVoting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Voting feedback state
  const [showFeedbackInput, setShowFeedbackInput] = React.useState(false);
  const [feedbackComment, setFeedbackComment] = React.useState("");

  // Re-upload mode toggle
  const [showReuploadForm, setShowReuploadForm] = React.useState(false);

  // Identify current user in team
  const currentUserId = (
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.participantId
  )?.toString();
  const currentUserEmail = currentUser?.email?.toLowerCase();
  const currentUserName = currentUser?.name || "Participant";

  // Team members list
  const teamMembers = team?.members || [];
  const memberApprovals = submission?.memberApprovals || [];

  // Reconcile team members with approvals
  const consolidatedMembers = teamMembers.map((m: any) => {
    const approval = memberApprovals.find(
      (a: any) =>
        (a.email && a.email.toLowerCase() === m.email?.toLowerCase()) ||
        (a.participant &&
          (a.participant.toString() === m.participant?.toString() ||
            a.participant?._id?.toString() === m.participant?.toString())) ||
        (a.name && a.name.toLowerCase() === m.name?.toLowerCase())
    );

    const isCurrentUser =
      (currentUserEmail && m.email?.toLowerCase() === currentUserEmail) ||
      (currentUserId &&
        (m.participant?.toString() === currentUserId ||
          m._id?.toString() === currentUserId)) ||
      m.name?.toLowerCase() === currentUserName.toLowerCase();

    return {
      name: m.name,
      email: m.email,
      role: m.role || "Developer",
      isLeader: m.isLeader,
      isCurrentUser,
      status: approval ? approval.status : "PENDING",
      comment: approval?.comment || "",
      updatedAt: approval?.updatedAt ? new Date(approval.updatedAt) : null,
    };
  });

  const totalMembers = consolidatedMembers.length || 1;
  const approvedCount = consolidatedMembers.filter((m: any) => m.status === "APPROVED").length;
  const changesRequestedCount = consolidatedMembers.filter(
    (m: any) => m.status === "CHANGES_REQUESTED"
  ).length;
  const pendingCount = totalMembers - approvedCount - changesRequestedCount;
  const approvalPercent = Math.round((approvedCount / totalMembers) * 100);

  const currentUserMember = consolidatedMembers.find((m: any) => m.isCurrentUser);
  const currentUserStatus = currentUserMember?.status || "PENDING";

  const isFullyApproved =
    submission &&
    (submission.status === "Submitted" ||
      submission.status === "Approved" ||
      submission.approvalStatus === "APPROVED" ||
      (totalMembers > 0 && approvedCount === totalMembers));

  // Handle Drag & Drop / File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "File upload failed.");
      } else {
        setUploadedFile({
          url: data.url,
          fileName: data.fileName,
          fileSize: data.fileSize,
        });
        setSuccessMsg(`File "${data.fileName}" uploaded successfully!`);
      }
    } catch {
      setErrorMsg("Network error during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit / Stage PPT for team approval
  const handleStagePpt = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!uploadedFile?.url && !externalDeckUrl.trim()) {
      setErrorMsg("Please upload a PPT file or provide a Cloud Presentation URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: team._id,
          day: 1,
          phase: "Day 01 — Team + Ideation",
          title: deckTitle.trim() || `${team.name} — Solution Ideation Deck`,
          type: "Ideation PPT",
          fileUrl: uploadedFile?.url || "",
          fileName: uploadedFile?.fileName || "",
          fileSize: uploadedFile?.fileSize || "",
          externalLink: externalDeckUrl.trim(),
          presentationUrl: externalDeckUrl.trim() || uploadedFile?.url || "",
          projectDescription: deckDescription.trim(),
          submittedByName: currentUserName,
          requiresMemberApproval: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to stage Day 1 PPT.");
      } else {
        setSuccessMsg(
          data.allApproved
            ? "Day 01 PPT fully approved & submitted for evaluator review!"
            : "Day 01 PPT staged successfully! Team members have been notified to review and approve."
        );
        setShowReuploadForm(false);
        onRefresh();
      }
    } catch {
      setErrorMsg("Network error staging presentation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vote on PPT (Approve or Request Changes)
  const handleVote = async (action: "APPROVE" | "REQUEST_CHANGES") => {
    if (!submission?._id) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      setIsVoting(true);
      const res = await fetch("/api/submissions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission._id,
          action,
          comment: action === "REQUEST_CHANGES" ? feedbackComment.trim() : "Approved deliverable",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to record approval vote.");
      } else {
        setShowFeedbackInput(false);
        setFeedbackComment("");
        if (action === "APPROVE") {
          setSuccessMsg(
            data.allApproved
              ? "✓ 100% Team Consensus! Day 01 PPT is now officially submitted to evaluators."
              : "✓ Your approval has been recorded! Waiting for remaining teammates."
          );
        } else {
          setSuccessMsg("Changes requested. Feedback note shared with your squad.");
        }
        onRefresh();
      }
    } catch {
      setErrorMsg("Network error processing vote.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Case A: PPT has NOT been uploaded yet OR User clicked Re-upload */}
      {(!submission || showReuploadForm) && (
        <div className="rounded-2xl border-2 border-border bg-surface p-6 sm:p-7 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                DELIVERABLE GATEWAY
              </span>
              <h3 className="text-lg font-black text-[#111111] tracking-tight">
                {showReuploadForm ? "UPLOAD REVISED SLIDE DECK" : "UPLOAD DAY 01 SOLUTION PPT"}
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Upload your squad&apos;s Solution Ideation slide deck. All team members must review and approve before submission locks.
              </p>
            </div>
            {showReuploadForm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReuploadForm(false)}
                className="text-xs font-bold text-secondary"
              >
                Cancel Revision
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111] block mb-1.5">
                Presentation Title *
              </label>
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="e.g. NaviCampus 3D — System Architecture & Concept Pitch"
                className="w-full h-10 px-3.5 text-xs font-medium rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Drag & Drop File Upload Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                Presentation File (.pptx, .ppt, .pdf)
              </label>

              <label
                className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                  uploadedFile
                    ? "border-emerald-300 bg-emerald-50/40"
                    : "border-border bg-surface-subtle/60 hover:border-accent hover:bg-accent/5"
                }`}
              >
                <input
                  type="file"
                  accept=".ppt,.pptx,.pdf,.key"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center space-y-2 text-xs text-secondary">
                    <div className="h-7 w-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span className="font-bold text-[#111111]">Uploading presentation file...</span>
                  </div>
                ) : uploadedFile ? (
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-[#111111]">
                        {uploadedFile.fileName}
                      </div>
                      <div className="text-[11px] font-mono-num text-secondary">
                        Size: {uploadedFile.fileSize} • Ready to stage
                      </div>
                    </div>
                    <span className="text-[10px] text-accent font-bold hover:underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-black text-xs text-[#111111]">
                        CHOOSE A FILE OR DRAG & DROP
                      </div>
                      <div className="text-[11px] text-secondary">
                        PowerPoint (.pptx, .ppt) or PDF slide deck (up to 50MB)
                      </div>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Cloud Slides URL Alternative */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111] block mb-1.5">
                Or Presentation URL (Google Slides, Canva, Microsoft 365, Pitch)
              </label>
              <input
                type="url"
                value={externalDeckUrl}
                onChange={(e) => setExternalDeckUrl(e.target.value)}
                placeholder="https://docs.google.com/presentation/d/... or https://canva.com/..."
                className="w-full h-10 px-3.5 text-xs font-medium rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-mono"
              />
            </div>

            {/* Deck Summary / Notes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111] block mb-1.5">
                Executive Concept Summary
              </label>
              <textarea
                rows={2}
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="Key problem tackled, target persona, proposed core features, and architectural highlights..."
                className="w-full p-3 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-secondary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Uploading will stage the deck and request approval from all {totalMembers} team members.
                </span>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleStagePpt}
                isLoading={isSubmitting}
                className="text-xs font-bold uppercase tracking-wider px-6 shadow-sm gap-2"
              >
                <span>{showReuploadForm ? "Upload & Request Re-approval" : "Stage PPT & Request Approval"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Case B: PPT has been staged or submitted */}
      {submission && !showReuploadForm && (
        <div className="space-y-6 animate-in fade-in">
          {/* Deck Showcase Card */}
          <div className="rounded-2xl border-2 border-border bg-surface p-6 sm:p-7 shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-start gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-[#111111] text-white flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-wider">
                      DAY 01 DELIVERABLE
                    </span>
                    <Badge variant={isFullyApproved ? "success" : "accent"}>
                      v{submission.version || 1}
                    </Badge>
                    {isFullyApproved ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Consensus Approved</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                        <Clock className="h-3 w-3 animate-spin" />
                        <span>Pending Team Approval</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-[#111111] tracking-tight mt-1">
                    {submission.title}
                  </h3>

                  <div className="text-[11px] text-secondary mt-0.5 flex items-center gap-3 flex-wrap">
                    <span>
                      Staged by: <strong className="text-[#111111]">{submission.uploadedByName || submission.submittedByName}</strong>
                    </span>
                    <span>•</span>
                    <span className="font-mono-num">
                      {new Date(submission.updatedAt || submission.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {submission.fileName && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-accent">{submission.fileName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Deck Actions */}
              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                {(submission.fileUrl || submission.externalLink) && (
                  <a
                    href={submission.fileUrl || submission.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>View Deck</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReuploadForm(true)}
                  className="text-xs font-bold gap-1.5"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Upload Revised Deck</span>
                </Button>
              </div>
            </div>

            {/* Abstract note if present */}
            {submission.projectDescription && (
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-xs text-secondary leading-relaxed">
                <span className="font-bold text-[#111111] block mb-0.5">Abstract / Overview:</span>
                {submission.projectDescription}
              </div>
            )}

            {/* Team Approval Meter */}
            <div className="p-5 rounded-xl bg-surface-subtle/80 border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono-num font-bold text-secondary uppercase tracking-widest block">
                    TEAM CONSENSUS PROGRESS
                  </span>
                  <div className="text-base font-black text-[#111111] mt-0.5 flex items-center gap-2">
                    <span>
                      {approvedCount} of {totalMembers} Team Members Approved
                    </span>
                    <span className="text-xs font-mono-num font-bold text-accent">
                      ({approvalPercent}%)
                    </span>
                  </div>
                </div>

                <div>
                  {isFullyApproved ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Ready for Bootcamp Evaluator Review</span>
                    </span>
                  ) : changesRequestedCount > 0 ? (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Revisions Requested by Teammate</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      <span>Waiting for {pendingCount} Teammate{pendingCount > 1 ? "s" : ""}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isFullyApproved
                      ? "bg-emerald-500"
                      : changesRequestedCount > 0
                      ? "bg-rose-500"
                      : "bg-accent"
                  }`}
                  style={{ width: `${Math.max(5, approvalPercent)}%` }}
                />
              </div>
            </div>

            {/* Team Members Approval Roster */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                TEAM MEMBER SIGN-OFF STATUS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {consolidatedMembers.map((member: any) => {
                  const isApproved = member.status === "APPROVED";
                  const isChanges = member.status === "CHANGES_REQUESTED";

                  return (
                    <div
                      key={member.email || member.name}
                      className={`p-4 rounded-xl border transition-all ${
                        member.isCurrentUser
                          ? "border-black/30 bg-surface shadow-2xs ring-1 ring-black/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="font-black text-xs text-[#111111] flex items-center gap-1.5">
                            {member.isLeader && (
                              <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate">{member.name}</span>
                            {member.isCurrentUser && (
                              <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.2 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-secondary font-medium">
                            {member.role}
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isApproved ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 shrink-0">
                            <Check className="h-3 w-3" />
                            <span>Approved</span>
                          </span>
                        ) : isChanges ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 shrink-0">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Changes Needed</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>

                      {/* Comment bubble if any */}
                      {member.comment && (
                        <div className="mt-2.5 p-2 rounded-lg bg-surface-subtle border border-border text-[11px] text-secondary italic flex items-start gap-1.5">
                          <MessageSquare className="h-3 w-3 text-secondary shrink-0 mt-0.5" />
                          <span>&ldquo;{member.comment}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current User Action Voting Panel */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                    YOUR APPROVAL ACTION
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {currentUserStatus === "APPROVED"
                      ? "✓ You have voted to approve this deliverable."
                      : currentUserStatus === "CHANGES_REQUESTED"
                      ? "⚠ You requested changes on this deliverable."
                      : "Please review the presentation deck and confirm your approval."}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {currentUserStatus !== "APPROVED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVote("APPROVE")}
                      isLoading={isVoting}
                      className="text-xs font-bold uppercase tracking-wider gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>[ ✓ Approve PPT ]</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedbackInput(!showFeedbackInput)}
                    className="text-xs font-bold uppercase tracking-wider gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{showFeedbackInput ? "Hide Feedback" : "[ Request Changes ]"}</span>
                  </Button>
                </div>
              </div>

              {/* Feedback input box for Request Changes */}
              {showFeedbackInput && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    SPECIFY REVISIONS / CHANGES NEEDED
                  </div>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="e.g. Slide 3 needs clearer competitor differentiation, and let's add the database ER diagram on slide 5..."
                    className="w-full p-2.5 text-xs rounded-lg border border-rose-300 bg-white text-[#111111] focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFeedbackInput(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVote("REQUEST_CHANGES")}
                      isLoading={isVoting}
                      className="text-xs font-bold bg-rose-600 hover:bg-rose-700 border-rose-600 text-white"
                    >
                      Submit Feedback & Request Revision
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
