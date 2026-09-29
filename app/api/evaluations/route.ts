import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Evaluation, Team, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") filter.team = teamId;

    const evaluations = await Evaluation.find(filter)
      .populate("team", "name code currentPhase progress problemStatement")
      .sort({ totalWeightedScore: -1 })
      .lean();

    return NextResponse.json({ evaluations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching evaluations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { teamId, round, criteriaScores, reviewerNotes, status } = body;

    if (!teamId || !criteriaScores || !Array.isArray(criteriaScores)) {
      return NextResponse.json({ error: "Team ID and criteriaScores are required" }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Calculate total weighted score (criteria scores out of 10)
    let totalScore = 0;
    for (const c of criteriaScores) {
      const weightFraction = (Number(c.weightPercent) || 0) / 100;
      const normalizedScore = (Number(c.score) || 0) * 10; // convert 0-10 to 0-100
      totalScore += normalizedScore * weightFraction;
    }
    const totalWeightedScore = Math.round(totalScore * 10) / 10;

    const evalRecord = await Evaluation.findOneAndUpdate(
      { team: teamId, round: round || "Final Evaluation" },
      {
        $set: {
          teamName: team.name,
          criteriaScores,
          totalWeightedScore,
          reviewerNotes: reviewerNotes || "",
          status: status || "Published",
          evaluatedByName: session?.name || "Jury Panel",
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    await Activity.create({
      type: "EVALUATION_UPDATED",
      title: `Evaluation recorded for ${team.name}`,
      description: `Score: ${totalWeightedScore}/100 in ${round || "Final Evaluation"}`,
      teamId: team._id,
      teamName: team.name,
      participantName: session?.name || "Evaluator",
    });

    return NextResponse.json({ success: true, evaluation: evalRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error submitting evaluation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
