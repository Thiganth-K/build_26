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

    const problems = await ProblemStatement.find(filter).sort({ category: 1, title: 1 }).lean();

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

    return NextResponse.json({ problems: problemsWithTeams });
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
