"use client";

import * as React from "react";
import { Search, Filter, Clock, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export default function WorkLogsPage() {
  const [workLogs, setWorkLogs] = React.useState<any[]>([]);
  const [teams, setTeams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTeam, setSelectedTeam] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
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

  const filteredLogs = workLogs.filter((log) => {
    const matchesTeam = selectedTeam === "all" || log.team === selectedTeam;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    const matchesSearch =
      log.participantName.toLowerCase().includes(search.toLowerCase()) ||
      log.teamName.toLowerCase().includes(search.toLowerCase()) ||
      log.workDone.toLowerCase().includes(search.toLowerCase()) ||
      (log.blockers && log.blockers.toLowerCase().includes(search.toLowerCase()));

    return matchesTeam && matchesStatus && matchesSearch;
  });

  const totalHours = filteredLogs.reduce((acc, l) => acc + (l.timeSpentHours || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Engineering Work Logs
            </h1>
            <Badge variant="secondary" className="font-mono-num text-[11px]">
              {workLogs.length} Records
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Audit daily student contributions, hours logged, sprint blockers, and completed tasks.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface p-2.5 rounded-xl border border-border">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-secondary">Total Sprint Hours</div>
            <div className="text-lg font-bold font-mono-num text-accent">{totalHours} Hours</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search work done or blockers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-surface text-[#111111] placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Team Filter */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Teams</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Work Logs List */}
      <div className="space-y-3.5">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-secondary border border-dashed border-border rounded-xl">
            No work logs found matching the filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log._id}
              className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3 transition-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Avatar name={log.participantName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111111]">
                        {log.participantName}
                      </span>
                      <Badge variant="accent" size="sm">
                        {log.teamName}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {log.role}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-secondary font-mono-num">
                      Logged for {formatDate(log.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-mono-num font-semibold text-secondary">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{log.timeSpentHours}h logged</span>
                  </div>
                  <Badge
                    variant={
                      log.status === "Completed"
                        ? "success"
                        : log.status === "Blocked"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
              </div>

              {/* Work Done */}
              <div className="text-xs space-y-2">
                <div>
                  <span className="font-semibold text-secondary text-[11px] uppercase tracking-wider block">
                    Today&apos;s Work:
                  </span>
                  <p className="text-[#111111] leading-relaxed mt-0.5">{log.workDone}</p>
                </div>

                {log.completedTasks && (
                  <div>
                    <span className="font-semibold text-secondary text-[11px] uppercase tracking-wider block">
                      Tasks Completed:
                    </span>
                    <p className="text-secondary leading-relaxed mt-0.5">{log.completedTasks}</p>
                  </div>
                )}

                {log.blockers && log.blockers !== "None" && (
                  <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200/60 text-[11px] text-rose-800 flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">Blocker Encountered: </span>
                      {log.blockers}
                    </div>
                  </div>
                )}

                {log.nextSteps && (
                  <div className="text-[11px] text-secondary">
                    <span className="font-semibold text-secondary">Next Steps: </span>
                    {log.nextSteps}
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
