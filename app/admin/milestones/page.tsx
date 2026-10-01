"use client";

import * as React from "react";
import {
  Flag,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Save,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingDay, setEditingDay] = React.useState<any>(null);
  const [saving, setSaving] = React.useState(false);

  // Form fields matching Section 42
  const [dayNumber, setDayNumber] = React.useState(2);
  const [title, setTitle] = React.useState("WIREFRAME");
  const [objective, setObjective] = React.useState(
    "Convert the selected solution into a user experience wireframe."
  );
  const [instructions, setInstructions] = React.useState(
    "1. Define user journey\n2. Identify screens\n3. Build wireframe"
  );
  const [tasks, setTasks] = React.useState<string[]>([
    "Define user journey",
    "Identify screens",
    "Build wireframe",
    "Review with team",
  ]);
  const [newTaskInput, setNewTaskInput] = React.useState("");
  const [requiredSubmission, setRequiredSubmission] = React.useState("Wireframe / PDF / Image / Link");
  const [allowedFileTypes, setAllowedFileTypes] = React.useState<string[]>([
    "PDF",
    "PNG",
    "JPG",
    "FIG",
    "LINK",
  ]);
  const [workLogRequired, setWorkLogRequired] = React.useState(true);
  const [status, setStatus] = React.useState<"Draft" | "Published">("Published");

  const fetchMilestones = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/milestones").then((r) => r.json());
      if (res.milestones) {
        setMilestones(res.milestones);
      }
    } catch (err) {
      console.error("Error loading milestones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const openEditor = (m?: any) => {
    if (m) {
      setEditingDay(m);
      setDayNumber(m.dayNumber);
      setTitle(m.title);
      setObjective(m.objective);
      setInstructions(m.instructions || "");
      setTasks(m.tasks?.map((t: any) => (typeof t === "string" ? t : t.title)) || []);
      setRequiredSubmission(m.requiredSubmission || "Deliverable");
      setAllowedFileTypes(m.allowedFileTypes || ["PDF", "LINK"]);
      setWorkLogRequired(m.workLogRequired ?? true);
      setStatus(m.status === "Published" ? "Published" : "Draft");
    } else {
      setEditingDay(null);
      setDayNumber(milestones.length + 1);
      setTitle("SPRINT MILESTONE");
      setObjective("Sprint objective details...");
      setInstructions("");
      setTasks(["Define requirements", "Implement module", "Review output"]);
      setRequiredSubmission("Deliverable / Link");
      setAllowedFileTypes(["PDF", "LINK"]);
      setWorkLogRequired(true);
      setStatus("Published");
    }
    setEditorOpen(true);
  };

  const addTask = () => {
    if (!newTaskInput.trim()) return;
    setTasks((prev) => [...prev, newTaskInput.trim()]);
    setNewTaskInput("");
  };

  const removeTask = (idx: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleFileType = (ft: string) => {
    setAllowedFileTypes((prev) =>
      prev.includes(ft) ? prev.filter((t) => t !== ft) : [...prev, ft]
    );
  };

  const handleSaveMilestone = async (publishStatus: "Draft" | "Published") => {
    try {
      setSaving(true);
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayNumber,
          title,
          objective,
          instructions,
          tasks: tasks.map((t, idx) => ({ id: `task-${dayNumber}-${idx}`, title: t, completed: false })),
          requiredSubmission,
          allowedFileTypes,
          workLogRequired,
          status: publishStatus,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to save milestone");
      } else {
        setEditorOpen(false);
        fetchMilestones();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Milestone Engine...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Wireframe Section 41: ADMIN / MILESTONES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
            SECTION 41 — ADMIN / MILESTONES
          </span>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">
            BUILD26 — 6 DAY JOURNEY
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Admin configuration engine driving the daily sequential gates in the participant app.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openEditor()}
          className="gap-1.5 font-bold text-xs bg-[#111111] hover:bg-black text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>[ + ADD DAY ]</span>
        </Button>
      </div>

      {/* 6-Day List */}
      <div className="space-y-4">
        {milestones.map((m) => {
          const isPublished = m.status === "Published";
          const isActive = m.status === "Active" || m.dayNumber === 3;

          return (
            <div
              key={m.dayNumber}
              className="p-6 rounded-2xl border-2 border-border bg-surface shadow-2xs space-y-4 hover:border-black/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-[#111111] font-mono-num">
                    DAY 0{m.dayNumber} {m.title}
                  </span>
                  {isActive ? (
                    <Badge variant="accent" className="font-mono-num font-bold text-[10px] uppercase">
                      ● ACTIVE
                    </Badge>
                  ) : isPublished ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Published
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-secondary bg-surface-subtle px-2 py-0.5 rounded border border-border">
                      ○ SCHEDULED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditor(m)}
                    className="text-xs font-bold"
                  >
                    [ EDIT ]
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditor(m)}
                    className="text-xs font-bold"
                  >
                    [ VIEW ]
                  </Button>
                </div>
              </div>

              <div className="text-xs text-secondary leading-relaxed pl-0.5">
                <span className="font-bold text-[#111111]">Objective: </span>
                {m.objective}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-secondary font-mono pt-1">
                <div>
                  <span className="font-semibold text-[#111111]">Required:</span>{" "}
                  {m.requiredSubmission}
                </div>
                <div>
                  <span className="font-semibold text-[#111111]">Tasks:</span>{" "}
                  {m.tasks?.length || 0}
                </div>
                <div>
                  <span className="font-semibold text-[#111111]">Work Log:</span>{" "}
                  {m.workLogRequired ? "Required ✓" : "Optional"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wireframe Section 42: ADMIN / CREATE & EDIT MILESTONE MODAL */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-border bg-surface p-7 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 text-xs">
            <div className="pb-3 border-b border-border flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-num font-bold text-accent uppercase">
                  SECTION 42
                </span>
                <h3 className="text-lg font-black text-[#111111]">
                  ADMIN / {editingDay ? "EDIT" : "CREATE"} MILESTONE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="text-secondary hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                  DAY NUMBER
                </label>
                <div className="px-3 py-2 rounded-lg bg-surface-subtle border border-border font-bold font-mono">
                  [ DAY 0{dayNumber} ]
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-surface font-bold uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                OBJECTIVE
              </label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-surface leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                INSTRUCTIONS
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="1. Step 1\n2. Step 2\n3. Step 3"
                className="w-full p-3 rounded-lg border border-border bg-surface font-mono"
              />
            </div>

            {/* Tasks with + ADD TASK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-secondary uppercase">
                  TASKS
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Task title..."
                  className="flex-1 h-9 px-3 rounded-lg border border-border bg-surface text-xs"
                />
                <Button variant="outline" size="sm" onClick={addTask} className="text-xs font-bold">
                  [ + ADD TASK ]
                </Button>
              </div>

              <div className="space-y-1.5 pt-1">
                {tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-surface-subtle border border-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-mono">□</span>
                      <span>{task}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTask(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Submission & Allowed File Types */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                  REQUIRED SUBMISSION
                </label>
                <input
                  type="text"
                  value={requiredSubmission}
                  onChange={(e) => setRequiredSubmission(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1.5">
                  ALLOWED FILE TYPES
                </label>
                <div className="flex flex-wrap gap-2">
                  {["PDF", "PNG", "JPG", "FIG", "LINK", "PPTX", "ZIP"].map((ft) => {
                    const active = allowedFileTypes.includes(ft);
                    return (
                      <button
                        key={ft}
                        type="button"
                        onClick={() => toggleFileType(ft)}
                        className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all ${
                          active
                            ? "bg-black text-white"
                            : "bg-surface-subtle border border-border text-secondary"
                        }`}
                      >
                        [ {ft} ]
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                  WORK LOG REQUIRED
                </label>
                <button
                  type="button"
                  onClick={() => setWorkLogRequired(!workLogRequired)}
                  className={`px-4 py-1.5 rounded-lg border text-xs font-bold ${
                    workLogRequired
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-surface-subtle text-secondary border-border"
                  }`}
                >
                  {workLogRequired ? "[ ✓ YES ]" : "[ NO ]"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() => handleSaveMilestone("Draft")}
              >
                [ SAVE DRAFT ]
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={saving}
                onClick={() => handleSaveMilestone("Published")}
                className="bg-[#111111] hover:bg-black text-white font-bold"
              >
                {saving ? "Publishing..." : "[ PUBLISH ]"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
