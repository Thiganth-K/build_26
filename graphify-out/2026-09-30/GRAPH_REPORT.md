# Graph Report - build_26  (2026-09-30)

## Corpus Check
- 93 files · ~370,903 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 444 nodes · 1186 edges · 29 communities (20 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08d90433`
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
- next
- package.json
- compilerOptions
- announcements/route.ts
- dependencies
- devDependencies
- getSessionFromRequest
- scripts
- login/page.tsx
- bootcamp/route.ts
- types/index.ts
- next.config.mjs
- clean-db.mjs
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
4. `react` - 51 edges
5. `next` - 44 edges
6. `lucide-react` - 40 edges
7. `getSessionFromRequest()` - 37 edges
8. `Avatar()` - 36 edges
9. `cn()` - 34 edges
10. `Modal()` - 18 edges

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

## Communities (29 total, 9 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Badge"
Cohesion: 0.09
Nodes (58): AnalyticsPage(), AnnouncementsPage(), EvaluationPage(), FeedbackPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), ProgressPage() (+50 more)

### Community 3 - "cn"
Cohesion: 0.12
Nodes (23): AdminLayout(), AdminDashboardPage(), AdminHeader(), AdminSidebar(), BootcampPhaseTimeline(), PHASES, PhaseTimelineProps, DeadlinePanel() (+15 more)

### Community 4 - "models/index.ts"
Cohesion: 0.06
Nodes (31): ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema, IActivity, IAnnouncement, IBootcamp (+23 more)

### Community 5 - "mentors/route.ts"
Cohesion: 0.40
Nodes (4): GET(), PATCH(), POST(), Mentor

### Community 6 - "connectToDatabase"
Cohesion: 0.15
Nodes (20): GET(), POST(), GET(), GET(), PATCH(), POST(), DELETE(), GET() (+12 more)

### Community 7 - "db.ts"
Cohesion: 0.17
Nodes (13): GET(), GET(), GET(), POST(), GET(), GET(), POST(), MongooseCache (+5 more)

### Community 8 - "next"
Cohesion: 0.21
Nodes (15): POST(), POST(), GET(), POST(), POST(), clearSessionCookie(), getSessionUser(), SessionUser (+7 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, autoprefixer, clsx, jsonwebtoken, postcss, react-dom (+9 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "announcements/route.ts"
Cohesion: 0.15
Nodes (10): DELETE(), GET(), POST(), GET(), POST(), GET(), PATCH(), Announcement (+2 more)

### Community 12 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, jsonwebtoken, lucide-react, mongoose, next, react (+4 more)

### Community 13 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/react (+2 more)

### Community 14 - "getSessionFromRequest"
Cohesion: 0.20
Nodes (11): GET(), PATCH(), POST(), DELETE(), GET(), PATCH(), POST(), POST() (+3 more)

### Community 15 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, db:check, db:clean, db:erase, dev, lint, seed (+1 more)

### Community 16 - "login/page.tsx"
Cohesion: 0.50
Nodes (3): DEPARTMENTS, LoginPage(), YEARS

### Community 17 - "bootcamp/route.ts"
Cohesion: 0.50
Nodes (3): GET(), PATCH(), Bootcamp

### Community 18 - "types/index.ts"
Cohesion: 0.05
Nodes (42): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 7. Database Models (`/models/index.ts`), 8. Docker Setup & Operations (+34 more)

### Community 20 - "clean-db.mjs"
Cohesion: 0.12
Nodes (14): dynamic, GET(), ref_fs, mongoose, ref_path, ref_readline, checkConnection(), maskUri() (+6 more)

### Community 26 - "seed/route.ts"
Cohesion: 0.50
Nodes (4): execPromise, POST(), ref_child_process, ref_util

## Knowledge Gaps
- **165 isolated node(s):** `dynamic`, `metadata`, `DEPARTMENTS`, `YEARS`, `ActivityFeedProps` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 185 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Badge`, `cn`, `mentors/route.ts`, `connectToDatabase`, `db.ts`, `package.json`, `announcements/route.ts`, `getSessionFromRequest`, `login/page.tsx`, `bootcamp/route.ts`, `clean-db.mjs`, `seed/route.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **What connects `dynamic`, `metadata`, `DEPARTMENTS` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Badge` be split into smaller, more focused modules?**
  _Cohesion score 0.0896913220733838 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.11827956989247312 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._