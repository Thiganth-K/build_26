# Graph Report - build_26  (2026-10-01)

## Corpus Check
- 116 files · ~398,731 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 32 file(s) not represented in the graph (top: .csv 24, (none) 4, .example 1)

## Summary
- 600 nodes · 1491 edges · 36 communities (27 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08d90433`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AI-Native Build
- Button
- Learn & Reference Graph
- cn
- models/index.ts
- connectToDatabase
- [teamId]/route.ts
- auth.ts
- package.json
- compilerOptions
- getSessionFromRequest
- dependencies
- devDependencies
- ui-ux-pro-max
- scripts
- login/page.tsx
- DesignSystemGenerator
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
- design_system.py
- core.py
- BM25
- search.py
- milestones/route.ts
- generate_design_system
- next
- db.ts

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 97 edges
2. `Button` - 69 edges
3. `Badge()` - 64 edges
4. `next` - 62 edges
5. `react` - 60 edges
6. `getSessionFromRequest()` - 55 edges
7. `lucide-react` - 48 edges
8. `Avatar()` - 33 edges
9. `cn()` - 32 edges
10. `Team` - 24 edges

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

## Communities (36 total, 9 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (78): AnalyticsPage(), AnnouncementsPage(), BootcampConfigurationPage(), EvaluationPage(), FeedbackPage(), MentorsPage(), AdminMilestonesPage(), AdminDashboardPage() (+70 more)

### Community 3 - "cn"
Cohesion: 0.16
Nodes (15): AdminLayout(), ParticipantLayout(), AdminSidebar(), AdminSidebarProps, KpiCard(), KpiCardProps, ParticipantSidebar(), ParticipantSidebarProps (+7 more)

### Community 4 - "models/index.ts"
Cohesion: 0.05
Nodes (39): GET(), PATCH(), ActivitySchema, AnnouncementSchema, Bootcamp, BootcampSchema, EvaluationSchema, FeedbackSchema (+31 more)

### Community 6 - "connectToDatabase"
Cohesion: 0.12
Nodes (25): GET(), POST(), GET(), POST(), GET(), PATCH(), POST(), GET() (+17 more)

### Community 7 - "[teamId]/route.ts"
Cohesion: 0.17
Nodes (11): GET(), GET(), DELETE(), GET(), PATCH(), GET(), POST(), Mentor (+3 more)

### Community 8 - "auth.ts"
Cohesion: 0.36
Nodes (9): POST(), POST(), getSessionUser(), SessionUser, setSessionCookie(), signToken(), verifyToken(), User (+1 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, autoprefixer, clsx, jsonwebtoken, postcss, react-dom (+9 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "getSessionFromRequest"
Cohesion: 0.13
Nodes (18): DELETE(), GET(), POST(), GET(), POST(), GET(), PATCH(), GET() (+10 more)

### Community 12 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, jsonwebtoken, lucide-react, mongoose, next, react (+4 more)

### Community 13 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/react (+2 more)

### Community 14 - "ui-ux-pro-max"
Cohesion: 0.07
Nodes (29): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Example Workflow, How to Use This Skill, Icons & Visual Elements, Interaction (+21 more)

### Community 15 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, db:check, db:clean, db:erase, dev, lint, seed (+1 more)

### Community 16 - "login/page.tsx"
Cohesion: 0.70
Nodes (3): LoginContent(), LoginPage(), SignupPage()

### Community 17 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (13): detect_domain(), Auto-detect the most relevant domain from query, Main search function with auto-domain detection, search(), DesignSystemGenerator, Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation. (+5 more)

### Community 18 - "types/index.ts"
Cohesion: 0.04
Nodes (44): NeedsAttentionPanelProps, 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 7. Database Models (`/models/index.ts`) (+36 more)

### Community 20 - "clean-db.mjs"
Cohesion: 0.12
Nodes (14): dynamic, GET(), ref_fs, mongoose, ref_path, ref_readline, checkConnection(), maskUri() (+6 more)

### Community 26 - "seed/route.ts"
Cohesion: 0.50
Nodes (4): execPromise, POST(), ref_child_process, ref_util

### Community 29 - "design_system.py"
Cohesion: 0.19
Nodes (13): _detect_page_type(), format_master_md(), format_page_override_md(), _generate_intelligent_overrides(), persist_design_system(), Detect page type from context and search results., Design System Generator - Aggregates search results and applies reasoning to…, Persist design system to design-system/<project>/ folder using Master +… (+5 more)

### Community 30 - "core.py"
Cohesion: 0.18
Nodes (12): _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Search stack-specific guidelines, UI/UX Pro Max Core - BM25 search engine for UI/UX style guides, _search_csv(), search_stack(), collections (+4 more)

### Community 31 - "BM25"
Cohesion: 0.28
Nodes (5): BM25, Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, BM25 ranking algorithm for text search

### Community 32 - "search.py"
Cohesion: 0.25
Nodes (7): format_output(), UI/UX Pro Max Search - BM25 search engine for UI/UX style guides Usage: python…, Format results for Claude consumption (token-optimized), argparse, io, json, sys

### Community 33 - "milestones/route.ts"
Cohesion: 0.40
Nodes (4): DEFAULT_MILESTONES, GET(), POST(), Milestone

### Community 34 - "generate_design_system"
Cohesion: 0.29
Nodes (6): format_ascii_box(), format_markdown(), generate_design_system(), Format design system as ASCII box with emojis (MCP-style)., Format design system as markdown., Main entry point for design system generation. Args: query: Search query (e.g.,…

### Community 35 - "next"
Cohesion: 0.16
Nodes (11): GET(), POST(), GET(), POST(), POST(), POST(), POST(), POST() (+3 more)

### Community 36 - "db.ts"
Cohesion: 0.16
Nodes (11): GET(), POST(), GET(), GET(), GET(), POST(), POST(), MongooseCache (+3 more)

## Knowledge Gaps
- **195 isolated node(s):** `dynamic`, `DEFAULT_MILESTONES`, `metadata`, `CANONICAL_ROLES`, `CONTRIBUTION_TYPES` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Button`, `milestones/route.ts`, `cn`, `models/index.ts`, `db.ts`, `connectToDatabase`, `[teamId]/route.ts`, `auth.ts`, `package.json`, `getSessionFromRequest`, `login/page.tsx`, `types/index.ts`, `clean-db.mjs`, `seed/route.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `react` connect `Button` to `cn`, `package.json`, `login/page.tsx`, `types/index.ts`, `loading.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `dynamic`, `DEFAULT_MILESTONES`, `metadata` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06177334116265414 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.11895161290322581 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._