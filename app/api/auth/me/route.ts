import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, clearSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Participant } from "@/models";

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
          teamData = p.team;
        } else {
          session.teamId = undefined;
        }
      }
    }

    return NextResponse.json({
      user: session,
      participant: participantData,
      team: teamData,
      hasTeam: Boolean(session.teamId),
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
