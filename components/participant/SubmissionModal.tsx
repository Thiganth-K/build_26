"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamId?: string;
  currentPhase?: string;
}

export function SubmissionModal({
  isOpen,
  onClose,
  onSuccess,
  teamId,
  currentPhase = "Ideation",
}: SubmissionModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    type: "Ideation PPT",
    externalLink: "",
    fileUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          teamId,
          phase: currentPhase,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || "Submission failed");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting milestone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Bootcamp Milestone"
      description={`Submitting milestone for Phase: ${currentPhase}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-secondary">Submission Title *</label>
          <input
            required
            type="text"
            placeholder="e.g. NaviCampus 3D — System Concept & Architecture Deck"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111]"
          />
        </div>

        <div>
          <label className="font-semibold text-secondary">Milestone Deliverable Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111]"
          >
            <option value="Ideation PPT">Ideation PPT (5 Slides)</option>
            <option value="Problem Analysis">Problem Analysis Document</option>
            <option value="Solution Proposal">Solution Proposal</option>
            <option value="Prototype">Working Prototype URL</option>
            <option value="Progress Report">Sprint Progress Report</option>
            <option value="Final Demo">Final Demo Video</option>
            <option value="Final Presentation">Final Pitch Presentation</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-secondary">
            Pitch Deck or Prototype URL (Google Slides, Figma, GitHub, Vercel) *
          </label>
          <input
            required
            type="url"
            placeholder="https://pitch.build26.org/alpha or https://slides.google.com/..."
            value={formData.externalLink}
            onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Upload & Notify Evaluators
          </Button>
        </div>
      </form>
    </Modal>
  );
}
