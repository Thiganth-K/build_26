import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim();

    if (!name) {
      return NextResponse.json({ available: false, error: "Team name is required." }, { status: 400 });
    }

    const existing = await Team.findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        error: "TEAM NAME ALREADY EXISTS. Please choose another team name.",
      });
    }

    return NextResponse.json({
      available: true,
      message: "✓ Team name available",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error checking team name";
    return NextResponse.json({ available: false, error: message }, { status: 500 });
  }
}
