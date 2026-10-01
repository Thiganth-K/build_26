import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Participant, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in to join a team." }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { teamIdOrCode, roleInTeam } = body;

    if (!teamIdOrCode || typeof teamIdOrCode !== "string" || !teamIdOrCode.trim()) {
      return NextResponse.json(
        { error: "Please enter a valid Team Code (e.g. B26-ALPHA) or Team ID." },
        { status: 400 }
      );
    }

    const cleanInput = teamIdOrCode.trim();

    // 1. Locate current participant record
    let participant: any = null;
    if (session.participantId) {
      participant = await Participant.findById(session.participantId);
    }
    if (!participant) {
      participant = await Participant.findOne({
        $or: [{ user: session.id }, { email: session.email.toLowerCase() }],
      });
    }

    if (!participant) {
      return NextResponse.json(
        { error: "Participant profile not found. Please log in again to verify your student profile." },
        { status: 404 }
      );
    }

    // 2. Check if participant already belongs to a team
    if (participant.team) {
      const existingTeam = await Team.findById(participant.team);
      if (existingTeam) {
        return NextResponse.json(
          {
            error: `You are already a member of "${existingTeam.name}" (${existingTeam.code}). Participants cannot join multiple teams.`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Find the team by Code or ObjectId or Name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orQueries: any[] = [
      { code: { $regex: `^${cleanInput}$`, $options: "i" } },
      { name: { $regex: `^${cleanInput}$`, $options: "i" } },
    ];

    if (mongoose.Types.ObjectId.isValid(cleanInput)) {
      orQueries.push({ _id: cleanInput });
    }

    const team = await Team.findOne({ $or: orQueries });

    if (!team) {
      return NextResponse.json(
        {
          error: `No team found with Code or ID "${cleanInput}". Please confirm the exact team code with your team lead.`,
        },
        { status: 404 }
      );
    }

    // 4. Capacity check (Max teamSize fixed at creation)
    const MAX_TEAM_SIZE = team.teamSize || 4;
    const currentMemberCount = team.members ? team.members.length : 0;
    if (currentMemberCount >= MAX_TEAM_SIZE) {
      return NextResponse.json(
        {
          error: `Team "${team.name}" is already at full capacity (${currentMemberCount}/${MAX_TEAM_SIZE} members).`,
        },
        { status: 400 }
      );
    }

    const chosenRole = roleInTeam?.trim() || "Frontend Developer";

    // Validate that chosen role is configured and not already taken (Requirements 4 & 5)
    if (team.definedRoles && team.definedRoles.length > 0) {
      const isConfigured = team.definedRoles.some((dr: any) => dr.role?.toLowerCase() === chosenRole.toLowerCase());
      if (!isConfigured) {
        return NextResponse.json(
          { error: `The role "${chosenRole}" is not configured for ${team.name}. Please select from the available roles.` },
          { status: 400 }
        );
      }

      const roleAssigned = team.members.some((m: any) => m.role?.toLowerCase() === chosenRole.toLowerCase());
      if (roleAssigned) {
        const assignedMember = team.members.find((m: any) => m.role?.toLowerCase() === chosenRole.toLowerCase());
        return NextResponse.json(
          { error: `The role "${chosenRole}" is already assigned to ${assignedMember?.name || "another member"}.` },
          { status: 400 }
        );
      }
    }

    const requestOnly = body.requestOnly ?? false;

    // Check if participant was already invited
    const hasInvitation = (team.invitations || []).some(
      (inv: any) =>
        inv.email?.toLowerCase() === participant.email?.toLowerCase() && inv.status === "INVITED"
    );

    if (requestOnly && !hasInvitation) {
      // Add or update in joinRequests
      if (!team.joinRequests) team.joinRequests = [];
      const existingReqIndex = team.joinRequests.findIndex(
        (r: any) => r.email?.toLowerCase() === participant.email?.toLowerCase()
      );

      if (existingReqIndex >= 0) {
        team.joinRequests[existingReqIndex].status = "PENDING";
        team.joinRequests[existingReqIndex].requestedRole = chosenRole;
      } else {
        team.joinRequests.push({
          participant: participant._id,
          name: participant.name,
          email: participant.email,
          requestedRole: chosenRole,
          status: "PENDING",
          requestedAt: new Date(),
        });
      }
      await team.save();

      await Activity.create({
        type: "PARTICIPANT_JOINED",
        title: `${participant.name} requested to join ${team.name}`,
        description: `Requested role: ${chosenRole}`,
        teamId: team._id,
        teamName: team.name,
        participantName: participant.name,
      });

      return NextResponse.json({
        success: true,
        requested: true,
        message: "Join request submitted! Awaiting Team Lead approval.",
        team: {
          name: team.name,
          code: team.code,
        },
      });
    }

    // 5. Add participant to team members if not already listed
    const alreadyListed = team.members.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any) =>
        m.participant?.toString() === participant._id.toString() ||
        m.email?.toLowerCase() === participant.email.toLowerCase()
    );

    if (!alreadyListed) {
      team.members.push({
        participant: participant._id,
        name: participant.name,
        email: participant.email,
        role: chosenRole,
        isLeader: false,
      });

      // If they had an invitation, mark it accepted
      if (team.invitations) {
        team.invitations.forEach((inv: any) => {
          if (inv.email?.toLowerCase() === participant.email?.toLowerCase()) {
            inv.status = "ACCEPTED";
          }
        });
      }
      await team.save();
    }

    // 6. Link participant to team
    participant.team = team._id;
    participant.roleInTeam = chosenRole;
    await participant.save();

    // 7. Log activity
    await Activity.create({
      type: "PARTICIPANT_JOINED",
      title: `${participant.name} joined ${team.name}`,
      description: `Joined team ${team.code} as ${chosenRole}`,
      teamId: team._id,
      teamName: team.name,
      participantName: participant.name,
      avatar: participant.avatar,
    });

    return NextResponse.json({
      success: true,
      message: `You have successfully joined ${team.name}!`,
      team,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error joining team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
