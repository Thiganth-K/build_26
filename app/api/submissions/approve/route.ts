import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Submission, Team, Activity, Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { submissionId, action, comment = "" } = body;

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: "submissionId and action ('APPROVE' or 'REQUEST_CHANGES') are required" },
        { status: 400 }
      );
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const team = await Team.findById(submission.team);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Identify user in team
    const userEmail = session?.email?.toLowerCase();
    const userName = session?.name || "Team Member";
    const userId = session?.id || session?.participantId;

    // Check if user is a member of this team
    const isMember = team.members.some(
      (m: any) =>
        (userEmail && m.email?.toLowerCase() === userEmail) ||
        (userId && (m.participant?.toString() === userId || m._id?.toString() === userId)) ||
        (m.name?.toLowerCase() === userName.toLowerCase())
    );

    if (!isMember && session?.role !== "ADMIN" && session?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to vote on this team's deliverable" },
        { status: 403 }
      );
    }

    // Ensure memberApprovals exists and has all current team members
    let approvals = submission.memberApprovals || [];
    if (!approvals || approvals.length === 0) {
      // Initialize with team members
      approvals = team.members.map((m: any) => ({
        participant: m.participant,
        name: m.name,
        email: m.email,
        role: m.role || "Team Member",
        status: (userEmail && m.email?.toLowerCase() === userEmail) ? "APPROVED" : "PENDING",
        comment: "",
        updatedAt: new Date(),
      }));
    }

    // Find the member approval slot
    let memberIndex = approvals.findIndex(
      (a: any) =>
        (userEmail && a.email?.toLowerCase() === userEmail) ||
        (userId && a.participant?.toString() === userId) ||
        (a.name?.toLowerCase() === userName.toLowerCase())
    );

    if (memberIndex === -1) {
      // Add member to approvals if they just joined
      approvals.push({
        name: userName,
        email: userEmail || "",
        role: "Team Member",
        status: action === "APPROVE" ? "APPROVED" : "CHANGES_REQUESTED",
        comment,
        updatedAt: new Date(),
      });
      memberIndex = approvals.length - 1;
    } else {
      approvals[memberIndex].status = action === "APPROVE" ? "APPROVED" : "CHANGES_REQUESTED";
      approvals[memberIndex].comment = comment;
      approvals[memberIndex].updatedAt = new Date();
    }

    submission.memberApprovals = approvals;

    // Check if all members approved
    const allApproved = approvals.length > 0 && approvals.every((a: any) => a.status === "APPROVED");
    const anyChangesRequested = approvals.some((a: any) => a.status === "CHANGES_REQUESTED");

    if (action === "REQUEST_CHANGES") {
      submission.approvalStatus = "CHANGES_REQUESTED";
      submission.status = "Pending Team Approval";

      // Activity
      await Activity.create({
        type: "TASK_UPDATED",
        title: `${userName} requested changes on Day 0${submission.day} PPT`,
        description: `Feedback: "${comment || "Needs revisions before final submission"}"`,
        teamId: team._id,
        teamName: team.name,
        participantName: userName,
      });

      // Notification
      await Notification.create({
        recipientRole: "PARTICIPANT",
        type: "SUBMISSION",
        title: `Revisions requested: Day 0${submission.day} PPT`,
        message: `${userName} requested changes: "${comment || "Please review feedback and update slide deck."}"`,
        link: `/participant/milestones?day=${submission.day}`,
      });
    } else if (allApproved) {
      submission.approvalStatus = "APPROVED";
      submission.status = "Submitted";
      submission.reviewNotes = "100% Team Consensus Approved";

      // Advance team milestone and progress
      const dayNumber = submission.day || 1;
      const updatedMilestoneDay = Math.max(team.currentMilestoneDay || 1, Math.min(dayNumber + 1, 6));
      const newProgress = Math.min(100, Math.round((dayNumber / 6) * 100));

      await Team.findByIdAndUpdate(team._id, {
        currentMilestoneDay: updatedMilestoneDay,
        progress: Math.max(team.progress || 0, newProgress),
        lastActivityAt: new Date(),
        presentationUrl: submission.fileUrl || submission.externalLink || team.presentationUrl,
      });

      // Activity log
      await Activity.create({
        type: "SUBMISSION_CREATED",
        title: `Team ${team.name} achieved full approval for Day 0${dayNumber} PPT`,
        description: `All ${approvals.length} team members approved the presentation. Deliverable locked & submitted for evaluation.`,
        teamId: team._id,
        teamName: team.name,
        participantName: userName,
      });

      // Evaluator notification
      await Notification.create({
        recipientRole: "ADMIN",
        type: "SUBMISSION",
        title: `Day 0${dayNumber} Deliverable Ready: ${team.name}`,
        message: `${team.name} submitted ${submission.title} with 100% team member approval!`,
        link: "/admin/submissions",
      });

      // Participant notification
      await Notification.create({
        recipientRole: "PARTICIPANT",
        type: "SUBMISSION",
        title: `✓ Day 0${dayNumber} PPT Fully Approved!`,
        message: `Your entire team approved the Solution Ideation PPT. It is now submitted to evaluators.`,
        link: "/participant/submissions",
      });
    } else {
      submission.approvalStatus = "PENDING_APPROVAL";
      submission.status = "Pending Team Approval";

      // Activity
      await Activity.create({
        type: "TASK_UPDATED",
        title: `${userName} approved Day 0${submission.day} PPT`,
        description: `${approvals.filter((a: any) => a.status === "APPROVED").length} of ${approvals.length} members approved so far.`,
        teamId: team._id,
        teamName: team.name,
        participantName: userName,
      });
    }

    await submission.save();

    return NextResponse.json({
      success: true,
      submission,
      allApproved,
      approvalStatus: submission.approvalStatus,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error recording approval";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
