# Graph Report - build_26  (2026-10-18)

## Corpus Check
- 127 files · ~410,718 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 32 file(s) not represented in the graph (top: .csv 24, (none) 4, .example 1)

## Summary
- 705 nodes · 1624 edges · 42 communities (33 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a924e377`
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
- Team
- types/index.ts
- package.json
- compilerOptions
- announcements/route.ts
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
- design_system.py
- core.py
- BM25
- search.py
- 2. Daily Milestone Specifications & Submissions
- generate_design_system
- next
- getSessionFromRequest
- Procedure 05: Daily Work Logging and Team Activity Flow
- Procedure 03: Problem Statement Selection Flow
- BUILD26 — User Procedures & Flow Navigation Manual
- evaluations/route.ts
- bootcamp/route.ts

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 99 edges
2. `Button` - 71 edges
3. `Badge()` - 66 edges
4. `next` - 65 edges
5. `react` - 61 edges
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

## Communities (42 total, 9 thin omitted)

### Community 0 - "AI-Native Build"
Cohesion: 0.15
Nodes (14): AI-Native Build, Daily Evidence, Demo Day, Deploy Stage, AI, APIs and Emerging Tech, Product Backlog, Product Pitch+, 8 Real Problems (+6 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (95): AnalyticsPage(), AnnouncementsPage(), BootcampConfigurationPage(), EvaluationPage(), FeedbackPage(), AdminLayout(), MentorsPage(), AdminMilestonesPage() (+87 more)

### Community 3 - "Procedure 02: Participant Team Formation and Onboarding Flow"
Cohesion: 0.12
Nodes (16): 1. Flow Overview, 2. Unassigned State & Portal Directives, 3. Path A: Creating a New Team (Team Lead Flow), 4. Path B: Joining an Existing Team (Member Flow), 5.1 Team Roster Management, 5.2 Transfer Leadership Procedure (Wireframe Section 17), 5. Team Management & Leadership Transfer, Procedure 02: Participant Team Formation and Onboarding Flow (+8 more)

### Community 4 - "models/index.ts"
Cohesion: 0.05
Nodes (41): DEFAULT_MILESTONES, GET(), POST(), ActivitySchema, AnnouncementSchema, BootcampSchema, EvaluationSchema, FeedbackSchema (+33 more)

### Community 5 - "Procedure 06: Admin Command Center and Governance Flow"
Cohesion: 0.13
Nodes (14): 1. Flow Overview, 2.1 KPI Monitoring Cards, 2.2 Needs Attention Risk Engine, 2. Admin Command Dashboard (`/admin`), 3. Bootcamp Configuration (`/admin/bootcamp` - Wireframe Section 38), 4.1 Participant Registry (`/admin/participants`), 4.2 Teams Command Directory (`/admin/teams`), 4. Participant & Team Administration (+6 more)

### Community 6 - "connectToDatabase"
Cohesion: 0.12
Nodes (22): dynamic, GET(), GET(), PATCH(), POST(), DELETE(), GET(), PATCH() (+14 more)

### Community 7 - "Team"
Cohesion: 0.15
Nodes (14): GET(), GET(), POST(), GET(), GET(), DELETE(), GET(), PATCH() (+6 more)

### Community 8 - "types/index.ts"
Cohesion: 0.05
Nodes (45): NeedsAttentionPanelProps, getSessionUser(), verifyToken(), 1. Flow Overview, 2.1 Interface & Directives, 2. Landing Page Directives (`/`), 3.1 Input Requirements, 3.2 Submission & Validation Rules (+37 more)

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
Nodes (26): 1. Executive Summary, 2. Platform Architecture & Workflow, 3. Implemented Routes & Capabilities, 4. Technology Stack, 5. Environment Variables (`.env.local`), 6. Getting Started & Running Locally, 8. Docker Setup & Operations, Admin Application (`/admin`) (+18 more)

### Community 20 - "clean-db.mjs"
Cohesion: 0.13
Nodes (13): POST(), ref_fs, mongoose, ref_path, ref_readline, checkConnection(), maskUri(), args (+5 more)

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

### Community 33 - "2. Daily Milestone Specifications & Submissions"
Cohesion: 0.17
Nodes (11): 1. Flow Overview, 2.1 Day 01 — Team + Ideation (Wireframe Section 23), 2.2 Day 02 — Wireframe & User Flow (Wireframe Section 24), 2.3 Day 03 — Build / Repository Initialization (Wireframe Section 25), 2.4 Day 04 — Integration & API Handshake (Wireframe Section 26), 2.5 Day 05 — Test + Polish (Wireframe Section 27), 2.6 Day 06 — Final Demo & Product Ship (Wireframe Section 28), 2. Daily Milestone Specifications & Submissions (+3 more)

### Community 34 - "generate_design_system"
Cohesion: 0.29
Nodes (6): format_ascii_box(), format_markdown(), generate_design_system(), Format design system as ASCII box with emojis (MCP-style)., Format design system as markdown., Main entry point for design system generation. Args: query: Search query (e.g.,…

### Community 35 - "next"
Cohesion: 0.15
Nodes (20): GET(), POST(), POST(), GET(), POST(), POST(), GET(), PATCH() (+12 more)

### Community 36 - "getSessionFromRequest"
Cohesion: 0.15
Nodes (17): GET(), POST(), GET(), POST(), GET(), POST(), DELETE(), POST() (+9 more)

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

### Community 41 - "bootcamp/route.ts"
Cohesion: 0.50
Nodes (3): GET(), PATCH(), Bootcamp

## Knowledge Gaps
- **253 isolated node(s):** `dynamic`, `DEFAULT_MILESTONES`, `metadata`, `CANONICAL_ROLES`, `CONTRIBUTION_TYPES` (+248 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 320 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Button`, `getSessionFromRequest`, `models/index.ts`, `connectToDatabase`, `Team`, `evaluations/route.ts`, `bootcamp/route.ts`, `types/index.ts`, `announcements/route.ts`, `package.json`, `login/page.tsx`, `clean-db.mjs`, `seed/route.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Why does `react` connect `Button` to `login/page.tsx`, `types/index.ts`, `loading.tsx`, `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `dynamic`, `DEFAULT_MILESTONES`, `metadata` to the rest of the system?**
  _253 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05127775450356096 - nodes in this community are weakly interconnected._
- **Should `Procedure 02: Participant Team Formation and Onboarding Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Procedure 06: Admin Command Center and Governance Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._