import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, Participant, Activity } from "@/models";
import { signToken, setSessionCookie, SessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      name,
      email,
      admissionNumber,
      yearOfStudy,
      department,
      mobileNumber,
      password,
    } = body;

    // 1. Validate required fields
    if (!name || !email || !admissionNumber || !yearOfStudy || !department || !mobileNumber) {
      return NextResponse.json(
        {
          error:
            "All fields are required: Full Name, Email, Admission Number, Year of Study, Department, and Mobile Number.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanAdmission = admissionNumber.trim().toUpperCase();
    const cleanMobile = mobileNumber.trim();
    const cleanDepartment = department.trim();
    const cleanYear = yearOfStudy.trim();

    // 2. Already Account Exists Check (Email)
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          error: `An account with email "${cleanEmail}" already exists. Please sign in instead.`,
          accountExists: true,
          existingEmail: cleanEmail,
        },
        { status: 409 }
      );
    }

    // 3. Already Account Exists Check (Admission Number)
    const existingParticipant = await Participant.findOne({ admissionNumber: cleanAdmission });
    if (existingParticipant) {
      return NextResponse.json(
        {
          error: `Admission number "${cleanAdmission}" is already registered. Please sign in instead.`,
          accountExists: true,
          existingAdmissionNumber: cleanAdmission,
        },
        { status: 409 }
      );
    }

    // Also check if participant with that email exists
    const existingParticipantEmail = await Participant.findOne({ email: cleanEmail });
    if (existingParticipantEmail) {
      return NextResponse.json(
        {
          error: `A participant profile with email "${cleanEmail}" already exists. Please sign in instead.`,
          accountExists: true,
          existingEmail: cleanEmail,
        },
        { status: 409 }
      );
    }

    // 4. Hash password if provided
    let hashedPassword: string | undefined = undefined;
    if (password && password.trim()) {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    // 5. Create User record
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "PARTICIPANT",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        cleanName
      )}&backgroundColor=5e56e7&textColor=ffffff`,
    });

    // 6. Create Participant record (unassigned team -> triggers team onboarding)
    const participant = await Participant.create({
      user: user._id,
      name: cleanName,
      email: cleanEmail,
      admissionNumber: cleanAdmission,
      yearOfStudy: cleanYear,
      year: cleanYear,
      department: cleanDepartment,
      mobileNumber: cleanMobile,
      roleInTeam: "Participant",
      skills: ["Web Development", "Prototyping"],
      contributionScore: 85,
      attendance: "Present",
      status: "ACTIVE",
      avatar: user.avatar,
    });

    user.participantId = participant._id;
    await user.save();

    // 7. Log Activity
    await Activity.create({
      type: "PARTICIPANT_JOINED",
      title: `${cleanName} registered for BUILD26`,
      description: `New participant checked in from ${cleanDepartment} (${cleanAdmission})`,
      participantName: cleanName,
      avatar: user.avatar,
    });

    // 8. Sign Token and return session
    const sessionPayload: SessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: "PARTICIPANT",
      participantId: participant._id.toString(),
      department: participant.department,
      avatar: user.avatar,
    };

    const token = signToken(sessionPayload);
    const response = NextResponse.json({
      success: true,
      message: "Registration successful! Welcome to BUILD26.",
      user: sessionPayload,
      redirectUrl: "/participant",
    });

    setSessionCookie(response.headers, token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during registration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
