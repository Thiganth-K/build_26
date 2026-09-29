import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execPromise("node scripts/seed.mjs");
    return NextResponse.json({ success: true, message: "Database seeded successfully", stdout, stderr });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error running seed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
