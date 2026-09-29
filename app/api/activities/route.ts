import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Activity } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 25;

    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ activities });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching activities";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const activity = await Activity.create({
      type: body.type || "TASK_UPDATED",
      title: body.title,
      description: body.description || "",
      teamId: body.teamId,
      teamName: body.teamName,
      participantName: body.participantName,
      avatar: body.avatar,
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating activity";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
