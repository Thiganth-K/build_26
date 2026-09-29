import * as React from "react";
import { ParticipantSidebar } from "@/components/participant/ParticipantSidebar";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <ParticipantSidebar
        participantName="Thiganth K."
        teamName="Team Alpha"
        teamCode="B26-ALPHA"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
