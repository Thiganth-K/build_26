"use client";

import * as React from "react";
import { Plus, Search, Filter, Kanban, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProgressPage() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [teams, setTeams] = React.useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = React.useState("all");

  const fetchData = React.useCallback(async () => {
    try {
      const [tasksRes, teamsRes] = await Promise.all([
        fetch("/api/tasks").then((r) => r.json()),
        fetch("/api/teams").then((r) => r.json()),
      ]);
      setTasks(tasksRes.tasks || []);
      setTeams(teamsRes.teams || []);
    } catch (err) {
      console.error(err);
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

  const filteredTasks = tasks.filter(
    (t) => selectedTeam === "all" || t.team === selectedTeam
  );

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
              Sprint Execution Board
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {filteredTasks.length} Tasks
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Kanban-style progress board across all sprint tasks.
          </p>
        </div>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="h-8 px-3 text-xs rounded-lg border border-border bg-surface text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="all">All Teams</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.column === col.id);
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
                      <span className="text-[10px] text-secondary font-mono-num">
                        {task.assigneeRole}
                      </span>
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
    </div>
  );
}
