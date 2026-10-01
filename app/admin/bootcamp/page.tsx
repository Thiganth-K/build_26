"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BootcampConfigurationPage() {
  const [bootcampName, setBootcampName] = React.useState("BUILD26");
  const [description, setDescription] = React.useState("6-day hands-on product building bootcamp");
  const [duration, setDuration] = React.useState("6 DAYS");
  const [startDate, setStartDate] = React.useState("01/10/2026");
  const [endDate, setEndDate] = React.useState("06/10/2026");
  const [allowedSizes, setAllowedSizes] = React.useState<number[]>([3, 4]);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    fetch("/api/bootcamp")
      .then((r) => r.json())
      .then((data) => {
        if (data.bootcamp) {
          if (data.bootcamp.name) setBootcampName(data.bootcamp.name);
          if (data.bootcamp.description) setDescription(data.bootcamp.description);
        }
      })
      .catch((err) => console.error("Error loading bootcamp:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch("/api/bootcamp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bootcampName,
          description,
          totalDays: 6,
          startDate,
          endDate,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: result.error || "Failed to update configuration" });
      } else {
        setMessage({ type: "success", text: "Bootcamp configuration saved successfully!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error saving configuration" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="pb-3 border-b border-border">
        <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
          SECTION 38
        </span>
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">
          BOOTCAMP CONFIGURATION
        </h1>
        <p className="text-xs text-secondary mt-0.5">
          Configure overarching sprint parameters, dates, and strict team size constraints.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Wireframe Section 38 Master Form */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-6 text-xs"
      >
        <div>
          <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
            BOOTCAMP NAME
          </label>
          <input
            type="text"
            value={bootcampName}
            onChange={(e) => setBootcampName(e.target.value)}
            required
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-black focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
            DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-border bg-surface text-xs focus:border-black focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
            DURATION
          </label>
          <div className="inline-block px-4 py-2 rounded-lg bg-surface-subtle border border-border font-bold font-mono-num text-[#111111]">
            [ 6 DAYS ]
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
              START DATE
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="01 / 10 / 2026"
              className="w-full h-10 px-3 rounded-lg border border-border bg-surface font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
              END DATE
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="06 / 10 / 2026"
              className="w-full h-10 px-3 rounded-lg border border-border bg-surface font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">
            TEAM SIZE (RULE 04)
          </label>
          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-xl border-2 border-black bg-surface font-black text-sm">
              [ 3 MEMBERS ]
            </div>
            <div className="px-5 py-2.5 rounded-xl border-2 border-black bg-surface font-black text-sm">
              [ 4 MEMBERS ]
            </div>
          </div>
          <p className="text-[11px] text-secondary mt-1.5">
            Fixed after team creation. Participants choose either 3 or 4 members during Step 1.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={saving}
            className="font-bold text-xs gap-1.5 bg-[#111111] hover:bg-black text-white px-8"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving..." : "[ SAVE CONFIGURATION ]"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
