"use client";

import * as React from "react";
import { Plus, Megaphone, AlertTriangle, Users, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuickActionModal } from "@/components/admin/QuickActionModal";
import { formatDate } from "@/lib/utils";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchAnnouncements = React.useCallback(async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Bootcamp Broadcast Announcements
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {announcements.length} Published
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Dispatch high-priority milestone reminders, room allocations, and mentor hours directly to participant interfaces.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Announcement</span>
        </Button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {announcements.map((ann) => (
          <div
            key={ann._id}
            className={`p-5 rounded-xl border bg-surface shadow-soft space-y-3 transition-card ${
              ann.priority === "Urgent"
                ? "border-rose-200/90 bg-rose-50/10"
                : ann.priority === "High"
                ? "border-amber-200/90 bg-amber-50/10"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    ann.priority === "Urgent"
                      ? "danger"
                      : ann.priority === "High"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {ann.priority} Priority
                </Badge>
                <span className="text-xs font-semibold text-secondary">
                  Audience: {ann.audience}
                </span>
              </div>
              <span className="text-[11px] font-mono-num text-secondary">
                {formatDate(ann.publishedAt)}
              </span>
            </div>

            <h3 className="font-bold text-sm text-[#111111]">{ann.title}</h3>
            <p className="text-xs text-secondary leading-relaxed">{ann.message}</p>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-secondary">
              <span>Author: {ann.author}</span>
              <button
                onClick={() => handleDelete(ann._id)}
                className="text-secondary hover:text-rose-600 p-1 transition-colors"
                title="Delete announcement"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <QuickActionModal
        actionType={isModalOpen ? "broadcast_announcement" : null}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAnnouncements}
      />
    </div>
  );
}
