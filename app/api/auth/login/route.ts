import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, Participant, Mentor, Team } from "@/models";
import { signToken, setSessionCookie, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, role, demo } = body;

    let user;

    if (demo) {
      // One-click demo login switch
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        user = await User.findOne({ role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN" });
      } else if (role === "MENTOR") {
        user = await User.findOne({ role: "MENTOR" });
      } else {
        // Participant (default to Thiganth K. or first participant)
        user = await User.findOne({ role: "PARTICIPANT" });
      }
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      // Fallback: create or find first admin
      user = await User.findOne({});
      if (!user) {
        return NextResponse.json({ error: "No users found. Please run database seed." }, { status: 404 });
      }
    }

    // Look up participant / team info if participant
    let participantId: string | undefined;
    let teamId: string | undefined;
    let mentorId: string | undefined;

    if (user.role === "PARTICIPANT") {
      const p = await Participant.findOne({ user: user._id });
      if (p) {
        participantId = p._id.toString();
        teamId = p.team?.toString();
      }
    } else if (user.role === "MENTOR") {
      const m = await Mentor.findOne({ email: user.email });
      if (m) {
        mentorId = m._id.toString();
      }
    }

    const sessionPayload: SessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      participantId,
      teamId,
      mentorId,
      avatar: user.avatar,
    };

    const token = signToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
    });

    setSessionCookie(response.headers, token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
