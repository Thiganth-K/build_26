import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Announcement, Activity, Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (audience && audience !== "all") {
      filter.$or = [{ audience: "Everyone" }, { audience }];
    }

    const announcements = await Announcement.find(filter)
      .populate("targetTeam", "name code")
      .sort({ publishedAt: -1 })
      .lean();

    return NextResponse.json({ announcements });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching announcements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { title, message, audience, priority, targetTeam } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const announcement = await Announcement.create({
      title,
      message,
      audience: audience || "Everyone",
      priority: priority || "Normal",
      targetTeam: targetTeam || undefined,
      author: session?.name || "Build26 Operations Command",
      publishedAt: new Date(),
    });

    await Activity.create({
      type: "ANNOUNCEMENT_PUBLISHED",
      title: `Announcement: ${title}`,
      description: message.length > 90 ? `${message.substring(0, 90)}...` : message,
      participantName: session?.name || "Operations",
    });

    await Notification.create({
      recipientRole: audience === "Mentors" ? "MENTOR" : "PARTICIPANT",
      type: "ANNOUNCEMENT",
      title: `Announcement: ${title}`,
      message,
      link: "/participant",
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error broadcasting announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Announcement ID required" }, { status: 400 });
    }

    await Announcement.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Announcement deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
