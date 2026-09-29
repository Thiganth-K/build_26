"use client";

import * as React from "react";
import { MessageSquare, Star, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchFeedbacks = React.useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#111111]">
            Mentor Feedback & Review Log
          </h1>
          <Badge variant="secondary" className="font-mono-num text-[11px]">
            {feedbacks.length} Reviews
          </Badge>
        </div>
        <p className="text-xs text-secondary mt-1">
          Detailed architectural and product critique submitted by assigned mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3 transition-card"
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
                <Badge variant="accent" className="font-semibold text-xs">
                  {fb.teamName}
                </Badge>
                <div className="text-[11px] font-bold text-amber-600 font-mono-num mt-1">
                  {"★".repeat(fb.rating)} ({fb.rating}/5)
                </div>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-[#111111] leading-relaxed italic bg-surface-subtle/50 p-2.5 rounded border border-border/50">
                &ldquo;{fb.generalFeedback}&rdquo;
              </p>

              {fb.strengths && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                    Observed Strengths:
                  </span>
                  <p className="text-secondary mt-0.5">{fb.strengths}</p>
                </div>
              )}

              {fb.areasOfImprovement && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-700 block">
                    Areas of Improvement:
                  </span>
                  <p className="text-secondary mt-0.5">{fb.areasOfImprovement}</p>
                </div>
              )}

              {fb.actionItems && fb.actionItems.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-[10px] font-bold uppercase text-secondary block mb-1">
                    Action Items:
                  </span>
                  <ul className="list-disc list-inside text-secondary space-y-0.5">
                    {fb.actionItems.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
