"use client";

import * as React from "react";
import { Plus, Kanban, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function ParticipantTasksPage() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [team, setTeam] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isNewTaskOpen, setIsNewTaskOpen] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskPriority, setNewTaskPriority] = React.useState("Medium");

  const fetchData = React.useCallback(async () => {
    try {
      const teamsRes = await fetch("/api/teams").then((r) => r.json());
      const firstTeam = teamsRes.teams?.[0];
      if (firstTeam) {
        setTeam(firstTeam);
        const tasksRes = await fetch(`/api/tasks?teamId=${firstTeam._id}`).then((r) => r.json());
        setTasks(tasksRes.tasks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMoveColumn = async (taskId: string, targetCol: string) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, column: targetCol }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !newTaskTitle) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: team._id,
          title: newTaskTitle,
          priority: newTaskPriority,
          assigneeName: "Thiganth K.",
          assigneeRole: "Frontend Lead",
          column: "TODO",
        }),
      });

      if (res.ok) {
        setIsNewTaskOpen(false);
        setNewTaskTitle("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { id: "BACKLOG", label: "Backlog" },
    { id: "TODO", label: "To Do" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "REVIEW", label: "Review" },
    { id: "DONE", label: "Done" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Sprint Kanban Board
            </h1>
            <Badge variant="accent">Live Sprint</Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Track micro-milestones and sprint tasks across development columns.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewTaskOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Task</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.id);
          return (
            <div
              key={col.id}
              className="rounded-xl border border-border bg-surface-subtle/40 p-3 flex flex-col min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  {col.label}
                </span>
                <span className="text-[10px] font-mono-num font-bold text-secondary bg-surface px-1.5 py-0.5 rounded border border-border/50">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3 rounded-lg border border-border bg-surface shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          task.priority === "Critical"
                            ? "danger"
                            : task.priority === "High"
                            ? "warning"
                            : "secondary"
                        }
                        size="sm"
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <h4 className="font-semibold text-xs text-[#111111]">{task.title}</h4>

                    <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-secondary">
                      <span>{task.assigneeName}</span>
                      <select
                        value={task.column}
                        onChange={(e) => handleMoveColumn(task._id, e.target.value)}
                        className="text-[10px] bg-surface-subtle border border-border rounded px-1 py-0.5"
                      >
                        <option value="BACKLOG">Backlog</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Create Sprint Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-secondary">Task Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Integrate Leaflet floor maps"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
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
              <option value="Critical">Critical</option>
            </select>
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
            <Button variant="primary" size="sm" type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
