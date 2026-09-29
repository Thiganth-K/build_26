import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Team, Submission, Task, WorkLog } from "@/models";
import { AttentionItem } from "@/types";

export async function GET() {
  try {
    await connectToDatabase();

    const [teams, pendingSubmissions, overdueTasks] = await Promise.all([
      Team.find({}).populate("mentor").populate("problemStatement").lean(),
      Submission.find({ status: "Pending Review" }).lean(),
      Task.find({ column: { $ne: "DONE" }, deadline: { $lt: new Date() } }).lean(),
    ]);

    const attentionItems: AttentionItem[] = [];
    const now = new Date().getTime();

    // 1. Teams with no activity > 12 hours
    teams.forEach((team) => {
      const lastAct = new Date(team.lastActivityAt || team.updatedAt).getTime();
      const hoursAgo = Math.floor((now - lastAct) / (1000 * 60 * 60));

      if (hoursAgo >= 12) {
        attentionItems.push({
          id: `inact-${team._id}`,
          teamId: team._id.toString(),
          teamName: team.name,
          severity: hoursAgo >= 20 ? "high" : "medium",
          type: "NO_ACTIVITY",
          message: `No team activity recorded for ${hoursAgo} hours`,
          timeAgo: `${hoursAgo}h ago`,
          actionLabel: "Nudge Team",
          actionUrl: `/admin/teams/${team._id}`,
        });
      }

      // Check team member count
      if (!team.members || team.members.length < 4) {
        attentionItems.push({
          id: `members-${team._id}`,
          teamId: team._id.toString(),
          teamName: team.name,
          severity: "low",
          type: "INCOMPLETE_TEAM",
          message: `Team has ${team.members?.length || 0}/4 members`,
          timeAgo: "Registration",
          actionLabel: "Assign Members",
          actionUrl: `/admin/teams/${team._id}`,
        });
      }

      // Check if team has no mentor
      if (!team.mentor) {
        attentionItems.push({
          id: `mentor-${team._id}`,
          teamId: team._id.toString(),
          teamName: team.name,
          severity: "medium",
          type: "PENDING_FEEDBACK",
          message: "No mentor assigned to this team yet",
          timeAgo: "Bootcamp setup",
          actionLabel: "Assign Mentor",
          actionUrl: `/admin/mentors`,
        });
      }
    });

    // 2. Unreviewed submissions
    pendingSubmissions.forEach((sub) => {
      attentionItems.push({
        id: `sub-${sub._id}`,
        teamId: sub.team.toString(),
        teamName: sub.teamName,
        severity: "high",
        type: "MISSING_SUBMISSION",
        message: `Unreviewed submission: "${sub.title}" (${sub.type})`,
        timeAgo: "Waiting for grade",
        actionLabel: "Review Now",
        actionUrl: `/admin/submissions`,
      });
    });

    // 3. Overdue tasks
    overdueTasks.forEach((task) => {
      attentionItems.push({
        id: `task-${task._id}`,
        teamId: task.team.toString(),
        teamName: "Team",
        severity: "medium",
        type: "OVERDUE_TASK",
        message: `Overdue task: "${task.title}" (assigned to ${task.assigneeName})`,
        timeAgo: "Past deadline",
        actionLabel: "View Board",
        actionUrl: `/admin/progress`,
      });
    });

    return NextResponse.json({
      count: attentionItems.length,
      items: attentionItems.slice(0, 10), // top 10 items
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error generating attention list";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
