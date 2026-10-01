"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Send,
  Calendar,
  Save,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CONTRIBUTION_TYPES = [
  "Ideation",
  "Research",
  "UI/UX",
  "Frontend",
  "Backend",
  "AI/ML",
  "Testing",
  "Documentation",
  "Presentation",
  "Other",
];

export default function ParticipantWorklogsPage() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State matching Section 30
  const [selectedDay, setSelectedDay] = React.useState<number>(1);
  const [workDone, setWorkDone] = React.useState("");
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(["Frontend"]);
  const [timeSpent, setTimeSpent] = React.useState("3 hours");
  const [evidenceLink, setEvidenceLink] = React.useState("");
  const [status, setStatus] = React.useState<"Planned" | "In Progress" | "Completed">("Completed");

  const fetchLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      const user = meRes.participant || meRes.user;
      setCurrentUser(user);
      setTeam(meRes.team);

      const res = await fetch("/api/worklogs");
      const data = await res.json();
      setLogs(data.workLogs || []);
    } catch (err) {
      console.error("Error fetching worklogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSaveWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDone.trim()) {
      alert("Please describe what you worked on.");
      return;
    }

    try {
      setSaving(true);
      setSaveMessage(null);

      // Parse hours from timeSpent (e.g. "3 hours" -> 3)
      const hoursMatch = timeSpent.match(/\d+(\.\d+)?/);
      const hoursNum = hoursMatch ? parseFloat(hoursMatch[0]) : 3;

      const res = await fetch("/api/worklogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: selectedDay,
          workDone: workDone.trim(),
          contributionTypes: selectedTypes,
          timeSpentHours: hoursNum,
          tasksCompleted: workDone.trim(),
          evidenceLink: evidenceLink.trim(),
          status,
          role: currentUser?.roleInTeam || "Full Stack Developer",
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setSaveMessage({ type: "error", text: result.error || "Failed to save work log" });
      } else {
        setSaveMessage({ type: "success", text: "Work log recorded successfully!" });
        setWorkDone("");
        setEvidenceLink("");
        fetchLogs();
      }
    } catch (err) {
      setSaveMessage({ type: "error", text: "Network error saving work log" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Work Logs...</div>
      </div>
    );
  }

  const participantName = currentUser?.name || "THIGANTH K";
  const userRole = currentUser?.roleInTeam || "FULL STACK DEVELOPER";
  const teamName = team?.name || "NEURAL BUILDERS";

  // Group logs by Day for Section 31 Work Log History
  const logsByDay: { [key: number]: any[] } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  logs.forEach((log) => {
    const d = log.day || 1;
    if (!logsByDay[d]) logsByDay[d] = [];
    logsByDay[d].push(log);
  });


  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Wireframe Section 30: INDIVIDUAL WORK LOG */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                SECTION 30
              </span>
              <h1 className="text-2xl font-black tracking-tight text-[#111111]">
                MY WORK LOG
              </h1>
            </div>

            <div className="text-right">
              <span className="font-mono-num font-black text-sm uppercase text-[#111111]">
                {participantName}
              </span>
              <div className="text-[11px] text-secondary">
                ROLE: {userRole.toUpperCase()} • TEAM: {teamName.toUpperCase()}
              </div>
            </div>
          </div>

          {saveMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                saveMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {saveMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </div>
          )}

          {/* Master Work Log Form Card */}
          <form
            onSubmit={handleSaveWorkLog}
            className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-6"
          >
            {/* Day Selector */}
            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
                SELECT DAY
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="h-10 px-3 rounded-lg border border-border bg-surface text-xs font-mono font-bold focus:border-black cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>
                    DAY 0{d}
                  </option>
                ))}
              </select>
            </div>

            {/* What did you work on? */}
            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
                WHAT DID YOU WORK ON?
              </label>
              <textarea
                rows={3}
                value={workDone}
                onChange={(e) => setWorkDone(e.target.value)}
                placeholder="Describe your technical contributions, modules engineered, and progress today..."
                required
                className="w-full p-3.5 rounded-xl border border-border bg-surface text-xs focus:border-black focus:outline-none"
              />
            </div>

            {/* Contribution Types (10 Checkboxes) */}
            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">
                CONTRIBUTION TYPE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {CONTRIBUTION_TYPES.map((type) => {
                  const checked = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-3 py-2 rounded-lg border text-xs text-left flex items-center gap-2 transition-all cursor-pointer ${
                        checked
                          ? "bg-black text-white border-black font-semibold shadow-2xs"
                          : "bg-surface-subtle border-border text-secondary hover:text-[#111111]"
                      }`}
                    >
                      <span className="text-xs font-mono">{checked ? "■" : "□"}</span>
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Spent & Evidence Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
                  TIME SPENT
                </label>
                <input
                  type="text"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="e.g. 3 hours"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:border-black focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
                  EVIDENCE / LINK
                </label>
                <input
                  type="text"
                  value={evidenceLink}
                  onChange={(e) => setEvidenceLink(e.target.value)}
                  placeholder="GitHub / Figma / Document / Demo link"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:border-black focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Status Radio */}
            <div>
              <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">
                STATUS
              </label>
              <div className="flex items-center gap-6 text-xs">
                {(["Planned", "In Progress", "Completed"] as const).map((st) => (
                  <label key={st} className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="status"
                      value={st}
                      checked={status === st}
                      onChange={() => setStatus(st)}
                      className="text-black focus:ring-black"
                    />
                    <span>{st === "Completed" ? "● Completed" : st === "In Progress" ? "○ In Progress" : "○ Planned"}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saving}
                className="font-bold text-xs gap-1.5 bg-[#111111] hover:bg-black text-white px-6"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saving ? "Saving..." : "[ SAVE WORK LOG ]"}</span>
              </Button>
            </div>
          </form>
        </section>

        {/* Wireframe Section 31: MY WORK LOG HISTORY */}
        <section className="space-y-4 pt-4">
          <div className="pb-2 border-b border-border">
            <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
              SECTION 31
            </span>
            <h2 className="text-lg font-black text-[#111111]">
              WORK LOG HISTORY
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Chronological log tree of personal milestone tasks engineered during the sprint.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft font-mono text-xs space-y-6">
            {logs.length === 0 ? (
              <div className="text-center py-6 text-secondary space-y-1">
                <div className="font-bold text-[#111111] uppercase tracking-wider text-xs font-sans">
                  NO WORK LOGS YET
                </div>
                <p className="text-xs font-sans text-secondary max-w-sm mx-auto">
                  No individual tasks have been logged yet. Use the form above to record your contributions.
                </p>
              </div>
            ) : (
              [1, 2, 3, 4, 5, 6].map((dayNum) => {
                const dayLogs = logsByDay[dayNum] || [];
                if (dayLogs.length === 0) return null;

                return (
                  <div key={dayNum} className="space-y-1.5">
                    <div className="font-bold text-sm text-[#111111]">DAY 0{dayNum}</div>
                    <div className="space-y-0.5 text-secondary pl-2">
                      {dayLogs.map((item: any, idx: number) => {
                        const isLast = idx === dayLogs.length - 1;
                        return (
                          <div key={item._id || idx} className="flex items-center gap-2">
                            <span className="text-secondary/60">{isLast ? "└──" : "├──"}</span>
                            <span className="text-[#111111]">{item.workDone || item.tasksCompleted}</span>
                            {item.status && (
                              <span className="text-[10px] text-accent font-semibold font-sans">
                                [{item.status}]
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
