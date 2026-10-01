import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Participant, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

// GET /api/teams/invitations - Retrieve all pending invitations for the logged-in participant
export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const email = session.email.toLowerCase();

    const teams = await Team.find({
      "invitations.email": email,
      "invitations.status": "INVITED",
    })
      .select("name code teamSize members definedRoles invitations")
      .lean();

    const invitations = teams.map((t: any) => {
      const lead = t.members?.find((m: any) => m.isLeader) || t.members?.[0];
      const inv = t.invitations?.find((i: any) => i.email?.toLowerCase() === email && i.status === "INVITED");
      return {
        id: inv?._id ? inv._id.toString() : t._id.toString(),
        teamId: t._id.toString(),
        teamName: t.name,
        teamCode: t.code,
        teamSize: t.teamSize || 4,
        memberCount: t.members?.length || 0,
        isFull: (t.members?.length || 0) >= (t.teamSize || 4),
        leadName: lead?.name || "Team Lead",
        role: inv?.role || "Team Member",
        invitedAt: inv?.invitedAt,
        expiresAt: inv?.expiresAt,
      };
    });

    return NextResponse.json({ success: true, invitations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching invitations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/teams/invitations - Accept or Decline invitation
export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const { teamId, action } = await req.json();

    if (!teamId || !action) {
      return NextResponse.json({ error: "teamId and action are required." }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    const email = session.email.toLowerCase();
    const invIndex = (team.invitations || []).findIndex(
      (inv: any) => inv.email?.toLowerCase() === email
    );

    if (invIndex === -1) {
      return NextResponse.json({ error: "No invitation found for your email in this team." }, { status: 404 });
    }

    const invitation = team.invitations[invIndex];

    if (action.toUpperCase() === "ACCEPT") {
      // Check capacity
      const teamSize = team.teamSize || 4;
      if (team.members.length >= teamSize) {
        return NextResponse.json(
          { error: `This team is full (${team.members.length}/${teamSize} members).` },
          { status: 400 }
        );
      }

      // Find participant
      let participant: any = null;
      if (session.participantId) {
        participant = await Participant.findById(session.participantId);
      }
      if (!participant) {
        participant = await Participant.findOne({ email });
      }

      if (!participant) {
        return NextResponse.json({ error: "Participant profile not found. Please log in again." }, { status: 404 });
      }

      // Check if already in another team
      if (participant.team && participant.team.toString() !== team._id.toString()) {
        const otherTeam = await Team.findById(participant.team);
        return NextResponse.json(
          { error: `You are already a member of "${otherTeam?.name || "another team"}". You must leave your current team first.` },
          { status: 400 }
        );
      }

      // Check if role is taken; if so, assign first available defined role or fallback
      let assignedRole = invitation.role || "Developer";
      const isRoleTaken = team.members.some((m: any) => m.role?.toLowerCase() === assignedRole.toLowerCase());
      if (isRoleTaken && team.definedRoles && team.definedRoles.length > 0) {
        const takenRoles = team.members.map((m: any) => m.role?.toLowerCase());
        const availableRole = team.definedRoles.find((dr: any) => !takenRoles.includes(dr.role?.toLowerCase()));
        if (availableRole) {
          assignedRole = availableRole.role;
        }
      }

      // Check if already listed in team members
      const alreadyListed = team.members.some(
        (m: any) => m.email?.toLowerCase() === email || m.participant?.toString() === participant._id.toString()
      );

      if (!alreadyListed) {
        team.members.push({
          participant: participant._id,
          name: participant.name,
          email: participant.email,
          role: assignedRole,
          isLeader: false,
        });
      }

      invitation.status = "ACCEPTED";
      await team.save();

      participant.team = team._id;
      participant.roleInTeam = assignedRole;
      await participant.save();

      await Activity.create({
        type: "PARTICIPANT_JOINED",
        title: `${participant.name} accepted invitation to ${team.name}`,
        description: `Joined as ${assignedRole}`,
        teamId: team._id,
        teamName: team.name,
        participantName: participant.name,
      });

      return NextResponse.json({
        success: true,
        message: `Successfully joined ${team.name}!`,
        team,
      });
    } else {
      invitation.status = "DECLINED";
      await team.save();

      return NextResponse.json({
        success: true,
        message: `Declined invitation to ${team.name}.`,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error responding to invitation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
