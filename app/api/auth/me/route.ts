import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, clearSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Participant } from "@/models";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Refresh participant/team details if participant
    if (session.role === "PARTICIPANT" && !session.teamId) {
      await connectToDatabase();
      const p = await Participant.findOne({ user: session.id });
      if (p && p.team) {
        session.teamId = p.team.toString();
        session.participantId = p._id.toString();
      }
    }

    return NextResponse.json({ user: session });
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
