import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Feedback, Team, Activity, Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") filter.team = teamId;

    const feedbacks = await Feedback.find(filter)
      .populate("team", "name code currentPhase")
      .populate("mentor", "name designation organization avatar")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ feedbacks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching feedback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const {
      teamId,
      mentorId,
      mentorName,
      phase,
      rating,
      strengths,
      areasOfImprovement,
      generalFeedback,
      actionItems,
    } = body;

    if (!teamId || !generalFeedback) {
      return NextResponse.json({ error: "Team ID and general feedback are required" }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const mName = mentorName || session?.name || "Mentor";

    const feedback = await Feedback.create({
      team: teamId,
      teamName: team.name,
      mentor: mentorId || session?.mentorId || undefined,
      mentorName: mName,
      phase: phase || team.currentPhase || "Ideation",
      rating: Number(rating) || 4,
      strengths: strengths || "",
      areasOfImprovement: areasOfImprovement || "",
      generalFeedback,
      actionItems: Array.isArray(actionItems)
        ? actionItems
        : actionItems
        ? actionItems.split("\n").filter((item: string) => item.trim().length > 0)
        : [],
    });

    await Team.findByIdAndUpdate(teamId, { lastActivityAt: new Date() });

    await Activity.create({
      type: "FEEDBACK_ADDED",
      title: `${team.name} received mentor feedback`,
      description: `${mName} gave a ${rating || 4}/5 rating`,
      teamId: team._id,
      teamName: team.name,
      participantName: mName,
    });

    await Notification.create({
      recipientRole: "PARTICIPANT",
      type: "FEEDBACK",
      title: "New Mentor Feedback",
      message: `${mName} left constructive feedback on your team's work.`,
      link: "/participant/feedback",
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating feedback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
