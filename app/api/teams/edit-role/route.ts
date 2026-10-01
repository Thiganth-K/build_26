import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Participant } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const { teamId, memberId, newRole } = await req.json();

    if (!teamId || !memberId || !newRole) {
      return NextResponse.json({ error: "teamId, memberId, and newRole are required." }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    const isLeader = team.members.some(
      (m: any) =>
        m.isLeader &&
        (m.participant?.toString() === session.participantId || m.email?.toLowerCase() === session.email.toLowerCase())
    );

    const isSelf = team.members.some(
      (m: any) =>
        (m.participant?.toString() === memberId || m._id?.toString() === memberId) &&
        (m.participant?.toString() === session.participantId || m.email?.toLowerCase() === session.email.toLowerCase())
    );

    if (!isLeader && !isSelf && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only the Team Lead or member themselves can edit role." }, { status: 403 });
    }

    const memberIndex = team.members.findIndex(
      (m: any) => m.participant?.toString() === memberId || m._id?.toString() === memberId
    );

    if (memberIndex === -1) {
      return NextResponse.json({ error: "Member not found in team." }, { status: 404 });
    }

    team.members[memberIndex].role = newRole.trim();
    await team.save();

    if (team.members[memberIndex].participant) {
      await Participant.findByIdAndUpdate(team.members[memberIndex].participant, {
        roleInTeam: newRole.trim(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Role updated to ${newRole}!`,
      team,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error editing role";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
