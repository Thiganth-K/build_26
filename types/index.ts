export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MENTOR" | "PARTICIPANT";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  participantId?: string;
  mentorId?: string;
}

export interface Participant {
  _id: string;
  user?: string;
  name: string;
  email: string;
  admissionNumber?: string;
  yearOfStudy?: string;
  department: string;
  year: string;
  mobileNumber?: string;
  team?: {
    _id: string;
    name: string;
    code: string;
  } | string;
  roleInTeam: string;
  skills: string[];
  contributionScore: number;
  attendance: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  avatar?: string;
  createdAt: string;
}

export interface ProblemStatement {
  _id: string;
  title: string;
  category: string;
  description: string;
  targetUsers: string;
  context: string;
  constraints: string;
  expectedOutcome: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  status: "ACTIVE" | "ARCHIVED" | "DRAFT";
  maxTeams: number;
  assignedTeamCount: number;
}

export interface TeamMember {
  participant: string;
  name: string;
  email: string;
  role: string;
  isLeader: boolean;
}

export interface Team {
  _id: string;
  name: string;
  code: string;
  problemStatement?: ProblemStatement | string;
  mentor?: Mentor | string;
  members: TeamMember[];
  currentPhase: "Problem Understanding" | "Ideation" | "Validation" | "Build" | "Testing" | "Final Demo";
  progress: number;
  status: "ACTIVE" | "NEEDS_ATTENTION" | "INACTIVE";
  solutionTitle?: string;
  solutionDescription?: string;
  targetUsers?: string;
  coreFeatures?: string[];
  uniqueValue?: string;
  techStack?: string[];
  demoUrl?: string;
  githubUrl?: string;
  presentationUrl?: string;
  lastActivityAt: string;
  createdAt: string;
}

export interface Mentor {
  _id: string;
  name: string;
  email: string;
  designation: string;
  organization: string;
  expertise: string[];
  assignedTeams: string[] | Team[];
  availability: string;
  avatar?: string;
}

export interface Bootcamp {
  _id: string;
  name: string;
  tagline: string;
  status: "LIVE" | "UPCOMING" | "COMPLETED";
  currentPhase: "Problem Understanding" | "Ideation" | "Validation" | "Build" | "Testing" | "Final Demo";
  dayNumber: number;
  totalDays: number;
  startDate: string;
  endDate: string;
  description: string;
  settings: {
    maxTeamSize: number;
    allowRegistration: boolean;
    submissionOpen: boolean;
  };
}

export interface ScheduleEvent {
  _id: string;
  title: string;
  description: string;
  phase: string;
  day: number;
  startTime: string;
  endTime: string;
  location: string;
  type: "Keynote" | "Milestone" | "Workshop" | "Review" | "Submission" | "Social";
  isCompleted: boolean;
}

export interface WorkLog {
  _id: string;
  participant: string;
  participantName: string;
  team: string;
  teamName: string;
  date: string;
  role: string;
  workDone: string;
  completedTasks: string;
  nextSteps: string;
  blockers: string;
  timeSpentHours: number;
  evidenceUrl?: string;
  status: "Completed" | "In Progress" | "Blocked";
  createdAt: string;
}

export interface Task {
  _id: string;
  team: string;
  title: string;
  description: string;
  assigneeName: string;
  assigneeRole: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  deadline?: string;
  column: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  evidenceUrl?: string;
}

export interface Submission {
  _id: string;
  team: string | { _id: string; name: string };
  teamName: string;
  submittedByName: string;
  phase: string;
  title: string;
  type: "Ideation PPT" | "Problem Analysis" | "Solution Proposal" | "Prototype" | "Progress Report" | "Final Demo" | "Final Presentation";
  fileUrl?: string;
  externalLink?: string;
  status: "Pending Review" | "Changes Requested" | "Approved";
  reviewNotes?: string;
  scores: {
    problemUnderstanding: number;
    innovation: number;
    feasibility: number;
    technicalApproach: number;
    userImpact: number;
  };
  totalScore: number;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Feedback {
  _id: string;
  team: string;
  teamName: string;
  mentor?: string;
  mentorName: string;
  phase: string;
  rating: number;
  strengths: string;
  areasOfImprovement: string;
  generalFeedback: string;
  actionItems: string[];
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  audience: "Everyone" | "All Teams" | "Mentors" | "Participants" | "Specific Team";
  targetTeam?: string;
  priority: "Normal" | "High" | "Urgent";
  author: string;
  publishedAt: string;
}

export interface ActivityItem {
  _id: string;
  type: string;
  title: string;
  description: string;
  teamId?: string;
  teamName?: string;
  participantName?: string;
  avatar?: string;
  createdAt: string;
}

export interface AttentionItem {
  id: string;
  teamId: string;
  teamName: string;
  severity: "high" | "medium" | "low";
  type: "NO_ACTIVITY" | "MISSING_SUBMISSION" | "PENDING_FEEDBACK" | "INCOMPLETE_TEAM" | "OVERDUE_TASK";
  message: string;
  timeAgo: string;
  actionLabel: string;
  actionUrl: string;
}
