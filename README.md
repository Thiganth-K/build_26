# BUILD26 — Admin Command Center & Participant Management Platform

> **Build • Ship • Showcase**  
> Production-grade collegiate tech bootcamp operating system for organizers, participants, and mentors.

---

## 1. Executive Summary

**BUILD26** is the central operating platform for an intensive hands-on college technology bootcamp. Rather than functioning like generic educational administrative software, Build26 is engineered as a **startup/product-building command center** inspired by Linear, Notion, Vercel, and GitHub.

It orchestrates:
- **40+ Student Participants** across multidisciplinary engineering roles (Lead, Frontend, Backend, UI/UX, AI/ML, Product, Research).
- **10 Core Teams** (Team Alpha, Nova, Orbit, Pixel, Nexus, Spark, Flux, Vertex, Pulse, Forge).
- **8 Real-World Problem Statements** across Campus Navigation, Career AI, Verifiable Credential Ledgers, Neurodiversity, Food Waste, Dorm Energy, Mental Well-being, and Peer Code Review.
- **5 Industry Technical Mentors** with dedicated expertise and scheduled roundtable reviews.
- **6 Progression Phases** (Problem Understanding → Ideation → Validation → Build → Testing → Final Demo).
- **Automated Needs Attention Risk Engine** identifying inactive teams (>12h), pending mentor reviews, missing submissions, and incomplete rosters.
- **50-point Submissions Rubric & 100% Weighted Final Showcase Evaluation Matrix**.

---

## 2. Platform Architecture & Workflow

```
ADMIN COMMAND CENTER (/admin)
          ↕
      BOOTCAMP (Phases 01 - 06, Day 1-6 Timeline, Rules)
          ↕
        TEAMS (10 Squads, Roster Limits, Codes)
          ↕
    PARTICIPANTS (Skills, Role Allocation, Attendance)
          ↕
      WORK LOGS (Daily Hours, Completed Sprints, Blockers)
          ↕
     SUBMISSIONS (Decks, Working Prototypes, 50-pt Rubric)
          ↕
   MENTOR FEEDBACK (5-star Ratings, Action Items)
          ↕
    EVALUATIONS (100% Weighted Jury Deliberation)
          ↕
   PRODUCT SHOWCASE (/admin/showcase)
```

---

## 3. Implemented Routes & Capabilities

### Admin Application (`/admin`)
| Route | Description |
|---|---|
| `/admin` | **Command Center Header, 8 KPI cards, Phase Timeline, Needs Attention engine, Team Matrix, Real-time Pulse Activity Feed, Schedule Deadlines, ⌘K Global Search, Quick Action Modals** |
| `/admin/teams` | Team directory, code generator, member count, solution concept cards |
| `/admin/teams/[teamId]` | Deep-dive command page: Members, Problem Challenge, Solution Features, Tech Stack, Work Logs, Submissions, Mentor Feedback |
| `/admin/problem-statements` | Challenge CRUD, category pills, difficulty ratings, team assignment caps |
| `/admin/participants` | Student registry, department/year breakdown, contribution score, profile drawer |
| `/admin/mentors` | Industry advisor directory, organization, availability, assigned teams |
| `/admin/schedule` | Interactive Day 1 to Day 6 visual timeline, start/end times, milestone completion toggles |
| `/admin/worklogs` | Daily work logs across all teams with filters by team, status, role, and search query |
| `/admin/submissions` | Deliverable review queue with 50-point scoring rubric (Problem Understanding, Innovation, Feasibility, Tech Approach, Impact) |
| `/admin/progress` | Multi-column Sprint Kanban board across Backlog, To Do, In Progress, Review, Done |
| `/admin/feedback` | Mentor review log with star ratings, strengths, improvement areas, and action items |
| `/admin/evaluation` | 100% weighted jury evaluation system with instant score calculation |
| `/admin/showcase` | Hall of Fame product cards with GitHub repositories, pitch decks, and live prototype URLs |
| `/admin/analytics` | Cohort velocity, phase distribution bars, engagement metrics, total hours logged |
| `/admin/settings` | Live bootcamp control (status, phase, day number, max team size, submission gate, DB reseed) |

### Participant Application (`/participant`)
| Route | Description |
|---|---|
| `/participant` | **Personalized student dashboard, current team phase, progress ring, active sprint tasks, next deadline countdown, announcements, mentor feedback** |
| `/participant/team` | Team workspace, roster roles, problem challenge, solution architecture |
| `/participant/worklogs` | Daily work logger form (work done, tasks completed, time spent, blockers, evidence link) |
| `/participant/tasks` | Drag/drop & status-switchable sprint task board |
| `/participant/submissions` | Upload deliverable decks, view review verdicts, notes, and rubric scores |
| `/participant/schedule` | Today's timeline, next milestone countdown (e.g. Ideation PPT due in 02h 14m) |
| `/participant/feedback` | Mentor critique, ratings, and targeted action items |

### Authentication & Switcher (`/login`)
- 1-click instant login switcher for:
  - **Super Admin** (`admin@build26.org` - Thiganth)
  - **Operations Admin** (`ops@build26.org`)
  - **Technical Mentor** (`kumar.s@build26.org` - Dr. Kumar Sundaram)
  - **Participant** (Thiganth K. - Team Alpha Lead)
- Custom email authentication.

---

