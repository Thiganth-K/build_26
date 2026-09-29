# Graph Report - build_26  (2026-09-29)

## Corpus Check
- 86 files · ~361,260 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .pptx 2, .example 1)

## Summary
- 412 nodes · 1090 edges · 32 communities (23 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- AI-Native Build
- Badge
- Learn & Reference Graph
- cn
- models/index.ts
- types/index.ts
- connectToDatabase
- db.ts
- next
- package.json
- compilerOptions
- getSessionFromRequest
- dependencies
- devDependencies
- seed/route.ts
- scripts
- bootcamp/route.ts
- evaluations/route.ts
- 8. Docker Setup & Operations
- next.config.mjs
- mongoose
- tailwindcss
- rules/graphify.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- lucide-react
- badge.tsx
- react
- participant/page.tsx
- ProgressBar
- app/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 67 edges
2. `Badge()` - 60 edges
3. `Button` - 50 edges
4. `react` - 49 edges
5. `lucide-react` - 39 edges
6. `next` - 38 edges
7. `getSessionFromRequest()` - 35 edges
8. `Avatar()` - 34 edges
9. `cn()` - 32 edges
10. `ProgressBar()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `7. Database Models (`/models/index.ts`)` --references--> `Submission`  [INFERRED]
  README.md → types/index.ts
- `GET()` --calls--> `connectToDatabase()`  [EXTRACTED]
  app/api/analytics/route.ts → lib/db.ts
- `GET()` --calls--> `connectToDatabase()`  [EXTRACTED]
  app/api/announcements/route.ts → lib/db.ts
- `DELETE()` --calls--> `connectToDatabase()`  [EXTRACTED]
  app/api/announcements/route.ts → lib/db.ts
- `GET()` --calls--> `connectToDatabase()`  [EXTRACTED]
  app/api/attention/route.ts → lib/db.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **BUILD26 End-to-End Delivery Pipeline** — docs_build26_real_problems, docs_build26_ai_native_build, docs_build26_deploy_stage, docs_build26_demo_day [EXTRACTED 0.95]

## Communities (32 total, 9 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Badge"
Cohesion: 0.19
Nodes (18): AnnouncementsPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), ProgressPage(), SchedulePage(), SettingsPage(), TeamsListPage() (+10 more)

### Community 3 - "cn"
Cohesion: 0.16
Nodes (15): AdminLayout(), ParticipantLayout(), AdminSidebar(), AdminSidebarProps, KpiCard(), KpiCardProps, ParticipantSidebar(), ParticipantSidebarProps (+7 more)

### Community 4 - "models/index.ts"
Cohesion: 0.06
Nodes (31): ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema, IActivity, IAnnouncement, IBootcamp (+23 more)

### Community 5 - "types/index.ts"
Cohesion: 0.11
Nodes (18): NeedsAttentionPanelProps, 7. Database Models (`/models/index.ts`), ActivityItem, Announcement, AttentionItem, Bootcamp, Feedback, Mentor (+10 more)

### Community 6 - "connectToDatabase"
Cohesion: 0.16
Nodes (19): GET(), POST(), GET(), PATCH(), POST(), DELETE(), GET(), PATCH() (+11 more)

### Community 7 - "db.ts"
Cohesion: 0.13
Nodes (17): GET(), GET(), DELETE(), GET(), PATCH(), POST(), DELETE(), GET() (+9 more)

### Community 8 - "next"
Cohesion: 0.14
Nodes (18): POST(), POST(), GET(), POST(), dynamic, GET(), GET(), PATCH() (+10 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): name, private, version, autoprefixer, bcryptjs, clsx, jsonwebtoken, postcss (+10 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "getSessionFromRequest"
Cohesion: 0.16
Nodes (14): DELETE(), GET(), POST(), GET(), POST(), GET(), PATCH(), GET() (+6 more)

### Community 12 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, jsonwebtoken, lucide-react, mongoose, next, react (+4 more)

### Community 13 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/react (+2 more)

### Community 14 - "seed/route.ts"
Cohesion: 0.50
Nodes (4): execPromise, POST(), ref_child_process, ref_util

### Community 15 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, seed, start

### Community 16 - "bootcamp/route.ts"
Cohesion: 0.50
Nodes (3): GET(), PATCH(), Bootcamp

### Community 17 - "evaluations/route.ts"
Cohesion: 0.50
Nodes (3): GET(), POST(), Evaluation

### Community 18 - "8. Docker Setup & Operations"
Cohesion: 0.07
Nodes (26): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 8. Docker Setup & Operations, Admin Application (`/admin`) (+18 more)

### Community 26 - "lucide-react"
Cohesion: 0.18
Nodes (16): AdminDashboardPage(), ActivityFeed(), ActivityFeedProps, AdminHeader(), BootcampPhaseTimeline(), PHASES, PhaseTimelineProps, DeadlinePanel() (+8 more)

### Community 27 - "badge.tsx"
Cohesion: 0.24
Nodes (10): FeedbackPage(), ShowcasePage(), TeamDetailPage(), WorkLogsPage(), ParticipantFeedbackPage(), AdminHeaderProps, Avatar(), AvatarProps (+2 more)

### Community 28 - "react"
Cohesion: 0.28
Nodes (9): EvaluationPage(), SubmissionsPage(), ParticipantSubmissionsPage(), ParticipantTasksPage(), SubmissionModal(), SubmissionModalProps, Modal(), ModalProps (+1 more)

### Community 29 - "participant/page.tsx"
Cohesion: 0.33
Nodes (6): ParticipantDashboardPage(), ParticipantWorklogsPage(), ParticipantHeader(), ParticipantHeaderProps, WorkLogModal(), WorkLogModalProps

### Community 30 - "ProgressBar"
Cohesion: 0.36
Nodes (4): AnalyticsPage(), ParticipantTeamPage(), ProgressBar(), ProgressProps

## Knowledge Gaps
- **157 isolated node(s):** `dynamic`, `metadata`, `ActivityFeedProps`, `AdminHeaderProps`, `AdminSidebarProps` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 172 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Badge`, `cn`, `types/index.ts`, `connectToDatabase`, `db.ts`, `package.json`, `getSessionFromRequest`, `seed/route.ts`, `bootcamp/route.ts`, `evaluations/route.ts`, `lucide-react`, `badge.tsx`, `participant/page.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.310) - this node is a cross-community bridge._
- **Why does `7. Database Models (`/models/index.ts`)` connect `types/index.ts` to `8. Docker Setup & Operations`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `dynamic`, `metadata`, `ActivityFeedProps` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11052631578947368 - nodes in this community are weakly interconnected._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.14130434782608695 - nodes in this community are weakly interconnected._