"use client";

import * as React from "react";
import { Plus, Clock, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface ParticipantHeaderProps {
  participantName?: string;
  currentPhase?: string;
  onOpenWorkLog?: () => void;
  onSubmitMilestone?: () => void;
}

export function ParticipantHeader({
  participantName = "Thiganth K.",
  currentPhase = "Ideation",
  onOpenWorkLog,
  onSubmitMilestone,
}: ParticipantHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Good morning, {participantName.split(" ")[0]}
            </h1>
            <Badge variant="accent" className="font-mono-num text-[10px] uppercase">
              Phase: {currentPhase}
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Keep your team sprint moving, log today&apos;s contributions, and check milestone gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenWorkLog}
            className="gap-1.5"
          >
            <Clock className="h-3.5 w-3.5 text-accent" />
            <span>Log Today&apos;s Work</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSubmitMilestone}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Submit Milestone</span>
          </Button>

          <Avatar name={participantName} size="md" />
        </div>
      </div>
    </header>
  );
}
