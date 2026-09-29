# Graph Report - build_26  (2026-09-29)

## Corpus Check
- 91 files · ~366,417 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 430 nodes · 1152 edges · 28 communities (20 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cab37b8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AI-Native Build
- Badge
- Learn & Reference Graph
- cn
- models/index.ts
- teams/route.ts
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
- login/page.tsx
- bootcamp/route.ts
- types/index.ts
- next.config.mjs
- check-db.mjs
- tailwindcss
- rules/graphify.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- seed/route.ts
- app/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 73 edges
2. `Badge()` - 61 edges
3. `Button` - 53 edges
4. `react` - 50 edges
5. `next` - 42 edges
6. `lucide-react` - 40 edges
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
Cohesion: 0.09
Nodes (55): AnalyticsPage(), AnnouncementsPage(), EvaluationPage(), FeedbackPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), ProgressPage() (+47 more)

### Community 3 - "cn"
Cohesion: 0.11
Nodes (24): AdminLayout(), AdminDashboardPage(), ParticipantLayout(), AdminHeader(), AdminHeaderProps, AdminSidebar(), BootcampPhaseTimeline(), PHASES (+16 more)

### Community 4 - "models/index.ts"
Cohesion: 0.06
Nodes (37): GET(), GET(), ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema, IActivity (+29 more)

### Community 5 - "teams/route.ts"
Cohesion: 0.50
Nodes (3): GET(), POST(), ProblemStatement

### Community 6 - "connectToDatabase"
Cohesion: 0.13
Nodes (23): GET(), POST(), GET(), PATCH(), POST(), GET(), PATCH(), POST() (+15 more)

### Community 7 - "[teamId]/route.ts"
Cohesion: 0.25
Nodes (6): GET(), POST(), DELETE(), GET(), PATCH(), Evaluation

### Community 8 - "next"
Cohesion: 0.21
Nodes (15): GET(), POST(), POST(), POST(), POST(), clearSessionCookie(), getSessionUser(), SessionUser (+7 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, autoprefixer, clsx, jsonwebtoken, postcss, react-dom (+9 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "getSessionFromRequest"
Cohesion: 0.15
Nodes (15): DELETE(), GET(), POST(), GET(), GET(), POST(), GET(), PATCH() (+7 more)

### Community 12 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, jsonwebtoken, lucide-react, mongoose, next, react (+4 more)

### Community 13 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/react (+2 more)

### Community 14 - "db.ts"
Cohesion: 0.18
Nodes (8): dynamic, GET(), POST(), GET(), POST(), MongooseCache, Team, mongoose

### Community 15 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, db:check, dev, lint, seed, start

### Community 16 - "login/page.tsx"
Cohesion: 0.50
Nodes (3): DEPARTMENTS, LoginPage(), YEARS

### Community 17 - "bootcamp/route.ts"
Cohesion: 0.50
Nodes (3): GET(), PATCH(), Bootcamp

### Community 18 - "types/index.ts"
Cohesion: 0.04
Nodes (44): NeedsAttentionPanelProps, 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 7. Database Models (`/models/index.ts`) (+36 more)

### Community 20 - "check-db.mjs"
Cohesion: 0.40
Nodes (4): ref_fs, ref_path, checkConnection(), maskUri()

### Community 26 - "seed/route.ts"
Cohesion: 0.50
Nodes (4): execPromise, POST(), ref_child_process, ref_util

## Knowledge Gaps
- **160 isolated node(s):** `dynamic`, `metadata`, `DEPARTMENTS`, `YEARS`, `ActivityFeedProps` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Badge`, `cn`, `models/index.ts`, `teams/route.ts`, `connectToDatabase`, `[teamId]/route.ts`, `package.json`, `getSessionFromRequest`, `db.ts`, `login/page.tsx`, `bootcamp/route.ts`, `seed/route.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **What connects `dynamic`, `metadata`, `DEPARTMENTS` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Badge` be split into smaller, more focused modules?**
  _Cohesion score 0.09236271828318957 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.10984848484848485 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.057692307692307696 - nodes in this community are weakly interconnected._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.13054187192118227 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._