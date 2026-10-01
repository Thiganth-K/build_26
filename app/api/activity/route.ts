import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") {
      filter.teamId = teamId;
    }

    const activities = await Activity.find(filter).sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json({ activities });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching activities";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { type, title, description, teamId, teamName } = body;

    const activity = await Activity.create({
      type: type || "WORK_LOG_CREATED",
      title: title || "New activity recorded",
      description: description || "",
      teamId: teamId || null,
      teamName: teamName || "",
      participantName: session?.name || "Participant",
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating activity";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
