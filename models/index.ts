import mongoose, { Schema, Document, Model } from "mongoose";

// ================= USER MODEL =================
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  college?: string;
  phone?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MENTOR" | "PARTICIPANT";
  avatar?: string;
  participantId?: mongoose.Types.ObjectId;
  mentorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    college: { type: String, default: "Sona College of Technology" },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "MENTOR", "PARTICIPANT"],
      default: "PARTICIPANT",
    },
    avatar: { type: String },
    participantId: { type: Schema.Types.ObjectId, ref: "Participant" },
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor" },
  },
  { timestamps: true }
);

// ================= PARTICIPANT MODEL =================
export interface IParticipant extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  college?: string;
  admissionNumber?: string;
  yearOfStudy?: string;
  department: string;
  year: string;
  mobileNumber?: string;
  phone?: string;
  team?: mongoose.Types.ObjectId;
  roleInTeam: string; // Team Lead, Product, UI/UX, Frontend, Backend, AI/ML, Research, Marketing
  skills: string[];
  contributionScore: number;
  attendance: string; // Present, Absent, Excused
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    college: { type: String, default: "Sona College of Technology" },
    admissionNumber: { type: String, trim: true },
    yearOfStudy: { type: String, default: "3rd Year" },
    department: { type: String, default: "Computer Science" },
    year: { type: String, default: "3rd Year" },
    mobileNumber: { type: String, trim: true },
    phone: { type: String, trim: true },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    roleInTeam: { type: String, default: "Frontend Developer" },
    skills: [{ type: String }],
    contributionScore: { type: Number, default: 85 },
    attendance: { type: String, default: "Present" },
    status: { type: String, enum: ["ACTIVE", "PENDING", "INACTIVE"], default: "ACTIVE" },
    avatar: { type: String },
  },
  { timestamps: true }
);

// ================= PROBLEM STATEMENT MODEL =================
export interface IProblemStatement extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const ProblemStatementSchema = new Schema<IProblemStatement>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    targetUsers: { type: String, default: "Students and University Faculty" },
    context: { type: String, default: "" },
    constraints: { type: String, default: "Must use responsive modern web stack" },
    expectedOutcome: { type: String, default: "Interactive functional prototype" },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    tags: [{ type: String }],
    status: { type: String, enum: ["ACTIVE", "ARCHIVED", "DRAFT"], default: "ACTIVE" },
    maxTeams: { type: Number, default: 3 },
    assignedTeamCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ================= TEAM MODEL =================
export interface ITeamMember {
  participant: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  isLeader: boolean;
}

export interface IJoinRequest {
  participant: mongoose.Types.ObjectId;
  name: string;
  email: string;
  requestedRole: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  requestedAt: Date;
}

export interface IInvitation {
  _id?: mongoose.Types.ObjectId;
  email: string;
  role: string;
  status: "INVITED" | "ACCEPTED" | "DECLINED" | "CANCELLED";
  invitedBy?: string;
  invitedAt: Date;
  expiresAt?: Date;
}

