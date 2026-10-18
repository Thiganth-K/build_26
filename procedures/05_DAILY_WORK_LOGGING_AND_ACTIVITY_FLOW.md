# Procedure 05: Daily Work Logging and Team Activity Flow

> **Applicable Routes**: `/participant/worklogs`, `/participant/activity`, `/api/worklogs`, `/api/activity`  
> **Target Personas**: All Participants, Team Leads, Mentors, Administrators

---

## 1. Flow Overview

Every participant in BUILD26 is required to log their daily engineering activities, hours invested, and technical blockers. This creates a transparent record of contributions, updates attendance, and alerts organizers if an engineer or team is blocked.

```mermaid
sequenceDiagram
    autonumber
    actor Participant as Student Engineer
    participant UI as Work Log Form (/participant/worklogs)
    participant API as /api/worklogs
    participant DB as MongoDB
    participant Stream as Team Activity (/participant/activity)

    Participant->>UI: Opens Work Logs page
    UI->>UI: Pre-populates Date, Participant, Team & Role
    Participant->>UI: Enters Hours Spent, Work Accomplished, Tasks, Blockers, Evidence Link
    Participant->>UI: Clicks [Save Daily Work Log]
    UI->>API: POST /api/worklogs
    API->>DB: Stores WorkLog document
    API->>DB: Updates Participant.attendance = "Present"
    API->>DB: Updates Participant.contributionScore
    API->>DB: Appends record to Activity feed
    API-->>UI: 200 OK: "Daily work log submitted successfully!"
    UI->>Participant: Appends entry to My Work Log History
    Stream-->>Participant: Live Activity broadcast visible to full team
```

---

## 2. Daily Work Log Submission Procedure (Wireframe Section 30)

### 2.1 Access & Cadence
- **Location**: Navigated via the sidebar under `CONTRIBUTION -> My Work Log` (`/participant/worklogs`).
- **Cadence**: Must be completed at the end of each sprint day (prior to midnight).

### 2.2 Field Requirements
1. **Date & Sprint Day**: Automatically locked to today's date.
2. **Hours Spent**: Number of hours contributed (typically 4.0 to 12.0 hours).
3. **Work Done Today**: Clear narrative of features, components, or artifacts built.
4. **Completed Tasks**: Specific sprint tasks closed today.
5. **Next Steps / Priorities**: Focus areas planned for the next sprint day.
6. **Blockers & Impediments**:
   - Technical challenges, missing dependencies, or API errors.
   - If blocked: Mark status as `Blocked` to trigger mentor notification.
7. **Evidence / Proof Link**:
   - Clickable URL validating the work done (e.g. GitHub Commit, Pull Request, Figma Frame, Loom demo).
8. **Work Status**: Toggle between `Completed`, `In Progress`, or `Blocked`.

---

## 3. Work Log History & Attendance (Wireframe Section 31)

### 3.1 Historical Audit Table
- Displays past entries grouped by day.
- Columns: `Date`, `Hours Logged`, `Tasks Completed`, `Blockers`, `Evidence Link`, `Status`.
- Allows participants to review their consistency across the 6 days.

### 3.2 Automated Attendance & Contribution Tracking
- Submitting a valid work log automatically marks the participant's attendance as **"Present"** for that sprint day.
- System dynamically recalculates the **Contribution Score** (0–100) based on hours logged, evidence provided, and task velocity.

---

## 4. Team Activity Feed & Member Pulse (`/participant/activity`)

### 4.1 Real-Time Team Activity Feed (Wireframe Section 32)
The activity stream records all squad events chronologically:
- `PARTICIPANT_JOINED`: Member added to team roster.
- `PROBLEM_SELECTED`: Challenge officially claimed.
- `WORKLOG_SUBMITTED`: Engineer logged daily hours.
- `MILESTONE_SUBMITTED`: Deliverable uploaded for review.
- `FEEDBACK_RECEIVED`: Technical mentor provided ratings & critique.

### 4.2 Member Contribution Matrix (Wireframe Section 33)
- Visual progress bar showing team overall completion percentage.
- Breakdown of member contribution distribution to ensure equitable workload across Lead, Frontend, Backend, and Design roles.
