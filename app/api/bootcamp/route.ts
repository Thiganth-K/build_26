import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Bootcamp, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let bootcamp = await Bootcamp.findOne({});
    if (!bootcamp) {
      bootcamp = await Bootcamp.create({
        name: "BUILD26 2026",
        tagline: "Build • Ship • Showcase",
        status: "LIVE",
        currentPhase: "Ideation",
        dayNumber: 1,
        totalDays: 6,
      });
    }
    return NextResponse.json({ bootcamp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching bootcamp config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const bootcamp = await Bootcamp.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });

    // Log activity
    if (body.currentPhase || body.status || body.dayNumber) {
      await Activity.create({
        type: "ANNOUNCEMENT_PUBLISHED",
        title: `Bootcamp status updated: Phase ${bootcamp.currentPhase} (Day ${bootcamp.dayNumber})`,
        description: `Admin updated status to ${bootcamp.status}`,
        participantName: session.name,
      });
    }

    return NextResponse.json({ success: true, bootcamp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating bootcamp config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