export interface ITeam extends Document {
  name: string;
  code: string;
  teamSize: number; // 3 or 4, fixed after creation
  problemStatement?: mongoose.Types.ObjectId;
  mentor?: mongoose.Types.ObjectId;
  members: ITeamMember[];
  definedRoles?: Array<{ slot: number; role: string }>;
  currentMilestoneDay: number; // 1 to 6
  currentPhase: "Problem Understanding" | "Ideation" | "Validation" | "Build" | "Testing" | "Final Demo";
  progress: number; // 0 - 100
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
  joinRequests: IJoinRequest[];
  invitations: IInvitation[];
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    teamSize: { type: Number, enum: [3, 4], default: 4 },
    problemStatement: { type: Schema.Types.ObjectId, ref: "ProblemStatement" },
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor" },
    members: [
      {
        participant: { type: Schema.Types.ObjectId, ref: "Participant" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, default: "Developer" },
        isLeader: { type: Boolean, default: false },
      },
    ],
    definedRoles: [
      {
        slot: { type: Number },
        role: { type: String },
      },
    ],
    currentMilestoneDay: { type: Number, default: 1 },
    currentPhase: {
      type: String,
      enum: ["Problem Understanding", "Ideation", "Validation", "Build", "Testing", "Final Demo"],
      default: "Problem Understanding",
    },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "NEEDS_ATTENTION", "INACTIVE"], default: "ACTIVE" },
    solutionTitle: { type: String, default: "" },
    solutionDescription: { type: String, default: "" },
    targetUsers: { type: String, default: "" },
    coreFeatures: [{ type: String }],
    uniqueValue: { type: String, default: "" },
    techStack: [{ type: String }],
    demoUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    presentationUrl: { type: String, default: "" },
    joinRequests: [
      {
        participant: { type: Schema.Types.ObjectId, ref: "Participant" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        requestedRole: { type: String, default: "Frontend Developer" },
        status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    invitations: [
      {
        email: { type: String, required: true, lowercase: true },
        role: { type: String, default: "Developer" },
        status: { type: String, enum: ["INVITED", "ACCEPTED", "DECLINED", "CANCELLED"], default: "INVITED" },
        invitedBy: { type: String },
        invitedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
      },
    ],
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ================= MENTOR MODEL =================
export interface IMentor extends Document {
  name: string;
  email: string;
  designation: string;
  organization: string;
  expertise: string[];
  assignedTeams: mongoose.Types.ObjectId[];
  availability: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema = new Schema<IMentor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    designation: { type: String, default: "Senior Software Architect" },
    organization: { type: String, default: "Tech Innovators Lab" },
    expertise: [{ type: String }],
    assignedTeams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    availability: { type: String, default: "Available for mentoring" },
    avatar: { type: String },
  },
  { timestamps: true }
);

// ================= BOOTCAMP SETTINGS MODEL =================
export interface IBootcamp extends Document {
  name: string;
  tagline: string;
  status: "LIVE" | "UPCOMING" | "COMPLETED";
  currentPhase: "Problem Understanding" | "Ideation" | "Validation" | "Build" | "Testing" | "Final Demo";
  dayNumber: number;
  totalDays: number;
  startDate: Date;
  endDate: Date;
  description: string;
  settings: {
    maxTeamSize: number;
    allowRegistration: boolean;
    submissionOpen: boolean;
  };
}

const BootcampSchema = new Schema<IBootcamp>(
  {
    name: { type: String, default: "BUILD26 2026" },
    tagline: { type: String, default: "Build • Ship • Showcase" },
    status: { type: String, enum: ["LIVE", "UPCOMING", "COMPLETED"], default: "LIVE" },
    currentPhase: {
      type: String,
      enum: ["Problem Understanding", "Ideation", "Validation", "Build", "Testing", "Final Demo"],
      default: "Ideation",
    },
    dayNumber: { type: Number, default: 1 },
    totalDays: { type: Number, default: 6 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
    description: { type: String, default: "A hands-on college technology bootcamp where students build real products." },
    settings: {
      maxTeamSize: { type: Number, default: 4 },
      allowRegistration: { type: Boolean, default: true },
      submissionOpen: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// ================= SCHEDULE EVENT MODEL =================
export interface IScheduleEvent extends Document {
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

const ScheduleEventSchema = new Schema<IScheduleEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    phase: { type: String, default: "Ideation" },
    day: { type: Number, default: 1 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, default: "Auditorium / Lab 301" },
    type: {
      type: String,
      enum: ["Keynote", "Milestone", "Workshop", "Review", "Submission", "Social"],
      default: "Milestone",
    },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ================= WORK LOG MODEL =================
export interface IWorkLog extends Document {
  participant: mongoose.Types.ObjectId;
  participantName: string;
  team: mongoose.Types.ObjectId;
  teamName: string;
  date: Date;
  day: number; // 1 to 6
  role: string;
  workDone: string;
  contributionTypes: string[]; // Ideation, Research, UI/UX, Frontend, Backend, AI/ML, Testing, Documentation, Presentation, Other
  completedTasks: string;
  nextSteps: string;
  blockers: string;
  timeSpentHours: number;
  evidenceUrl?: string;
  status: "Completed" | "In Progress" | "Blocked" | "Planned";
  createdAt: Date;
  updatedAt: Date;
}

const WorkLogSchema = new Schema<IWorkLog>(
  {
    participant: { type: Schema.Types.ObjectId, ref: "Participant", required: true },
    participantName: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    day: { type: Number, default: 1, min: 1, max: 6 },
    role: { type: String, required: true },
    workDone: { type: String, required: true },
    contributionTypes: [{ type: String }],
    completedTasks: { type: String, default: "" },
    nextSteps: { type: String, default: "" },
    blockers: { type: String, default: "None" },
    timeSpentHours: { type: Number, default: 2 },
    evidenceUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Blocked", "Planned"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

// ================= TASK (KANBAN) MODEL =================
export interface ITask extends Document {
  team: mongoose.Types.ObjectId;
  title: string;
  description: string;
  assigneeName: string;
  assigneeRole: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  deadline?: Date;
  column: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  evidenceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assigneeName: { type: String, default: "Unassigned" },
    assigneeRole: { type: String, default: "Developer" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    deadline: { type: Date },
    column: {
      type: String,
      enum: ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"],
      default: "TODO",
    },
    evidenceUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// ================= SUBMISSION MODEL =================
export interface IMemberApproval {
  participant?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  comment?: string;
  updatedAt: Date;
}

export interface ISubmission extends Document {
  team: mongoose.Types.ObjectId;
  teamName: string;
  submittedByName: string;
  day: number; // 1 to 6
  phase: string;
  title: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  externalLink?: string;
  githubUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  projectDescription?: string;
  status: "Pending Review" | "Changes Requested" | "Approved" | "Submitted" | "Pending Team Approval";
  requiresMemberApproval?: boolean;
  memberApprovals?: IMemberApproval[];
  approvalStatus?: "PENDING_APPROVAL" | "APPROVED" | "CHANGES_REQUESTED";
  uploadedByName?: string;
  uploadedByEmail?: string;
  version?: number;
  reviewNotes?: string;
  scores: {
    problemUnderstanding: number; // max 10
    innovation: number; // max 10
    feasibility: number; // max 10
    technicalApproach: number; // max 10
    userImpact: number; // max 10
  };
  totalScore: number; // max 50
  reviewedByName?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamName: { type: String, required: true },
    submittedByName: { type: String, required: true },
    day: { type: Number, default: 1, min: 1, max: 6 },
    phase: { type: String, default: "Ideation" },
    title: { type: String, required: true },
    type: {
      type: String,
      default: "Ideation PPT",
    },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileSize: { type: String, default: "" },
    externalLink: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    presentationUrl: { type: String, default: "" },
    projectDescription: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending Review", "Changes Requested", "Approved", "Submitted", "Pending Team Approval"],
      default: "Submitted",
    },
    requiresMemberApproval: { type: Boolean, default: false },
    memberApprovals: [
      {
        participant: { type: Schema.Types.ObjectId, ref: "Participant" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, default: "Team Member" },
        status: {
          type: String,
          enum: ["PENDING", "APPROVED", "CHANGES_REQUESTED"],
          default: "PENDING",
        },
        comment: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    approvalStatus: {
      type: String,
      enum: ["PENDING_APPROVAL", "APPROVED", "CHANGES_REQUESTED"],
      default: "PENDING_APPROVAL",
    },
    uploadedByName: { type: String, default: "" },
    uploadedByEmail: { type: String, default: "" },
    version: { type: Number, default: 1 },
    reviewNotes: { type: String, default: "" },
    scores: {
      problemUnderstanding: { type: Number, default: 0 },
      innovation: { type: Number, default: 0 },
      feasibility: { type: Number, default: 0 },
      technicalApproach: { type: Number, default: 0 },
      userImpact: { type: Number, default: 0 },
    },
    totalScore: { type: Number, default: 0 },
    reviewedByName: { type: String, default: "" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// ================= MILESTONE MODEL =================
export interface IMilestoneTask {
  id: string;
  title: string;
  completed?: boolean;
}

export interface IMilestone extends Document {
  dayNumber: number; // 1 to 6
  title: string;
  objective: string;
  instructions: string;
  tasks: IMilestoneTask[];
  requiredSubmission: string;
  allowedFileTypes: string[];
  workLogRequired: boolean;
  startDate: Date;
  endDate: Date;
  status: "Published" | "Active" | "Scheduled" | "Draft";
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    dayNumber: { type: Number, required: true, unique: true, min: 1, max: 6 },
    title: { type: String, required: true },
    objective: { type: String, required: true },
    instructions: { type: String, default: "" },
    tasks: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    requiredSubmission: { type: String, default: "Deliverable" },
    allowedFileTypes: [{ type: String }],
    workLogRequired: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    status: {
      type: String,
      enum: ["Published", "Active", "Scheduled", "Draft"],
      default: "Published",
    },
  },
  { timestamps: true }
);

// ================= MENTOR FEEDBACK MODEL =================
export interface IFeedback extends Document {
  team: mongoose.Types.ObjectId;
  teamName: string;
  mentor: mongoose.Types.ObjectId;
  mentorName: string;
  phase: string;
  rating: number; // 1 to 5
  strengths: string;
  areasOfImprovement: string;
  generalFeedback: string;
  actionItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamName: { type: String, required: true },
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor" },
    mentorName: { type: String, required: true },
    phase: { type: String, default: "Ideation" },
    rating: { type: Number, default: 4, min: 1, max: 5 },
    strengths: { type: String, default: "" },
    areasOfImprovement: { type: String, default: "" },
    generalFeedback: { type: String, required: true },
    actionItems: [{ type: String }],
  },
  { timestamps: true }
);

// ================= ANNOUNCEMENT MODEL =================
export interface IAnnouncement extends Document {
  title: string;
  message: string;
  audience: "Everyone" | "All Teams" | "Mentors" | "Participants" | "Specific Team";
  targetTeam?: mongoose.Types.ObjectId;
  priority: "Normal" | "High" | "Urgent";
  author: string;
  publishedAt: Date;
  expiresAt?: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: {
      type: String,
      enum: ["Everyone", "All Teams", "Mentors", "Participants", "Specific Team"],
      default: "Everyone",
    },
    targetTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    priority: { type: String, enum: ["Normal", "High", "Urgent"], default: "Normal" },
    author: { type: String, default: "Build26 Operations" },
    publishedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// ================= NOTIFICATION MODEL =================
export interface INotification extends Document {
  recipientUser?: mongoose.Types.ObjectId;
  recipientRole?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientUser: { type: Schema.Types.ObjectId, ref: "User" },
    recipientRole: { type: String },
    type: { type: String, default: "INFO" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ================= EVALUATION MODEL =================
export interface IEvaluation extends Document {
  team: mongoose.Types.ObjectId;
  teamName: string;
  round: string;
  criteriaScores: {
    criteriaName: string;
    weightPercent: number;
    score: number; // 0 to 10
  }[];
  totalWeightedScore: number; // out of 100
  reviewerNotes: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Published";
  evaluatedByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<IEvaluation>(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamName: { type: String, required: true },
    round: { type: String, default: "Final Evaluation" },
    criteriaScores: [
      {
        criteriaName: { type: String, required: true },
        weightPercent: { type: Number, required: true },
        score: { type: Number, default: 0 },
      },
    ],
    totalWeightedScore: { type: Number, default: 0 },
    reviewerNotes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Reviewed", "Published"],
      default: "Published",
    },
    evaluatedByName: { type: String, default: "Jury Panel" },
  },
  { timestamps: true }
);

// ================= ACTIVITY MODEL =================
export interface IActivity extends Document {
  type:
    | "TEAM_CREATED"
    | "PARTICIPANT_JOINED"
    | "PROBLEM_ASSIGNED"
    | "WORKLOG_CREATED"
    | "SUBMISSION_CREATED"
    | "SUBMISSION_REVIEWED"
    | "FEEDBACK_ADDED"
    | "ANNOUNCEMENT_PUBLISHED"
    | "EVALUATION_UPDATED"
    | "TASK_UPDATED";
  title: string;
  description: string;
  teamId?: mongoose.Types.ObjectId;
  teamName?: string;
  participantName?: string;
  avatar?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    teamName: { type: String, default: "" },
    participantName: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

// ================= MODEL REGISTRATIONS =================
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Participant: Model<IParticipant> = mongoose.models.Participant || mongoose.model<IParticipant>("Participant", ParticipantSchema);
export const ProblemStatement: Model<IProblemStatement> = mongoose.models.ProblemStatement || mongoose.model<IProblemStatement>("ProblemStatement", ProblemStatementSchema);
export const Team: Model<ITeam> = mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
export const Mentor: Model<IMentor> = mongoose.models.Mentor || mongoose.model<IMentor>("Mentor", MentorSchema);
export const Bootcamp: Model<IBootcamp> = mongoose.models.Bootcamp || mongoose.model<IBootcamp>("Bootcamp", BootcampSchema);
export const ScheduleEvent: Model<IScheduleEvent> = mongoose.models.ScheduleEvent || mongoose.model<IScheduleEvent>("ScheduleEvent", ScheduleEventSchema);
export const WorkLog: Model<IWorkLog> = mongoose.models.WorkLog || mongoose.model<IWorkLog>("WorkLog", WorkLogSchema);
export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
export const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
export const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
export const Announcement: Model<IAnnouncement> = mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
export const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export const Evaluation: Model<IEvaluation> = mongoose.models.Evaluation || mongoose.model<IEvaluation>("Evaluation", EvaluationSchema);
export const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
export const Milestone: Model<IMilestone> = mongoose.models.Milestone || mongoose.model<IMilestone>("Milestone", MilestoneSchema);