## 4. Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions & Route Handlers)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS with custom design system tokens (`#F7F7F5` surface, `#111111` high-contrast typography, `#5E56E7` Build26 signature purple/indigo accent)
- **Database**: MongoDB 8.0 with Mongoose ODM
- **Authentication**: JWT token in HttpOnly SameSite Lax cookies
- **Icons**: Lucide React
- **Validation**: Zod & custom type guards

---

## 5. Environment Variables (`.env.local`)

```env
MONGODB_URI=mongodb://127.0.0.1:27017/build26
JWT_SECRET=build26_production_secret_key_college_bootcamp_2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 6. Getting Started & Running Locally

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Seed the Database
Pre-populates 40+ participants, 10 teams, 5 mentors, 8 problems, schedules, daily logs, and reviews:
```bash
npm run seed
```

### Step 3: Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
- **Admin Command Center**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Participant Workspace**: [http://localhost:3000/participant](http://localhost:3000/participant)
- **Role Switcher**: [http://localhost:3000/login](http://localhost:3000/login)

### Step 4: Build for Production
```bash
npm run build
npm run start
```
*Validated: All 47 pages and API routes compile with 0 TypeScript/ESLint errors.*

---

## 7. Database Models (`/models/index.ts`)

1. **User**: Name, email, role (`SUPER_ADMIN`, `ADMIN`, `MENTOR`, `PARTICIPANT`), avatar, references.
2. **Participant**: User link, department, year of study, team, team role, skills array, contribution score, attendance, status.
3. **Team**: Name, unique uppercase code (`B26-ALPHA`), problem statement, mentor, members roster with leader flag, current phase, progress percentage (0-100), solution details, tech stack, repository and demo URLs, last activity timestamp.
4. **ProblemStatement**: Title, category, description, target users, context, constraints, expected outcome, difficulty (`Beginner`, `Intermediate`, `Advanced`), tags, team quota, assigned team count.
5. **Bootcamp**: Name, tagline, status (`LIVE`, `UPCOMING`, `COMPLETED`), current phase, day number (1-6), settings (max team size, registration open, submission gate).
6. **ScheduleEvent**: Day, start time, end time, location, phase, title, description, event type (`Keynote`, `Milestone`, `Workshop`, `Review`, `Submission`, `Social`), completion boolean.
7. **WorkLog**: Participant, team, date, role, work done, completed tasks, next steps, blockers, hours spent, evidence link, status (`Completed`, `In Progress`, `Blocked`).
8. **Task**: Team, title, description, assignee, priority (`Low`, `Medium`, `High`, `Critical`), deadline, column (`BACKLOG`, `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`).
9. **Submission**: Team, phase, deliverable type, title, external/file links, status (`Pending Review`, `Changes Requested`, `Approved`), 5-criteria scores (out of 50), reviewer notes, evaluator info.
10. **Feedback**: Team, mentor, rating (1-5), strengths, improvement areas, general critique, action items array.
11. **Announcement**: Title, message, audience (`Everyone`, `All Teams`, `Mentors`, `Participants`, `Specific Team`), priority (`Normal`, `High`, `Urgent`), author, publication date.
12. **Notification**: Recipient user/role, type, title, message, link, read status.
13. **Evaluation**: Team, round, 6-dimension weighted criteria (out of 100), reviewer notes, jury deliberation status.
14. **Activity**: Event type, title, description, team, participant, avatar, timestamp.

---

## 8. Docker Setup & Operations

### Requirements
- Docker Desktop (or Docker Engine on Linux)
- Docker Compose v2+

### Architecture
```text
BUILD26
│
├── build26-app (Next.js Standalone, Non-root user nextjs)
│      │
│      └── Port 3000
│
└── build26-mongodb (MongoDB 8.0, Persistent Volume)
       │
       └── Port 27017 (Dev only; Internal only in Prod)
```

### Start the Container Stack
Build the multi-stage image and launch both Next.js and MongoDB:
```bash
docker compose up --build -d
```

### Seed the Database (Inside Container)
Populate pristine seed data (40+ participants, 10 teams, 5 mentors, 8 problems, schedules):
```bash
docker compose exec app npm run seed
```

### Check Container Health & Status
```bash
docker compose ps
```
Expected output:
```text
NAME                IMAGE               COMMAND                  SERVICE             STATUS
build26-app         build_26-app        "node server.js"         app                 running (healthy)
build26-mongodb     mongo:8             "docker-entrypoint.s…"   mongodb             running (healthy)
```

### View Logs
Stream live output from both services:
```bash
docker compose logs -f
```
Or for a specific container:
```bash
docker compose logs -f app
docker compose logs -f mongodb
```

### Application URLs
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Admin Command Center**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Participant Workspace**: [http://localhost:3000/participant](http://localhost:3000/participant)
- **Role Switcher & Auth**: [http://localhost:3000/login](http://localhost:3000/login)
- **Health Check Endpoint**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Stop the Containers
Gracefully shut down containers while preserving the persistent database volume:
```bash
docker compose down
```

### Full Reset (Destructive)
To stop containers AND destroy the persistent MongoDB volume:
```bash
docker compose down -v
```
> [!WARNING]
> Running `docker compose down -v` permanently removes the `build26_mongodb_data` volume and destroys all local database records.

### Production Deployment (`docker-compose.prod.yml`)
In production, MongoDB port `27017` is **never exposed** to the host machine. Communication happens exclusively over the internal `build26-network` with root authentication:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Database Backup & Restore

**Backup MongoDB:**
```bash
docker exec build26-mongodb mongodump --out /data/db/backup
```

**Restore MongoDB:**
```bash
docker exec build26-mongodb mongorestore /data/db/backup
```

