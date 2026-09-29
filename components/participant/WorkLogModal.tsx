"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface WorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamId?: string;
  participantName?: string;
}

export function WorkLogModal({
  isOpen,
  onClose,
  onSuccess,
  teamId,
  participantName = "Thiganth K.",
}: WorkLogModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    workDone: "",
    completedTasks: "",
    nextSteps: "",
    blockers: "None",
    timeSpentHours: 3,
    evidenceUrl: "",
    role: "Frontend Developer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/worklogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          teamId,
          participantName,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          workDone: "",
          completedTasks: "",
          nextSteps: "",
          blockers: "None",
          timeSpentHours: 3,
          evidenceUrl: "",
          role: "Frontend Developer",
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to log work");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting work log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Maintain Daily Work Log"
      description="Record what you engineered today, blockers encountered, and sprint velocity."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-secondary">What did you work on today? *</label>
          <textarea
            required
            rows={3}
            placeholder="e.g. Built responsive navigation bar, integrated Leaflet tile layer and beacon WebSockets..."
            value={formData.workDone}
            onChange={(e) => setFormData({ ...formData, workDone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-secondary">What did you complete?</label>
            <input
              type="text"
              placeholder="e.g. Three.js floor mesh loaded & tested"
              value={formData.completedTasks}
              onChange={(e) => setFormData({ ...formData, completedTasks: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-secondary">Time Spent (Hours)</label>
            <input
              type="number"
              min={0.5}
              max={16}
              step={0.5}
              required
              value={formData.timeSpentHours}
              onChange={(e) =>
                setFormData({ ...formData, timeSpentHours: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] font-mono-num font-bold focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-secondary">What are you working on next?</label>
            <input
              type="text"
              placeholder="e.g. Implement Dijkstra path calculation"
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-secondary">Any blockers or impediments?</label>
            <input
              type="text"
              placeholder="e.g. None, or waiting on API schema"
              value={formData.blockers}
              onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-secondary">
            Attach Evidence (GitHub Commit, PR, or Figma Link)
          </label>
          <input
            type="url"
            placeholder="https://github.com/build26/team-alpha/commit/..."
            value={formData.evidenceUrl}
            onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Save Work Log
          </Button>
        </div>
      </form>
    </Modal>
  );
}
