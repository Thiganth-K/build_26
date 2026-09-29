"use client";

import * as React from "react";
import {
  FileText,
  UploadCloud,
  MessageSquare,
  Users,
  CheckCircle,
  Megaphone,
  Award,
  Zap,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface ActivityFeedProps {
  activities: any[];
}

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "SUBMISSION_CREATED":
        return <UploadCloud className="h-3.5 w-3.5 text-accent" />;
      case "WORKLOG_CREATED":
        return <FileText className="h-3.5 w-3.5 text-blue-500" />;
      case "FEEDBACK_ADDED":
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />;
      case "PARTICIPANT_JOINED":
        return <Users className="h-3.5 w-3.5 text-indigo-500" />;
      case "ANNOUNCEMENT_PUBLISHED":
        return <Megaphone className="h-3.5 w-3.5 text-amber-500" />;
      case "EVALUATION_UPDATED":
        return <Award className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <Zap className="h-3.5 w-3.5 text-secondary" />;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-soft flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Real-time Activity Stream
          </h3>
        </div>
        <span className="text-[10px] text-secondary font-mono-num font-semibold">Live Pulse</span>
      </div>

      <div className="space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-xs text-secondary">
            No recent activity recorded yet.
          </div>
        ) : (
          activities.map((act) => (
            <div key={act._id} className="flex items-start gap-3 group">
              <Avatar
                name={act.participantName || act.teamName || "User"}
                src={act.avatar}
                size="sm"
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-[#111111] truncate">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-secondary font-mono-num whitespace-nowrap">
                    {formatRelativeTime(act.createdAt)}
                  </span>
                </div>
                {act.description && (
                  <p className="text-[11px] text-secondary mt-0.5 line-clamp-2">
                    {act.description}
                  </p>
                )}
                {act.teamName && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-secondary font-medium">
                    {getActivityIcon(act.type)}
                    <span className="text-foreground font-semibold">{act.teamName}</span>
                    {act.participantName && <span>• by {act.participantName}</span>}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
