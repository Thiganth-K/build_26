import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Mentor, Team, User, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const mentors = await Mentor.find({})
      .populate("assignedTeams", "name code currentPhase progress")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ mentors });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching mentors";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { name, email, designation, organization, expertise, availability, assignedTeams } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const mentor = await Mentor.create({
      name,
      email: email.toLowerCase(),
      designation: designation || "Industry Mentor",
      organization: organization || "Tech Innovators",
      expertise: Array.isArray(expertise) ? expertise : (expertise ? expertise.split(",").map((e: string) => e.trim()) : ["Software Engineering"]),
      availability: availability || "Daily 4:00 PM - 7:00 PM",
      assignedTeams: assignedTeams || [],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=111111&textColor=ffffff`,
    });

    // Create user account for mentor if not exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        role: "MENTOR",
        avatar: mentor.avatar,
        mentorId: mentor._id,
      });
    } else {
      user.mentorId = mentor._id;
      user.role = "MENTOR";
      await user.save();
    }

    // If teams assigned, update them
    if (assignedTeams && assignedTeams.length > 0) {
      await Team.updateMany({ _id: { $in: assignedTeams } }, { $set: { mentor: mentor._id } });
    }

    await Activity.create({
      type: "ANNOUNCEMENT_PUBLISHED",
      title: `Mentor added: ${name}`,
      description: `${designation} at ${organization}`,
      participantName: session?.name || "Admin",
    });

    return NextResponse.json({ success: true, mentor });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error adding mentor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, teamId, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Mentor ID is required" }, { status: 400 });
    }

    if (action === "assign" && teamId) {
      await Mentor.findByIdAndUpdate(id, { $addToSet: { assignedTeams: teamId } });
      await Team.findByIdAndUpdate(teamId, { $set: { mentor: id } });
    } else if (action === "unassign" && teamId) {
      await Mentor.findByIdAndUpdate(id, { $pull: { assignedTeams: teamId } });
      await Team.findByIdAndUpdate(teamId, { $unset: { mentor: 1 } });
    } else {
      await Mentor.findByIdAndUpdate(id, { $set: updates });
    }

    const updatedMentor = await Mentor.findById(id).populate("assignedTeams", "name code currentPhase progress");
    return NextResponse.json({ success: true, mentor: updatedMentor });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating mentor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
