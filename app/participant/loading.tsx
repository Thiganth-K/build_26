import * as React from "react";

export default function ParticipantLoading() {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
        <div className="absolute h-3 w-3 bg-accent rounded-full animate-ping opacity-75" />
      </div>
      <div className="text-center space-y-1">
        <div className="text-xs font-bold text-[#111111] tracking-tight">
          Loading Workspace View...
        </div>
        <div className="text-[11px] text-secondary">
          Fetching team records & sprint state
        </div>
      </div>
    </div>
  );
}
