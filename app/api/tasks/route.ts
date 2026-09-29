import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Task, Team, Activity } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") {
      filter.team = teamId;
    }

    const tasks = await Task.find(filter).sort({ priority: -1, createdAt: -1 }).lean();
    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching tasks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { teamId, title, description, assigneeName, assigneeRole, priority, deadline, column } = body;

    if (!teamId || !title) {
      return NextResponse.json({ error: "Team ID and title are required" }, { status: 400 });
    }

    const task = await Task.create({
      team: teamId,
      title,
      description: description || "",
      assigneeName: assigneeName || session?.name || "Unassigned",
      assigneeRole: assigneeRole || "Developer",
      priority: priority || "Medium",
      deadline: deadline ? new Date(deadline) : undefined,
      column: column || "TODO",
    });

    await Team.findByIdAndUpdate(teamId, { lastActivityAt: new Date() });

    return NextResponse.json({ success: true, task });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();
    const { id, column, priority, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: any = { ...updates };
    if (column) updateObj.column = column;
    if (priority) updateObj.priority = priority;

    const task = await Task.findByIdAndUpdate(id, { $set: updateObj }, { new: true });
    if (task && task.team) {
      await Team.findByIdAndUpdate(task.team, { lastActivityAt: new Date() });
      if (column === "DONE") {
        await Activity.create({
          type: "TASK_UPDATED",
          title: `Task completed: ${task.title}`,
          description: `Marked done by ${session?.name || task.assigneeName}`,
          teamId: task.team,
        });
      }
    }

    return NextResponse.json({ success: true, task });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await Task.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
