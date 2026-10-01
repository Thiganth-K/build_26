"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  GraduationCap,
  Users,
  Briefcase,
  CheckCircle2,
  Edit2,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default function ParticipantProfilePage() {
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [editModal, setEditModal] = React.useState(false);

  // Edit fields
  const [collegeInput, setCollegeInput] = React.useState("");
  const [phoneInput, setPhoneInput] = React.useState("");

  const fetchProfile = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me").then((r) => r.json());
      const p = res.participant || res.user;
      setProfile({
        name: p?.name || "THIGANTH K",
        email: p?.email || "participant@college.edu",
        college: p?.college || "Sona College of Technology",
        phone: p?.phone || "+91 98765 43210",
        team: res.team?.name || "Neural Builders",
        role: p?.roleInTeam || "Full Stack Developer",
        teamCreated: true,
        problemSelected: true,
        milestones: "3 / 6",
        workLogs: 8,
        submissions: 3,
      });
      setCollegeInput(p?.college || "Sona College of Technology");
      setPhoneInput(p?.phone || "+91 98765 43210");
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
            SECTION 35
          </span>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">
            PROFILE
          </h1>
        </div>

        {/* Master Profile Card */}
        <div className="rounded-2xl border-2 border-border bg-surface p-8 shadow-soft space-y-7 text-center">
          {/* Avatar and Name */}
          <div className="space-y-3 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-[#111111] text-white flex items-center justify-center text-3xl font-bold shadow-md">
              👤
            </div>
            <div>
              <h2 className="text-xl font-black text-[#111111] tracking-wide uppercase">
                {profile?.name}
              </h2>
              <Badge variant="accent" className="font-mono-num text-[11px] mt-1 font-bold">
                {profile?.role}
              </Badge>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-border bg-surface-subtle/50 divide-y divide-border text-left text-xs font-mono">
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-secondary font-medium">Email</span>
              <span className="font-bold text-[#111111]">{profile?.email}</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-secondary font-medium">College</span>
              <span className="font-bold text-[#111111]">{profile?.college}</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-secondary font-medium">Team</span>
              <span className="font-bold text-accent">{profile?.team}</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-secondary font-medium">Role</span>
              <span className="font-bold text-[#111111]">{profile?.role}</span>
            </div>
          </div>

          {/* Build26 Participation Stats */}
          <div className="space-y-3 text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              BUILD26 PARTICIPATION
            </div>

            <div className="rounded-xl border border-border bg-surface-subtle/50 divide-y divide-border text-xs font-mono">
              <div className="p-3 flex items-center justify-between">
                <span>Team Created</span>
                <span className="text-emerald-700 font-bold">✓</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span>Problem Selected</span>
                <span className="text-emerald-700 font-bold">✓</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span>Milestones</span>
                <span className="font-bold text-[#111111]">{profile?.milestones}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span>Work Logs</span>
                <span className="font-bold text-[#111111]">{profile?.workLogs}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span>Submissions</span>
                <span className="font-bold text-[#111111]">{profile?.submissions}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditModal(true)}
              className="w-full font-bold text-xs gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>[ EDIT PROFILE ]</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border-2 border-border bg-surface p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div>
              <h3 className="text-base font-black text-[#111111]">EDIT PROFILE</h3>
              <p className="text-xs text-secondary mt-0.5">
                Update your institution and contact details.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                  College / Institution
                </label>
                <input
                  type="text"
                  value={collegeInput}
                  onChange={(e) => setCollegeInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs focus:border-black font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setEditModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setProfile((prev: any) => ({
                    ...prev,
                    college: collegeInput,
                    phone: phoneInput,
                  }));
                  setEditModal(false);
                }}
                className="font-bold text-xs"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
