# Graph Report - build_26  (2026-09-29)

## Corpus Check
- 85 files · ~360,626 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .pptx 2, .example 1, .css 1)

## Summary
- 397 nodes · 1071 edges · 26 communities (18 shown, 8 thin omitted)
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
- teams/route.ts
- next.config.mjs
- mongoose
- tailwindcss
- rules/graphify.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 65 edges
2. `Badge()` - 60 edges
3. `Button` - 50 edges
4. `react` - 49 edges
5. `lucide-react` - 39 edges
6. `next` - 37 edges
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

## Communities (26 total, 8 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Badge"
Cohesion: 0.11
Nodes (48): AnalyticsPage(), AnnouncementsPage(), EvaluationPage(), FeedbackPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), ProgressPage() (+40 more)

### Community 3 - "cn"
Cohesion: 0.08
Nodes (32): AdminLayout(), AdminDashboardPage(), ParticipantLayout(), ActivityFeed(), ActivityFeedProps, AdminHeader(), AdminSidebar(), AdminSidebarProps (+24 more)

### Community 4 - "models/index.ts"
Cohesion: 0.06
Nodes (31): ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema, IActivity, IAnnouncement, IBootcamp (+23 more)

### Community 5 - "types/index.ts"
Cohesion: 0.06
Nodes (30): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 7. Database Models (`/models/index.ts`), Admin Application (`/admin`) (+22 more)

### Community 6 - "connectToDatabase"
Cohesion: 0.14
Nodes (21): GET(), POST(), GET(), PATCH(), POST(), GET(), PATCH(), POST() (+13 more)

### Community 7 - "db.ts"
Cohesion: 0.16
Nodes (14): GET(), GET(), DELETE(), GET(), PATCH(), POST(), DELETE(), GET() (+6 more)

### Community 8 - "next"
Cohesion: 0.20
Nodes (14): POST(), POST(), GET(), POST(), GET(), POST(), clearSessionCookie(), getSessionUser() (+6 more)

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
Cohesion: 0.22
Nodes (6): execPromise, POST(), app_globals, metadata, ref_child_process, ref_util

### Community 15 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, seed, start

### Community 16 - "bootcamp/route.ts"
Cohesion: 0.50
Nodes (3): GET(), PATCH(), Bootcamp

### Community 17 - "evaluations/route.ts"
Cohesion: 0.50
Nodes (3): GET(), POST(), Evaluation

### Community 18 - "teams/route.ts"
Cohesion: 0.50
Nodes (3): GET(), POST(), ProblemStatement

## Knowledge Gaps
- **145 isolated node(s):** `metadata`, `ActivityFeedProps`, `AdminHeaderProps`, `AdminSidebarProps`, `PhaseTimelineProps` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 160 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Badge`, `cn`, `connectToDatabase`, `db.ts`, `package.json`, `getSessionFromRequest`, `seed/route.ts`, `bootcamp/route.ts`, `evaluations/route.ts`, `teams/route.ts`?**
  _High betweenness centrality (0.319) - this node is a cross-community bridge._
- **Why does `react` connect `Badge` to `package.json`, `cn`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `metadata`, `ActivityFeedProps`, `AdminHeaderProps` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Badge` be split into smaller, more focused modules?**
  _Cohesion score 0.10960916838084044 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.08418367346938775 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._