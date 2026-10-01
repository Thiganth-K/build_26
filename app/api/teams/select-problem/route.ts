import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, ProblemStatement, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const { teamId, problemStatementId } = await req.json();

    if (!teamId || !problemStatementId) {
      return NextResponse.json({ error: "teamId and problemStatementId are required." }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Wireframe 19: Only Team Lead finalizes problem statement
    const isLeader = team.members.some(
      (m: any) =>
        m.isLeader &&
        (m.participant?.toString() === session.participantId || 
         m.email?.toLowerCase() === session.email.toLowerCase() ||
         m._id?.toString() === session.participantId)
    );

    if (!isLeader && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only the Team Lead can finalize the problem statement." }, { status: 403 });
    }

    const problem = await ProblemStatement.findById(problemStatementId);
    if (!problem) {
      return NextResponse.json({ error: "Problem statement not found." }, { status: 404 });
    }

    // Decrement previous problem count if changed
    if (team.problemStatement && team.problemStatement.toString() !== problemStatementId) {
      await ProblemStatement.findByIdAndUpdate(team.problemStatement, {
        $inc: { assignedTeamCount: -1 },
      });
    }

    team.problemStatement = problem._id;
    await team.save();

    await ProblemStatement.findByIdAndUpdate(problem._id, {
      $inc: { assignedTeamCount: 1 },
    });

    await Activity.create({
      type: "PROBLEM_ASSIGNED",
      title: `${team.name} selected "${problem.title}"`,
      description: `Problem finalized by Team Lead ${session.name}`,
      teamId: team._id,
      teamName: team.name,
      participantName: session.name,
    });

    return NextResponse.json({
      success: true,
      message: `Problem statement "${problem.title}" selected successfully!`,
      problem,
      team,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error selecting problem statement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
