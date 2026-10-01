import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Milestone } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

const DEFAULT_MILESTONES = [
  {
    dayNumber: 1,
    title: "TEAM + IDEATION",
    objective: "Form your team, assign responsibilities, select a problem statement, and submit your initial solution idea.",
    instructions: "1. Form team\n2. Complete team membership\n3. Assign roles\n4. Select problem statement\n5. Prepare solution ideation PPT\n6. Submit presentation",
    tasks: [
      { id: "d1-1", title: "Create team", completed: false },
      { id: "d1-2", title: "Complete team membership", completed: false },
      { id: "d1-3", title: "Assign roles", completed: false },
      { id: "d1-4", title: "Select problem statement", completed: false },
      { id: "d1-5", title: "Prepare solution ideation", completed: false },
      { id: "d1-6", title: "Prepare presentation", completed: false },
      { id: "d1-7", title: "Submit presentation", completed: false },
    ],
    requiredSubmission: "PPT — Solution Ideation",
    allowedFileTypes: ["PPTX", "PDF"],
    workLogRequired: true,
    status: "Published",
  },
  {
    dayNumber: 2,
    title: "WIREFRAME",
    objective: "Convert your solution idea into a structured user experience.",
    instructions: "1. Define target user\n2. Define user journey\n3. Identify application screens\n4. Create low-fidelity wireframe\n5. Review wireframe as a team",
    tasks: [
      { id: "d2-1", title: "Define target user", completed: false },
      { id: "d2-2", title: "Define user journey", completed: false },
      { id: "d2-3", title: "Identify application screens", completed: false },
      { id: "d2-4", title: "Create low-fidelity wireframe", completed: false },
      { id: "d2-5", title: "Review wireframe as a team", completed: false },
    ],
    requiredSubmission: "Wireframe / Design",
    allowedFileTypes: ["PDF", "PNG", "JPG", "FIG", "LINK"],
    workLogRequired: true,
    status: "Published",
  },
  {
    dayNumber: 3,
    title: "BUILD",
    objective: "Start implementing the actual product.",
    instructions: "1. Project setup\n2. Repository creation\n3. Frontend implementation\n4. Backend implementation\n5. Core feature implementation",
    tasks: [
      { id: "d3-1", title: "Project setup", completed: false },
      { id: "d3-2", title: "Repository creation", completed: false },
      { id: "d3-3", title: "Frontend implementation", completed: false },
      { id: "d3-4", title: "Backend implementation", completed: false },
      { id: "d3-5", title: "Core feature implementation", completed: false },
    ],
    requiredSubmission: "GitHub Repository",
    allowedFileTypes: ["LINK"],
    workLogRequired: true,
    status: "Active",
  },
  {
    dayNumber: 4,
    title: "INTEGRATION",
    objective: "Integrate the major components of the product.",
    instructions: "1. Backend integration\n2. Database integration\n3. API integration\n4. AI / ML integration if applicable\n5. Connect frontend + backend\n6. Test core workflow",
    tasks: [
      { id: "d4-1", title: "Backend integration", completed: false },
      { id: "d4-2", title: "Database integration", completed: false },
      { id: "d4-3", title: "API integration", completed: false },
      { id: "d4-4", title: "Connect frontend + backend", completed: false },
      { id: "d4-5", title: "Test core workflow", completed: false },
    ],
    requiredSubmission: "Repository + Progress Evidence",
    allowedFileTypes: ["LINK", "PDF", "ZIP"],
    workLogRequired: true,
    status: "Scheduled",
  },
  {
    dayNumber: 5,
    title: "TEST + POLISH",
    objective: "Make the product stable, usable, and presentation-ready.",
    instructions: "1. Functional testing\n2. Bug fixing\n3. UI/UX refinement\n4. Responsive testing\n5. Performance check\n6. Final feature verification",
    tasks: [
      { id: "d5-1", title: "Functional testing", completed: false },
      { id: "d5-2", title: "Bug fixing", completed: false },
      { id: "d5-3", title: "UI/UX refinement", completed: false },
      { id: "d5-4", title: "Responsive testing", completed: false },
      { id: "d5-5", title: "Final feature verification", completed: false },
    ],
    requiredSubmission: "Product progress / build evidence",
    allowedFileTypes: ["LINK", "PDF", "MP4"],
    workLogRequired: true,
    status: "Scheduled",
  },
  {
    dayNumber: 6,
    title: "FINAL DEMO",
    objective: "Ship the final working product and present your demo.",
    instructions: "1. Live product deployment\n2. GitHub repository with complete README\n3. Final Presentation deck\n4. Live demonstration & jury Q&A",
    tasks: [
      { id: "d6-1", title: "Deploy live URL", completed: false },
      { id: "d6-2", title: "Document GitHub repository", completed: false },
      { id: "d6-3", title: "Upload final presentation", completed: false },
      { id: "d6-4", title: "Conduct live demonstration", completed: false },
    ],
    requiredSubmission: "Final Product URL + GitHub + PPT",
    allowedFileTypes: ["LINK", "PPTX", "PDF"],
    workLogRequired: true,
    status: "Scheduled",
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let milestones = await Milestone.find().sort({ dayNumber: 1 }).lean();

    if (!milestones || milestones.length === 0) {
      // Auto-populate default 6-day bootcamp milestones
      for (const m of DEFAULT_MILESTONES) {
        await Milestone.create(m);
      }
      milestones = await Milestone.find().sort({ dayNumber: 1 }).lean();
    }

    return NextResponse.json({ success: true, milestones });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching milestones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    const {
      dayNumber,
      title,
      objective,
      instructions,
      tasks,
      requiredSubmission,
      allowedFileTypes,
      workLogRequired,
      startDate,
      endDate,
      status,
    } = body;

    if (!dayNumber || !title || !objective) {
      return NextResponse.json({ error: "Day number, title, and objective are required." }, { status: 400 });
    }

    const milestone = await Milestone.findOneAndUpdate(
      { dayNumber: Number(dayNumber) },
      {
        dayNumber: Number(dayNumber),
        title: title.trim().toUpperCase(),
        objective: objective.trim(),
        instructions: instructions || "",
        tasks: Array.isArray(tasks) ? tasks : [],
        requiredSubmission: requiredSubmission || "Deliverable",
        allowedFileTypes: Array.isArray(allowedFileTypes) ? allowedFileTypes : ["PDF", "LINK"],
        workLogRequired: workLogRequired ?? true,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        status: status || "Published",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, milestone });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error saving milestone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
