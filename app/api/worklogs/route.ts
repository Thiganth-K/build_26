import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { WorkLog, Team, Participant, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const participantId = searchParams.get("participantId");
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") filter.team = teamId;
    if (participantId && participantId !== "all") filter.participant = participantId;
    if (status && status !== "all") filter.status = status;
    if (role && role !== "all") filter.role = { $regex: role, $options: "i" };
    if (search) {
      filter.$or = [
        { workDone: { $regex: search, $options: "i" } },
        { completedTasks: { $regex: search, $options: "i" } },
        { blockers: { $regex: search, $options: "i" } },
        { participantName: { $regex: search, $options: "i" } },
        { teamName: { $regex: search, $options: "i" } },
      ];
    }

    const workLogs = await WorkLog.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ workLogs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching work logs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const {
      participantId,
      participantName,
      teamId,
      teamName,
      role,
      workDone,
      completedTasks,
      nextSteps,
      blockers,
      timeSpentHours,
      evidenceUrl,
      status,
    } = body;

    // Resolve participant and team
    let pId = participantId;
    let pName = participantName;
    let tId = teamId;
    let tName = teamName;
    let userRole = role || "Developer";

    if (!pId && session?.participantId) {
      pId = session.participantId;
    }

    if (pId) {
      const part = await Participant.findById(pId).populate("team");
      if (part) {
        pName = part.name;
        userRole = role || part.roleInTeam;
        if (!tId && part.team) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tId = (part.team as any)._id;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tName = (part.team as any).name;
        }
      }
    }

    if (!pName) pName = session?.name || "Participant";
    if (!tId) {
      const firstTeam = await Team.findOne({});
      tId = firstTeam?._id;
      tName = firstTeam?.name || "Team Alpha";
    }

    if (!workDone) {
      return NextResponse.json({ error: "Today's work description is required" }, { status: 400 });
    }

    const workLog = await WorkLog.create({
      participant: pId || tId,
      participantName: pName,
      team: tId,
      teamName: tName || "Team Alpha",
      date: new Date(),
      role: userRole,
      workDone,
      completedTasks: completedTasks || "",
      nextSteps: nextSteps || "",
      blockers: blockers || "None",
      timeSpentHours: Number(timeSpentHours) || 2,
      evidenceUrl: evidenceUrl || "",
      status: status || "Completed",
    });

    // Update team lastActivityAt and slight progress boost
    await Team.findByIdAndUpdate(tId, {
      lastActivityAt: new Date(),
      $inc: { progress: 1 },
    });

    // Create activity
    await Activity.create({
      type: "WORKLOG_CREATED",
      title: `${pName} logged ${timeSpentHours || 2} hours for ${tName}`,
      description: workDone.length > 80 ? `${workDone.substring(0, 80)}...` : workDone,
      teamId: tId,
      teamName: tName,
      participantName: pName,
    });

    return NextResponse.json({ success: true, workLog });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating work log";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
