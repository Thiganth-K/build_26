import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Activity, ProblemStatement, Participant, User } from "@/models";
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

    const {
      name,
      code,
      teamSize = 4,
      leadRole = "Full Stack Developer",
      definedRoles = [],
      invitations = [],
      problemStatementId,
      solutionTitle,
      solutionDescription,
      techStack,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Team name is required." }, { status: 400 });
    }

    const cleanTeamName = name.trim();

    // Rule 03: Team name must be unique
    const existingTeamName = await Team.findOne({
      name: { $regex: `^${cleanTeamName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });
    if (existingTeamName) {
      return NextResponse.json(
        {
          error: "TEAM NAME ALREADY EXISTS. Please choose another team name.",
          nameExists: true,
        },
        { status: 409 }
      );
    }

    // Rule 04: Team size must be 3 or 4
    const validTeamSize = Number(teamSize) === 3 ? 3 : 4;

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

    // Generate unique code in wireframe format: B26-X7K9
    const generateTeamCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let randomPart = "";
      for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `B26-${randomPart}`;
    };

    const finalCode = code?.trim().toUpperCase() || generateTeamCode();

    // Member list starting with Team Lead (Rule 05)
    const memberList = participant
      ? [
          {
            participant: participant._id,
            name: participant.name,
            email: participant.email,
            role: leadRole || "Team Lead",
            isLeader: true,
          },
        ]
      : session
      ? [
          {
            participant: session.participantId || session.id,
            name: session.name,
            email: session.email,
            role: leadRole || "Team Lead",
            isLeader: true,
          },
        ]
      : [];

    // Process valid invitations
    const invitationList: Array<{
      email: string;
      role: string;
      status: "INVITED";
      invitedBy: string;
      invitedAt: Date;
      expiresAt: Date;
    }> = [];
    const leadName = participant?.name || session?.name || "Team Lead";
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (Array.isArray(invitations)) {
      for (const inv of invitations) {
        if (inv && inv.email && inv.email.trim()) {
          invitationList.push({
            email: inv.email.trim().toLowerCase(),
            role: inv.role || "Developer",
            status: "INVITED",
            invitedBy: leadName,
            invitedAt: new Date(),
            expiresAt: sevenDaysFromNow,
          });
        }
      }
    }

    const newTeam = await Team.create({
      name: cleanTeamName,
      code: finalCode,
      teamSize: validTeamSize,
      problemStatement: problemStatementId || undefined,
      solutionTitle: solutionTitle || "",
      solutionDescription: solutionDescription || "",
      techStack: Array.isArray(techStack) ? techStack : ["Next.js", "TypeScript", "Tailwind CSS"],
      members: memberList,
      definedRoles: Array.isArray(definedRoles) ? definedRoles : [],
      invitations: invitationList,
      currentMilestoneDay: 1,
      currentPhase: "Problem Understanding",
      progress: 0,
      status: "ACTIVE",
    });

    // Link team to participant
    if (participant) {
      participant.team = newTeam._id;
      participant.roleInTeam = leadRole || "Team Lead";
      await participant.save();
    }

    if (problemStatementId) {
      await ProblemStatement.findByIdAndUpdate(problemStatementId, {
        $inc: { assignedTeamCount: 1 },
      });
    }

    // Create notifications for invited participants
    for (const inv of invitationList) {
      const invitedUser = await User.findOne({ email: inv.email });
      if (invitedUser) {
        await Activity.create({
          type: "PARTICIPANT_JOINED",
          title: `Invitation sent to ${inv.email}`,
          description: `Invited to join ${cleanTeamName} as ${inv.role}`,
          teamId: newTeam._id,
          teamName: cleanTeamName,
          participantName: participant?.name || session?.name,
        });
      }
    }

    await Activity.create({
      type: "TEAM_CREATED",
      title: `${cleanTeamName} was formed`,
      description: `New team registered with code ${finalCode}`,
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
