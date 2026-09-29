import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Activity, ProblemStatement } from "@/models";
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

    if (!name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    const generatedCode = code || `B26-${name.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newTeam = await Team.create({
      name,
      code: generatedCode,
      problemStatement: problemStatementId || undefined,
      solutionTitle: solutionTitle || "",
      solutionDescription: solutionDescription || "",
      techStack: techStack || ["Next.js", "TypeScript"],
      members: session
        ? [
            {
              participant: session.participantId || session.id,
              name: session.name,
              email: session.email,
              role: "Team Lead",
              isLeader: true,
            },
          ]
        : [],
      currentPhase: "Problem Understanding",
      progress: 10,
      status: "ACTIVE",
    });

    if (problemStatementId) {
      await ProblemStatement.findByIdAndUpdate(problemStatementId, {
        $inc: { assignedTeamCount: 1 },
      });
    }

    await Activity.create({
      type: "TEAM_CREATED",
      title: `${name} was formed`,
      description: `New team registered with code ${generatedCode}`,
      teamId: newTeam._id,
      teamName: name,
      participantName: session?.name || "Organizer",
    });

    return NextResponse.json({ success: true, team: newTeam });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
