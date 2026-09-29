import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (session) {
      filter.$or = [
        { recipientUser: session.id },
        { recipientRole: session.role },
        { recipientRole: { $exists: false } },
      ];
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ notifications });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, readAll } = body;

    if (readAll) {
      await Notification.updateMany({ read: false }, { $set: { read: true } });
      return NextResponse.json({ success: true });
    }

    if (id) {
      await Notification.findByIdAndUpdate(id, { $set: { read: true } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating notification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
