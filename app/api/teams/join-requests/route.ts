import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Participant, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const teamId = body.teamId;
    const targetId = body.participantId || body.requestId;
    const action = body.action?.toUpperCase();

    if (!teamId || !targetId || !action) {
      return NextResponse.json({ error: "teamId, participantId/requestId, and action are required." }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Verify caller is team lead or admin
    const isLeader = team.members.some(
      (m: any) =>
        m.isLeader &&
        (m.participant?.toString() === session.participantId ||
         m.participant?.toString() === session.id ||
         m._id?.toString() === session.participantId ||
         m.email?.toLowerCase() === session.email.toLowerCase())
    );

    if (!isLeader && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only the Team Lead can approve or reject join requests." }, { status: 403 });
    }

    const requestIndex = (team.joinRequests || []).findIndex(
      (r: any) =>
        r._id?.toString() === targetId ||
        r.participant?.toString() === targetId ||
        r.email?.toLowerCase() === targetId.toLowerCase()
    );

    if (requestIndex === -1) {
      return NextResponse.json({ error: "Join request not found." }, { status: 404 });
    }

    const request = team.joinRequests[requestIndex];

    if (action === "ACCEPT") {
      // Check capacity
      const teamSize = team.teamSize || 4;
      if (team.members.length >= teamSize) {
        return NextResponse.json(
          { error: `Team is already full (${team.members.length}/${teamSize} members).` },
          { status: 400 }
        );
      }

      // Add to members if not already listed
      const alreadyMember = team.members.some(
        (m: any) =>
          (request.participant && m.participant?.toString() === request.participant.toString()) ||
          m.email?.toLowerCase() === request.email?.toLowerCase()
      );

      if (!alreadyMember) {
        team.members.push({
          participant: request.participant,
          name: request.name,
          email: request.email,
          role: request.requestedRole || "Developer",
          isLeader: false,
        });
      }

      request.status = "ACCEPTED";
      await team.save();

      // Update participant record
      if (request.participant) {
        await Participant.findByIdAndUpdate(request.participant, {
          team: team._id,
          roleInTeam: request.requestedRole || "Developer",
        });
      } else if (request.email) {
        await Participant.findOneAndUpdate(
          { email: request.email.toLowerCase() },
          {
            team: team._id,
            roleInTeam: request.requestedRole || "Developer",
          }
        );
      }

      await Activity.create({
        type: "PARTICIPANT_JOINED",
        title: `${request.name} joined ${team.name}`,
        description: `Team Lead approved join request for ${request.requestedRole}`,
        teamId: team._id,
        teamName: team.name,
        participantName: request.name,
      });

      return NextResponse.json({ success: true, message: `Approved ${request.name}!`, team });
    } else {
      request.status = "REJECTED";
      await team.save();

      return NextResponse.json({ success: true, message: `Rejected join request.`, team });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error handling join request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
