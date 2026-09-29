import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Submission, Team, Activity, Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") filter.team = teamId;
    if (status && status !== "all") filter.status = status;
    if (type && type !== "all") filter.type = type;

    const submissions = await Submission.find(filter)
      .populate("team", "name code currentPhase progress")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ submissions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching submissions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { teamId, title, type, phase, fileUrl, externalLink, submittedByName } = body;

    if (!teamId || !title) {
      return NextResponse.json({ error: "Team ID and title are required" }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const submission = await Submission.create({
      team: teamId,
      teamName: team.name,
      submittedByName: submittedByName || session?.name || "Participant",
      phase: phase || team.currentPhase || "Ideation",
      title,
      type: type || "Ideation PPT",
      fileUrl: fileUrl || "",
      externalLink: externalLink || "",
      status: "Pending Review",
      scores: {
        problemUnderstanding: 0,
        innovation: 0,
        feasibility: 0,
        technicalApproach: 0,
        userImpact: 0,
      },
      totalScore: 0,
    });

    // Update team lastActivityAt
    await Team.findByIdAndUpdate(teamId, { lastActivityAt: new Date() });

    // Activity log
    await Activity.create({
      type: "SUBMISSION_CREATED",
      title: `${team.name} submitted ${type || "Ideation PPT"}`,
      description: title,
      teamId: team._id,
      teamName: team.name,
      participantName: submittedByName || session?.name,
    });

    // Admin notification
    await Notification.create({
      recipientRole: "ADMIN",
      type: "SUBMISSION",
      title: `New submission: ${team.name}`,
      message: `${team.name} uploaded ${title} (${type})`,
      link: "/admin/submissions",
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error submitting milestone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { id, status, reviewNotes, scores } = body;

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: any = {
      reviewedByName: session?.name || "Bootcamp Evaluator",
      reviewedAt: new Date(),
    };

    if (status) updateObj.status = status;
    if (reviewNotes !== undefined) updateObj.reviewNotes = reviewNotes;

    if (scores) {
      updateObj.scores = scores;
      const total =
        (Number(scores.problemUnderstanding) || 0) +
        (Number(scores.innovation) || 0) +
        (Number(scores.feasibility) || 0) +
        (Number(scores.technicalApproach) || 0) +
        (Number(scores.userImpact) || 0);
      updateObj.totalScore = total;
    }

    const submission = await Submission.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    if (submission && submission.team) {
      // Activity
      await Activity.create({
        type: "SUBMISSION_REVIEWED",
        title: `Submission reviewed for ${submission.teamName}`,
        description: `Status: ${status || submission.status} • Total Score: ${submission.totalScore}/50`,
        teamId: submission.team,
        teamName: submission.teamName,
        participantName: session?.name,
      });

      // If approved, bump team progress
      if (status === "Approved") {
        await Team.findByIdAndUpdate(submission.team, {
          $inc: { progress: 15 },
          lastActivityAt: new Date(),
        });
      }

      // Notify participant
      await Notification.create({
        recipientRole: "PARTICIPANT",
        type: "SUBMISSION_REVIEWED",
        title: `Review updated: ${submission.title}`,
        message: `Your submission is ${status || submission.status}. Score: ${submission.totalScore}/50`,
        link: "/participant/submissions",
      });
    }

    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error reviewing submission";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
