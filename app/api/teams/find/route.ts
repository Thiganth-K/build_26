import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, ProblemStatement } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Team code is required." }, { status: 400 });
    }

    const team = await Team.findOne({ code })
      .populate("problemStatement", "title category description")
      .lean();

    if (!team) {
      return NextResponse.json(
        { error: "No team found with this code. Please verify and try again." },
        { status: 404 }
      );
    }

    const leader = team.members?.find((m: any) => m.isLeader) || team.members?.[0];
    const teamSize = team.teamSize || 4;
    const currentMemberCount = team.members?.length || 0;
    const isFull = currentMemberCount >= teamSize;

    // Requirement 4 & 5: Roles MUST come from this specific team's configuration
    const configuredRolesList: string[] = [];
    if (team.definedRoles && team.definedRoles.length > 0) {
      team.definedRoles.forEach((dr: any) => {
        if (dr.role && !configuredRolesList.includes(dr.role)) {
          configuredRolesList.push(dr.role);
        }
      });
    }

    // Fallback if legacy team has no definedRoles
    if (configuredRolesList.length === 0) {
      (team.members || []).forEach((m: any) => {
        if (m.role && !configuredRolesList.includes(m.role)) {
          configuredRolesList.push(m.role);
        }
      });
      if (configuredRolesList.length === 0) {
        configuredRolesList.push("Frontend Developer", "Backend Developer", "UI/UX Designer", "AI/ML Developer");
      }
    }

    // Build assignment status for each configured role
    const teamRoles = configuredRolesList.map((roleName) => {
      const assignedMember = (team.members || []).find(
        (m: any) => m.role?.toLowerCase() === roleName.toLowerCase()
      );
      return {
        role: roleName,
        isAssigned: Boolean(assignedMember),
        assignedTo: assignedMember ? assignedMember.name : null,
      };
    });

    const availableRoles = teamRoles.filter((r) => !r.isAssigned).map((r) => r.role);

    return NextResponse.json({
      success: true,
      team: {
        _id: team._id.toString(),
        name: team.name,
        code: team.code,
        leadName: leader ? leader.name : "Team Lead",
        teamSize,
        currentMemberCount,
        isFull,
        members: team.members,
        problemTitle: (team.problemStatement as any)?.title || "Not yet selected",
        teamRoles,
        availableRoles: availableRoles.length > 0 ? availableRoles : [configuredRolesList[0]],
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error finding team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
