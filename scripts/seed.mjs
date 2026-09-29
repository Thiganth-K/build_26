import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is required to run seed script.");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  // Clear existing collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  console.log("Cleared existing database records.");

  // Import schemas or define directly in script to ensure clean standalone execution
  const db = mongoose.connection.db;

  // 1. BOOTCAMP
  const bootcamp = {
    name: "BUILD26 2026",
    tagline: "Build • Ship • Showcase",
    status: "LIVE",
    currentPhase: "Ideation",
    dayNumber: 1,
    totalDays: 6,
    startDate: new Date("2026-09-29T09:00:00Z"),
    endDate: new Date("2026-10-04T18:00:00Z"),
    description: "Hands-on collegiate tech bootcamp where multidisciplinary teams conceptualize, engineer, and pitch functioning software products.",
    settings: {
      maxTeamSize: 4,
      allowRegistration: true,
      submissionOpen: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const { insertedId: bootcampId } = await db.collection("bootcamps").insertOne(bootcamp);
  console.log("Bootcamp initialized with ID:", bootcampId);

  // 2. MENTORS (5+)
  const mentorDocs = [
    {
      name: "Dr. Kumar Sundaram",
      email: "kumar.s@build26.org",
      designation: "Senior Software Architect & Dept Chair",
      organization: "Center for Cloud Innovation",
      expertise: ["Distributed Systems", "Cloud Architecture", "System Design"],
      assignedTeams: [],
      availability: "Daily 3:00 PM - 6:30 PM",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@fintechlabs.io",
      designation: "Director of Product Strategy",
      organization: "NextGen FinTech",
      expertise: ["Product Strategy", "User Journey Mapping", "FinTech"],
      assignedTeams: [],
      availability: "Daily 4:00 PM - 7:00 PM",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Arvind Swaminathan",
      email: "arvind.swami@tensorcraft.ai",
      designation: "Principal AI Research Scientist",
      organization: "TensorCraft AI",
      expertise: ["LLMs", "RAG Systems", "Vector Databases", "MLOps"],
      assignedTeams: [],
      availability: "Daily 2:00 PM - 5:00 PM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Ananya Roy",
      email: "ananya.roy@designsystem.co",
      designation: "Lead Product Designer",
      organization: "Starlight Interface Studio",
      expertise: ["Design Systems", "Figma", "Micro-Interactions", "Accessibility"],
      assignedTeams: [],
      availability: "Daily 5:00 PM - 7:30 PM",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Rajesh Pillai",
      email: "rajesh.pillai@scalewave.tech",
      designation: "Co-Founder & VP Engineering",
      organization: "ScaleWave Technologies",
      expertise: ["Full-Stack TypeScript", "DevOps", "Database Optimization"],
      assignedTeams: [],
      availability: "Daily 4:30 PM - 8:00 PM",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mentorInsertResult = await db.collection("mentors").insertMany(mentorDocs);
  const mentorIds = Object.values(mentorInsertResult.insertedIds);
  console.log(`Seeded ${mentorIds.length} mentors.`);

  // 3. PROBLEM STATEMENTS (8+)
  const problemDocs = [
    {
      title: "Smart Campus Indoor & Outdoor Navigation",
      category: "Campus",
      description: "College campuses are often labyrinthine for freshers, visitors, and differently-abled individuals. Build a high-precision, low-latency navigation companion with real-time room availability, accessible paths, and event-routing.",
      targetUsers: "15,000+ university students, faculty, conference attendees, and mobility-impaired visitors.",
      context: "Traditional GPS fails inside multi-story university blocks. Bluetooth beacons and WiFi fingerprinting provide high accuracy.",
      constraints: "Must operate smoothly on standard mobile browsers without requiring native 1GB app downloads.",
      expectedOutcome: "Interactive 3D or 2.5D web map with turn-by-turn routing and wheelchair-accessible filter toggles.",
      difficulty: "Advanced",
      tags: ["Mapping", "Accessibility", "Campus Tech", "WebGIS"],
      status: "ACTIVE",
      maxTeams: 3,
      assignedTeamCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Autonomous AI Student Career & Skill Compass",
      category: "Education",
      description: "College syllabi struggle to keep pace with rapid market disruptions. Create an agentic career engine that analyzes actual student code repositories and resumes to generate verified skill matrices and weekly sprint roadmaps.",
      targetUsers: "Undergraduate engineering students targeting product companies and high-growth startups.",
      context: "Students suffer from tutorial paralysis and lack verified industry feedback on real project code.",
      constraints: "Analysis must take under 10 seconds and preserve repository privacy.",
      expectedOutcome: "Working diagnostic portal that parses GitHub repos and outputs custom project tasks with automated linting checks.",
      difficulty: "Intermediate",
      tags: ["AI/ML", "GitHub API", "EdTech", "Career"],
      status: "ACTIVE",
      maxTeams: 3,
      assignedTeamCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Decentralized Academic & Extracurricular Credential Ledger",
      category: "Finance",
      description: "Certificate fraud and manual verifications slow down university recruitment. Build an instant cryptographically verifiable credential system for hackathon wins, course completions, and student club leadership.",
      targetUsers: "College registrars, hiring managers, student event organizers.",
      context: "Paper certificates and simple PDFs are easily photoshopped. Instant verification with cryptographic proofs eliminates background check delays.",
      constraints: "Zero gas fees for students; instant QR code scanning verification.",
      expectedOutcome: "Issuance dashboard for admins and mobile-friendly verifiable credential viewer with one-click verification.",
      difficulty: "Advanced",
      tags: ["Cryptography", "Verification", "Identity", "Zero-Knowledge"],
      status: "ACTIVE",
      maxTeams: 2,
      assignedTeamCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Accessible Real-time Audio-Visual Learning Companion",
      category: "Accessibility",
      description: "Neurodivergent students and learners with auditory processing challenges struggle in fast-paced college lectures. Build an on-device live transcription and concept-visualizer tool.",
      targetUsers: "Students with ADHD, auditory sensitivity, and ESL learners.",
      context: "Generic transcripts create overwhelming walls of text. Mind-mapping concepts in real-time dramatically aids retention.",
      constraints: "Low CPU latency on ordinary laptops; completely private audio processing.",
      expectedOutcome: "Live speech-to-structured-concept diagram web application with instant glossary popups.",
      difficulty: "Intermediate",
      tags: ["Accessibility", "Web Audio API", "Concept Mapping", "Speech-to-Text"],
      status: "ACTIVE",
      maxTeams: 3,
      assignedTeamCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Campus Food Waste Redistribution & Hostel Mess Tracker",
      category: "Sustainability",
      description: "Over 400 kg of mess food is wasted daily across campus hostels while local shelters face deficits. Build an automated demand-forecasting and rapid food dispatch ledger.",
      targetUsers: "Hostel mess contractors, student volunteers, and verified local NGOs.",
      context: "Perishable cooked meals spoil within 3 hours. Rapid automated alerts and route matching are crucial.",
      constraints: "Strict hygiene certification log and real-time pickup confirmations under 45 minutes.",
      expectedOutcome: "Real-time kitchen surplus alert dashboard with SMS dispatch and temperature compliance logging.",
      difficulty: "Beginner",
      tags: ["Sustainability", "Food Logistics", "IoT Sensor Data", "Community"],
      status: "ACTIVE",
      maxTeams: 3,
      assignedTeamCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Micro-Energy Harvest & Smart Dorm Energy Optimizer",
      category: "Sustainability",
      description: "College dorms account for 45% of peak campus power consumption. Create an interactive energy dashboard with anomaly detection for unswitched appliances and student rewards.",
      targetUsers: "Campus facility managers and residential students.",
      context: "Students lack visibility into energy waste. Gamification and automated power threshold warnings reduce consumption by 24%.",
      constraints: "Simulate smart meter telemetry feeds with sub-second polling.",
      expectedOutcome: "Dorm floor-by-floor energy heatmap and gamified carbon offset leaderboard.",
      difficulty: "Intermediate",
      tags: ["GreenTech", "Telemetry", "Gamification", "IoT"],
      status: "ACTIVE",
      maxTeams: 2,
      assignedTeamCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Predictive Student Mental Well-being & Academic Stress Radar",
      category: "Healthcare",
      description: "Academic burnout spikes undetected prior to university exam weeks. Build a privacy-first, opt-in mood journaling and workload stress indicator that recommends timely peer support.",
      targetUsers: "University counseling cell and anonymous student participants.",
      context: "Students hesitate to visit physical clinics. A private, non-judgmental pulse survey with automated resource matching saves lives.",
      constraints: "End-to-end client-side encryption of all student reflections.",
      expectedOutcome: "Anonymous sentiment pulse board, emergency contact SOS button, and breathing intervention UI.",
      difficulty: "Intermediate",
      tags: ["Health", "Privacy", "Sentiment Analysis", "Student Support"],
      status: "ACTIVE",
      maxTeams: 3,
      assignedTeamCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Collaborative Real-Time Peer Code Review & Pair-Programming Arena",
      category: "Productivity",
      description: "Students learn best by reading real code. Create an asynchronous peer review arena with inline code commenting, automated test runner sandboxes, and reputation rankings.",
      targetUsers: "Bootcamp participants, lab instructors, and student developers.",
      context: "GitHub pull requests can feel intimidating for beginners. A gentle, structured peer-critique rubric improves code quality.",
      constraints: "Support syntax highlighting for JavaScript, Python, C++, and Go.",
      expectedOutcome: "Web-based split-view code reviewer with inline annotations and rubric scoring.",
      difficulty: "Advanced",
      tags: ["Developer Tools", "Code Review", "Collaboration", "Productivity"],
      status: "ACTIVE",
      maxTeams: 3,
      assignedTeamCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const problemInsertResult = await db.collection("problemstatements").insertMany(problemDocs);
  const problemIds = Object.values(problemInsertResult.insertedIds);
  console.log(`Seeded ${problemIds.length} problem statements.`);

  // 4. USERS (Super Admin, Admins, Mentors, Participants)
  const users = [
    {
      name: "Thiganth (Super Admin)",
      email: "admin@build26.org",
      role: "SUPER_ADMIN",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Operations Admin",
      email: "ops@build26.org",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Add mentor users
  mentorDocs.forEach((m, idx) => {
    users.push({
      name: m.name,
      email: m.email,
      role: "MENTOR",
      avatar: m.avatar,
      mentorId: mentorIds[idx],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // 5. TEAMS DATA (10 teams)
  const teamTemplates = [
    {
      name: "Team Alpha",
      code: "B26-ALPHA",
      problemIndex: 0,
      mentorIndex: 0,
      phase: "Build",
      progress: 68,
      status: "ACTIVE",
      solutionTitle: "NaviCampus 3D",
      solutionDescription: "High-precision web-based 3D campus routing engine with real-time lab beacon tracking and wheelchair friendly routing.",
      targetUsers: "Campus freshers, faculty, visiting parents, and physically challenged students.",
      coreFeatures: ["Interactive 3D Canvas Map", "Accessible Turn-by-Turn Paths", "Live Room Occupancy Beacons", "Voice Guidance"],
      uniqueValue: "Works instantly on mobile web with zero app installs required.",
      techStack: ["Next.js", "Three.js", "WebSockets", "MongoDB"],
      demoUrl: "https://alpha.build26.preview",
      githubUrl: "https://github.com/build26/team-alpha-navicampus",
      presentationUrl: "https://pitch.build26.org/alpha",
      lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    },
    {
      name: "Team Nova",
      code: "B26-NOVA",
      problemIndex: 1,
      mentorIndex: 2,
      phase: "Ideation",
      progress: 28,
      status: "NEEDS_ATTENTION", // missing submission
      solutionTitle: "CompassAI",
      solutionDescription: "Agentic career guide that reads live student codebases and constructs actionable weekly project tracks.",
      targetUsers: "Undergrad students preparing for software engineering internships.",
      coreFeatures: ["GitHub Repo AST Parser", "Skill Gap Radar", "Custom Weekly Sprints", "AI Mentor Chat"],
      uniqueValue: "Tailored to actual code repos rather than self-reported checkboxes.",
      techStack: ["React", "FastAPI", "LangChain", "PostgreSQL"],
      demoUrl: "https://nova.build26.preview",
      githubUrl: "https://github.com/build26/team-nova-compass",
      presentationUrl: "",
      lastActivityAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14h ago
    },
    {
      name: "Team Orbit",
      code: "B26-ORBIT",
      problemIndex: 2,
      mentorIndex: 1,
      phase: "Validation",
      progress: 42,
      status: "NEEDS_ATTENTION", // no activity for 18 hours
      solutionTitle: "VeriGrad Ledger",
      solutionDescription: "Tamper-proof verifiable digital credentials for college hackathon prizes and lab assistantships.",
      targetUsers: "Colleges, student leaders, recruiting partners.",
      coreFeatures: ["Instant Cryptographic Issuer", "QR Verification Portal", "Student Wallet Card", "Revocation Registry"],
      uniqueValue: "Zero gas fee, instant sub-second verification.",
      techStack: ["Next.js", "Ed25519 Signatures", "TailwindCSS"],
      demoUrl: "https://orbit.build26.preview",
      githubUrl: "https://github.com/build26/team-orbit-verigrad",
      presentationUrl: "https://pitch.build26.org/orbit",
      lastActivityAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18h ago
    },
    {
      name: "Team Pixel",
      code: "B26-PIXEL",
      problemIndex: 3,
      mentorIndex: 3,
      phase: "Build",
      progress: 62,
      status: "ACTIVE",
      solutionTitle: "AuraLearn Companion",
      solutionDescription: "Real-time speech-to-concept visualizer designed specifically for neurodivergent engineering students.",
      targetUsers: "Students with ADHD and auditory processing difficulties.",
      coreFeatures: ["Live Audio Stream Parser", "Dynamic Concept Graph", "Instant Glossary Sidebar", "Lecture Summaries"],
      uniqueValue: "Visual mind-mapping in real-time while lecture is in progress.",
      techStack: ["Web Audio API", "D3.js", "Next.js", "Whisper Small"],
      demoUrl: "https://pixel.build26.preview",
      githubUrl: "https://github.com/build26/team-pixel-auralearn",
      presentationUrl: "https://pitch.build26.org/pixel",
      lastActivityAt: new Date(Date.now() - 45 * 60 * 1000), // 45m ago
    },
    {
      name: "Team Nexus",
      code: "B26-NEXUS",
      problemIndex: 4,
      mentorIndex: 4,
      phase: "Build",
      progress: 55,
      status: "ACTIVE",
      solutionTitle: "MessBridge Surplus",
      solutionDescription: "Automated surplus food prediction and rapid shelter dispatch platform for hostel mess facilities.",
      targetUsers: "Hostel wardens, kitchen staff, student coordinators, NGO drivers.",
      coreFeatures: ["Kitchen Weight Sensor Telemetry", "One-Tap Surplus Dispatch", "NGO Geo-Routing", "Hygiene Verification"],
      uniqueValue: "Guaranteed 45-minute pickup notification dispatch.",
      techStack: ["Next.js", "Express", "MongoDB", "Twilio API"],
      demoUrl: "https://nexus.build26.preview",
      githubUrl: "https://github.com/build26/team-nexus-messbridge",
      presentationUrl: "https://pitch.build26.org/nexus",
      lastActivityAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      name: "Team Spark",
      code: "B26-SPARK",
      problemIndex: 5,
      mentorIndex: 0,
      phase: "Validation",
      progress: 45,
      status: "ACTIVE",
      solutionTitle: "WattSense Dorms",
      solutionDescription: "Smart power telemetry tracking with gamified floor competitions to cut collegiate energy waste.",
      targetUsers: "Dorm residents and college infrastructure managers.",
      coreFeatures: ["Live Floor Heatmaps", "Appliance Anomaly Alerts", "Inter-Hostel Eco Leaderboard", "Automated Cutoff"],
      uniqueValue: "Student-driven incentives save 20%+ electrical load.",
      techStack: ["React", "Chart.js", "Node.js", "TimescaleDB"],
      demoUrl: "https://spark.build26.preview",
      githubUrl: "https://github.com/build26/team-spark-wattsense",
      presentationUrl: "https://pitch.build26.org/spark",
      lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      name: "Team Flux",
      code: "B26-FLUX",
      problemIndex: 6,
      mentorIndex: 1,
      phase: "Ideation",
      progress: 30,
      status: "ACTIVE",
      solutionTitle: "MindAnchor Radar",
      solutionDescription: "Privacy-preserving anonymous mental wellness pulse tracker for academic pressure seasons.",
      targetUsers: "College students feeling pre-exam burnout and campus counseling center.",
      coreFeatures: ["Zero-Knowledge Mood Vault", "Anonymous Stress Radar", "One-Click Counselor SOS", "Micro-Mindfulness"],
      uniqueValue: "Guarantees student privacy with zero dean-level identity exposure.",
      techStack: ["Next.js", "TailwindCSS", "WebCrypto API"],
      demoUrl: "https://flux.build26.preview",
      githubUrl: "https://github.com/build26/team-flux-mindanchor",
      presentationUrl: "",
      lastActivityAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      name: "Team Vertex",
      code: "B26-VERTEX",
      problemIndex: 7,
      mentorIndex: 2,
      phase: "Build",
      progress: 60,
      status: "ACTIVE",
      solutionTitle: "CritiqueHub Arena",
      solutionDescription: "Structured asynchronous peer code review arena with automated linter sandboxes.",
      targetUsers: "Computer science lab students and teaching assistants.",
      coreFeatures: ["Diff Annotator", "Rubric Scoring Matrix", "Gamified Peer Badges", "Sandbox Test Runner"],
      uniqueValue: "Encouraging, structured feedback for beginners.",
      techStack: ["Next.js", "Monaco Editor", "Docker", "Node.js"],
      demoUrl: "https://vertex.build26.preview",
      githubUrl: "https://github.com/build26/team-vertex-critiquehub",
      presentationUrl: "https://pitch.build26.org/vertex",
      lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      name: "Team Pulse",
      code: "B26-PULSE",
      problemIndex: 0,
      mentorIndex: 3,
      phase: "Ideation",
      progress: 25,
      status: "ACTIVE",
      solutionTitle: "CampusFlow Shuttle & Walk",
      solutionDescription: "Crowdsourced campus bus frequency and real-time pedestrian density routing.",
      targetUsers: "Hostellers and commuter day scholars.",
      coreFeatures: ["Live Shuttle GPS Map", "Crowd Density Heatmap", "Rain Route Advisor"],
      uniqueValue: "Combines shuttle tracking with covered walkway navigation.",
      techStack: ["React Native Web", "Leaflet", "Node.js"],
      demoUrl: "https://pulse.build26.preview",
      githubUrl: "https://github.com/build26/team-pulse-campusflow",
      presentationUrl: "",
      lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      name: "Team Forge",
      code: "B26-FORGE",
      problemIndex: 7,
      mentorIndex: 4,
      phase: "Problem Understanding",
      progress: 18,
      status: "NEEDS_ATTENTION", // slow start
      solutionTitle: "DevForge Labs",
      solutionDescription: "Interactive coding playground for college hackathon teams with live multiplayer pair-programming.",
      targetUsers: "Collegiate hackathon teams and workshop mentors.",
      coreFeatures: ["Multiplayer Web IDE", "Shared Terminal", "Voice Room", "Git Synchronizer"],
      uniqueValue: "Zero config collaborative dev environment in the browser.",
      techStack: ["Next.js", "Yjs WebRTC", "Node.js"],
      demoUrl: "",
      githubUrl: "https://github.com/build26/team-forge-devforge",
      presentationUrl: "",
      lastActivityAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22h ago
    },
  ];

  // 6. PARTICIPANTS (40+ participants across 10 teams)
  const participantNames = [
    // Team Alpha (0)
    { name: "Thiganth K.", dept: "Computer Science", year: "3rd Year", role: "Team Lead & Frontend", skills: ["Next.js", "TypeScript", "Tailwind CSS"] },
    { name: "Siddharth Verma", dept: "Information Tech", year: "3rd Year", role: "Frontend Developer", skills: ["React", "Three.js", "WebGL"] },
    { name: "Aarushi Patel", dept: "Computer Science", year: "3rd Year", role: "Backend Developer", skills: ["Node.js", "MongoDB", "WebSockets"] },
    { name: "Meera Krishnan", dept: "AI & Data Science", year: "2nd Year", role: "UI/UX Designer", skills: ["Figma", "User Research", "Prototyping"] },

    // Team Nova (1)
    { name: "Rohan Nair", dept: "Computer Science", year: "4th Year", role: "Team Lead & AI/ML", skills: ["Python", "FastAPI", "LangChain"] },
    { name: "Tanvi Saxena", dept: "Electronics & Comm", year: "3rd Year", role: "Frontend Developer", skills: ["React", "Tailwind", "CSS"] },
    { name: "Aditya Hegde", dept: "Computer Science", year: "3rd Year", role: "Backend Developer", skills: ["PostgreSQL", "Docker", "REST API"] },
    { name: "Sneha Sen", dept: "Information Tech", year: "2nd Year", role: "Product Manager", skills: ["Roadmapping", "Product Analytics"] },

    // Team Orbit (2)
    { name: "Vikramaditya Rao", dept: "Computer Science", year: "4th Year", role: "Team Lead & Architect", skills: ["Cryptography", "Next.js", "System Design"] },
    { name: "Nandita Iyer", dept: "Information Tech", year: "3rd Year", role: "Frontend Developer", skills: ["TypeScript", "Tailwind CSS", "UI/UX"] },
    { name: "Kunal Bansal", dept: "Computer Science", year: "2nd Year", role: "Backend Developer", skills: ["Node.js", "Express", "Security"] },
    { name: "Shreya Joshi", dept: "Electronics & Comm", year: "3rd Year", role: "Research & QA", skills: ["Manual Testing", "API Testing", "Docs"] },

    // Team Pixel (3)
    { name: "Gautam Menon", dept: "AI & Data Science", year: "3rd Year", role: "Team Lead & Frontend", skills: ["Web Audio API", "D3.js", "Next.js"] },
    { name: "Rhea Chawla", dept: "Computer Science", year: "3rd Year", role: "UI/UX Designer", skills: ["Figma", "Accessibility Testing", "Design Systems"] },
    { name: "Farhan Zaidi", dept: "Computer Science", year: "2nd Year", role: "ML Engineer", skills: ["Python", "Whisper", "PyTorch"] },
    { name: "Divya Nambiar", dept: "Information Tech", year: "3rd Year", role: "Full-Stack Developer", skills: ["React", "Express", "Tailwind"] },

    // Team Nexus (4)
    { name: "Prateek Deshmukh", dept: "Mechanical Engg", year: "4th Year", role: "Team Lead & Hardware", skills: ["IoT", "Arduino", "Product Design"] },
    { name: "Ananya Deshpande", dept: "Computer Science", year: "3rd Year", role: "Frontend Developer", skills: ["Next.js", "Mobile Web", "Tailwind"] },
    { name: "Harshil Dave", dept: "Information Tech", year: "3rd Year", role: "Backend Developer", skills: ["Node.js", "Twilio API", "MongoDB"] },
    { name: "Isha Kapoor", dept: "AI & Data Science", year: "2nd Year", role: "Logistics & Testing", skills: ["Quality Assurance", "Field Testing"] },

    // Team Spark (5)
    { name: "Manish Kumar", dept: "Electrical Engg", year: "4th Year", role: "Team Lead & Tech", skills: ["Energy Systems", "Telemetry", "React"] },
    { name: "Pooja Hegde", dept: "Computer Science", year: "3rd Year", role: "Frontend Developer", skills: ["Chart.js", "Tailwind CSS", "TypeScript"] },
    { name: "Nitin Sharma", dept: "Computer Science", year: "3rd Year", role: "Backend Developer", skills: ["TimescaleDB", "Node.js", "MQTT"] },
    { name: "Tara Ghosh", dept: "Information Tech", year: "2nd Year", role: "UI/UX & Marketing", skills: ["Figma", "Pitch Decks", "User Feedback"] },

    // Team Flux (6)
    { name: "Dhruv Kapoor", dept: "Computer Science", year: "3rd Year", role: "Team Lead & Frontend", skills: ["Next.js", "WebCrypto", "Tailwind CSS"] },
    { name: "Simran Kaur", dept: "AI & Data Science", year: "3rd Year", role: "Product & Researcher", skills: ["User Interviews", "UX Copy", "Psychometrics"] },
    { name: "Yash Mehta", dept: "Information Tech", year: "2nd Year", role: "Backend Developer", skills: ["Node.js", "Fastify", "MongoDB"] },
    { name: "Zoya Merchant", dept: "Electronics & Comm", year: "3rd Year", role: "UI Designer", skills: ["Design Systems", "Prototyping"] },

    // Team Vertex (7)
    { name: "Karthik Raja", dept: "Computer Science", year: "4th Year", role: "Team Lead & Full-Stack", skills: ["Monaco Editor", "Next.js", "Docker"] },
    { name: "Deepika Pillai", dept: "Computer Science", year: "3rd Year", role: "Frontend Developer", skills: ["TypeScript", "Tailwind CSS", "React"] },
    { name: "Varun Shenoy", dept: "Information Tech", year: "3rd Year", role: "Backend Developer", skills: ["Go", "Node.js", "Linux Sandbox"] },
    { name: "Bhavya Trivedi", dept: "AI & Data Science", year: "2nd Year", role: "Product & QA", skills: ["User Testing", "Automated Testing"] },

    // Team Pulse (8)
    { name: "Rishabh Bhatt", dept: "Computer Science", year: "3rd Year", role: "Team Lead & Mobile", skills: ["React Native Web", "Geolocation", "Leaflet"] },
    { name: "Kavya Sundaram", dept: "Electronics & Comm", year: "2nd Year", role: "UI/UX Designer", skills: ["Figma", "Interface Design"] },
    { name: "Ayush Saxena", dept: "Information Tech", year: "3rd Year", role: "Backend Developer", skills: ["Node.js", "PostGIS", "WebSockets"] },
    { name: "Sanjana Reddy", dept: "Computer Science", year: "2nd Year", role: "Data Analyst", skills: ["Python", "Data Cleansing"] },

    // Team Forge (9)
    { name: "Akash Chopra", dept: "Computer Science", year: "4th Year", role: "Team Lead & Systems", skills: ["WebRTC", "Yjs", "TypeScript"] },
    { name: "Ritika Sen", dept: "Information Tech", year: "3rd Year", role: "Frontend Developer", skills: ["Next.js", "Tailwind CSS", "Monaco"] },
    { name: "Sameer Alam", dept: "Computer Science", year: "3rd Year", role: "Backend Developer", skills: ["Node.js", "WebSocket Servers"] },
    { name: "Natasha Roy", dept: "AI & Data Science", year: "2nd Year", role: "UI/UX & Documentation", skills: ["Figma", "Technical Writing"] },
  ];

  // Insert teams and participants
  const teamDocs = [];
  const createdParticipantIds = [];
  const createdUserIds = [];

  // Seed participants and teams in pairs
  for (let tIdx = 0; tIdx < teamTemplates.length; tIdx++) {
    const t = teamTemplates[tIdx];
    const teamProblemId = problemIds[t.problemIndex];
    const teamMentorId = mentorIds[t.mentorIndex];

    const teamId = new mongoose.Types.ObjectId();
    const teamMembers = [];

    // Slice 4 participants per team
    const sliceStart = tIdx * 4;
    const teamParticipants = participantNames.slice(sliceStart, sliceStart + 4);

    for (let pIdx = 0; pIdx < teamParticipants.length; pIdx++) {
      const p = teamParticipants[pIdx];
      const isLead = pIdx === 0;
      const participantId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const email = `${p.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@student.college.edu`;

      // Create User record
      const userDoc = {
        _id: userId,
        name: p.name,
        email: email,
        role: "PARTICIPANT",
        participantId: participantId,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}&backgroundColor=5e56e7&textColor=ffffff`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection("users").insertOne(userDoc);
      createdUserIds.push(userId);

      // Create Participant record
      const participantDoc = {
        _id: participantId,
        user: userId,
        name: p.name,
        email: email,
        department: p.dept,
        year: p.year,
        team: teamId,
        roleInTeam: p.role,
        skills: p.skills,
        contributionScore: 78 + Math.floor(Math.random() * 20),
        attendance: "Present",
        status: "ACTIVE",
        avatar: userDoc.avatar,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection("participants").insertOne(participantDoc);
      createdParticipantIds.push(participantId);

      teamMembers.push({
        participant: participantId,
        name: p.name,
        email: email,
        role: p.role,
        isLeader: isLead,
      });
    }

    teamDocs.push({
      _id: teamId,
      name: t.name,
      code: t.code,
      problemStatement: teamProblemId,
      mentor: teamMentorId,
      members: teamMembers,
      currentPhase: t.phase,
      progress: t.progress,
      status: t.status,
      solutionTitle: t.solutionTitle,
      solutionDescription: t.solutionDescription,
      targetUsers: t.targetUsers,
      coreFeatures: t.coreFeatures,
      uniqueValue: t.uniqueValue,
      techStack: t.techStack,
      demoUrl: t.demoUrl,
      githubUrl: t.githubUrl,
      presentationUrl: t.presentationUrl,
      lastActivityAt: t.lastActivityAt,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });

    // Update mentor's assigned teams
    await db.collection("mentors").updateOne(
      { _id: teamMentorId },
      { $addToSet: { assignedTeams: teamId } }
    );
  }

  await db.collection("teams").insertMany(teamDocs);
  console.log(`Seeded ${teamDocs.length} teams and ${createdParticipantIds.length} participants.`);

  // Insert Admin users into Users collection
  await db.collection("users").insertMany(users);
  console.log(`Seeded administrative and mentor users.`);

  // 7. SCHEDULE (Day 1 - Day 6)
  const scheduleEvents = [
    // Day 1
    {
      title: "Bootcamp Grand Opening & Keynote",
      description: "Welcome address by Dean, keynote on zero-to-one product shipping by industry leaders.",
      phase: "Problem Understanding",
      day: 1,
      startTime: "04:30 PM",
      endTime: "04:40 PM",
      location: "Main Auditorium",
      type: "Keynote",
      isCompleted: true,
    },
    {
      title: "Problem Statements Deep-Dive & Allocation",
      description: "Briefing on the 8 live challenges, user context, constraint guidelines, and domain expert Q&A.",
      phase: "Problem Understanding",
      day: 1,
      startTime: "04:40 PM",
      endTime: "05:00 PM",
      location: "Main Auditorium",
      type: "Workshop",
      isCompleted: true,
    },
    {
      title: "Team Formation & Role Calibration",
      description: "Finalize multidisciplinary rosters, designate Team Leads, and confirm mentor allocations.",
      phase: "Problem Understanding",
      day: 1,
      startTime: "05:00 PM",
      endTime: "05:20 PM",
      location: "Innovation Hub Floor 2",
      type: "Milestone",
      isCompleted: true,
    },
    {
      title: "Intensive Ideation & User Persona Mapping",
      description: "Teams brainstorm value propositions, user pain-points, and technical feasibility.",
      phase: "Ideation",
      day: 1,
      startTime: "05:20 PM",
      endTime: "06:00 PM",
      location: "Team Pods (Rooms 201-210)",
      type: "Workshop",
      isCompleted: false,
    },
    {
      title: "Ideation PPT & Solution Proposal Submission",
      description: "Mandatory upload of 5-slide ideation deck and system architecture concept.",
      phase: "Ideation",
      day: 1,
      startTime: "06:00 PM",
      endTime: "06:30 PM",
      location: "Build26 Admin Portal",
      type: "Submission",
      isCompleted: false,
    },
    {
      title: "Day 1 Stand-down & Daily Work Log Review",
      description: "Admin check-in on submission compliance and day-1 wrap-up briefing.",
      phase: "Ideation",
      day: 1,
      startTime: "06:30 PM",
      endTime: "06:45 PM",
      location: "Online / Innovation Hub",
      type: "Milestone",
      isCompleted: false,
    },
    // Day 2
    {
      title: "Day 2 Kickoff & Mentor Feedback Sprint",
      description: "One-on-one mentor critique on Day 1 ideation decks and architectural pivot recommendations.",
      phase: "Validation",
      day: 2,
      startTime: "04:30 PM",
      endTime: "05:30 PM",
      location: "Mentor Roundtables",
      type: "Review",
      isCompleted: false,
    },
    {
      title: "API Design & Schema Definition Workshop",
      description: "Hands-on session: crafting clean REST route handlers and MongoDB schema models.",
      phase: "Validation",
      day: 2,
      startTime: "05:30 PM",
      endTime: "06:30 PM",
      location: "Lab 301 & Live Stream",
      type: "Workshop",
      isCompleted: false,
    },
    // Day 3
    {
      title: "Sprint 1: Core Engine & Database Integration",
      description: "Active coding sprint: backend endpoints, database persistence, and auth flows.",
      phase: "Build",
      day: 3,
      startTime: "04:30 PM",
      endTime: "07:00 PM",
      location: "Team Pods",
      type: "Milestone",
      isCompleted: false,
    },
    // Day 4
    {
      title: "Sprint 2: Frontend Aesthetics & User Experience",
      description: "Polish UI micro-interactions, responsive states, and connect real API data.",
      phase: "Build",
      day: 4,
      startTime: "04:30 PM",
      endTime: "07:00 PM",
      location: "Team Pods",
      type: "Milestone",
      isCompleted: false,
    },
    // Day 5
    {
      title: "Working Prototype Submission & Stress Testing",
      description: "Deploy working live URL, submit test results, and conduct edge-case verification.",
      phase: "Testing",
      day: 5,
      startTime: "05:00 PM",
      endTime: "06:30 PM",
      location: "Build26 Admin Portal",
      type: "Submission",
      isCompleted: false,
    },
    // Day 6
    {
      title: "Build26 Grand Finale & Product Showcase",
      description: "Live 5-minute pitches to venture capitalists, tech executives, and college leadership.",
      phase: "Final Demo",
      day: 6,
      startTime: "03:00 PM",
      endTime: "06:30 PM",
      location: "Central Convention Auditorium",
      type: "Milestone",
      isCompleted: false,
    },
  ];

  await db.collection("scheduleevents").insertMany(scheduleEvents);
  console.log(`Seeded ${scheduleEvents.length} schedule events.`);

  // 8. WORK LOGS
  const workLogs = [
    {
      participant: createdParticipantIds[0], // Thiganth
      participantName: "Thiganth K.",
      team: teamDocs[0]._id,
      teamName: "Team Alpha",
      date: new Date(),
      role: "Frontend Developer",
      workDone: "Engineered core dashboard shell, persistent admin sidebar navigation, and hooked JWT cookie authentication context.",
      completedTasks: "Designed 3D canvas viewport container; integrated Leaflet/Three.js responsive layout.",
      nextSteps: "Connect live campus beacon WebSocket endpoints and test turn-by-turn routing steps.",
      blockers: "Waiting on room 301 beacon calibration map coordinates from facility admin.",
      timeSpentHours: 3.5,
      evidenceUrl: "https://github.com/build26/team-alpha-navicampus/commit/a8f9c12",
      status: "Completed",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      participant: createdParticipantIds[1], // Siddharth
      participantName: "Siddharth Verma",
      team: teamDocs[0]._id,
      teamName: "Team Alpha",
      date: new Date(),
      role: "Frontend Developer",
      workDone: "Prototyped Three.js indoor level switcher and created custom vector SVG map pins for campus facilities.",
      completedTasks: "Level 1, 2, and 3 3D mesh rendering with camera orbit controls.",
      nextSteps: "Link search bar query to node coordinates.",
      blockers: "None",
      timeSpentHours: 3,
      evidenceUrl: "https://github.com/build26/team-alpha-navicampus/commit/c4b8e21",
      status: "Completed",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      participant: createdParticipantIds[12], // Gautam Menon (Pixel)
      participantName: "Gautam Menon",
      team: teamDocs[3]._id,
      teamName: "Team Pixel",
      date: new Date(),
      role: "Team Lead & Frontend",
      workDone: "Built Web Audio API microphone stream capture pipeline and real-time concept frequency spectrum visualizer.",
      completedTasks: "Connected Web Audio AnalyserNode to SVG graph canvas.",
      nextSteps: "Test speech transcription latency on low-end laptops.",
      blockers: "Browser permissions on Safari require user gesture trigger.",
      timeSpentHours: 4,
      evidenceUrl: "https://github.com/build26/team-pixel-auralearn/commit/9e110ac",
      status: "Completed",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      participant: createdParticipantIds[16], // Prateek (Nexus)
      participantName: "Prateek Deshmukh",
      team: teamDocs[4]._id,
      teamName: "Team Nexus",
      date: new Date(),
      role: "Team Lead & Hardware",
      workDone: "Calibrated HX711 load cell amplifier with Arduino to weigh leftover food trays in hostel mess kitchen.",
      completedTasks: "MQTT publish script sending grams to server every 10 seconds.",
      nextSteps: "Connect automated WhatsApp / Twilio emergency surplus dispatcher.",
      blockers: "Hostel WiFi drops sporadically in the kitchen basement.",
      timeSpentHours: 3,
      evidenceUrl: "https://github.com/build26/team-nexus-messbridge/commit/d22910f",
      status: "In Progress",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      participant: createdParticipantIds[28], // Karthik Raja (Vertex)
      participantName: "Karthik Raja",
      team: teamDocs[7]._id,
      teamName: "Team Vertex",
      date: new Date(),
      role: "Team Lead & Full-Stack",
      workDone: "Configured Monaco Editor split-pane diff viewer and integrated syntax tokenizers for Python and TypeScript.",
      completedTasks: "Side-by-side line diff review with expandable line comment drawers.",
      nextSteps: "Implement peer evaluation score submission modal.",
      blockers: "None",
      timeSpentHours: 4.5,
      evidenceUrl: "https://github.com/build26/team-vertex-critiquehub/commit/ff901a1",
      status: "Completed",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  await db.collection("worklogs").insertMany(workLogs);
  console.log(`Seeded ${workLogs.length} initial work logs.`);

  // 9. KANBAN TASKS
  const tasks = [
    // Team Alpha Tasks
    {
      team: teamDocs[0]._id,
      title: "Three.js campus 3D mesh optimization",
      description: "Compress GLTF model to under 4MB for instant mobile network loading.",
      assigneeName: "Siddharth Verma",
      assigneeRole: "Frontend Developer",
      priority: "High",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      column: "IN_PROGRESS",
      evidenceUrl: "https://github.com/build26/team-alpha",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[0]._id,
      title: "Implement Dijkstra shortest path algorithm",
      description: "Compute fastest wheelchair-accessible corridors between Academic Block A and Library.",
      assigneeName: "Aarushi Patel",
      assigneeRole: "Backend Developer",
      priority: "Critical",
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
      column: "TODO",
      evidenceUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[0]._id,
      title: "Ideation Presentation Deck (5 Slides)",
      description: "Prepare problem statement breakdown, target personas, and architecture diagrams.",
      assigneeName: "Thiganth K.",
      assigneeRole: "Team Lead",
      priority: "High",
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
      column: "DONE",
      evidenceUrl: "https://pitch.build26.org/alpha",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[0]._id,
      title: "Figma mobile UI mockup & user testing",
      description: "Test high contrast mode with 5 campus students.",
      assigneeName: "Meera Krishnan",
      assigneeRole: "UI/UX Designer",
      priority: "Medium",
      deadline: new Date(Date.now() + 18 * 60 * 60 * 1000),
      column: "REVIEW",
      evidenceUrl: "https://figma.com/file/build26-alpha",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Team Nova Tasks
    {
      team: teamDocs[1]._id,
      title: "Submit Ideation PPT Deck",
      description: "Overdue submission for Day 1 ideation milestone.",
      assigneeName: "Rohan Nair",
      assigneeRole: "Team Lead",
      priority: "Critical",
      deadline: new Date(Date.now() - 1 * 60 * 60 * 1000), // Overdue
      column: "TODO",
      evidenceUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Team Pixel Tasks
    {
      team: teamDocs[3]._id,
      title: "Speech recognition latency benchmark",
      description: "Measure local browser Whisper latency under varying background classroom noise.",
      assigneeName: "Farhan Zaidi",
      assigneeRole: "ML Engineer",
      priority: "High",
      deadline: new Date(Date.now() + 20 * 60 * 60 * 1000),
      column: "IN_PROGRESS",
      evidenceUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection("tasks").insertMany(tasks);
  console.log(`Seeded ${tasks.length} kanban tasks.`);

  // 10. SUBMISSIONS
  const submissions = [
    {
      team: teamDocs[0]._id,
      teamName: "Team Alpha",
      submittedByName: "Thiganth K.",
      phase: "Ideation",
      title: "NaviCampus 3D — System Concept & Architecture Deck",
      type: "Ideation PPT",
      fileUrl: "https://build26-assets.s3.amazonaws.com/submissions/team-alpha-ideation.pdf",
      externalLink: "https://pitch.build26.org/alpha",
      status: "Approved",
      reviewNotes: "Brilliant spatial mapping proposal. The focus on low-bandwidth WebGL rendering and wheelchair accessibility is practical and well-scoped.",
      scores: {
        problemUnderstanding: 10,
        innovation: 9,
        feasibility: 9,
        technicalApproach: 10,
        userImpact: 10,
      },
      totalScore: 48,
      reviewedByName: "Dr. Kumar Sundaram",
      reviewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[3]._id,
      teamName: "Team Pixel",
      submittedByName: "Gautam Menon",
      phase: "Ideation",
      title: "AuraLearn — Real-time Lecture Concept Visualizer",
      type: "Ideation PPT",
      fileUrl: "https://build26-assets.s3.amazonaws.com/submissions/team-pixel-ideation.pdf",
      externalLink: "https://pitch.build26.org/pixel",
      status: "Pending Review",
      reviewNotes: "Under mentor evaluation queue.",
      scores: {
        problemUnderstanding: 9,
        innovation: 10,
        feasibility: 8,
        technicalApproach: 9,
        userImpact: 9,
      },
      totalScore: 45,
      reviewedByName: "",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[7]._id,
      teamName: "Team Vertex",
      submittedByName: "Karthik Raja",
      phase: "Ideation",
      title: "CritiqueHub — Asynchronous Peer Review Arena",
      type: "Ideation PPT",
      fileUrl: "https://build26-assets.s3.amazonaws.com/submissions/team-vertex-ideation.pdf",
      externalLink: "https://pitch.build26.org/vertex",
      status: "Approved",
      reviewNotes: "Clear architecture, solid containerization strategy for student code isolation.",
      scores: {
        problemUnderstanding: 9,
        innovation: 9,
        feasibility: 9,
        technicalApproach: 9,
        userImpact: 8,
      },
      totalScore: 44,
      reviewedByName: "Rajesh Pillai",
      reviewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[2]._id,
      teamName: "Team Orbit",
      submittedByName: "Vikramaditya Rao",
      phase: "Ideation",
      title: "VeriGrad Ledger — Verifiable Credential Protocol",
      type: "Ideation PPT",
      fileUrl: "https://build26-assets.s3.amazonaws.com/submissions/team-orbit-ideation.pdf",
      externalLink: "https://pitch.build26.org/orbit",
      status: "Changes Requested",
      reviewNotes: "The cryptographic verification model is sound, but user onboarding for university registrars needs simplification. Resubmit with UI wireframes.",
      scores: {
        problemUnderstanding: 8,
        innovation: 9,
        feasibility: 7,
        technicalApproach: 9,
        userImpact: 7,
      },
      totalScore: 40,
      reviewedByName: "Priya Sharma",
      reviewedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  await db.collection("submissions").insertMany(submissions);
  console.log(`Seeded ${submissions.length} submissions.`);

  // 11. MENTOR FEEDBACK
  const feedbacks = [
    {
      team: teamDocs[0]._id,
      teamName: "Team Alpha",
      mentor: mentorIds[0],
      mentorName: "Dr. Kumar Sundaram",
      phase: "Ideation",
      rating: 5,
      strengths: "Exceptionally sharp problem framing. The 3D campus routing concept with wheelchair-accessible constraints has tremendous social and functional utility.",
      areasOfImprovement: "Ensure the Three.js canvas falls back smoothly to lightweight 2D SVG canvas on low-tier mobile devices.",
      generalFeedback: "Outstanding kickoff. Keep up the high engineering velocity!",
      actionItems: [
        "Benchmark WebGL RAM consumption on iOS Safari",
        "Calibrate beacon coordinates with campus facility blueprints",
        "Prepare responsive pinch-to-zoom controls",
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[3]._id,
      teamName: "Team Pixel",
      mentor: mentorIds[3],
      mentorName: "Ananya Roy",
      phase: "Ideation",
      rating: 4,
      strengths: "The real-time concept visualizer is deeply empathetic. The accessibility considerations are commendable.",
      areasOfImprovement: "Ensure high contrast and dyslexic-friendly font toggles are enabled by default in settings.",
      generalFeedback: "Very promising concept. Focus on keeping the diagram uncluttered during fast lecture delivery.",
      actionItems: [
        "Add font size adjuster slider",
        "Create color-blind friendly node palette",
        "Add one-click audio bookmarking",
      ],
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  await db.collection("feedbacks").insertMany(feedbacks);
  console.log(`Seeded ${feedbacks.length} mentor feedback items.`);

  // 12. ANNOUNCEMENTS
  const announcements = [
    {
      title: "Day 1 Ideation PPT Milestone Deadline — 6:00 PM Sharp",
      message: "All teams must upload their 5-slide Ideation Deck and Architecture Overview before 6:00 PM today. Mentors will conduct 1-on-1 feedback reviews starting at 6:15 PM.",
      audience: "All Teams",
      priority: "Urgent",
      author: "Build26 Operations Command",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Mentor Office Hours Calibration in Innovation Hub",
      message: "Dr. Kumar Sundaram, Arvind Swaminathan, and Priya Sharma are stationed at Mentor Pods 1-3. Teams can walk in for 10-minute technical design reviews.",
      audience: "Everyone",
      priority: "Normal",
      author: "Chief Mentor Liaison",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "API Sandboxes & High-Speed WiFi Credentials",
      message: "Dedicated 1Gbps low-latency SSID 'BUILD26-ENGINEERS' is now live in Labs 301-305. Check your team dashboard for individual sandbox credentials.",
      audience: "Participants",
      priority: "High",
      author: "Campus Infrastructure Team",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection("announcements").insertMany(announcements);
  console.log(`Seeded ${announcements.length} announcements.`);

  // 13. NOTIFICATIONS
  const notifications = [
    {
      recipientRole: "PARTICIPANT",
      type: "DEADLINE",
      title: "Ideation Deck Due Soon",
      message: "Team Alpha's Ideation PPT is due in 02h 14m. Upload your slides now.",
      link: "/participant/submissions",
      read: false,
      createdAt: new Date(),
    },
    {
      recipientRole: "PARTICIPANT",
      type: "FEEDBACK",
      title: "New Mentor Feedback Received",
      message: "Dr. Kumar Sundaram left detailed feedback on your architecture proposal.",
      link: "/participant/feedback",
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      recipientRole: "ADMIN",
      type: "SUBMISSION",
      title: "New Submission Pending Review",
      message: "Team Pixel uploaded their Ideation PPT for review.",
      link: "/admin/submissions",
      read: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    },
  ];

  await db.collection("notifications").insertMany(notifications);
  console.log(`Seeded notifications.`);

  // 14. EVALUATIONS (Showcase Ready)
  const evaluations = [
    {
      team: teamDocs[0]._id,
      teamName: "Team Alpha",
      round: "Day 1 Ideation Review",
      criteriaScores: [
        { criteriaName: "Problem Understanding", weightPercent: 20, score: 9.8 },
        { criteriaName: "Innovation", weightPercent: 20, score: 9.2 },
        { criteriaName: "Solution Quality & Feasibility", weightPercent: 20, score: 9.5 },
        { criteriaName: "Technical Implementation", weightPercent: 20, score: 9.6 },
        { criteriaName: "Presentation", weightPercent: 10, score: 9.0 },
        { criteriaName: "Team Collaboration", weightPercent: 10, score: 9.5 },
      ],
      totalWeightedScore: 94.6,
      reviewerNotes: "Exceptional presentation and concrete working prototype plan. Highest ranked team in Day 1 round.",
      status: "Published",
      evaluatedByName: "Jury Panel (Dr. Kumar & Priya Sharma)",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[3]._id,
      teamName: "Team Pixel",
      round: "Day 1 Ideation Review",
      criteriaScores: [
        { criteriaName: "Problem Understanding", weightPercent: 20, score: 9.5 },
        { criteriaName: "Innovation", weightPercent: 20, score: 9.7 },
        { criteriaName: "Solution Quality & Feasibility", weightPercent: 20, score: 8.8 },
        { criteriaName: "Technical Implementation", weightPercent: 20, score: 8.9 },
        { criteriaName: "Presentation", weightPercent: 10, score: 9.4 },
        { criteriaName: "Team Collaboration", weightPercent: 10, score: 9.0 },
      ],
      totalWeightedScore: 92.1,
      reviewerNotes: "Strong human-centric design. Neurodiversity tools need this level of deep care.",
      status: "Published",
      evaluatedByName: "Jury Panel",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      team: teamDocs[7]._id,
      teamName: "Team Vertex",
      round: "Day 1 Ideation Review",
      criteriaScores: [
        { criteriaName: "Problem Understanding", weightPercent: 20, score: 8.9 },
        { criteriaName: "Innovation", weightPercent: 20, score: 8.8 },
        { criteriaName: "Solution Quality & Feasibility", weightPercent: 20, score: 9.2 },
        { criteriaName: "Technical Implementation", weightPercent: 20, score: 9.4 },
        { criteriaName: "Presentation", weightPercent: 10, score: 8.5 },
        { criteriaName: "Team Collaboration", weightPercent: 10, score: 9.0 },
      ],
      totalWeightedScore: 90.0,
      reviewerNotes: "Engineered like a true developer tool. Great use of Monaco editor.",
      status: "Published",
      evaluatedByName: "Jury Panel",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection("evaluations").insertMany(evaluations);
  console.log(`Seeded ${evaluations.length} team evaluations.`);

  // 15. ACTIVITY FEED
  const activities = [
    {
      type: "SUBMISSION_CREATED",
      title: "Team Alpha submitted their Ideation PPT",
      description: "Deck uploaded with system architecture and 3D mockups.",
      teamId: teamDocs[0]._id,
      teamName: "Team Alpha",
      participantName: "Thiganth K.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Thiganth%20K.&backgroundColor=5e56e7&textColor=ffffff",
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15m ago
    },
    {
      type: "WORKLOG_CREATED",
      title: "Team Pixel updated their daily work log",
      description: "Gautam Menon logged 4.0 hours on Web Audio stream capture.",
      teamId: teamDocs[3]._id,
      teamName: "Team Pixel",
      participantName: "Gautam Menon",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Gautam%20Menon&backgroundColor=5e56e7&textColor=ffffff",
      createdAt: new Date(Date.now() - 32 * 60 * 1000), // 32m ago
    },
    {
      type: "FEEDBACK_ADDED",
      title: "Team Alpha received mentor feedback",
      description: "Dr. Kumar Sundaram reviewed spatial mapping architecture and awarded 5/5 stars.",
      teamId: teamDocs[0]._id,
      teamName: "Team Alpha",
      participantName: "Dr. Kumar Sundaram",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(Date.now() - 58 * 60 * 1000), // 58m ago
    },
    {
      type: "TASK_UPDATED",
      title: "Team Vertex completed Monaco diff viewer integration",
      description: "Karthik Raja moved task to Review column.",
      teamId: teamDocs[7]._id,
      teamName: "Team Vertex",
      participantName: "Karthik Raja",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Karthik%20Raja&backgroundColor=5e56e7&textColor=ffffff",
      createdAt: new Date(Date.now() - 105 * 60 * 1000), // 1h 45m ago
    },
    {
      type: "ANNOUNCEMENT_PUBLISHED",
      title: "Urgent milestone alert broadcasted",
      description: "Day 1 Ideation PPT Milestone Deadline set to 6:00 PM.",
      participantName: "Operations Command",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(Date.now() - 130 * 60 * 1000),
    },
    {
      type: "PARTICIPANT_JOINED",
      title: "Aarushi Patel joined Team Alpha",
      description: "Assigned as Backend Developer & Data Engineer.",
      teamId: teamDocs[0]._id,
      teamName: "Team Alpha",
      participantName: "Aarushi Patel",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Aarushi%20Patel&backgroundColor=5e56e7&textColor=ffffff",
      createdAt: new Date(Date.now() - 180 * 60 * 1000),
    },
  ];

  await db.collection("activities").insertMany(activities);
  console.log(`Seeded ${activities.length} activity feed entries.`);

  console.log("==========================================");
  console.log("BUILD26 DATABASE SEEDED SUCCESSFULLY!");
  console.log("Bootcamp: BUILD26 2026 (Live — Day 1: Ideation)");
  console.log(`Teams: ${teamDocs.length} teams`);
  console.log(`Participants: ${createdParticipantIds.length} participants`);
  console.log(`Mentors: ${mentorIds.length} mentors`);
  console.log(`Problems: ${problemIds.length} challenge statements`);
  console.log("==========================================");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
