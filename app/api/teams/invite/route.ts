import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, User, Participant, Activity, Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    await connectToDatabase();
    const { teamId, email, role } = await req.json();

    if (!teamId || !email) {
      return NextResponse.json({ error: "teamId and email are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role?.trim() || "Developer";

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Verify user authorization: only team lead or admin can invite
    const isLeader = team.members.some(
      (m: any) =>
        m.isLeader &&
        (m.participant?.toString() === session.participantId || m.email?.toLowerCase() === session.email.toLowerCase())
    );

    if (!isLeader && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only the Team Lead can invite members." }, { status: 403 });
    }

    // Capacity Check
    const teamSize = team.teamSize || 4;
    if (team.members.length >= teamSize) {
      return NextResponse.json(
        { error: `This team is full (${team.members.length}/${teamSize} members).` },
        { status: 400 }
      );
    }

    // Rule 06 & 07: Search registered users
    const registeredUser = await User.findOne({ email: cleanEmail });
    const registeredParticipant = await Participant.findOne({ email: cleanEmail });

    if (!registeredUser && !registeredParticipant) {
      // Wireframe Section 09 & Rule 07 exact wording
      return NextResponse.json(
        {
          error: "Participant not registered. Ask them to sign up first.",
          notRegistered: true,
        },
        { status: 404 }
      );
    }

    // Check if participant already belongs to any team
    if (registeredParticipant && registeredParticipant.team) {
      const otherTeam = await Team.findById(registeredParticipant.team);
      if (otherTeam) {
        if (otherTeam._id.toString() === team._id.toString()) {
          return NextResponse.json({ error: "Participant is already a member of this team." }, { status: 400 });
        } else {
          return NextResponse.json(
            { error: `${registeredParticipant.name} is already a member of another team (${otherTeam.name}).` },
            { status: 400 }
          );
        }
      }
    }

    // Check if role is configured for this team
    if (team.definedRoles && team.definedRoles.length > 0) {
      const isConfigured = team.definedRoles.some((dr: any) => dr.role?.toLowerCase() === cleanRole.toLowerCase());
      if (!isConfigured) {
        return NextResponse.json(
          { error: `Role "${cleanRole}" is not one of the configured roles for ${team.name}.` },
          { status: 400 }
        );
      }
    }

    // Check if role is already assigned to another active team member
    const alreadyAssigned = team.members.some((m: any) => m.role?.toLowerCase() === cleanRole.toLowerCase());
    if (alreadyAssigned) {
      const assignedMember = team.members.find((m: any) => m.role?.toLowerCase() === cleanRole.toLowerCase());
      return NextResponse.json(
        {
          error: `Role "${cleanRole}" is already assigned to ${assignedMember?.name || "another member"}.`,
        },
        { status: 400 }
      );
    }

    // Check if already invited and pending
    if (!team.invitations) team.invitations = [];
    const existingInv = team.invitations.find((i: any) => i.email?.toLowerCase() === cleanEmail);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let activeInv: any = null;
    if (existingInv) {
      existingInv.role = cleanRole;
      existingInv.status = "INVITED";
      existingInv.invitedBy = session.name;
      existingInv.invitedAt = new Date();
      existingInv.expiresAt = expiresAt;
      activeInv = existingInv;
    } else {
      team.invitations.push({
        email: cleanEmail,
        role: cleanRole,
        status: "INVITED",
        invitedBy: session.name,
        invitedAt: new Date(),
        expiresAt,
      });
      activeInv = team.invitations[team.invitations.length - 1];
    }

    await team.save();

    const participantName = registeredParticipant?.name || registeredUser?.name || cleanEmail;

    // Send in-app notification
    await Notification.create({
      recipientUser: registeredUser?._id,
      recipientRole: "PARTICIPANT",
      type: "INVITATION",
      title: `Team Invitation: ${team.name}`,
      message: `${session.name} invited you to join ${team.name} as ${cleanRole}`,
      link: "/participant",
    });

    await Activity.create({
      type: "PARTICIPANT_JOINED",
      title: `Invitation sent to ${participantName}`,
      description: `Invited to join ${team.name} as ${cleanRole}`,
      teamId: team._id,
      teamName: team.name,
      participantName: session.name,
    });

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      invitation: {
        id: activeInv?._id ? activeInv._id.toString() : team._id.toString(),
        teamId: team._id.toString(),
        teamName: team.name,
        email: cleanEmail,
        role: cleanRole,
        status: "pending",
        invitedBy: session.name,
        invitedAt: activeInv?.invitedAt || new Date(),
        expiresAt,
      },
      invitations: team.invitations,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error sending invitation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Cancel / revoke an invitation
export async function DELETE(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!teamId || !email) {
      return NextResponse.json({ error: "teamId and email are required." }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    team.invitations = (team.invitations || []).filter(
      (inv: any) => inv.email?.toLowerCase() !== email
    );

    await team.save();

    return NextResponse.json({
      success: true,
      message: `Invitation to ${email} cancelled.`,
      invitations: team.invitations,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error cancelling invitation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
