# Graph Report - build_26  (2026-10-18)

## Corpus Check
- 129 files · ~412,854 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 32 file(s) not represented in the graph (top: .csv 24, (none) 4, .example 1)

## Summary
- 728 nodes · 1635 edges · 58 communities (40 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94dc0efd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AI-Native Build
- Button
- Learn & Reference Graph
- Procedure 02: Participant Team Formation and Onboarding Flow
- models/index.ts
- Procedure 06: Admin Command Center and Governance Flow
- connectToDatabase
- db.ts
- types/index.ts
- package.json
- compilerOptions
- getSessionFromRequest
- dependencies
- devDependencies
- ui-ux-pro-max
- scripts
- login/page.tsx
- DesignSystemGenerator
- 8. Docker Setup & Operations
- next.config.mjs
- clean-db.mjs
- tailwindcss
- rules/graphify.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- seed/route.ts
- app/layout.tsx
- react
- design_system.py
- core.py
- BM25
- search.py
- 2. Daily Milestone Specifications & Submissions
- generate_design_system
- next
- [teamId]/page.tsx
- Procedure 05: Daily Work Logging and Team Activity Flow
- Procedure 03: Problem Statement Selection Flow
- BUILD26 — User Procedures & Flow Navigation Manual
- evaluations/route.ts
- milestones/route.ts
- badge.tsx
- admin/page.tsx
- cn
- lucide-react
- pixel-retroui.d.ts
- Badge
- app/page.tsx
- Accordion
- Bubble
- Button
- Card
- Dropdown
- Input
- Popup
- ProgressBar
- TextArea

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 99 edges
2. `Button` - 69 edges
3. `Badge()` - 65 edges
4. `next` - 65 edges
5. `react` - 63 edges
6. `getSessionFromRequest()` - 59 edges
7. `lucide-react` - 49 edges
8. `Avatar()` - 33 edges
9. `cn()` - 32 edges
10. `Team` - 25 edges

## Surprising Connections (you probably didn't know these)
- `2. Route Guard & Access Matrix` --references--> `TeamOnboardingView()`  [INFERRED]
  procedures/07_SYSTEM_STATE_TRANSITIONS_AND_ROUTING_MATRIX.md → components/participant/TeamOnboardingView.tsx
- `Edge Case 02: Unassigned Participant Accessing Deep URLs` --references--> `TeamOnboardingView()`  [INFERRED]
  procedures/07_SYSTEM_STATE_TRANSITIONS_AND_ROUTING_MATRIX.md → components/participant/TeamOnboardingView.tsx
- `Edge Case 01: Expired or Corrupted Session Cookie` --references--> `verifyToken()`  [INFERRED]
  procedures/07_SYSTEM_STATE_TRANSITIONS_AND_ROUTING_MATRIX.md → lib/auth.ts
- `3.2 Submission & Validation Rules` --references--> `User`  [INFERRED]
  procedures/01_USER_ONBOARDING_AND_AUTH_FLOW.md → types/index.ts
- `4.2 Credential Verification Matrix` --references--> `User`  [INFERRED]
  procedures/01_USER_ONBOARDING_AND_AUTH_FLOW.md → types/index.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **BUILD26 End-to-End Delivery Pipeline** — docs_build26_real_problems, docs_build26_ai_native_build, docs_build26_deploy_stage, docs_build26_demo_day [EXTRACTED 0.95]

## Communities (58 total, 18 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Button"
Cohesion: 0.18
Nodes (14): AnnouncementsPage(), BootcampConfigurationPage(), MentorsPage(), ParticipantsPage(), ProblemStatementsPage(), AdminReportsPage(), SchedulePage(), TeamsListPage() (+6 more)

### Community 3 - "Procedure 02: Participant Team Formation and Onboarding Flow"
Cohesion: 0.12
Nodes (16): 1. Flow Overview, 2. Unassigned State & Portal Directives, 3. Path A: Creating a New Team (Team Lead Flow), 4. Path B: Joining an Existing Team (Member Flow), 5.1 Team Roster Management, 5.2 Transfer Leadership Procedure (Wireframe Section 17), 5. Team Management & Leadership Transfer, Procedure 02: Participant Team Formation and Onboarding Flow (+8 more)

### Community 4 - "models/index.ts"
Cohesion: 0.05
Nodes (40): GET(), PATCH(), ActivitySchema, AnnouncementSchema, Bootcamp, BootcampSchema, EvaluationSchema, FeedbackSchema (+32 more)

### Community 5 - "Procedure 06: Admin Command Center and Governance Flow"
Cohesion: 0.13
Nodes (14): 1. Flow Overview, 2.1 KPI Monitoring Cards, 2.2 Needs Attention Risk Engine, 2. Admin Command Dashboard (`/admin`), 3. Bootcamp Configuration (`/admin/bootcamp` - Wireframe Section 38), 4.1 Participant Registry (`/admin/participants`), 4.2 Teams Command Directory (`/admin/teams`), 4. Participant & Team Administration (+6 more)

### Community 6 - "connectToDatabase"
Cohesion: 0.10
Nodes (29): GET(), POST(), GET(), POST(), DELETE(), GET(), POST(), GET() (+21 more)

### Community 7 - "db.ts"
Cohesion: 0.13
Nodes (18): GET(), GET(), POST(), GET(), GET(), POST(), DELETE(), GET() (+10 more)

### Community 8 - "types/index.ts"
Cohesion: 0.05
Nodes (43): NeedsAttentionPanelProps, getSessionUser(), verifyToken(), 1. Flow Overview, 2.1 Interface & Directives, 2. Landing Page Directives (`/`), 3.1 Input Requirements, 3.2 Submission & Validation Rules (+35 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, autoprefixer, clsx, jsonwebtoken, postcss, react-dom (+9 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "getSessionFromRequest"
Cohesion: 0.15
Nodes (15): GET(), POST(), GET(), PATCH(), GET(), PATCH(), POST(), GET() (+7 more)

### Community 12 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, clsx, jsonwebtoken, lucide-react, mongoose, next, pixel-retroui (+5 more)

### Community 13 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/react (+2 more)

### Community 14 - "ui-ux-pro-max"
Cohesion: 0.07
Nodes (29): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Example Workflow, How to Use This Skill, Icons & Visual Elements, Interaction (+21 more)

### Community 15 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:check, db:clean, dev, lint, seed, start

### Community 16 - "login/page.tsx"
Cohesion: 0.70
Nodes (3): LoginContent(), LoginPage(), SignupPage()

### Community 17 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (13): detect_domain(), Auto-detect the most relevant domain from query, Main search function with auto-domain detection, search(), DesignSystemGenerator, Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation. (+5 more)

### Community 18 - "8. Docker Setup & Operations"
Cohesion: 0.07
Nodes (28): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 7. Database Models (`/models/index.ts`), 8. Docker Setup & Operations (+20 more)

### Community 20 - "clean-db.mjs"
Cohesion: 0.11
Nodes (15): dynamic, GET(), POST(), ref_fs, mongoose, ref_path, ref_readline, checkConnection() (+7 more)

### Community 26 - "seed/route.ts"
Cohesion: 0.50
Nodes (4): execPromise, POST(), ref_child_process, ref_util

### Community 28 - "react"
Cohesion: 0.16
Nodes (14): EvaluationPage(), SubmissionsMonitorPage(), ParticipantSchedulePage(), ParticipantTasksPage(), CONTRIBUTION_TYPES, ParticipantWorklogsPage(), SubmissionModal(), SubmissionModalProps (+6 more)

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

### Community 33 - "2. Daily Milestone Specifications & Submissions"
Cohesion: 0.17
Nodes (11): 1. Flow Overview, 2.1 Day 01 — Team + Ideation (Wireframe Section 23), 2.2 Day 02 — Wireframe & User Flow (Wireframe Section 24), 2.3 Day 03 — Build / Repository Initialization (Wireframe Section 25), 2.4 Day 04 — Integration & API Handshake (Wireframe Section 26), 2.5 Day 05 — Test + Polish (Wireframe Section 27), 2.6 Day 06 — Final Demo & Product Ship (Wireframe Section 28), 2. Daily Milestone Specifications & Submissions (+3 more)

### Community 34 - "generate_design_system"
Cohesion: 0.29
Nodes (6): format_ascii_box(), format_markdown(), generate_design_system(), Format design system as ASCII box with emojis (MCP-style)., Format design system as markdown., Main entry point for design system generation. Args: query: Search query (e.g.,…

### Community 35 - "next"
Cohesion: 0.15
Nodes (19): GET(), POST(), POST(), GET(), POST(), POST(), POST(), POST() (+11 more)

### Community 36 - "[teamId]/page.tsx"
Cohesion: 0.26
Nodes (7): AnalyticsPage(), TeamDetailPage(), BootcampPhaseTimeline(), PHASES, PhaseTimelineProps, ProgressBar(), ProgressProps

### Community 37 - "Procedure 05: Daily Work Logging and Team Activity Flow"
Cohesion: 0.17
Nodes (11): 1. Flow Overview, 2.1 Access & Cadence, 2.2 Field Requirements, 2. Daily Work Log Submission Procedure (Wireframe Section 30), 3.1 Historical Audit Table, 3.2 Automated Attendance & Contribution Tracking, 3. Work Log History & Attendance (Wireframe Section 31), 4.1 Real-Time Team Activity Feed (Wireframe Section 32) (+3 more)

### Community 38 - "Procedure 03: Problem Statement Selection Flow"
Cohesion: 0.22
Nodes (8): 1. Flow Overview, 2.1 Catalog Layout (`/participant/problem`), 2. Problem Statement Catalog & Directives, 3. Detailed Review & Evaluation (Wireframe Section 19), 4. Selection Authority & Rule 14 Enforcement, 5. Quota Validation & Selection Handshake, Procedure 03: Problem Statement Selection Flow, Rule 14: Team Lead Privilege

### Community 39 - "BUILD26 — User Procedures & Flow Navigation Manual"
Cohesion: 0.33
Nodes (5): 1. Overview & Directory Purpose, 2. Document Index & Navigation, 3. High-Level User Persona Hierarchy, 4. Master Principles for User Direction, BUILD26 — User Procedures & Flow Navigation Manual

### Community 40 - "evaluations/route.ts"
Cohesion: 0.50
Nodes (3): GET(), POST(), Evaluation

### Community 41 - "milestones/route.ts"
Cohesion: 0.40
Nodes (4): DEFAULT_MILESTONES, GET(), POST(), Milestone

### Community 42 - "badge.tsx"
Cohesion: 0.21
Nodes (11): FeedbackPage(), ShowcasePage(), ParticipantFeedbackPage(), ActivityFeed(), ActivityFeedProps, TeamTableProps, Avatar(), AvatarProps (+3 more)

### Community 43 - "admin/page.tsx"
Cohesion: 0.26
Nodes (9): AdminDashboardPage(), AdminHeader(), AdminHeaderProps, DeadlinePanel(), DeadlinePanelProps, GlobalSearch(), GlobalSearchProps, NeedsAttentionPanel() (+1 more)

### Community 45 - "cn"
Cohesion: 0.21
Nodes (12): AdminLayout(), AdminSidebar(), AdminSidebarProps, KpiCard(), KpiCardProps, Card(), CardContent(), CardDescription() (+4 more)

### Community 46 - "lucide-react"
Cohesion: 0.19
Nodes (12): ParticipantLayout(), ParticipantDashboardPage(), SubmissionsCenterPage(), SubmissionsContent(), ParticipantHeader(), ParticipantHeaderProps, ParticipantSidebar(), ParticipantSidebarProps (+4 more)

### Community 47 - "pixel-retroui.d.ts"
Cohesion: 0.20
Nodes (9): AccordionProps, BubbleProps, ButtonProps, CardProps, InputProps, pixel-retroui, PopupProps, ProgressBarProps (+1 more)

### Community 48 - "Badge"
Cohesion: 0.14
Nodes (15): AdminMilestonesPage(), ProgressPage(), SettingsPage(), AdminWorkLogsMonitoringPage(), TeamActivityPage(), MilestonesContent(), MilestonesPage(), ProblemStatementsPage() (+7 more)

## Knowledge Gaps
- **272 isolated node(s):** `dynamic`, `DEFAULT_MILESTONES`, `metadata`, `CANONICAL_ROLES`, `CONTRIBUTION_TYPES` (+267 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 341 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Button`, `models/index.ts`, `connectToDatabase`, `db.ts`, `types/index.ts`, `package.json`, `getSessionFromRequest`, `login/page.tsx`, `clean-db.mjs`, `seed/route.ts`, `app/layout.tsx`, `react`, `[teamId]/page.tsx`, `evaluations/route.ts`, `milestones/route.ts`, `badge.tsx`, `admin/page.tsx`, `cn`, `lucide-react`, `Badge`, `app/page.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Button`, `[teamId]/page.tsx`, `types/index.ts`, `package.json`, `badge.tsx`, `admin/page.tsx`, `cn`, `lucide-react`, `pixel-retroui.d.ts`, `Badge`, `login/page.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `Submission` connect `8. Docker Setup & Operations` to `types/index.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `dynamic`, `DEFAULT_MILESTONES`, `metadata` to the rest of the system?**
  _272 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Procedure 02: Participant Team Formation and Onboarding Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `Procedure 06: Admin Command Center and Governance Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._