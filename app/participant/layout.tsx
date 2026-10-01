"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ParticipantSidebar } from "@/components/participant/ParticipantSidebar";
import { TeamOnboardingView } from "@/components/participant/TeamOnboardingView";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [participant, setParticipant] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);
  const [hasTeam, setHasTeam] = React.useState<boolean>(false);

  const checkUserStatus = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!res.ok || !data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      setParticipant(data.participant || null);
      setTeam(data.team || null);

      const hasAssignedTeam = Boolean(
        data.team?._id || data.user?.teamId || data.participant?.team
      );
      setHasTeam(hasAssignedTeam);
    } catch (err) {
      console.error("Error verifying participant status:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-3">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-secondary font-medium tracking-tight">
          Loading participant workspace...
        </div>
      </div>
    );
  }

  // When participant has NO team:
  // 1. Sidebar is REMOVED completely
  // 2. Only show Create New Team & Join Team onboarding
  // 3. Welcome card contains the Logout button
  if (!hasTeam) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
          <TeamOnboardingView
            participant={participant || user || { name: "Participant", email: "" }}
            onTeamAssigned={(newTeam) => {
              setTeam(newTeam);
              setHasTeam(true);
              checkUserStatus();
            }}
          />
        </div>
      </main>
    );
  }

  // Once team is created or joined, sidebar is visible
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <React.Suspense fallback={<aside className="w-64 shrink-0 border-r border-border bg-surface" />}>
        <ParticipantSidebar
          participantName={participant?.name || user?.name || "Participant"}
          teamName={team?.name || "My Team"}
          teamCode={team?.code || "ASSIGNED"}
        />
      </React.Suspense>
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
