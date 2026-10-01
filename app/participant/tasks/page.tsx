"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Kanban, Clock, Users, Trash2, Copy, Check, AlertCircle, ShieldAlert, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";

export default function ParticipantTasksPage() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [team, setTeam] = React.useState<any>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isTeamLead, setIsTeamLead] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [filterAssignee, setFilterAssignee] = React.useState<"ALL" | "MINE">("ALL");

  // Modal State
  const [isNewTaskOpen, setIsNewTaskOpen] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDescription, setNewTaskDescription] = React.useState("");
  const [newTaskPriority, setNewTaskPriority] = React.useState("Medium");
  const [newTaskAssignee, setNewTaskAssignee] = React.useState("");
  const [newTaskDeadline, setNewTaskDeadline] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const fetchSharedTeamTasks = React.useCallback(async () => {
    try {
      setLoading(true);
      // 1. Get authenticated user and team membership
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      const user = meRes.participant || meRes.user;
      setCurrentUser(user);

      const teamId = meRes.team?._id || meRes.user?.teamId || meRes.participant?.team;

      if (!teamId) {
        setTeam(null);
        setTasks([]);
        return;
      }

      // 2. Fetch full team data (including members roster)
      const teamDetail = await fetch(`/api/teams/${teamId}`).then((r) => r.json());
      const activeTeam = teamDetail.team;
      setTeam(activeTeam);

      const isLeader =
        user?.roleInTeam === "Team Lead" ||
        activeTeam?.members?.some(
          (m: any) =>
            (m.email?.toLowerCase() === user?.email?.toLowerCase() ||
              m.participant === user?._id) &&
            (m.isLeader || m.role === "Team Lead")
        );
      setIsTeamLead(Boolean(isLeader));

      // 3. Fetch shared tasks for this specific team
      const tasksRes = await fetch(`/api/tasks?teamId=${teamId}`).then((r) => r.json());
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      console.error("Error fetching shared team tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSharedTeamTasks();
  }, [fetchSharedTeamTasks]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleMoveColumn = async (taskId: string, targetCol: string) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, column: targetCol } : t))
      );

      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, column: targetCol }),
      });
      fetchSharedTeamTasks();
    } catch (err) {
      console.error(err);
      fetchSharedTeamTasks();
    }
  };

  const handleReassignTask = async (taskId: string, newAssigneeName: string) => {
    let role = "Developer";
    if (newAssigneeName === currentUser?.name) {
      role = currentUser?.roleInTeam || (isTeamLead ? "Team Lead" : "Developer");
    } else {
      const found = team?.members?.find((m: any) => m.name === newAssigneeName);
      if (found) role = found.role || "Developer";
    }

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? { ...t, assigneeName: newAssigneeName, assigneeRole: role }
          : t
      )
    );

    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          assigneeName: newAssigneeName,
          assigneeRole: role,
        }),
      });
      fetchSharedTeamTasks();
    } catch (err) {
      console.error("Error reassigning task:", err);
      fetchSharedTeamTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" });
      fetchSharedTeamTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreateModal = () => {
    // Default assignee to current user (team lead can assign to themselves or pick teammate)
    setNewTaskAssignee(currentUser?.name || "");
    setIsNewTaskOpen(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !newTaskTitle.trim()) return;

    try {
      setCreating(true);

      // Determine assignee name and role
      let assigneeName = "Unassigned";
      let assigneeRole = "Developer";

      if (newTaskAssignee === currentUser?.name) {
        assigneeName = currentUser.name;
        assigneeRole = currentUser.roleInTeam || (isTeamLead ? "Team Lead" : "Developer");
      } else if (newTaskAssignee) {
        const found = team.members?.find((m: any) => m.name === newTaskAssignee);
        if (found) {
          assigneeName = found.name;
          assigneeRole = found.role || "Developer";
        } else {
          assigneeName = newTaskAssignee;
        }
      } else if (currentUser?.name) {
        assigneeName = currentUser.name;
        assigneeRole = currentUser.roleInTeam || (isTeamLead ? "Team Lead" : "Developer");
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: team._id,
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim(),
          priority: newTaskPriority,
          assigneeName,
          assigneeRole,
          deadline: newTaskDeadline ? new Date(newTaskDeadline).toISOString() : undefined,
          column: "TODO",
        }),
      });

      if (res.ok) {
        setIsNewTaskOpen(false);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskPriority("Medium");
        setNewTaskAssignee("");
        setNewTaskDeadline("");
        fetchSharedTeamTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { id: "BACKLOG", label: "Backlog" },
    { id: "TODO", label: "To Do" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "REVIEW", label: "Review" },
    { id: "DONE", label: "Done" },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-3">
        <div className="h-7 w-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-secondary font-medium">Syncing team sprint board...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center space-y-4">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-left">
            <div className="font-bold text-sm">Team Required for Sprint Board</div>
            <div>Join an existing team or create a new team to collaborate on shared sprint tasks.</div>
          </div>
        </div>
        <Link href="/participant">
          <Button variant="primary" size="md">
            Go to Team Setup
          </Button>
        </Link>
      </div>
    );
  }

  const displayedTasks =
    filterAssignee === "MINE"
      ? tasks.filter((t) => t.assigneeName === currentUser?.name)
      : tasks;

  const myTasksCount = tasks.filter((t) => t.assigneeName === currentUser?.name).length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Team Context and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Shared Sprint Kanban
            </h1>
            <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              {team.name}
            </span>

            <button
              type="button"
              onClick={() => handleCopyCode(team.code)}
              title="Click to copy team invite code"
              className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-surface border border-border text-secondary hover:text-[#111111] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied {team.code}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Code: {team.code}</span>
                </>
              )}
            </button>

            {isTeamLead && (
              <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Team Lead (Can Assign & Reassign Tasks)
              </span>
            )}
          </div>
          <p className="text-xs text-secondary">
            Shared with all {team.members?.length || 1} team members. Assign tasks to teammates or yourself, track deadlines, and sync progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Filter: All vs My Tasks */}
          <div className="inline-flex rounded-lg border border-border bg-surface-subtle p-0.5 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setFilterAssignee("ALL")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterAssignee === "ALL"
                  ? "bg-surface text-[#111111] font-bold shadow-2xs"
                  : "text-secondary hover:text-[#111111]"
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterAssignee("MINE")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterAssignee === "MINE"
                  ? "bg-surface text-[#111111] font-bold shadow-2xs"
                  : "text-secondary hover:text-[#111111]"
              }`}
            >
              My Tasks ({myTasksCount})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="gap-1.5 shadow-sm text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Sprint Task</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colTasks = displayedTasks.filter((t) => t.column === col.id);
          return (
            <div
              key={col.id}
              className="rounded-xl border border-border bg-surface-subtle/50 p-3.5 flex flex-col min-h-[520px]"
            >
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  {col.label}
                </span>
                <span className="text-[10px] font-mono-num font-bold text-secondary bg-surface px-1.5 py-0.5 rounded border border-border/60">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-28 flex items-center justify-center text-[11px] text-secondary/60 border border-dashed border-border/70 rounded-lg">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3.5 rounded-xl border border-border bg-surface shadow-xs space-y-2.5 transition-all hover:border-accent/40 group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <Badge
                          variant={
                            task.priority === "Critical"
                              ? "danger"
                              : task.priority === "High"
                              ? "warning"
                              : "secondary"
                          }
                          size="sm"
                          className="text-[9px] px-1.5 py-0.2"
                        >
                          {task.priority}
                        </Badge>

                        {/* Deadline Indicator */}
                        {task.deadline && (
                          <div className="flex items-center gap-1 text-[10px] font-mono-num text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70">
                            <Clock className="h-3 w-3 shrink-0 text-amber-600" />
                            <span>{new Date(task.deadline).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                          </div>
                        )}

                        {isTeamLead && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task._id)}
                            title="Delete task (Team Lead)"
                            className="opacity-0 group-hover:opacity-100 text-secondary hover:text-rose-600 p-0.5 rounded transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-[#111111] leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-secondary mt-1 leading-relaxed line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Assignee & Column Move */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-secondary gap-1">
                        {/* Assignee display or Team Lead reassign dropdown */}
                        <div className="flex items-center gap-1.5 flex-1 min-w-0" title={`Assignee: ${task.assigneeName}`}>
                          <Avatar name={task.assigneeName || "Dev"} size="sm" />
                          {isTeamLead ? (
                            <select
                              value={task.assigneeName}
                              onChange={(e) => handleReassignTask(task._id, e.target.value)}
                              title="Reassign Task (Team Lead)"
                              className="text-[10px] font-semibold bg-transparent border-0 rounded px-1 py-0.5 text-[#111111] hover:bg-surface-subtle focus:bg-surface focus:ring-1 focus:ring-accent cursor-pointer truncate max-w-[105px]"
                            >
                              {currentUser?.name && (
                                <option value={currentUser.name}>
                                  Myself ({currentUser.name}) ⭐
                                </option>
                              )}
                              <optgroup label="Squad Teammates">
                                {team.members
                                  ?.filter((m: any) => m.name !== currentUser?.name)
                                  .map((m: any, idx: number) => (
                                    <option key={m.participant || idx} value={m.name}>
                                      {m.name}
                                    </option>
                                  ))}
                              </optgroup>
                              <option value="Unassigned">Unassigned</option>
                            </select>
                          ) : (
                            <span className="truncate font-medium text-[10px] text-secondary">
                              {task.assigneeName === currentUser?.name ? `${task.assigneeName} (You)` : task.assigneeName}
                            </span>
                          )}
                        </div>

                        {/* Move Column Selector */}
                        <select
                          value={task.column}
                          onChange={(e) => handleMoveColumn(task._id, e.target.value)}
                          className="text-[10px] font-medium bg-surface-subtle border border-border/80 rounded px-1.5 py-0.5 text-[#111111] focus:outline-none cursor-pointer shrink-0"
                        >
                          <option value="BACKLOG">Backlog</option>
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">Progress</option>
                          <option value="REVIEW">Review</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Sprint Task Modal */}
      <Modal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Create Team Sprint Task"
        description={`Add a new milestone or action item for ${team.name}. Assign it to yourself or any teammate.`}
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#111111]">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Implement WebSocket updates for campus map"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="font-semibold text-secondary">Task Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Add key deliverables, test conditions, or branch links..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-secondary">Assign To</label>
                {currentUser?.name && (
                  <button
                    type="button"
                    onClick={() => setNewTaskAssignee(currentUser.name)}
                    className="text-[10px] text-accent hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>Assign to Myself</span>
                  </button>
                )}
              </div>
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {currentUser?.name && (
                  <option value={currentUser.name}>
                    ⭐ Assign to Myself: {currentUser.name} {isTeamLead ? "(Team Lead)" : ""}
                  </option>
                )}
                <optgroup label="Squad Teammates">
                  {team.members
                    ?.filter((m: any) => m.name !== currentUser?.name)
                    .map((m: any, idx: number) => (
                      <option key={m.participant || idx} value={m.name}>
                        {m.name} ({m.role || "Developer"})
                      </option>
                    ))}
                </optgroup>
                <option value="">Unassigned / Open to All</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-secondary">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical (Blocker)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-secondary flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Target Completion Deadline</span>
            </label>
            <input
              type="date"
              value={newTaskDeadline}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent font-mono-num text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={creating}>
              Create Task & Sync Squad
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
