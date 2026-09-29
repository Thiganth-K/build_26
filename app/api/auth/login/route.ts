import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, Participant, Mentor, Team } from "@/models";
import { signToken, setSessionCookie, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      role,
      email,
      name,
      admissionNumber,
      yearOfStudy,
      department,
      mobileNumber,
    } = body;

    // 1. PARTICIPANT LOGIN & ONBOARDING DATA COLLECTION
    if (role === "PARTICIPANT" || (!role && admissionNumber)) {
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

      // Find or create User
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          name: cleanName,
          email: cleanEmail,
          role: "PARTICIPANT",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            cleanName
          )}&backgroundColor=5e56e7&textColor=ffffff`,
        });
      } else {
        user.name = cleanName;
        user.role = "PARTICIPANT";
        await user.save();
      }

      // Find or create Participant profile
      let participant = await Participant.findOne({
        $or: [{ email: cleanEmail }, { user: user._id }],
      });

      if (!participant) {
        participant = await Participant.create({
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
      } else {
        // Update with collected details
        participant.name = cleanName;
        participant.email = cleanEmail;
        participant.admissionNumber = cleanAdmission;
        participant.yearOfStudy = cleanYear;
        participant.year = cleanYear;
        participant.department = cleanDepartment;
        participant.mobileNumber = cleanMobile;
        participant.user = user._id;
        await participant.save();
      }

      user.participantId = participant._id;
      await user.save();

      const sessionPayload: SessionUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: "PARTICIPANT",
        participantId: participant._id.toString(),
        teamId: participant.team ? participant.team.toString() : undefined,
        department: participant.department,
        avatar: user.avatar,
      };

      const token = signToken(sessionPayload);
      const response = NextResponse.json({
        success: true,
        user: sessionPayload,
        redirectUrl: "/participant",
      });

      setSessionCookie(response.headers, token);
      return response;
    }

    // 2. ADMIN / MENTOR / STAFF LOGIN WITH REGISTERED EMAIL
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "No registered user found for this email. Please check your credentials or register as a participant.",
        },
        { status: 404 }
      );
    }

    let participantId: string | undefined;
    let teamId: string | undefined;
    let mentorId: string | undefined;

    if (user.role === "PARTICIPANT") {
      const p = await Participant.findOne({ user: user._id });
      if (p) {
        participantId = p._id.toString();
        teamId = p.team?.toString();
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
      user: sessionPayload,
      redirectUrl,
    });

    setSessionCookie(response.headers, token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
