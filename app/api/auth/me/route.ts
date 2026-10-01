import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, clearSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Participant, Team } from "@/models";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ user: null, hasTeam: false }, { status: 200 });
    }

    await connectToDatabase();

    let participantData = null;
    let teamData = null;

    if (session.role === "PARTICIPANT") {
      let p = null;
      if (session.participantId) {
        p = await Participant.findById(session.participantId).populate("team");
      }
      if (!p) {
        p = await Participant.findOne({
          $or: [{ user: session.id }, { email: session.email.toLowerCase() }],
        }).populate("team");
      }

      if (p) {
        session.participantId = p._id.toString();
        participantData = p;

        if (p.team) {
          session.teamId = (p.team._id || p.team).toString();
          teamData = await Team.findById(p.team._id || p.team)
            .populate("problemStatement", "title category description")
            .lean();
        } else {
          session.teamId = undefined;
        }
      }
    }

    // Find any teams where this user is invited
    let pendingInvitations: any[] = [];
    if (session.email) {
      const invitedTeams = await Team.find({
        "invitations.email": session.email.toLowerCase(),
        "invitations.status": "INVITED",
      }).lean();

      pendingInvitations = invitedTeams.map((t: any) => {
        const lead = t.members?.find((m: any) => m.isLeader) || t.members?.[0];
        const inv = t.invitations?.find((i: any) => i.email === session.email.toLowerCase());
        return {
          teamId: t._id,
          teamName: t.name,
          teamCode: t.code,
          teamSize: t.teamSize || 4,
          memberCount: t.members?.length || 0,
          leadName: lead?.name || "Team Lead",
          proposedRole: inv?.role || "Team Member",
        };
      });
    }

    return NextResponse.json({
      user: session,
      participant: participantData,
      team: teamData,
      hasTeam: Boolean(session.teamId),
      invitations: pendingInvitations,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error verifying session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response.headers);
  return response;
}
