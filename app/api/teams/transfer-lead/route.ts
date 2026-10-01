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
    const targetLeadId = body.newLeadId || body.newLeadParticipantId;

    if (!teamId || !targetLeadId) {
      return NextResponse.json({ error: "teamId and newLeadId are required." }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Verify caller is current leader
    const currentLeaderIndex = team.members.findIndex(
      (m: any) =>
        m.isLeader &&
        (m.participant?.toString() === session.participantId || 
         m.email?.toLowerCase() === session.email.toLowerCase() ||
         m._id?.toString() === session.participantId)
    );

    if (currentLeaderIndex === -1 && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only the current Team Lead can transfer leadership." }, { status: 403 });
    }

    // Find new leader in members
    const newLeaderIndex = team.members.findIndex(
      (m: any) =>
        m.participant?.toString() === targetLeadId ||
        m._id?.toString() === targetLeadId ||
        m.id?.toString() === targetLeadId ||
        m.email?.toLowerCase() === targetLeadId?.toLowerCase()
    );

    if (newLeaderIndex === -1) {
      return NextResponse.json({ error: "Target member is not in this team." }, { status: 404 });
    }

    // Rule 11 & 12: Previous lead becomes normal member, target becomes leader
    const previousLeaderName = team.members[currentLeaderIndex]?.name || session.name;
    const newLeaderName = team.members[newLeaderIndex].name;

    // Reset all leaders to false first (Rule 13: Only one active Team Lead)
    team.members.forEach((m: any) => {
      m.isLeader = false;
    });

    team.members[newLeaderIndex].isLeader = true;
    await team.save();

    // Update participants' roles if needed
    if (team.members[newLeaderIndex].participant) {
      await Participant.findByIdAndUpdate(team.members[newLeaderIndex].participant, {
        roleInTeam: team.members[newLeaderIndex].role || "Team Lead",
      });
    }

    await Activity.create({
      type: "TEAM_CREATED",
      title: `Team Leadership Transferred`,
      description: `${previousLeaderName} transferred leadership of ${team.name} to ${newLeaderName}`,
      teamId: team._id,
      teamName: team.name,
      participantName: newLeaderName,
    });

    return NextResponse.json({
      success: true,
      message: `Leadership successfully transferred to ${newLeaderName}!`,
      team,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error transferring leadership";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
