import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, Participant } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const admissionNumber = searchParams.get("admissionNumber")?.trim().toUpperCase();

    if (!email && !admissionNumber) {
      return NextResponse.json({ error: "Email or admission number required" }, { status: 400 });
    }

    let existingByEmail = null;
    let existingByAdmission = null;

    if (email) {
      existingByEmail = await User.findOne({ email });
      if (!existingByEmail) {
        existingByEmail = await Participant.findOne({ email });
      }
    }

    if (admissionNumber) {
      existingByAdmission = await Participant.findOne({ admissionNumber });
    }

    const exists = Boolean(existingByEmail || existingByAdmission);

    let message = "";
    if (existingByEmail && existingByAdmission) {
      message = "Both email and admission number are already registered.";
    } else if (existingByEmail) {
      message = `An account with email "${email}" already exists.`;
    } else if (existingByAdmission) {
      message = `Admission number "${admissionNumber}" is already registered.`;
    }

    return NextResponse.json({
      exists,
      emailExists: Boolean(existingByEmail),
      admissionExists: Boolean(existingByAdmission),
      message,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error checking user existence";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
