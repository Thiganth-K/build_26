"use client";

import * as React from "react";
import { Search, Filter, Clock, AlertCircle, FileText, CheckCircle2, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function AdminWorkLogsMonitoringPage() {
  const [workLogs, setWorkLogs] = React.useState<any[]>([]);
  const [teams, setTeams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTeamId, setSelectedTeamId] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  const fetchData = React.useCallback(async () => {
    try {
      const [logsRes, teamsRes] = await Promise.all([
        fetch("/api/worklogs").then((r) => r.json()),
        fetch("/api/teams").then((r) => r.json()),
      ]);

      setWorkLogs(logsRes.workLogs || []);
      setTeams(teamsRes.teams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Section 46 Team Individual Contributions Sample
  const sampleContributions = [
    { name: "Thiganth K", role: "Full Stack", logs: 8, hours: 14.5, lastActive: "10 min ago" },
    { name: "Neha Prapti", role: "UI/UX", logs: 7, hours: 11.0, lastActive: "25 min ago" },
    { name: "Aathikesavaa", role: "AI/ML", logs: 6, hours: 10.5, lastActive: "40 min ago" },
    { name: "Member 04", role: "Backend", logs: 5, hours: 8.0, lastActive: "1 hr ago" },
  ];

  const activeTeam = teams.find((t) => t._id === selectedTeamId) || teams[0] || { name: "NEURAL BUILDERS" };

  const filteredLogs = workLogs.filter((log) => {
    const matchesTeam = selectedTeamId === "all" || log.team === selectedTeamId;
    const matchesSearch =
      log.participantName.toLowerCase().includes(search.toLowerCase()) ||
      log.workDone.toLowerCase().includes(search.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="pb-3 border-b border-border">
        <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
          SECTION 46
        </span>
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">
          ADMIN / INDIVIDUAL CONTRIBUTION
        </h1>
        <p className="text-xs text-secondary mt-0.5">
          Measure individual participant contribution, hours logged, and accountability within teams.
        </p>
      </div>

      {/* Wireframe Section 46: Team Selection & Individual Table */}
      <div className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-secondary uppercase">TEAM:</span>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-surface text-xs font-bold"
            >
              <option value="all">All Teams (Neural Builders)</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-mono text-secondary">
            Section 46 Individual Participation Metric
          </span>
        </div>

        {/* Section 46 Table */}
        <div className="rounded-xl border border-border overflow-hidden font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-secondary font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">PARTICIPANT</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">LOGS</th>
                <th className="py-3 px-4">HOURS</th>
                <th className="py-3 px-4">LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sampleContributions.map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#111111]">
                    {idx === 0 ? "👑 " : "👤 "}
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-secondary">{p.role}</td>
                  <td className="py-3 px-4 font-bold text-accent">{p.logs}</td>
                  <td className="py-3 px-4 font-bold">{p.hours}</td>
                  <td className="py-3 px-4 text-emerald-700 font-medium">{p.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const el = document.getElementById("full-logs-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-xs font-bold"
          >
            [ VIEW FULL LOGS ]
          </Button>
        </div>
      </div>

      {/* Full Work Logs Stream */}
      <div id="full-logs-section" className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-base font-bold text-[#111111] uppercase tracking-wide">
            AUDIT LOG STREAM ({filteredLogs.length} ENTRIES)
          </h2>
          <div className="w-56">
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-border bg-surface text-xs focus:border-black focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div key={log._id} className="p-4 rounded-xl border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111111]">{log.participantName}</span>
                  <Badge variant="secondary" size="sm">
                    {log.teamName}
                  </Badge>
                  <span className="text-[11px] text-secondary">({log.role})</span>
                </div>
                <span className="font-bold text-accent">{log.timeSpentHours || 3}h</span>
              </div>
              <p className="text-secondary leading-relaxed font-sans text-xs">{log.workDone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
