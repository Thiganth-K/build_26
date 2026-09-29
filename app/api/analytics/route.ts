import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Participant, Team, Mentor, ProblemStatement, Submission, WorkLog, Bootcamp } from "@/models";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      participantCount,
      teams,
      mentorCount,
      problemCount,
      submissions,
      workLogs,
      bootcamp,
    ] = await Promise.all([
      Participant.countDocuments({}),
      Team.find({}).lean(),
      Mentor.countDocuments({}),
      ProblemStatement.countDocuments({}),
      Submission.find({}).lean(),
      WorkLog.find({}).lean(),
      Bootcamp.findOne({}).lean(),
    ]);

    const totalTeams = teams.length;
    const activeTeams = teams.filter((t) => t.status === "ACTIVE").length;
    const attentionTeams = teams.filter((t) => t.status === "NEEDS_ATTENTION").length;

    const totalProgress = teams.reduce((acc, t) => acc + (t.progress || 0), 0);
    const avgProgress = totalTeams > 0 ? Math.round(totalProgress / totalTeams) : 0;

    const pendingSubmissions = submissions.filter((s) => s.status === "Pending Review").length;
    const approvedSubmissions = submissions.filter((s) => s.status === "Approved").length;

    const totalHoursLogged = workLogs.reduce((acc, w) => acc + (w.timeSpentHours || 0), 0);

    // Phase distribution
    const phases = ["Problem Understanding", "Ideation", "Validation", "Build", "Testing", "Final Demo"];
    const phaseDistribution = phases.map((phase) => {
      const count = teams.filter((t) => t.currentPhase === phase).length;
      return {
        phase,
        count,
        percentage: totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0,
      };
    });

    // Team progress ranking
    const teamProgressList = teams
      .map((t) => ({
        name: t.name,
        progress: t.progress,
        phase: t.currentPhase,
        status: t.status,
      }))
      .sort((a, b) => b.progress - a.progress);

    return NextResponse.json({
      kpis: {
        totalParticipants: participantCount,
        participantsTrend: "+8 this week",
        totalTeams,
        teamsTrend: "10 fully formed",
        activeTeams,
        attentionTeams,
        mentors: mentorCount,
        problemStatements: problemCount,
        pendingSubmissions,
        completedSubmissions: approvedSubmissions,
        overallProgress: avgProgress,
        totalHoursLogged,
        totalWorkLogs: workLogs.length,
      },
      bootcamp: bootcamp || {
        currentPhase: "Ideation",
        dayNumber: 1,
        totalDays: 6,
        status: "LIVE",
      },
      phaseDistribution,
      teamProgressList,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error compiling analytics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
