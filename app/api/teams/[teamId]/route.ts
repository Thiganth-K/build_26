import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { 
  Team, 
  WorkLog, 
  Task, 
  Submission, 
  Feedback, 
  Evaluation, 
  Activity, 
  ProblemStatement, 
  Mentor, 
  User, 
  Participant 
} from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    await connectToDatabase();
    const { teamId } = await params;

    const team = await Team.findById(teamId)
      .populate("problemStatement")
      .populate("mentor")
      .lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const [workLogs, tasks, submissions, feedback, evaluation] = await Promise.all([
      WorkLog.find({ team: teamId }).sort({ date: -1 }).limit(20).lean(),
      Task.find({ team: teamId }).sort({ createdAt: -1 }).lean(),
      Submission.find({ team: teamId }).sort({ createdAt: -1 }).lean(),
      Feedback.find({ team: teamId }).sort({ createdAt: -1 }).lean(),
      Evaluation.findOne({ team: teamId }).lean(),
    ]);

    return NextResponse.json({
      team,
      workLogs,
      tasks,
      submissions,
      feedback,
      evaluation,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching team details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const { teamId } = await params;
    const body = await req.json();

    body.lastActivityAt = new Date();

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $set: body },
      { new: true }
    )
      .populate("problemStatement")
      .populate("mentor");

    if (!updatedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (body.currentPhase || body.progress) {
      await Activity.create({
        type: "TASK_UPDATED",
        title: `${updatedTeam.name} updated phase to ${updatedTeam.currentPhase}`,
        description: `Progress reached ${updatedTeam.progress}%`,
        teamId: updatedTeam._id,
        teamName: updatedTeam.name,
        participantName: session?.name || "Participant",
      });
    }

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    const { teamId } = await params;
    await Team.findByIdAndDelete(teamId);

    return NextResponse.json({ success: true, message: "Team removed" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
