import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Participant, User, Team, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const department = searchParams.get("department");
    const teamId = searchParams.get("teamId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { roleInTeam: { $regex: search, $options: "i" } },
      ];
    }
    if (department && department !== "all") {
      filter.department = department;
    }
    if (teamId && teamId !== "all") {
      filter.team = teamId;
    }

    const participants = await Participant.find(filter)
      .populate("team", "name code currentPhase")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ participants });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching participants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { name, email, department, year, roleInTeam, skills, teamId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        role: "PARTICIPANT",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=5e56e7&textColor=ffffff`,
      });
    }

    const participant = await Participant.create({
      user: user._id,
      name,
      email: email.toLowerCase(),
      department: department || "Computer Science",
      year: year || "3rd Year",
      team: teamId || undefined,
      roleInTeam: roleInTeam || "Developer",
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s: string) => s.trim()) : ["Web Dev"]),
      status: "ACTIVE",
      avatar: user.avatar,
    });

    user.participantId = participant._id;
    await user.save();

    if (teamId) {
      await Team.findByIdAndUpdate(teamId, {
        $push: {
          members: {
            participant: participant._id,
            name: participant.name,
            email: participant.email,
            role: participant.roleInTeam,
            isLeader: false,
          },
        },
      });
    }

    await Activity.create({
      type: "PARTICIPANT_JOINED",
      title: `${name} registered for Build26`,
      description: `Added to ${department || "Computer Science"}`,
      participantName: name,
      avatar: user.avatar,
    });

    return NextResponse.json({ success: true, participant });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating participant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Participant ID required" }, { status: 400 });
    }

    const participant = await Participant.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, participant });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating participant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
