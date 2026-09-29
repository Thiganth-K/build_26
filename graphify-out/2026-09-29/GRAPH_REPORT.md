# Graph Report - build_26  (2026-09-29)

## Corpus Check
- 87 files · ~362,664 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 421 nodes · 1098 edges · 25 communities (17 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `86c1f14f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AI-Native Build
- Badge
- Learn & Reference Graph
- cn
- models/index.ts
- mentors/route.ts
- connectToDatabase
- db.ts
- auth.ts
- package.json
- compilerOptions
- getSessionFromRequest
- dependencies
- devDependencies
- worklogs/route.ts
- scripts
- types/index.ts
- next.config.mjs
- health/route.ts
- tailwindcss
- rules/graphify.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- next

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 67 edges
2. `Badge()` - 59 edges
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

## Communities (25 total, 8 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Badge"
Cohesion: 0.10
Nodes (54): AnalyticsPage(), AnnouncementsPage(), EvaluationPage(), FeedbackPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), ProgressPage() (+46 more)

### Community 3 - "cn"
Cohesion: 0.19
Nodes (13): AdminLayout(), ParticipantLayout(), AdminSidebar(), AdminSidebarProps, ParticipantSidebar(), ParticipantSidebarProps, Card(), CardContent() (+5 more)

### Community 4 - "models/index.ts"
Cohesion: 0.06
Nodes (31): ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema, IActivity, IAnnouncement, IBootcamp (+23 more)

### Community 5 - "mentors/route.ts"
Cohesion: 0.40
Nodes (4): GET(), PATCH(), POST(), Mentor

### Community 6 - "connectToDatabase"
Cohesion: 0.15
Nodes (19): GET(), POST(), GET(), PATCH(), DELETE(), GET(), PATCH(), POST() (+11 more)

### Community 7 - "db.ts"
Cohesion: 0.13
Nodes (17): GET(), GET(), GET(), POST(), DELETE(), GET(), PATCH(), POST() (+9 more)

### Community 8 - "auth.ts"
Cohesion: 0.20
Nodes (12): POST(), GET(), GET(), PATCH(), POST(), getSessionUser(), SessionUser, setSessionCookie() (+4 more)

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

### Community 15 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, db:check, dev, lint, seed, start

### Community 18 - "types/index.ts"
Cohesion: 0.05
Nodes (42): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 7. Database Models (`/models/index.ts`), 8. Docker Setup & Operations (+34 more)

### Community 20 - "health/route.ts"
Cohesion: 0.18
Nodes (7): dynamic, GET(), ref_fs, mongoose, ref_path, checkConnection(), maskUri()

### Community 26 - "next"
Cohesion: 0.08
Nodes (25): AdminDashboardPage(), POST(), POST(), execPromise, POST(), app_globals, metadata, DEPARTMENTS (+17 more)

## Knowledge Gaps
- **160 isolated node(s):** `dynamic`, `metadata`, `DEPARTMENTS`, `YEARS`, `ActivityFeedProps` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Badge`, `cn`, `mentors/route.ts`, `connectToDatabase`, `db.ts`, `auth.ts`, `package.json`, `getSessionFromRequest`, `worklogs/route.ts`, `health/route.ts`?**
  _High betweenness centrality (0.305) - this node is a cross-community bridge._
- **What connects `dynamic`, `metadata`, `DEPARTMENTS` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Badge` be split into smaller, more focused modules?**
  _Cohesion score 0.09518477043673013 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._