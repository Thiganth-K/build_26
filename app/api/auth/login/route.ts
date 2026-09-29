import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, Participant, Mentor, Team } from "@/models";
import { signToken, setSessionCookie, SessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      identifier,
      email,
      password,
      // In case signup payload was posted here
      name,
      admissionNumber,
      yearOfStudy,
      department,
      mobileNumber,
      mode,
    } = body;

    // 1. IF FULL SIGNUP PAYLOAD IS POSTED
    if (mode === "SIGNUP" || (name && admissionNumber && department)) {
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
      const cleanAdmission = admissionNumber.trim().toUpperCase();

      // Check if already exists
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json(
          {
            error: `An account with email "${cleanEmail}" already exists. Please sign in instead.`,
            accountExists: true,
          },
          { status: 409 }
        );
      }

      const existingParticipant = await Participant.findOne({
        $or: [{ admissionNumber: cleanAdmission }, { email: cleanEmail }],
      });
      if (existingParticipant) {
        return NextResponse.json(
          {
            error: `An account with this email or admission number already exists. Please sign in instead.`,
            accountExists: true,
          },
          { status: 409 }
        );
      }

      const hashedPassword = password && password.trim() ? await bcrypt.hash(password.trim(), 10) : undefined;
      const cleanName = name.trim();

      const user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: "PARTICIPANT",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          cleanName
        )}&backgroundColor=5e56e7&textColor=ffffff`,
      });

      const participant = await Participant.create({
        user: user._id,
        name: cleanName,
        email: cleanEmail,
        admissionNumber: cleanAdmission,
        yearOfStudy: yearOfStudy.trim(),
        year: yearOfStudy.trim(),
        department: department.trim(),
        mobileNumber: mobileNumber.trim(),
        roleInTeam: "Participant",
        skills: ["Web Development"],
        contributionScore: 85,
        attendance: "Present",
        status: "ACTIVE",
        avatar: user.avatar,
      });

      user.participantId = participant._id;
      await user.save();

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
        message: "Sign up successful!",
        user: sessionPayload,
        redirectUrl: "/participant",
      });

      setSessionCookie(response.headers, token);
      return response;
    }

    // 2. SIGN IN WITH EMAIL OR ADMISSION NUMBER
    const rawIdentifier = (identifier || email || "").trim();
    if (!rawIdentifier) {
      return NextResponse.json(
        { error: "Please enter your registered email address or admission number." },
        { status: 400 }
      );
    }

    let user = null;
    let participantDoc = null;

    // A. Check if identifier is an email
    if (rawIdentifier.includes("@")) {
      user = await User.findOne({ email: rawIdentifier.toLowerCase() });
      if (!user) {
        participantDoc = await Participant.findOne({ email: rawIdentifier.toLowerCase() });
        if (participantDoc && participantDoc.user) {
          user = await User.findById(participantDoc.user);
        }
      }
    } else {
      // B. Check if identifier is an Admission Number
      participantDoc = await Participant.findOne({
        admissionNumber: { $regex: `^${rawIdentifier}$`, $options: "i" },
      });
      if (participantDoc) {
        user = await User.findOne({
          $or: [{ _id: participantDoc.user }, { email: participantDoc.email.toLowerCase() }],
        });
      }
    }

    // Fallback: search both user and participant by identifier string
    if (!user) {
      user = await User.findOne({
        $or: [{ email: rawIdentifier.toLowerCase() }],
      });
    }

    // If user does not exist in database:
    if (!user) {
      return NextResponse.json(
        {
          error: `No registered account found for "${rawIdentifier}". Please check your inputs or sign up to create your account.`,
          notFound: true,
        },
        { status: 404 }
      );
    }

    // C. Password check if user has a hashed password
    if (user.password && password) {
      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password. Please verify and try again." },
          { status: 401 }
        );
      }
    }

    // D. Attach participant / team info
    let participantId: string | undefined;
    let teamId: string | undefined;
    let mentorId: string | undefined;

    if (user.role === "PARTICIPANT") {
      const p = participantDoc || (await Participant.findOne({ user: user._id }));
      if (p) {
        participantId = p._id.toString();
        teamId = p.team ? p.team.toString() : undefined;
      }
    } else if (user.role === "MENTOR") {
      const m = await Mentor.findOne({ email: user.email });
      if (m) {
        mentorId = m._id.toString();
      }
    }

    const sessionPayload: SessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      participantId,
      teamId,
      mentorId,
      avatar: user.avatar,
    };

    const token = signToken(sessionPayload);
    const redirectUrl = user.role === "PARTICIPANT" ? "/participant" : "/admin";

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: sessionPayload,
      redirectUrl,
    });

    setSessionCookie(response.headers, token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during authentication";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
