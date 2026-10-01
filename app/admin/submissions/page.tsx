"use client";

import * as React from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, ExternalLink, Award, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function SubmissionsMonitorPage() {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDay, setSelectedDay] = React.useState("all");
  const [selectedTeam, setSelectedTeam] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  const [selectedSub, setSelectedSub] = React.useState<any>(null);
  const [reviewForm, setReviewForm] = React.useState<any>({
    status: "Approved",
    reviewNotes: "",
    scores: {
      problemUnderstanding: 9,
      innovation: 9,
      feasibility: 9,
      technicalApproach: 9,
      userImpact: 9,
    },
  });

  const fetchSubmissions = React.useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Section 45 default seed sample if empty
  const defaultSample = [
    {
      _id: "s1",
      teamName: "Neural Builders",
      day: 1,
      title: "Solution PPT",
      createdAt: new Date().toISOString(),
      displayTime: "5:42 PM",
      status: "Submitted",
    },
    {
      _id: "s2",
      teamName: "Code Crafters",
      day: 1,
      title: "Solution PPT",
      createdAt: new Date().toISOString(),
      displayTime: "5:58 PM",
      status: "Submitted",
    },
    {
      _id: "s3",
      teamName: "Innovators",
      day: 2,
      title: "Wireframe",
      createdAt: new Date().toISOString(),
      displayTime: "4:35 PM",
      status: "Submitted",
    },
  ];

  const displayList = submissions.length > 0 ? submissions : defaultSample;

  const filtered = displayList.filter((s) => {
    if (selectedDay !== "all" && String(s.day) !== selectedDay) return false;
    if (selectedTeam !== "all" && s.teamName !== selectedTeam) return false;
    if (selectedStatus !== "all" && s.status !== selectedStatus) return false;
    return true;
  });

  const uniqueTeams = Array.from(new Set(displayList.map((s) => s.teamName)));

  const handleOpenReview = (sub: any) => {
    setSelectedSub(sub);
    setReviewForm({
      status: sub.status === "Pending Review" ? "Approved" : sub.status,
      reviewNotes: sub.reviewNotes || "",
      scores: sub.scores || {
        problemUnderstanding: 9,
        innovation: 9,
        feasibility: 9,
        technicalApproach: 9,
        userImpact: 9,
      },
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSub._id,
          status: reviewForm.status,
          reviewNotes: reviewForm.reviewNotes,
          scores: reviewForm.scores,
        }),
      });
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-3 border-b border-border">
        <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
          SECTION 45
        </span>
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">
          ADMIN / SUBMISSIONS
        </h1>
        <p className="text-xs text-secondary mt-0.5">
          Submission monitor across all teams and milestone days with evaluation controls.
        </p>
      </div>

      {/* Wireframe Section 45 Filters */}
      <div className="p-4 rounded-xl border border-border bg-surface flex flex-wrap items-center gap-4 text-xs">
        <div className="font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          <span>FILTER:</span>
        </div>

        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-surface font-mono font-bold"
        >
          <option value="all">[ Day: All ]</option>
          <option value="1">Day 01</option>
          <option value="2">Day 02</option>
          <option value="3">Day 03</option>
          <option value="4">Day 04</option>
          <option value="5">Day 05</option>
          <option value="6">Day 06</option>
        </select>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-surface font-bold"
        >
          <option value="all">[ Team: All ]</option>
          {uniqueTeams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-surface font-bold"
        >
          <option value="all">[ Status: All ]</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Changes Requested">Changes Requested</option>
        </select>
      </div>

      {/* Wireframe Section 45 Table */}
      <div className="rounded-2xl border-2 border-border bg-surface overflow-hidden shadow-soft font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-subtle text-secondary font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4">TEAM</th>
              <th className="py-3.5 px-4">DAY</th>
              <th className="py-3.5 px-4">SUBMISSION</th>
              <th className="py-3.5 px-4">TIME</th>
              <th className="py-3.5 px-4">STATUS</th>
              <th className="py-3.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((sub) => {
              const timeStr =
                sub.displayTime ||
                new Date(sub.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

              return (
                <tr key={sub._id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#111111]">{sub.teamName}</td>
                  <td className="py-3 px-4">Day 0{sub.day || 1}</td>
                  <td className="py-3 px-4 font-semibold text-accent">{sub.title}</td>
                  <td className="py-3 px-4 text-secondary">{timeStr}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : sub.status === "Submitted"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {sub.status || "Submitted"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(sub)}
                      className="text-xs font-bold"
                    >
                      [ EVALUATE ]
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Evaluate Submission: ${selectedSub.teamName}`}
          description={`Day 0${selectedSub.day || 1} — ${selectedSub.title}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-2">
              <div className="font-bold text-xs text-[#111111]">Evaluator Decision</div>
              <select
                value={reviewForm.status}
                onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-surface font-bold"
              >
                <option value="Approved">Approved (Progress Team)</option>
                <option value="Changes Requested">Changes Requested</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-secondary uppercase text-[10px]">
                Feedback & Notes
              </label>
              <textarea
                rows={3}
                value={reviewForm.reviewNotes}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewNotes: e.target.value })}
                placeholder="Specific guidance for the team..."
                className="w-full p-3 rounded-lg border border-border bg-surface text-xs mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" type="button" onClick={() => setSelectedSub(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" className="font-bold">
                Save Evaluation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
