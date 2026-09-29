import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ScheduleEvent, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (day && day !== "all") {
      filter.day = Number(day);
    }

    const events = await ScheduleEvent.find(filter).sort({ day: 1, startTime: 1 }).lean();
    return NextResponse.json({ events });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching schedule";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { title, description, phase, day, startTime, endTime, location, type } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json({ error: "Title, start time, and end time are required" }, { status: 400 });
    }

    const event = await ScheduleEvent.create({
      title,
      description: description || "",
      phase: phase || "Ideation",
      day: Number(day) || 1,
      startTime,
      endTime,
      location: location || "Auditorium / Team Pods",
      type: type || "Milestone",
      isCompleted: false,
    });

    await Activity.create({
      type: "ANNOUNCEMENT_PUBLISHED",
      title: `Schedule updated: ${title}`,
      description: `Day ${day} at ${startTime}`,
      participantName: session?.name || "Admin",
    });

    return NextResponse.json({ success: true, event });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating schedule event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await ScheduleEvent.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, event });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    await ScheduleEvent.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Event removed" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
