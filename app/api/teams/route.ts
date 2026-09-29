import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Activity, ProblemStatement, Participant } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const phase = searchParams.get("phase");
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { solutionTitle: { $regex: search, $options: "i" } },
      ];
    }
    if (phase && phase !== "all") {
      filter.currentPhase = phase;
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    const teams = await Team.find(filter)
      .populate("problemStatement")
      .populate("mentor")
      .sort({ progress: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json({ teams });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching teams";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { name, code, problemStatementId, solutionTitle, solutionDescription, techStack } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    // Identify participant if session exists
    let participant: any = null;
    if (session) {
      if (session.participantId) {
        participant = await Participant.findById(session.participantId);
      }
      if (!participant) {
        participant = await Participant.findOne({
          $or: [{ user: session.id }, { email: session.email.toLowerCase() }],
        });
      }

      // Check if participant already has a team
      if (participant && participant.team) {
        const existingTeam = await Team.findById(participant.team);
        if (existingTeam) {
          return NextResponse.json(
            {
              error: `You are already a member of "${existingTeam.name}" (${existingTeam.code}). You cannot create another team.`,
            },
            { status: 400 }
          );
        }
      }
    }

    const cleanTeamName = name.trim();
    const cleanPrefix = cleanTeamName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 5)
      .toUpperCase();
    const generatedCode =
      code || `B26-${cleanPrefix || "TEAM"}-${Math.floor(100 + Math.random() * 900)}`;

    const memberList = participant
      ? [
          {
            participant: participant._id,
            name: participant.name,
            email: participant.email,
            role: "Team Lead",
            isLeader: true,
          },
        ]
      : session
      ? [
          {
            participant: session.participantId || session.id,
            name: session.name,
            email: session.email,
            role: "Team Lead",
            isLeader: true,
          },
        ]
      : [];

    const newTeam = await Team.create({
      name: cleanTeamName,
      code: generatedCode,
      problemStatement: problemStatementId || undefined,
      solutionTitle: solutionTitle || "",
      solutionDescription: solutionDescription || "",
      techStack: Array.isArray(techStack) ? techStack : ["Next.js", "TypeScript"],
      members: memberList,
      currentPhase: "Problem Understanding",
      progress: 10,
      status: "ACTIVE",
    });

    // Link team to participant
    if (participant) {
      participant.team = newTeam._id;
      participant.roleInTeam = "Team Lead";
      await participant.save();
    }

    if (problemStatementId) {
      await ProblemStatement.findByIdAndUpdate(problemStatementId, {
        $inc: { assignedTeamCount: 1 },
      });
    }

    await Activity.create({
      type: "TEAM_CREATED",
      title: `${cleanTeamName} was formed`,
      description: `New team registered with code ${generatedCode}`,
      teamId: newTeam._id,
      teamName: cleanTeamName,
      participantName: participant?.name || session?.name || "Participant",
    });

    return NextResponse.json({ success: true, team: newTeam });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
