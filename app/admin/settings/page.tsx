"use client";

import * as React from "react";
import { Settings, Save, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [bootcamp, setBootcamp] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const fetchBootcamp = React.useCallback(async () => {
    try {
      const res = await fetch("/api/bootcamp");
      const data = await res.json();
      setBootcamp(data.bootcamp || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBootcamp();
  }, [fetchBootcamp]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/bootcamp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bootcamp),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReseedDatabase = async () => {
    if (!confirm("This will reset and re-seed the MongoDB database with pristine demo data. Continue?")) return;
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        alert("Database successfully reset and re-seeded!");
        window.location.reload();
      }
    } catch (err) {
      alert("Error resetting database");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Bootcamp Operations Control & Settings
            </h1>
            <Badge variant="accent">Super Admin</Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Configure live phases, day number, submission rules, and database resets.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReseedDatabase}
          className="text-xs text-secondary hover:text-[#111111] gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset / Reseed Database</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          <span>Bootcamp configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Identity */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            General Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-secondary">Bootcamp Name</label>
              <input
                type="text"
                value={bootcamp.name || ""}
                onChange={(e) => setBootcamp({ ...bootcamp, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              />
            </div>
            <div>
              <label className="font-semibold text-secondary">Tagline</label>
              <input
                type="text"
                value={bootcamp.tagline || ""}
                onChange={(e) => setBootcamp({ ...bootcamp, tagline: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Live Phase & Day Control */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Active Phase & Schedule State
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-secondary">Bootcamp Operational State</label>
              <select
                value={bootcamp.status || "LIVE"}
                onChange={(e) => setBootcamp({ ...bootcamp, status: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              >
                <option value="LIVE">LIVE (Sprints Active)</option>
                <option value="UPCOMING">UPCOMING (Pre-registration)</option>
                <option value="COMPLETED">COMPLETED (Concluded)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-secondary">Current Active Phase</label>
              <select
                value={bootcamp.currentPhase || "Ideation"}
                onChange={(e) => setBootcamp({ ...bootcamp, currentPhase: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              >
                <option value="Problem Understanding">01. Problem Understanding</option>
                <option value="Ideation">02. Ideation</option>
                <option value="Validation">03. Validation</option>
                <option value="Build">04. Build</option>
                <option value="Testing">05. Testing</option>
                <option value="Final Demo">06. Final Demo</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-secondary">Current Day Number (1 - 6)</label>
              <input
                type="number"
                min={1}
                max={6}
                value={bootcamp.dayNumber || 1}
                onChange={(e) => setBootcamp({ ...bootcamp, dayNumber: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Team Limits & Gating */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Team Governance & Gating Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-secondary">Maximum Students per Team</label>
              <input
                type="number"
                min={2}
                max={6}
                value={bootcamp.settings?.maxTeamSize || 4}
                onChange={(e) =>
                  setBootcamp({
                    ...bootcamp,
                    settings: {
                      ...bootcamp.settings,
                      maxTeamSize: Number(e.target.value),
                    },
                  })
                }
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="submissionsOpen"
                checked={bootcamp.settings?.submissionOpen ?? true}
                onChange={(e) =>
                  setBootcamp({
                    ...bootcamp,
                    settings: {
                      ...bootcamp.settings,
                      submissionOpen: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="submissionsOpen" className="font-medium text-[#111111]">
                Allow Milestone Submissions Portal Access
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="primary" size="md" type="submit" isLoading={saving} className="gap-2">
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
