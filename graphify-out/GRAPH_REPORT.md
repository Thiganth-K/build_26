# Graph Report - build_26  (2026-09-29)

## Corpus Check
- 89 files · ~365,012 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 426 nodes · 1127 edges · 28 communities (20 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7958367a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AI-Native Build
- Badge
- Learn & Reference Graph
- Avatar
- models/index.ts
- mentors/route.ts
- connectToDatabase
- [teamId]/route.ts
- next
- package.json
- compilerOptions
- getSessionFromRequest
- dependencies
- devDependencies
- db.ts
- scripts
- types/index.ts
- bootcamp/route.ts
- 8. Docker Setup & Operations
- next.config.mjs
- mongoose
- tailwindcss
- rules/graphify.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- seed/route.ts
- app/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 69 edges
2. `Badge()` - 61 edges
3. `Button` - 53 edges
4. `react` - 50 edges
5. `lucide-react` - 40 edges
6. `next` - 40 edges
7. `getSessionFromRequest()` - 37 edges
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

## Communities (28 total, 8 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Badge"
Cohesion: 0.11
Nodes (44): AnalyticsPage(), AnnouncementsPage(), EvaluationPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), ProgressPage(), SchedulePage() (+36 more)

### Community 3 - "Avatar"
Cohesion: 0.08
Nodes (38): FeedbackPage(), AdminLayout(), AdminDashboardPage(), ShowcasePage(), WorkLogsPage(), ParticipantFeedbackPage(), ParticipantLayout(), ActivityFeed() (+30 more)

### Community 4 - "models/index.ts"
Cohesion: 0.06
Nodes (31): ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema, IActivity, IAnnouncement, IBootcamp (+23 more)

### Community 5 - "mentors/route.ts"
Cohesion: 0.22
Nodes (7): GET(), PATCH(), POST(), GET(), PATCH(), POST(), User

### Community 6 - "connectToDatabase"
Cohesion: 0.15
Nodes (19): GET(), POST(), dynamic, GET(), DELETE(), GET(), PATCH(), POST() (+11 more)

### Community 7 - "[teamId]/route.ts"
Cohesion: 0.15
Nodes (13): GET(), GET(), POST(), GET(), POST(), DELETE(), GET(), PATCH() (+5 more)

### Community 8 - "next"
Cohesion: 0.26
Nodes (11): POST(), POST(), GET(), POST(), clearSessionCookie(), getSessionUser(), SessionUser, setSessionCookie() (+3 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): name, private, version, autoprefixer, bcryptjs, clsx, jsonwebtoken, postcss (+10 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "getSessionFromRequest"
Cohesion: 0.21
Nodes (11): DELETE(), GET(), POST(), GET(), PATCH(), GET(), PATCH(), POST() (+3 more)

### Community 12 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, jsonwebtoken, lucide-react, mongoose, next, react (+4 more)

### Community 13 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/react (+2 more)

### Community 14 - "db.ts"
Cohesion: 0.17
Nodes (11): GET(), POST(), GET(), POST(), GET(), POST(), MongooseCache, Mentor (+3 more)

### Community 15 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, db:check, dev, lint, seed, start

### Community 16 - "types/index.ts"
Cohesion: 0.11
Nodes (18): NeedsAttentionPanelProps, 7. Database Models (`/models/index.ts`), ActivityItem, Announcement, AttentionItem, Bootcamp, Feedback, Mentor (+10 more)

### Community 17 - "bootcamp/route.ts"
Cohesion: 0.50
Nodes (3): GET(), PATCH(), Bootcamp

### Community 18 - "8. Docker Setup & Operations"
Cohesion: 0.07
Nodes (26): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 8. Docker Setup & Operations, Admin Application (`/admin`) (+18 more)

### Community 20 - "mongoose"
Cohesion: 0.25
Nodes (5): ref_fs, mongoose, ref_path, checkConnection(), maskUri()

### Community 26 - "seed/route.ts"
Cohesion: 0.50
Nodes (4): execPromise, POST(), ref_child_process, ref_util

## Knowledge Gaps
- **161 isolated node(s):** `dynamic`, `metadata`, `DEPARTMENTS`, `YEARS`, `ActivityFeedProps` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 179 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Badge`, `Avatar`, `mentors/route.ts`, `connectToDatabase`, `[teamId]/route.ts`, `package.json`, `getSessionFromRequest`, `db.ts`, `types/index.ts`, `bootcamp/route.ts`, `seed/route.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.308) - this node is a cross-community bridge._
- **Why does `7. Database Models (`/models/index.ts`)` connect `types/index.ts` to `8. Docker Setup & Operations`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `dynamic`, `metadata`, `DEPARTMENTS` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Badge` be split into smaller, more focused modules?**
  _Cohesion score 0.11171171171171171 - nodes in this community are weakly interconnected._
- **Should `Avatar` be split into smaller, more focused modules?**
  _Cohesion score 0.08240794856808883 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.14855072463768115 - nodes in this community are weakly interconnected._