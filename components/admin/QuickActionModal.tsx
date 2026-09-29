"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface QuickActionModalProps {
  actionType: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuickActionModal({ actionType, onClose, onSuccess }: QuickActionModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({});

  if (!actionType) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "";
      let payload = { ...formData };

      switch (actionType) {
        case "create_team":
          endpoint = "/api/teams";
          break;
        case "add_participant":
          endpoint = "/api/participants";
          break;
        case "add_problem":
          endpoint = "/api/problem-statements";
          break;
        case "broadcast_announcement":
          endpoint = "/api/announcements";
          break;
        case "add_schedule":
          endpoint = "/api/schedule";
          break;
        case "add_mentor":
          endpoint = "/api/mentors";
          break;
        default:
          return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to execute action");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case "create_team":
        return "Create New Bootcamp Team";
      case "add_participant":
        return "Register New Participant";
      case "add_problem":
        return "Add Problem Statement Challenge";
      case "broadcast_announcement":
        return "Broadcast Urgent Announcement";
      case "add_schedule":
        return "Add Bootcamp Schedule Event";
      case "add_mentor":
        return "Add Technical Mentor";
      default:
        return "Quick Action";
    }
  };

  return (
    <Modal isOpen={!!actionType} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* CREATE TEAM */}
        {actionType === "create_team" && (
          <>
            <div>
              <label className="font-semibold text-secondary">Team Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Team Hyperion"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-secondary">Solution Title / Concept</label>
              <input
                type="text"
                placeholder="e.g. Autonomous Campus Delivery Robot"
                onChange={(e) => setFormData({ ...formData, solutionTitle: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-secondary">Solution Description</label>
              <textarea
                rows={3}
                placeholder="Brief summary of what this team is building..."
                onChange={(e) => setFormData({ ...formData, solutionDescription: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </>
        )}

        {/* ADD PARTICIPANT */}
        {actionType === "add_participant" && (
          <>
            <div>
              <label className="font-semibold text-secondary">Full Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Ananya Sen"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-secondary">Student Email</label>
              <input
                required
                type="email"
                placeholder="e.g. ananya@student.college.edu"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-secondary">Department</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="font-semibold text-secondary">Year</label>
                <input
                  type="text"
                  placeholder="3rd Year"
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-secondary">Team Role</label>
              <select
                onChange={(e) => setFormData({ ...formData, roleInTeam: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>
          </>
        )}

        {/* ADD PROBLEM STATEMENT */}
        {actionType === "add_problem" && (
          <>
            <div>
              <label className="font-semibold text-secondary">Challenge Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Decentralized Green Campus Credits"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-secondary">Category</label>
                <select
                  required
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">Select category</option>
                  <option value="Campus">Campus</option>
                  <option value="Education">Education</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Accessibility">Accessibility</option>
                  <option value="AI">AI</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-secondary">Difficulty</label>
                <select
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold text-secondary">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Elaborate on the challenge context and expectations..."
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </>
        )}

        {/* BROADCAST ANNOUNCEMENT */}
        {actionType === "broadcast_announcement" && (
          <>
            <div>
              <label className="font-semibold text-secondary">Announcement Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Day 1 Milestone PPT Deadline Extended"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-secondary">Audience</label>
                <select
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="Everyone">Everyone</option>
                  <option value="All Teams">All Teams</option>
                  <option value="Participants">Participants Only</option>
                  <option value="Mentors">Mentors Only</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-secondary">Priority</label>
                <select
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent Alert</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold text-secondary">Message Body</label>
              <textarea
                required
                rows={4}
                placeholder="Type your announcement broadcast message..."
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </>
        )}

        {/* ADD SCHEDULE EVENT */}
        {actionType === "add_schedule" && (
          <>
            <div>
              <label className="font-semibold text-secondary">Event Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Mid-term Prototype Code Review"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-secondary">Day #</label>
                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  max={6}
                  onChange={(e) => setFormData({ ...formData, day: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="font-semibold text-secondary">Start Time</label>
                <input
                  required
                  type="text"
                  placeholder="04:30 PM"
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="font-semibold text-secondary">End Time</label>
                <input
                  required
                  type="text"
                  placeholder="05:30 PM"
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-secondary">Location</label>
              <input
                type="text"
                placeholder="Lab 301 / Auditorium"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </>
        )}

        {/* ADD MENTOR */}
        {actionType === "add_mentor" && (
          <>
            <div>
              <label className="font-semibold text-secondary">Mentor Name</label>
              <input
                required
                type="text"
                placeholder="Dr. Rajesh Raman"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-secondary">Email</label>
              <input
                required
                type="email"
                placeholder="rajesh.raman@company.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-secondary">Designation</label>
                <input
                  type="text"
                  placeholder="Principal Architect"
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="font-semibold text-secondary">Organization</label>
                <input
                  type="text"
                  placeholder="Tech Labs"
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Save & Publish
          </Button>
        </div>
      </form>
    </Modal>
  );
}
