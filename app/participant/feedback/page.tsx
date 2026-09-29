"use client";

import * as React from "react";
import { MessageSquare, Star, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export default function ParticipantFeedbackPage() {
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => setFeedbacks(data.feedbacks || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#111111]">
            Mentor Feedback & Recommendations
          </h1>
          <Badge variant="accent">Technical Advisory</Badge>
        </div>
        <p className="text-xs text-secondary mt-1">
          Review targeted architectural feedback, design suggestions, and assigned sprint action items from your mentors.
        </p>
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="p-5 rounded-xl border border-border bg-surface shadow-soft space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <Avatar name={fb.mentorName} size="md" />
                <div>
                  <div className="font-bold text-xs text-[#111111]">{fb.mentorName}</div>
                  <div className="text-[10px] text-secondary font-mono-num">
                    Phase: {fb.phase} • {formatDate(fb.createdAt)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-amber-600 font-mono-num">
                  {"★".repeat(fb.rating)} ({fb.rating}/5)
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2.5">
              <p className="text-[#111111] leading-relaxed italic bg-surface-subtle/50 p-3 rounded-lg border border-border/50">
                &ldquo;{fb.generalFeedback}&rdquo;
              </p>

              {fb.strengths && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                    Observed Strengths:
                  </span>
                  <p className="text-secondary mt-0.5 leading-relaxed">{fb.strengths}</p>
                </div>
              )}

              {fb.areasOfImprovement && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-700 block">
                    Areas of Improvement:
                  </span>
                  <p className="text-secondary mt-0.5 leading-relaxed">{fb.areasOfImprovement}</p>
                </div>
              )}

              {fb.actionItems && fb.actionItems.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-[10px] font-bold uppercase text-secondary block mb-1">
                    Priority Action Items:
                  </span>
                  <div className="space-y-1">
                    {fb.actionItems.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-secondary">
                        <CheckCircle2 className="h-3 w-3 text-accent shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
