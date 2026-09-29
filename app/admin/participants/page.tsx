"use client";

import * as React from "react";
import { Plus, Search, Filter, Mail, Award, X, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { QuickActionModal } from "@/components/admin/QuickActionModal";
import { ProgressBar } from "@/components/ui/progress";

export default function ParticipantsPage() {
  const [participants, setParticipants] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedParticipant, setSelectedParticipant] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchParticipants = React.useCallback(async () => {
    try {
      const res = await fetch("/api/participants");
      const data = await res.json();
      setParticipants(data.participants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const filteredParticipants = participants.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.admissionNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.mobileNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.department?.toLowerCase().includes(search.toLowerCase()) ||
      p.roleInTeam?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Participant Directory
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {participants.length} Active Students
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Student roster, multidisciplinary roles, attendance status, and team assignments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Participant</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="h-3.5 w-3.5 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, email, department, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-border bg-surface text-[#111111] placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Participants Table */}
      <div className="rounded-xl border border-border bg-surface shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle/60 border-b border-border text-[11px] font-semibold text-secondary uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Department & Year</th>
                <th className="py-3 px-3">Assigned Team</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Skills</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredParticipants.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-surface-subtle/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedParticipant(p)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.name} src={p.avatar} size="sm" />
                      <div>
                        <div className="font-semibold text-[#111111] flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.admissionNumber && (
                            <span className="text-[10px] font-mono-num px-1 py-0.2 rounded bg-surface-subtle border border-border/60 text-secondary">
                              {p.admissionNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-secondary">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-medium text-[#111111]">{p.department}</div>
                    <div className="text-[10px] text-secondary">{p.year}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {p.team ? (
                      <span className="font-semibold text-accent font-mono-num">
                        {p.team.name}
                      </span>
                    ) : (
                      <span className="text-secondary italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge variant="secondary">{p.roleInTeam}</Badge>
                  </td>
                  <td className="py-3 px-3 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {p.skills?.slice(0, 2).map((s: string, i: number) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border/50 text-[10px] text-secondary font-mono-num"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap font-mono-num font-bold text-emerald-600">
                    {p.contributionScore || 85}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td
                    className="py-3 px-3 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedParticipant(p)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Profile Drawer / Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setSelectedParticipant(null)} />
          <div className="relative w-full max-w-md h-full bg-surface border-l border-border p-6 shadow-elevated flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Participant Profile
              </span>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-1 rounded text-secondary hover:text-foreground hover:bg-surface-subtle"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <Avatar
                name={selectedParticipant.name}
                src={selectedParticipant.avatar}
                size="xl"
              />
              <h2 className="text-base font-bold text-[#111111] mt-3">
                {selectedParticipant.name}
              </h2>
              <div className="text-xs text-secondary mt-0.5">{selectedParticipant.email}</div>
              <Badge variant="accent" className="mt-2">
                {selectedParticipant.roleInTeam}
              </Badge>
            </div>

            <div className="mt-6 space-y-4 text-xs divide-y divide-border/60">
              {selectedParticipant.admissionNumber && (
                <div className="pt-3 flex justify-between items-center">
                  <span className="text-secondary">Admission / Roll No:</span>
                  <span className="font-mono-num font-bold text-[#111111] px-2 py-0.5 rounded bg-surface-subtle border border-border">
                    {selectedParticipant.admissionNumber}
                  </span>
                </div>
              )}
              {selectedParticipant.mobileNumber && (
                <div className="pt-3 flex justify-between items-center">
                  <span className="text-secondary">Mobile Number:</span>
                  <a
                    href={`tel:${selectedParticipant.mobileNumber}`}
                    className="font-mono-num font-semibold text-accent hover:underline"
                  >
                    {selectedParticipant.mobileNumber}
                  </a>
                </div>
              )}
              <div className="pt-3 flex justify-between">
                <span className="text-secondary">Department:</span>
                <span className="font-semibold text-[#111111]">
                  {selectedParticipant.department}
                </span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-secondary">Year of Study:</span>
                <span className="font-semibold text-[#111111]">
                  {selectedParticipant.yearOfStudy || selectedParticipant.year}
                </span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-secondary">Team:</span>
                <span className="font-semibold text-accent">
                  {selectedParticipant.team?.name || "Unassigned"}
                </span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-secondary">Attendance:</span>
                <span className="font-semibold text-emerald-600">
                  {selectedParticipant.attendance || "Present"}
                </span>
              </div>
              <div className="pt-3">
                <span className="text-secondary block mb-1.5">Contribution Score:</span>
                <div className="flex items-center gap-2">
                  <ProgressBar
                    value={selectedParticipant.contributionScore || 85}
                    color="emerald"
                    className="h-2 flex-1"
                  />
                  <span className="font-mono-num font-bold text-emerald-600">
                    {selectedParticipant.contributionScore || 85}/100
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-secondary block mb-1.5">Verified Technical Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedParticipant.skills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-secondary font-mono-num text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedParticipant(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <QuickActionModal
        actionType={isModalOpen ? "add_participant" : null}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchParticipants}
      />
    </div>
  );
}
