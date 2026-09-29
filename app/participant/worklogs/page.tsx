"use client";

import * as React from "react";
import { Plus, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkLogModal } from "@/components/participant/WorkLogModal";
import { formatDate } from "@/lib/utils";

export default function ParticipantWorklogsPage() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchLogs = React.useCallback(async () => {
    try {
      const res = await fetch("/api/worklogs");
      const data = await res.json();
      setLogs(data.workLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Daily Engineering Work Logs
            </h1>
            <Badge variant="accent">Mandatory Sprint Record</Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Maintain high velocity by logging daily progress, blockers, and completed milestones.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Log Today&apos;s Work</span>
        </Button>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-secondary border border-dashed border-border rounded-xl">
            No work logs recorded yet. Click &ldquo;Log Today&apos;s Work&rdquo; to add your first entry.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="p-5 rounded-xl border border-border bg-surface shadow-soft space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#111111]">
                    {log.participantName}
                  </span>
                  <Badge variant="secondary">{log.role}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-secondary font-mono-num">
                  <span className="flex items-center gap-1 font-semibold text-accent">
                    <Clock className="h-3.5 w-3.5" />
                    {log.timeSpentHours}h logged
                  </span>
                  <span>•</span>
                  <span>{formatDate(log.date)}</span>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-secondary block">
                    What was engineered:
                  </span>
                  <p className="text-[#111111] leading-relaxed mt-0.5">{log.workDone}</p>
                </div>

                {log.completedTasks && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-secondary block">
                      Completed:
                    </span>
                    <p className="text-secondary leading-relaxed mt-0.5">{log.completedTasks}</p>
                  </div>
                )}

                {log.blockers && log.blockers !== "None" && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800">
                    <span className="font-bold">Blockers: </span>
                    {log.blockers}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <WorkLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLogs}
        participantName="Thiganth K."
      />
    </div>
  );
}
