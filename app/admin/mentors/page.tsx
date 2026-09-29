"use client";

import * as React from "react";
import { Plus, Search, GraduationCap, Building2, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { QuickActionModal } from "@/components/admin/QuickActionModal";

export default function MentorsPage() {
  const [mentors, setMentors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchMentors = React.useCallback(async () => {
    try {
      const res = await fetch("/api/mentors");
      const data = await res.json();
      setMentors(data.mentors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Technical Mentors & Industry Experts
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {mentors.length} Mentors
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Industry advisors and faculty guiding architecture, product strategy, and reviews.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Mentor</span>
        </Button>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mentors.map((m) => (
          <div
            key={m._id}
            className="rounded-xl border border-border bg-surface p-5 shadow-soft hover:border-accent/40 transition-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
                <Avatar name={m.name} src={m.avatar} size="lg" />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#111111] truncate">{m.name}</h3>
                  <div className="text-xs text-accent font-medium mt-0.5">{m.designation}</div>
                  <div className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{m.organization}</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mt-3 flex items-center gap-2 text-[11px] text-secondary">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                <span>{m.availability || "Daily 4:00 PM - 7:00 PM"}</span>
              </div>

              {/* Expertise Tags */}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase text-secondary block mb-1">
                  Core Expertise:
                </span>
                <div className="flex flex-wrap gap-1">
                  {m.expertise?.map((e: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-surface-subtle border border-border/60 text-secondary font-mono-num text-[10px]"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned Teams */}
            <div className="mt-4 pt-3 border-t border-border/60">
              <span className="text-[10px] font-bold uppercase text-secondary block mb-1.5">
                Assigned Teams ({m.assignedTeams?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {m.assignedTeams && m.assignedTeams.length > 0 ? (
                  m.assignedTeams.map((t: any) => (
                    <span
                      key={t._id}
                      className="px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold text-[11px] font-mono-num"
                    >
                      {t.name}
                    </span>
                  ))
                ) : (
                  <span className="text-secondary text-xs italic">No teams assigned yet</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickActionModal
        actionType={isModalOpen ? "add_mentor" : null}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMentors}
      />
    </div>
  );
}
