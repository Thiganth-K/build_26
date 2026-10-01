import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ProblemStatement, Team, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (category && category !== "all") filter.category = category;
    if (difficulty && difficulty !== "all") filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    let problems = await ProblemStatement.find(filter).sort({ category: 1, title: 1 }).lean();

    // If database is clean/empty, auto-seed default problem statements
    if (problems.length === 0 && Object.keys(filter).length === 0) {
      const defaultDocs = [
        {
          title: "Smart Campus Indoor & Outdoor Navigation",
          category: "Campus Tech",
          description: "College campuses are often labyrinthine for freshers, visitors, and differently-abled individuals. Build a high-precision, low-latency navigation companion with real-time room availability, accessible paths, and event-routing.",
          targetUsers: "15,000+ university students, faculty, conference attendees, and mobility-impaired visitors.",
          context: "Traditional GPS fails inside multi-story university blocks. Bluetooth beacons and WiFi fingerprinting provide high accuracy.",
          constraints: "Must operate smoothly on standard mobile browsers without requiring native 1GB app downloads.",
          expectedOutcome: "Interactive 3D or 2.5D web map with turn-by-turn routing and wheelchair-accessible filter toggles.",
          difficulty: "Advanced",
          tags: ["Mapping", "Accessibility", "Campus Tech", "WebGIS"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Autonomous AI Student Career & Skill Compass",
          category: "Education",
          description: "College syllabi struggle to keep pace with rapid market disruptions. Create an agentic career engine that analyzes actual student code repositories and resumes to generate verified skill matrices and weekly sprint roadmaps.",
          targetUsers: "Undergraduate engineering students targeting product companies and high-growth startups.",
          context: "Students suffer from tutorial paralysis and lack verified industry feedback on real project code.",
          constraints: "Analysis must take under 10 seconds and preserve repository privacy.",
          expectedOutcome: "Working diagnostic portal that parses GitHub repos and outputs custom project tasks with automated linting checks.",
          difficulty: "Intermediate",
          tags: ["AI/ML", "GitHub API", "EdTech", "Career"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Decentralized Academic & Extracurricular Credential Ledger",
          category: "Finance",
          description: "Certificate fraud and manual verifications slow down university recruitment. Build an instant cryptographically verifiable credential system for hackathon wins, course completions, and student club leadership.",
          targetUsers: "College registrars, hiring managers, student event organizers.",
          context: "Paper certificates and simple PDFs are easily photoshopped. Instant verification with cryptographic proofs eliminates background check delays.",
          constraints: "Zero gas fees for students; instant QR code scanning verification.",
          expectedOutcome: "Issuance dashboard for admins and mobile-friendly verifiable credential viewer with one-click verification.",
          difficulty: "Advanced",
          tags: ["Cryptography", "Verification", "Identity", "Zero-Knowledge"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Accessible Real-time Audio-Visual Learning Companion",
          category: "Accessibility",
          description: "Neurodivergent students and learners with auditory processing challenges struggle in fast-paced college lectures. Build an on-device live transcription and concept-visualizer tool.",
          targetUsers: "Students with ADHD, auditory sensitivity, and ESL learners.",
          context: "Generic transcripts create overwhelming walls of text. Mind-mapping concepts in real-time dramatically aids retention.",
          constraints: "Low CPU latency on ordinary laptops; completely private audio processing.",
          expectedOutcome: "Live speech-to-structured-concept diagram web application with instant glossary popups.",
          difficulty: "Intermediate",
          tags: ["Accessibility", "Web Audio API", "Concept Mapping", "Speech-to-Text"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Campus Food Waste Redistribution & Hostel Mess Tracker",
          category: "Sustainability",
          description: "Over 400 kg of mess food is wasted daily across campus hostels while local shelters face deficits. Build an automated demand-forecasting and rapid food dispatch ledger.",
          targetUsers: "Hostel mess contractors, student volunteers, and verified local NGOs.",
          context: "Perishable cooked meals spoil within 3 hours. Rapid automated alerts and route matching are crucial.",
          constraints: "Strict hygiene certification log and real-time pickup confirmations under 45 minutes.",
          expectedOutcome: "Real-time kitchen surplus alert dashboard with SMS dispatch and temperature compliance logging.",
          difficulty: "Beginner",
          tags: ["Sustainability", "Food Logistics", "IoT Sensor Data", "Community"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Micro-Energy Harvest & Smart Dorm Energy Optimizer",
          category: "Sustainability",
          description: "College dorms account for 45% of peak campus power consumption. Create an interactive energy dashboard with anomaly detection for unswitched appliances and student rewards.",
          targetUsers: "Campus facility managers and residential students.",
          context: "Students lack visibility into energy waste. Gamification and automated power threshold warnings reduce consumption by 24%.",
          constraints: "Simulate smart meter telemetry feeds with sub-second polling.",
          expectedOutcome: "Dorm floor-by-floor energy heatmap and gamified carbon offset leaderboard.",
          difficulty: "Intermediate",
          tags: ["GreenTech", "Telemetry", "Gamification", "IoT"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Predictive Student Mental Well-being & Academic Stress Radar",
          category: "Healthcare",
          description: "Academic burnout spikes undetected prior to university exam weeks. Build a privacy-first, opt-in mood journaling and workload stress indicator that recommends timely peer support.",
          targetUsers: "University counseling cell and anonymous student participants.",
          context: "Students hesitate to visit physical clinics. A private, non-judgmental pulse survey with automated resource matching saves lives.",
          constraints: "End-to-end client-side encryption of all student reflections.",
          expectedOutcome: "Anonymous sentiment pulse board, emergency contact SOS button, and breathing intervention UI.",
          difficulty: "Intermediate",
          tags: ["Health", "Privacy", "Sentiment Analysis", "Student Support"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
        {
          title: "Collaborative Real-Time Peer Code Review & Pair-Programming Arena",
          category: "Productivity",
          description: "Students learn best by reading real code. Create an asynchronous peer review arena with inline code commenting, automated test runner sandboxes, and reputation rankings.",
          targetUsers: "Bootcamp participants, lab instructors, and student developers.",
          context: "GitHub pull requests can feel intimidating for beginners. A gentle, structured peer-critique rubric improves code quality.",
          constraints: "Support syntax highlighting for JavaScript, Python, C++, and Go.",
          expectedOutcome: "Web-based split-view code reviewer with inline annotations and rubric scoring.",
          difficulty: "Advanced",
          tags: ["Developer Tools", "Code Review", "Collaboration", "Productivity"],
          status: "ACTIVE",
          maxTeams: 3,
          assignedTeamCount: 0,
        },
      ];
      await ProblemStatement.insertMany(defaultDocs);
      problems = await ProblemStatement.find(filter).sort({ category: 1, title: 1 }).lean();
    }

    // Attach assigned teams to each problem
    const problemsWithTeams = await Promise.all(
      problems.map(async (p) => {
        const teams = await Team.find({ problemStatement: p._id }).select("name code progress currentPhase").lean();
        return {
          ...p,
          assignedTeams: teams,
        };
      })
    );

    return NextResponse.json({
      problems: problemsWithTeams,
      problemStatements: problemsWithTeams,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching problem statements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const {
      title,
      category,
      description,
      targetUsers,
      context,
      constraints,
      expectedOutcome,
      difficulty,
      tags,
      maxTeams,
    } = body;

    if (!title || !category || !description) {
      return NextResponse.json({ error: "Title, category, and description are required" }, { status: 400 });
    }

    const problem = await ProblemStatement.create({
      title,
      category,
      description,
      targetUsers: targetUsers || "Students & Faculty",
      context: context || "",
      constraints: constraints || "Responsive modern web stack",
      expectedOutcome: expectedOutcome || "Working prototype",
      difficulty: difficulty || "Intermediate",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t: string) => t.trim()) : [category]),
      maxTeams: Number(maxTeams) || 3,
      status: "ACTIVE",
    });

    await Activity.create({
      type: "PROBLEM_ASSIGNED",
      title: `New challenge statement published: ${title}`,
      description: `Category: ${category} | Max Teams: ${maxTeams || 3}`,
      participantName: session?.name || "Admin",
    });

    return NextResponse.json({ success: true, problem });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating problem statement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Problem ID required" }, { status: 400 });
    }

    const problem = await ProblemStatement.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, problem });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating problem statement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Problem ID required" }, { status: 400 });
    }

    await ProblemStatement.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Problem statement deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting problem statement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
