"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  ArrowRight,
  Play,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Code2,
  Users,
  Target,
  Trophy,
  Check,
  GraduationCap,
  Heart,
  Sparkles,
  Laptop,
  Award,
} from "lucide-react";

const sprintStages = [
  {
    day: "DAY 01",
    dayNum: "01",
    title: "TEAM + IDEATION",
    shortTitle: "IDEATION",
    subtitle: "Squad Formation & Solution Pitch Deck",
    desc: "Form your squad (3-4 members), allocate engineering roles, claim your problem statement, and upload your Solution Ideation PPT with 100% team consensus.",
    deliverable: "Solution PPT (.pptx / PDF)",
    badge: "Consensus Gate",
    badgeBg: "#DADBFF",
    badgeColor: "#312E81",
    accentBg: "#6366F1",
    lootIcon: "📦",
    image: "/roadmap/day1-ideation.jpg",
    milestones: [
      "Squad Roster Locked (3-4 Devs)",
      "Problem Statement Claimed",
      "Ideation Slide Deck Uploaded",
    ],
  },
  {
    day: "DAY 02",
    dayNum: "02",
    title: "WIREFRAME & UX",
    shortTitle: "WIREFRAME",
    subtitle: "User Flows & Interactive Figma Prototype",
    desc: "Map out end-to-end user journeys, structure application screens, construct interactive wireframes, and link team Figma design systems with interactive component states.",
    deliverable: "Wireframe PDF + Figma URL",
    badge: "UX Blueprint",
    badgeBg: "#E0F2FE",
    badgeColor: "#0369A1",
    accentBg: "#0284C7",
    lootIcon: "🎨",
    image: "/roadmap/day2-wireframe.jpg",
    milestones: [
      "End-to-End User Journeys",
      "High-Fidelity Figma Prototype",
      "Brutalist UI Component Specs",
    ],
  },
  {
    day: "DAY 03",
    dayNum: "03",
    title: "BUILD CORE MVP",
    shortTitle: "CORE MVP",
    subtitle: "Repository Setup & Foundation Architecture",
    desc: "Initialize team GitHub repository with hygiene standards, configure frontend & backend architectures, commit functioning boilerplate, and test local dev server.",
    deliverable: "Public GitHub Repository",
    badge: "Code Base",
    badgeBg: "#DCFCE7",
    badgeColor: "#15803D",
    accentBg: "#16A34A",
    lootIcon: "💻",
    image: "/roadmap/day3-mvp.jpg",
    milestones: [
      "GitHub Repo Hygiene & Branching",
      "Next.js + Tailwind Boilerplate",
      "Working Localhost Dev Server",
    ],
  },
  {
    day: "DAY 04",
    dayNum: "04",
    title: "INTEGRATION & DB",
    shortTitle: "DATABASE",
    subtitle: "Schemas, Migrations & REST/tRPC APIs",
    desc: "Persist database models, connect client interfaces to REST APIs, seed realistic mock collections, and validate end-to-end authentication and secure state management.",
    deliverable: "DB & API Proof Evidence",
    badge: "Full Stack",
    badgeBg: "#FEF3C7",
    badgeColor: "#B45309",
    accentBg: "#D97706",
    lootIcon: "🗄️",
    image: "/roadmap/day4-database.svg",
    milestones: [
      "PostgreSQL/Prisma Schema Seeded",
      "Authenticated API Endpoints",
      "CRUD Operations Verified",
    ],
  },
  {
    day: "DAY 05",
    dayNum: "05",
    title: "TEST & POLISH",
    shortTitle: "QA & POLISH",
    subtitle: "Stress Testing, Responsiveness & Bug Squashing",
    desc: "Conduct cross-browser QA, eliminate console errors, optimize mobile responsiveness, stress-test database queries, and rehearse the product walkthrough demo.",
    deliverable: "QA Stress-Test Audit",
    badge: "Stability",
    badgeBg: "#FCE7F3",
    badgeColor: "#BE185D",
    accentBg: "#DB2777",
    lootIcon: "🧪",
    image: "/roadmap/day5-testing.svg",
    milestones: [
      "Zero Console Warnings/Errors",
      "Mobile Responsive View Audit",
      "2-Minute Pitch Dry Run",
    ],
  },
  {
    day: "DAY 06",
    dayNum: "06",
    title: "FINAL DEMO & SHIP",
    shortTitle: "SHIP IT",
    subtitle: "Production Vercel Deployment & Jury Pitch",
    desc: "Deploy live working production build to Vercel/AWS, publish executive deck, verify submission checkpoints, and deliver the final pitch showcase to the jury.",
    deliverable: "Live URL + Pitch Deck",
    badge: "Ship It 🚀",
    badgeBg: "#00D285",
    badgeColor: "#000000",
    accentBg: "#00D285",
    lootIcon: "🏆",
    image: "/roadmap/day6-ship.svg",
    milestones: [
      "Production Vercel/AWS URL Live",
      "Executive Final Slide Deck",
      "Grand Jury Pitch Showcase",
    ],
  },
];

export default function HomePage() {
  const [session, setSession] = React.useState<any>(null);
  const [activeNav, setActiveNav] = React.useState("hero");
  const [hoveredRoadmapIndex, setHoveredRoadmapIndex] = React.useState<number | null>(null);

  // Smooth scroll click handler for homepage navbar sections
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    setActiveNav(targetId);
    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Scrollspy: automatically highlight the active section in navbar as user scrolls
  React.useEffect(() => {
    const sections = ["hero", "how-it-works", "sprint-roadmap", "credits"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveNav(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setSession(d);
      })
      .catch(() => {});
  }, []);

  const isAuthenticated = Boolean(session?.user);

  // =========================================================
  // RETRO TORCHLIGHT SPOTLIGHT ANIMATION LOGIC
  // =========================================================
  const [torchActive, setTorchActive] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const torchCutoutRef = React.useRef<SVGGElement | null>(null);
  const torchRingRef = React.useRef<SVGGElement | null>(null);

  const targetPosRef = React.useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const currentPosRef = React.useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animFrameRef = React.useRef<number | null>(null);
  const hoveredCardRef = React.useRef<number | null>(null);

  // 60FPS+ fluid lerp loop with organic damping
  React.useEffect(() => {
    const animate = () => {
      const target = targetPosRef.current;
      const current = currentPosRef.current;

      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      const roundedX = Math.round(current.x * 10) / 10;
      const roundedY = Math.round(current.y * 10) / 10;

      if (torchCutoutRef.current) {
        torchCutoutRef.current.setAttribute("transform", `translate(${roundedX}, ${roundedY})`);
      }
      if (torchRingRef.current) {
        torchRingRef.current.setAttribute("transform", `translate(${roundedX}, ${roundedY})`);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Sync coordinates on scroll if torch is active
  React.useEffect(() => {
    const handleScroll = () => {
      if (!torchActive || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.bottom < 40 || rect.top > window.innerHeight - 40) {
        setTorchActive(false);
        hoveredCardRef.current = null;
      } else if (hoveredCardRef.current !== null) {
        const cardEl = cardRefs.current[hoveredCardRef.current];
        if (cardEl) {
          const cardRect = cardEl.getBoundingClientRect();
          targetPosRef.current = {
            x: cardRect.left + cardRect.width / 2,
            y: cardRect.top + cardRect.height / 2,
          };
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [torchActive]);

  const userToggledOffRef = React.useRef(false);

  const toggleTorch = React.useCallback(() => {
    setTorchActive((prev) => {
      const next = !prev;
      userToggledOffRef.current = !next;
      if (next) {
        // Position spotlight nicely at card 0 or center if offscreen
        if (targetPosRef.current.x < -500) {
          const card0 = cardRefs.current[0];
          if (card0) {
            const rect = card0.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            currentPosRef.current = { x: cx, y: cy };
            targetPosRef.current = { x: cx, y: cy };
          } else {
            currentPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            targetPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          }
        }
      }
      return next;
    });
  }, []);

  // Listen for 'T' or 't' key press to toggle torch on and off
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTorch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTorch]);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!torchActive && !userToggledOffRef.current) setTorchActive(true);

    if (hoveredCardRef.current !== null) {
      const cardEl = cardRefs.current[hoveredCardRef.current];
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        targetPosRef.current = {
          x: cardCenterX + (e.clientX - cardCenterX) * 0.12,
          y: cardCenterY + (e.clientY - cardCenterY) * 0.12,
        };
        return;
      }
    }

    targetPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleSectionMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!userToggledOffRef.current) setTorchActive(true);
    if (currentPosRef.current.x < -500) {
      currentPosRef.current = { x: e.clientX, y: e.clientY };
    }
    targetPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleSectionMouseLeave = () => {
    setTorchActive(false);
    hoveredCardRef.current = null;
    userToggledOffRef.current = false;
  };

  const handleCardMouseEnter = (index: number) => {
    hoveredCardRef.current = index;
    const cardEl = cardRefs.current[index];
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      targetPosRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  };

  const handleCardMouseLeave = () => {
    hoveredCardRef.current = null;
  };

  return (
    <div
      className="min-h-screen bg-[#FBFBFA] text-[#111111] flex flex-col justify-between selection:bg-[#A7F3D0] selection:text-[#064E3B] font-sans relative"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }}
    >
      {/* ========================================================= */}
      {/* 0. RETRO TORCHLIGHT SPOTLIGHT OVERLAY (Whole Viewport)    */}
      {/* ========================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-[60]"
        style={{
          opacity: torchActive ? 1 : 0,
          visibility: torchActive ? "visible" : "hidden",
          transition: "opacity 400ms ease-out, visibility 400ms ease-out",
        }}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Smooth feathered edge for authentic torch beam falloff */}
            <filter id="torch-feather" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
            </filter>

            {/* Mask: White reveals dark overlay, Black punches transparent hole */}
            <mask id="retro-torch-mask">
              {/* Full screen white base (everything dark) */}
              <rect width="100%" height="100%" fill="white" />

              {/* Torchlight Cutout: Square with smooth corners (rx=36) */}
              <g ref={torchCutoutRef}>
                <rect
                  x="-165"
                  y="-165"
                  width="330"
                  height="330"
                  rx="36"
                  ry="36"
                  fill="black"
                  filter="url(#torch-feather)"
                />
              </g>
            </mask>
          </defs>

          {/* Heavy Dark Veil covering whole viewport (including navbar) */}
          <rect
            width="100%"
            height="100%"
            fill="rgba(8, 9, 14, 0.94)"
            mask="url(#retro-torch-mask)"
          />

          {/* Retro Torchlight HUD Frame & Smooth Rounded Reticle */}
          <g ref={torchRingRef}>
            {/* Soft inner ambient highlight inside the beam */}
            <rect
              x="-165"
              y="-165"
              width="330"
              height="330"
              rx="36"
              ry="36"
              fill="rgba(0, 210, 133, 0.02)"
            />

            {/* Smooth-cornered square dashed outline */}
            <rect
              x="-165"
              y="-165"
              width="330"
              height="330"
              rx="36"
              ry="36"
              fill="none"
              stroke="#00D285"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeOpacity="0.45"
            />

            {/* 4 Retro Pixel Corner Brackets hugging the smooth corners */}
            {/* Top-Left */}
            <path
              d="M -165 -135 L -165 -155 Q -165 -165 -155 -165 L -135 -165"
              stroke="#00D285"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Top-Right */}
            <path
              d="M 135 -165 L 155 -165 Q 165 -165 165 -155 L 165 -135"
              stroke="#00D285"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Bottom-Right */}
            <path
              d="M 165 135 L 165 155 Q 165 165 155 165 L 135 165"
              stroke="#00D285"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Bottom-Left */}
            <path
              d="M -135 165 L -155 165 Q -165 165 -165 155 L -165 135"
              stroke="#00D285"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Retro Torch Status Indicator Tag (Centered, spacious box, zero overflow) */}
            <g transform="translate(0, -182)">
              <rect
                x="-78"
                y="0"
                width="156"
                height="22"
                rx="4"
                fill="#000000"
                stroke="#00D285"
                strokeWidth="1.8"
              />
              <circle cx="-60" cy="11" r="3" fill="#00D285" />
              <text
                x="-50"
                y="14.5"
                fill="#00D285"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                PRESS [T] TO OFF
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* 1. NAVBAR (White Background + BUILD//26 official logo)    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
        <div className="w-full px-3 sm:px-6 md:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Left: Brand Identity with official // logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "hero")}
            className="flex items-center gap-3 group select-none cursor-pointer"
          >
            {/* Square Badge with Smooth Corners & // Slashes */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 bg-black border-2 border-black rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-[2px_2px_0_0_#000] group-hover:scale-105 group-hover:shadow-none transition-all">
              <span className="font-sans font-black italic tracking-tighter text-lg sm:text-xl text-white select-none translate-x-[-1px]">
                //
              </span>
            </div>

            <div>
              <div className="font-minecraft text-xl sm:text-2xl font-black text-black tracking-tight leading-none flex items-center">
                <span>BUILD</span>
                <span className="text-[#4E56E8] italic font-sans font-black mx-0.5">//</span>
                <span>26</span>
              </div>
              <div className="font-minecraft text-[10px] sm:text-[11px] text-black tracking-wider mt-1 flex items-center gap-1">
                <span>6-DAY BOOTCAMP</span>
                <span className="font-sans font-bold text-black text-xs leading-none">|</span>
              </div>
            </div>
          </a>

          {/* Center Navigation Links: Home Page Sections with Smooth Scroll */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 font-minecraft text-xs font-bold tracking-wider select-none">
            {[
              { label: "HOME", targetId: "hero" },
              { label: "HOW IT WORKS", targetId: "how-it-works" },
              { label: "ROADMAP", targetId: "sprint-roadmap" },
              { label: "CREDITS", targetId: "credits" },
            ].map((item) => {
              const isActive = activeNav === item.targetId;
              return (
                <a
                  key={item.targetId}
                  href={`#${item.targetId}`}
                  onClick={(e) => handleNavClick(e, item.targetId)}
                  className={`relative py-1 transition-colors flex flex-col items-center cursor-pointer ${
                    isActive ? "text-black" : "text-[#555555] hover:text-black"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="w-full h-[3px] bg-[#00D285] mt-1.5 transition-all" />
                  ) : (
                    <span className="w-full h-[3px] bg-transparent mt-1.5 transition-all" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: User Icon & Green Action Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href={isAuthenticated ? "/participant/profile" : "/login"}
              className="p-1.5 text-black hover:opacity-75 transition-opacity"
              title={isAuthenticated ? session?.user?.name || "Profile" : "Sign In"}
            >
              <User className="h-6 w-6 stroke-[2.2]" />
            </Link>

            <Link href={isAuthenticated ? "/participant" : "/signup"}>
              <button
                type="button"
                className="h-10 px-4 sm:px-5 bg-[#00D285] hover:bg-[#00BF79] active:translate-x-0.5 active:translate-y-0.5 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none font-minecraft text-xs font-bold text-black tracking-wider transition-all flex items-center justify-center cursor-pointer select-none"
              >
                {isAuthenticated ? "WORKSPACE" : "JOIN QUEST"}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION (Fits window screen + Enriched Elements)  */}
      {/* ========================================================= */}
      <main id="hero" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex-1 flex flex-col justify-center pt-2 sm:pt-4 pb-6 lg:pb-8 min-h-[calc(100vh-5rem)] scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Typography & Action Buttons */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Retro Pixel Badge (Sharp black border, 3D offset shadow) */}
            <div className="-mt-8 sm:-mt-12 lg:-mt-14 mb-2 inline-flex items-center gap-2.5 px-4 py-2 bg-[#DADBFF] border-2 border-black shadow-[3px_3px_0_0_#000] font-minecraft text-xs sm:text-sm font-bold text-black uppercase tracking-wider select-none">
              <span className="w-2.5 h-2.5 bg-[#00D285] border border-black inline-block animate-pulse" />
              <span>6-DAY BOOTCAMP</span>
            </div>

            {/* Giant Title: BUILD// 26 & New Inspirational Quote */}
            <div className="space-y-2.5 sm:space-y-3">
              <h1 className="font-minecraft text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none uppercase flex items-center">
                <span>BUILD</span>
                <span className="text-[#4E56E8] italic font-sans font-black ml-1.5 mr-5 sm:mr-7 lg:mr-9">//</span>
                <span>26</span>
              </h1>

              <h2 className="font-minecraft text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black tracking-tight">
                Craft Code. Ship Reality.
              </h2>
            </div>

            {/* Explanatory Paragraph (Enlarged Size) */}
            <p className="text-lg sm:text-xl lg:text-2xl text-[#333333] leading-relaxed max-w-2xl font-sans font-normal">
              Join Build26, an intensive 6-day engineering bootcamp where students form teams, solve real-world problems, and build innovative solutions.
            </p>

            {/* Buttons Row (Enlarged Buttons & Text) */}
            <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-6">
              <Link href={isAuthenticated ? "/participant" : "/signup"}>
                <button
                  type="button"
                  className="h-16 sm:h-18 px-8 sm:px-10 bg-[#00D285] hover:bg-[#00BF79] active:translate-x-0.5 active:translate-y-0.5 rounded-2xl border-2 border-black shadow-[5px_5px_0_0_#000] active:shadow-none font-minecraft text-base sm:text-lg lg:text-xl font-bold text-black tracking-wider transition-all flex items-center gap-3.5 cursor-pointer select-none"
                >
                  <span>START QUEST</span>
                  <ArrowRight className="h-6 w-6 stroke-[3]" />
                </button>
              </Link>

              <a href="#how-it-works">
                <button
                  type="button"
                  className="h-16 sm:h-18 px-8 sm:px-10 bg-white hover:bg-[#F3F3F0] active:translate-x-0.5 active:translate-y-0.5 rounded-2xl border-2 border-black shadow-[5px_5px_0_0_#000] active:shadow-none font-minecraft text-base sm:text-lg lg:text-xl font-bold text-black tracking-wider transition-all flex items-center gap-3 cursor-pointer select-none"
                >
                  <span>HOW IT WORKS</span>
                  <span className="text-lg sm:text-xl font-bold">▷</span>
                </button>
              </a>
            </div>
          </div>

          {/* Right Column: Isometric 3D Retro Monitor & Pixel Blocks Graphic (Enlarged Size) */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <div className="w-full max-w-[620px] lg:max-w-[700px] xl:max-w-[740px] aspect-4/3 relative flex items-center justify-center">
              {/* Scalable Vector SVG Illustration matching screenshot */}
              <svg
                viewBox="0 0 540 440"
                className="w-full h-full drop-shadow-xs overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 1. Base Ground Shadow */}
                <ellipse
                  cx="285"
                  cy="345"
                  rx="180"
                  ry="42"
                  fill="#E6E8FE"
                />

                {/* Ground Speckle Accent */}
                <circle cx="185" cy="340" r="2" fill="#111111" />

                {/* 2. Floating Pixel Cubes */}
                {/* Green Cube Left */}
                <rect
                  x="82"
                  y="180"
                  width="18"
                  height="18"
                  rx="2"
                  fill="#00D285"
                  stroke="#000000"
                  strokeWidth="2.5"
                />

                {/* Lilac Cube Far Left */}
                <rect
                  x="62"
                  y="240"
                  width="18"
                  height="18"
                  rx="2"
                  fill="#C4B5FD"
                  stroke="#000000"
                  strokeWidth="2"
                />

                {/* Translucent Mint Panel behind monitor */}
                <rect
                  x="395"
                  y="150"
                  width="52"
                  height="76"
                  rx="4"
                  fill="#A7F3D0"
                  opacity="0.8"
                />

                {/* Floating 3D Purple/Indigo Cube Top Right */}
                <g transform="translate(440, 138)">
                  {/* Front Face */}
                  <polygon
                    points="0,6 18,10 18,28 0,24"
                    fill="#5B63E6"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  {/* Top Face */}
                  <polygon
                    points="0,6 10,0 28,4 18,10"
                    fill="#7C83FD"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  {/* Right Face */}
                  <polygon
                    points="18,10 28,4 28,22 18,28"
                    fill="#4338CA"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                </g>

                {/* Corner outline indicator on right */}
                <path
                  d="M455 200 L465 200 L465 235 L455 235"
                  stroke="#111111"
                  strokeWidth="2.5"
                  fill="none"
                />

                {/* Small Green Accent Cube Right */}
                <rect
                  x="456"
                  y="320"
                  width="16"
                  height="16"
                  rx="2"
                  fill="#00D285"
                  stroke="#000000"
                  strokeWidth="2.5"
                />

                {/* 3. Blue/Cyan Back Window */}
                <g transform="matrix(0.97, 0.16, 0, 0.98, 125, 130)">
                  <rect
                    x="0"
                    y="0"
                    width="225"
                    height="160"
                    rx="8"
                    fill="#93C5FD"
                    stroke="#000000"
                    strokeWidth="3"
                  />
                </g>

                {/* 4. Foreground Main 3D Computer Monitor */}
                <g transform="translate(140, 155)">
                  {/* 3D Black Extrusion Shadow (Isometric Depth) */}
                  <path
                    d="M 12 178 L 196 218 L 210 216 L 210 32 L 196 28 L 196 206 L 12 178 Z"
                    fill="#000000"
                  />
                  <path
                    d="M 6 172 L 196 212 L 206 220 L 16 182 Z"
                    fill="#000000"
                  />

                  {/* Main Screen Body Container with Isometric Tilt */}
                  <g transform="matrix(0.97, 0.20, 0, 0.98, 0, 0)">
                    {/* Screen Card */}
                    <rect
                      x="0"
                      y="0"
                      width="198"
                      height="172"
                      rx="10"
                      fill="#FFFFFF"
                      stroke="#000000"
                      strokeWidth="3.5"
                    />

                    {/* Top Window Bar */}
                    <line
                      x1="0"
                      y1="28"
                      x2="198"
                      y2="28"
                      stroke="#000000"
                      strokeWidth="2.5"
                    />

                    {/* Top Bar Pill & Dot */}
                    <rect x="18" y="10" width="16" height="8" rx="4" fill="#CBD5E1" />
                    <circle cx="44" cy="14" r="3" fill="#CBD5E1" />

                    {/* Code Symbol </ > */}
                    <g transform="translate(99, 90)">
                      {/* Left Chevron < */}
                      <path
                        d="M -38 -15 L -52 0 L -38 15"
                        stroke="#000000"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Slash / */}
                      <line
                        x1="-8"
                        y1="20"
                        x2="8"
                        y2="-20"
                        stroke="#000000"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />

                      {/* Right Chevron > */}
                      <path
                        d="M 38 -15 L 52 0 L 38 15"
                        stroke="#000000"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* Skeleton Code Lines */}
                    <rect x="24" y="128" width="76" height="7" rx="3.5" fill="#E2E8F0" />
                    <rect x="108" y="128" width="48" height="7" rx="3.5" fill="#E2E8F0" />
                    <rect x="24" y="142" width="140" height="7" rx="3.5" fill="#E2E8F0" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. HOW IT WORKS / YOUR JOURNEY (Fits window screen)       */}
      {/* ========================================================= */}
      <section
        id="how-it-works"
        ref={sectionRef}
        onMouseMove={handleSectionMouseMove}
        onMouseEnter={handleSectionMouseEnter}
        onMouseLeave={handleSectionMouseLeave}
        className="w-full border-t-2 border-black min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-10 lg:py-12 scroll-mt-18 sm:scroll-mt-20 relative"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col justify-center items-center flex-1">
          <div className="text-center space-y-2 sm:space-y-2.5 flex flex-col items-center">
            <div className="font-minecraft text-xs sm:text-sm font-bold tracking-widest text-[#4E56E8] uppercase">
              YOUR JOURNEY
            </div>
            <h2 className="font-minecraft text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#555555] font-sans font-normal max-w-2xl text-center">
              A simple 6-day process to turn your ideas into real solutions.
            </p>
          </div>

          {/* 4 Steps Flow with Right Arrows */}
          <div className="w-full mt-8 sm:mt-10 lg:mt-12 xl:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 relative">
            {/* Step 01 */}
            <div
              ref={(el) => { cardRefs.current[0] = el; }}
              onMouseEnter={() => handleCardMouseEnter(0)}
              onMouseLeave={handleCardMouseLeave}
              className="flex flex-col items-center text-center relative group cursor-pointer"
            >
              {/* Card Icon */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 rounded-2xl bg-[#DADBFF] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
                <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left Member */}
                  <circle cx="11" cy="12" r="3.5" fill="#6366F1" stroke="#000000" strokeWidth="2" />
                  <path d="M5 23 C5 19 8 18 11 18 C13 18 15 19 15.5 20.5" stroke="#000000" strokeWidth="2" fill="#818CF8" />
                  {/* Right Member */}
                  <circle cx="25" cy="12" r="3.5" fill="#6366F1" stroke="#000000" strokeWidth="2" />
                  <path d="M20.5 20.5 C21 19 23 18 25 18 C28 18 31 19 31 23" stroke="#000000" strokeWidth="2" fill="#818CF8" />
                  {/* Center Foreground Member */}
                  <circle cx="18" cy="15" r="4.5" fill="#A5B4FC" stroke="#000000" strokeWidth="2" />
                  <path d="M10 27 C10 22 13.5 21 18 21 C22.5 21 26 22 26 27 Z" fill="#6366F1" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Connecting Arrow (Desktop) */}
              <div className="hidden lg:flex items-center justify-center absolute top-7 sm:top-8 lg:top-9 left-[calc(100%+12px)] xl:left-[calc(100%+16px)] -translate-x-1/2 text-black pointer-events-none select-none z-10">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <polyline points="14 6 20 12 14 18" />
                </svg>
              </div>

              {/* Step Number */}
              <span className="font-minecraft text-xs sm:text-sm lg:text-base font-bold text-black mt-3 sm:mt-4 text-center">
                01
              </span>

              {/* Step Title */}
              <h3 className="font-minecraft text-base sm:text-lg lg:text-xl font-bold text-black mt-1 text-center">
                Form Your Team
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 sm:mt-1.5 leading-relaxed font-sans max-w-[240px] text-center">
                Create or join a team with like-minded peers.
              </p>
            </div>

            {/* Step 02 */}
            <div
              ref={(el) => { cardRefs.current[1] = el; }}
              onMouseEnter={() => handleCardMouseEnter(1)}
              onMouseLeave={handleCardMouseLeave}
              className="flex flex-col items-center text-center relative group cursor-pointer"
            >
              {/* Card Icon */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 rounded-2xl bg-[#A7F3D0] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
                <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="5" width="24" height="26" rx="4" fill="#6EE7B7" stroke="#000000" strokeWidth="2.2" />
                  <path d="M6 12 L30 12" stroke="#000000" strokeWidth="2.2" />
                  <line x1="11" y1="18" x2="25" y2="18" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="11" y1="23" x2="21" y2="23" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Connecting Arrow (Desktop) */}
              <div className="hidden lg:flex items-center justify-center absolute top-7 sm:top-8 lg:top-9 left-[calc(100%+12px)] xl:left-[calc(100%+16px)] -translate-x-1/2 text-black pointer-events-none select-none z-10">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <polyline points="14 6 20 12 14 18" />
                </svg>
              </div>

              {/* Step Number */}
              <span className="font-minecraft text-xs sm:text-sm lg:text-base font-bold text-black mt-3 sm:mt-4 text-center">
                02
              </span>

              {/* Step Title */}
              <h3 className="font-minecraft text-base sm:text-lg lg:text-xl font-bold text-black mt-1 text-center">
                Pick a Problem
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 sm:mt-1.5 leading-relaxed font-sans max-w-[240px] text-center">
                Choose from real-world problem statements.
              </p>
            </div>

            {/* Step 03 */}
            <div
              ref={(el) => { cardRefs.current[2] = el; }}
              onMouseEnter={() => handleCardMouseEnter(2)}
              onMouseLeave={handleCardMouseLeave}
              className="flex flex-col items-center text-center relative group cursor-pointer"
            >
              {/* Card Icon */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 rounded-2xl bg-[#FDE047] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
                <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6 C12.5 6 9 9.5 9 14.5 C9 18 11.5 20.5 13 22.5 L13 25 C13 25.5 13.5 26 14 26 L22 26 C22.5 26 23 25.5 23 25 L23 22.5 C24.5 20.5 27 18 27 14.5 C27 9.5 23.5 6 18 6 Z" fill="#FEF08A" stroke="#000000" strokeWidth="2.2" strokeLinejoin="round" />
                  <line x1="14" y1="29" x2="22" y2="29" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M16 29 C16 30.5 17 31.5 18 31.5 C19 31.5 20 30.5 20 29" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* Connecting Arrow (Desktop) */}
              <div className="hidden lg:flex items-center justify-center absolute top-7 sm:top-8 lg:top-9 left-[calc(100%+12px)] xl:left-[calc(100%+16px)] -translate-x-1/2 text-black pointer-events-none select-none z-10">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <polyline points="14 6 20 12 14 18" />
                </svg>
              </div>

              {/* Step Number */}
              <span className="font-minecraft text-xs sm:text-sm lg:text-base font-bold text-black mt-3 sm:mt-4 text-center">
                03
              </span>

              {/* Step Title */}
              <h3 className="font-minecraft text-base sm:text-lg lg:text-xl font-bold text-black mt-1 text-center">
                Build Your Solution
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 sm:mt-1.5 leading-relaxed font-sans max-w-[240px] text-center">
                Plan, design and develop your idea.
              </p>
            </div>

            {/* Step 04 */}
            <div
              ref={(el) => { cardRefs.current[3] = el; }}
              onMouseEnter={() => handleCardMouseEnter(3)}
              onMouseLeave={handleCardMouseLeave}
              className="flex flex-col items-center text-center relative group cursor-pointer"
            >
              {/* Card Icon */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 rounded-2xl bg-[#C7D2FE] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
                <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(18, 18) rotate(45) translate(-18, -18)">
                    <path d="M18 4 C18 4 12 12 12 22 L24 22 C24 12 18 4 18 4 Z" fill="#818CF8" stroke="#000000" strokeWidth="2.2" strokeLinejoin="round" />
                    <circle cx="18" cy="14" r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
                    <path d="M12 18 L6 24 L12 23 Z" fill="#6366F1" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M24 18 L30 24 L24 23 Z" fill="#6366F1" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M14 23 L18 29 L22 23 Z" fill="#FBBF24" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>

              {/* Step Number */}
              <span className="font-minecraft text-xs sm:text-sm lg:text-base font-bold text-black mt-3 sm:mt-4 text-center">
                04
              </span>

              {/* Step Title */}
              <h3 className="font-minecraft text-base sm:text-lg lg:text-xl font-bold text-black mt-1 text-center">
                Submit & Grow
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 sm:mt-1.5 leading-relaxed font-sans max-w-[240px] text-center">
                Share your work and make an impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 6-DAY SPRINT ROADMAP (Interactive Retro Expansion)      */}
      {/* ========================================================= */}
      <section
        id="sprint-roadmap"
        className="border-t-2 border-black bg-[#FBFBFA] py-16 scroll-mt-20 select-none overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DADBFF] border border-black font-minecraft text-[11px] font-bold text-[#312E81] shadow-[2px_2px_0_0_#000]">
                <span>SPRINT ROADMAP</span>
                <span className="w-1.5 h-1.5 bg-[#312E81] rounded-full animate-ping" />
              </div>
              <h2 className="font-minecraft text-3xl sm:text-4xl font-black text-[#111111]">
                6 DAYS. 6 GATED MILESTONES.
              </h2>
              <p className="text-sm text-[#555555] max-w-xl">
                Sprint from team ideation to live product deployment with non-negotiable daily checkpoints.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#FFFBEB] border border-black font-minecraft text-[11px] text-[#92400E] shadow-[2px_2px_0_0_#000]">
                <span>🕹️</span>
                <span>HOVER TO EXPAND INTEL</span>
              </div>
              <Link href="/participant/milestones">
                <button
                  type="button"
                  className="h-10 px-4 bg-white hover:bg-[#F3F3F0] border-2 border-black shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] font-minecraft text-xs font-bold text-black flex items-center gap-1.5 transition-all"
                >
                  <span>VIEW SPRINT HUB</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Butter-Smooth Retro Expanding Roadmap: 2 Rows x 3 Columns */}
          <div
            className="flex flex-col gap-4 w-full h-auto lg:h-[570px] xl:h-[590px] select-none"
            onMouseLeave={() => setHoveredRoadmapIndex(null)}
          >
            {[0, 1].map((rowIndex) => {
              const rowStages = sprintStages.slice(rowIndex * 3, rowIndex * 3 + 3);
              const hoveredRow =
                hoveredRoadmapIndex !== null
                  ? Math.floor(hoveredRoadmapIndex / 3)
                  : null;
              const isRowActive = hoveredRow === rowIndex;
              const isRowInactive = hoveredRow !== null && !isRowActive;

              return (
                <div
                  key={rowIndex}
                  className={`flex flex-col lg:flex-row gap-4 w-full transition-all duration-1000 ease-in-out ${
                    hoveredRow === null
                      ? "lg:flex-1 h-auto"
                      : isRowActive
                      ? "lg:flex-[2.4] h-auto"
                      : "lg:flex-[0.75] h-auto opacity-80 hover:opacity-100"
                  }`}
                >
                  {rowStages.map((stage, cardIdxInRow) => {
                    const globalIndex = rowIndex * 3 + cardIdxInRow;
                    const isHovered = hoveredRoadmapIndex === globalIndex;
                    const isShrunk = isRowActive && !isHovered;
                    const isInactiveRowCard = isRowInactive;
                    const isResting = hoveredRow === null;

                    return (
                      <div
                        key={stage.day}
                        onMouseEnter={() => setHoveredRoadmapIndex(globalIndex)}
                        onClick={() =>
                          setHoveredRoadmapIndex(isHovered ? null : globalIndex)
                        }
                        className={`relative overflow-hidden transition-all duration-1000 ease-in-out border-2 border-black cursor-pointer group ${
                          isHovered
                            ? "lg:flex-[4.6] bg-white shadow-[8px_8px_0_0_#000] -translate-y-1 z-20"
                            : isShrunk
                            ? "lg:flex-[0.6] bg-[#F7F7F5] hover:bg-[#EFEFEA] shadow-[2px_2px_0_0_#000] opacity-90 hover:opacity-100"
                            : isInactiveRowCard
                            ? "lg:flex-1 bg-[#FAFAF9] hover:bg-white shadow-[3px_3px_0_0_#000]"
                            : "lg:flex-1 bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-0.5"
                        }`}
                      >
                        {/* ==================================================== */}
                        {/* EXPANDED STATE (Hovered Card: 2-column retro layout) */}
                        {/* ==================================================== */}
                        {isHovered ? (
                          <div className="w-full h-full p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-fadeIn">
                            {/* LEFT COLUMN: Text Intel & Deliverables */}
                            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                              <div className="space-y-2.5">
                                {/* Top Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className="font-minecraft text-xs font-black px-2.5 py-1 border border-black shadow-[2px_2px_0_0_#000]"
                                    style={{
                                      backgroundColor: stage.badgeBg,
                                      color: stage.badgeColor,
                                    }}
                                  >
                                    {stage.day}
                                  </span>
                                  <span className="font-minecraft text-xs font-bold px-2 py-1 bg-black text-white border border-black">
                                    {stage.badge}
                                  </span>
                                  <span className="font-minecraft text-[10px] text-[#666666] uppercase tracking-wider hidden sm:inline-block">
                                    STAGE 0{globalIndex + 1} OF 06
                                  </span>
                                </div>

                                {/* Title & Subtitle */}
                                <div>
                                  <h3 className="font-minecraft text-2xl lg:text-3xl font-black text-[#111111] tracking-tight">
                                    {stage.title}
                                  </h3>
                                  <p className="font-minecraft text-xs lg:text-sm text-[#4F46E5] mt-0.5 font-bold">
                                    ⚡ {stage.subtitle}
                                  </p>
                                </div>

                                {/* Full Detailed Description */}
                                <p className="text-xs lg:text-sm text-[#444444] leading-relaxed font-sans">
                                  {stage.desc}
                                </p>

                                {/* Milestone Checklist (Stacked to eliminate dead white space & show full names) */}
                                <div className="space-y-1.5 pt-1">
                                  <div className="text-[10px] font-minecraft text-[#777777] uppercase tracking-wider flex items-center justify-between">
                                    <span>DAY {stage.dayNum} CHECKPOINTS:</span>
                                    <span className="text-[9px] font-minecraft text-emerald-700 font-bold">ALL 3 REQUIRED</span>
                                  </div>
                                  <div className="flex flex-col gap-2 pt-0.5">
                                    {stage.milestones.map((milestone, mIdx) => (
                                      <div
                                        key={mIdx}
                                        className="flex items-center gap-2.5 text-xs font-minecraft text-[#222222]"
                                      >
                                        <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                                        </span>
                                        <span className="font-bold text-[#111111]">{milestone}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Mandatory Gated Deliverable Box */}
                              <div className="space-y-2 pt-1">
                                <div className="p-3 bg-[#FBFBFA] border-2 border-black shadow-[3px_3px_0_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="space-y-0.5">
                                    <div className="text-[10px] font-minecraft text-[#777777] flex items-center gap-1.5">
                                      <span>REQUIRED LOOT CHECKPOINT</span>
                                      <span className="text-[9px] px-1 bg-amber-100 text-amber-900 border border-black font-bold">
                                        GATEWAY 0{globalIndex + 1}
                                      </span>
                                    </div>
                                    <div className="font-minecraft text-xs sm:text-sm font-black text-[#111111] flex items-center gap-2">
                                      <span className="text-base">{stage.lootIcon}</span>
                                      <span>{stage.deliverable}</span>
                                    </div>
                                  </div>

                                  <Link href="/participant/milestones" className="shrink-0">
                                    <button
                                      type="button"
                                      className="w-full sm:w-auto h-9 px-3.5 bg-[#FFE873] hover:bg-[#FFDF40] border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-minecraft text-xs font-black text-black flex items-center justify-center gap-1.5 transition-all"
                                    >
                                      <span>SUBMIT ARTIFACT</span>
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT COLUMN: Retro Illustration Frame */}
                            <div className="lg:col-span-5 flex flex-col justify-center h-full">
                              <div className="relative w-full h-[200px] sm:h-[240px] lg:h-full border-2 border-black bg-zinc-950 overflow-hidden shadow-[4px_4px_0_0_#000] group/img">
                                <img
                                  src={stage.image}
                                  alt={stage.title}
                                  className="w-full h-full object-cover object-center transform group-hover/img:scale-105 transition-transform duration-1000 ease-in-out"
                                />

                                {/* HUD Scanner Badges */}
                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/85 backdrop-blur-sm border border-white/20 text-[10px] font-minecraft text-[#00D285] flex items-center gap-1.5">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D285] animate-ping" />
                                  <span>ACTIVE // {stage.day}</span>
                                </div>

                                <div
                                  className="absolute top-2.5 right-2.5 px-2 py-0.5 border border-black text-[10px] font-minecraft font-bold shadow-[2px_2px_0_0_#000]"
                                  style={{
                                    backgroundColor: stage.badgeBg,
                                    color: stage.badgeColor,
                                  }}
                                >
                                  {stage.badge}
                                </div>

                                {/* Pixel scanline bar overlay at bottom */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/75 px-2.5 py-1 text-[9px] font-minecraft text-zinc-300 border-t border-black flex items-center justify-between">
                                  <span>PIXEL_INTEL://STAGE_{stage.dayNum}</span>
                                  <span className="text-[#00D285]">READY ⚡</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* ==================================================== */}
                        {/* SHRUNKEN STATE (When neighbor in active row is hovered) */}
                        {/* ==================================================== */}
                        {isShrunk ? (
                          <div className="w-full h-full flex flex-col items-center justify-between py-4 px-1 lg:py-5">
                            {/* Day Number Pill */}
                            <span
                              className="font-minecraft text-xs font-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0_0_#000]"
                              style={{
                                backgroundColor: stage.badgeBg,
                                color: stage.badgeColor,
                              }}
                            >
                              0{globalIndex + 1}
                            </span>

                            {/* Vertically Rotated Title Tab */}
                            <div className="flex-1 flex items-center justify-center my-3 overflow-hidden">
                              <span className="font-minecraft text-xs font-black tracking-widest text-[#222222] whitespace-nowrap [writing-mode:vertical-rl] rotate-180 uppercase select-none opacity-80 group-hover:opacity-100 transition-opacity">
                                {stage.day} • {stage.shortTitle}
                              </span>
                            </div>

                            {/* Loot Icon Emoji */}
                            <div className="text-base select-none">{stage.lootIcon}</div>

                            {/* Bottom Accent Strip */}
                            <div
                              className="absolute bottom-0 inset-x-0 h-1"
                              style={{ backgroundColor: stage.accentBg }}
                            />
                          </div>
                        ) : null}

                        {/* ==================================================== */}
                        {/* INACTIVE ROW CARD STATE (Compact overview in other row) */}
                        {/* ==================================================== */}
                        {isInactiveRowCard ? (
                          <div className="w-full h-full p-3.5 flex flex-col justify-between space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span
                                className="font-minecraft text-xs font-black px-2 py-0.5 border border-black"
                                style={{
                                  backgroundColor: stage.badgeBg,
                                  color: stage.badgeColor,
                                }}
                              >
                                {stage.day}
                              </span>
                              <span className="font-minecraft text-[10px] font-bold px-1.5 py-0.5 border border-black bg-white text-black">
                                {stage.badge}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-minecraft text-sm font-black text-[#111111] line-clamp-1">
                                {stage.title}
                              </h4>
                              <p className="text-[11px] text-[#666666] line-clamp-1 font-sans">
                                {stage.subtitle}
                              </p>
                            </div>

                            <div className="pt-1 border-t border-dashed border-[#DDDDDD] flex items-center justify-between text-[10px] font-minecraft text-[#444444]">
                              <span className="flex items-center gap-1 truncate">
                                <span>{stage.lootIcon}</span>
                                <span className="truncate">{stage.deliverable}</span>
                              </span>
                              <span className="text-[#888888] font-bold shrink-0">EXPAND ↗</span>
                            </div>

                            {/* Bottom Accent Strip */}
                            <div
                              className="absolute bottom-0 inset-x-0 h-1"
                              style={{ backgroundColor: stage.accentBg }}
                            />
                          </div>
                        ) : null}

                        {/* ==================================================== */}
                        {/* INITIAL RESTING STATE (2 rows x 3 cols equal grid)   */}
                        {/* ==================================================== */}
                        {isResting ? (
                          <div className="w-full h-full p-4 flex flex-col justify-between space-y-1.5">
                            <div className="space-y-1.5 flex flex-col flex-1">
                              {/* Top Header */}
                              <div className="flex items-center justify-between">
                                <span className="font-minecraft text-sm font-black text-[#111111]">
                                  {stage.day}
                                </span>
                                <span
                                  className="font-minecraft text-[10px] font-bold px-2 py-0.5 border border-black"
                                  style={{
                                    backgroundColor: stage.badgeBg,
                                    color: stage.badgeColor,
                                  }}
                                >
                                  {stage.badge}
                                </span>
                              </div>

                              {/* Stage Title */}
                              <h3 className="font-minecraft text-base font-black text-[#111111] line-clamp-1">
                                {stage.title}
                              </h3>

                              {/* Preview Thumbnail Window */}
                              <div className="relative flex-1 min-h-[110px] max-h-[140px] w-full border-2 border-black bg-zinc-900 overflow-hidden shadow-[2px_2px_0_0_#000] group-hover:shadow-[3px_3px_0_0_#000] transition-shadow my-0.5">
                                <img
                                  src={stage.image}
                                  alt={stage.title}
                                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                />
                                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 text-[9px] font-minecraft text-white border border-black">
                                  STAGE 0{globalIndex + 1}
                                </div>
                              </div>

                              {/* Brief Subtitle */}
                              <p className="text-xs text-[#555555] line-clamp-1 leading-tight font-sans">
                                {stage.subtitle}
                              </p>
                            </div>

                            {/* Required Loot Section */}
                            <div className="pt-2 border-t border-dashed border-[#CCCCCC] space-y-0.5 mt-1">
                              <div className="text-[9px] font-minecraft text-[#888888] uppercase tracking-wider">
                                REQUIRED LOOT:
                              </div>
                              <div className="font-minecraft text-xs font-bold text-[#111111] flex items-center gap-1.5 truncate">
                                <span className="shrink-0">{stage.lootIcon}</span>
                                <span className="truncate">{stage.deliverable}</span>
                              </div>
                            </div>

                            {/* Bottom Accent Strip */}
                            <div
                              className="absolute bottom-0 inset-x-0 h-1 group-hover:h-1.5 transition-all"
                              style={{ backgroundColor: stage.accentBg }}
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CREDITS & SPECIAL ACKNOWLEDGMENTS                      */}
      {/* ========================================================= */}
      <section
        id="credits"
        className="border-t-2 border-black bg-[#F8F8F6] py-16 scroll-mt-20 select-none relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3C7] border border-black font-minecraft text-[11px] font-bold text-[#92400E] shadow-[2px_2px_0_0_#000]">
                <span>🌟 CREDITS & HALL OF HONOR</span>
                <span className="w-1.5 h-1.5 bg-[#92400E] rounded-full animate-ping" />
              </div>
              <h2 className="font-minecraft text-3xl sm:text-4xl font-black text-[#111111]">
                SPECIAL THANKS & ATTRIBUTIONS
              </h2>
              <p className="text-sm text-[#555555] max-w-2xl leading-relaxed font-sans">
                Honoring the institutional patron, academic leadership, and engineering minds behind the BUILD//26 Collegiate Sprint Platform.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black shadow-[3px_3px_0_0_#000] font-minecraft text-xs font-bold text-black">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>BUILT WITH PASSION</span>
            </div>
          </div>

          {/* Grid: Institutional Patronage (Left) & Developers Attribution (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* INSTITUTIONAL PATRONAGE CARD (Left Column - 6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#000] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-minecraft text-[10px] font-bold px-2.5 py-1 bg-[#DADBFF] text-[#312E81] border border-black shadow-[2px_2px_0_0_#000]">
                    INSTITUTIONAL PATRONAGE
                  </span>
                  <span className="font-minecraft text-[10px] text-[#666666]">
                    ESTD. 1997 • AUTONOMOUS
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#1E1B4B] text-white border-2 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0_0_#000]">
                    <GraduationCap className="h-7 w-7 text-[#00D285]" />
                  </div>
                  <div>
                    <h3 className="font-minecraft text-xl sm:text-2xl font-black text-[#111111] leading-tight">
                      SONA COLLEGE OF TECHNOLOGY
                    </h3>
                    <p className="font-minecraft text-xs sm:text-sm text-[#4338CA] font-bold mt-1 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Department of Information Technology</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed font-sans pt-1">
                  We convey our deepest gratitude and special thanks to the visionary management and leadership of <strong>Sona College of Technology</strong>, and the esteemed faculty and mentors of the <strong>Department of Information Technology</strong>. Their continuous encouragement, incubation support, and dedication to technical excellence empower collegiate innovators to transform bold concepts into industry-grade software.
                </p>

                {/* Key Institutional Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 bg-[#F9FAFB] border border-black text-[11px] font-minecraft text-[#18181B] shadow-[1px_1px_0_0_#000] space-y-0.5">
                    <div className="text-[9px] text-[#888888] uppercase tracking-wider">INSTITUTION</div>
                    <div className="font-bold">Sona College of Technology</div>
                    <div className="text-[10px] text-[#666666]">Autonomous • Salem, Tamil Nadu</div>
                  </div>
                  <div className="p-3 bg-[#F9FAFB] border border-black text-[11px] font-minecraft text-[#18181B] shadow-[1px_1px_0_0_#000] space-y-0.5">
                    <div className="text-[9px] text-[#888888] uppercase tracking-wider">DEPARTMENT</div>
                    <div className="font-bold">Information Technology</div>
                    <div className="text-[10px] text-[#666666]">Innovation & Engineering Hub</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Strip */}
              <div className="pt-3 border-t-2 border-dashed border-[#CCCCCC] flex items-center gap-2 text-xs font-minecraft text-[#555555]">
                <Award className="h-4 w-4 text-amber-600 shrink-0" />
                <span>"Nurturing Innovation, Empowering Engineering Excellence."</span>
              </div>
            </div>

            {/* DEVELOPERS ATTRIBUTION CARD (Right Column - 6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#000] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-minecraft text-[10px] font-bold px-2.5 py-1 bg-[#DCFCE7] text-[#15803D] border border-black shadow-[2px_2px_0_0_#000]">
                    CORE ENGINEERING SQUAD
                  </span>
                  <span className="font-minecraft text-[10px] text-[#666666]">
                    BUILD//26 ARCHITECTS
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-black text-white border-2 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0_0_#000]">
                    <Code2 className="h-7 w-7 text-[#00D285]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-minecraft font-bold text-[#888888] tracking-wider uppercase">
                      DEVELOPED & ARCHITECTED BY
                    </div>
                    <h3 className="font-minecraft text-xl sm:text-2xl font-black text-[#111111] leading-tight">
                      THIGANTH K & THIRUKUMARAN P
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed font-sans pt-1">
                  Engineered from the ground up with passion for retro-brutalist aesthetics, gamified sprint milestones, and high-performance collegiate competition infrastructure. Designed to provide student squads with an unforgettable bootcamp experience.
                </p>

                {/* Developer Profiles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Developer 1 */}
                  <div className="p-3 bg-[#FBFBFA] border-2 border-black shadow-[3px_3px_0_0_#000] space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-[#6366F1] text-white border border-black flex items-center justify-center font-minecraft text-xs font-black shadow-[1px_1px_0_0_#000]">
                        TK
                      </div>
                      <div>
                        <div className="font-minecraft text-xs font-black text-black">
                          THIGANTH K
                        </div>
                        <div className="text-[10px] text-[#4F46E5] font-minecraft font-bold">
                          Lead Architect & Dev
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-minecraft text-[#4B5563] border-t border-dashed border-[#DDD] pt-1.5 flex items-center justify-between">
                      <span>Full-Stack & UX</span>
                      <span className="text-[#00D285] font-bold">● ACTIVE</span>
                    </div>
                  </div>

                  {/* Developer 2 */}
                  <div className="p-3 bg-[#FBFBFA] border-2 border-black shadow-[3px_3px_0_0_#000] space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-[#00D285] text-black border border-black flex items-center justify-center font-minecraft text-xs font-black shadow-[1px_1px_0_0_#000]">
                        TP
                      </div>
                      <div>
                        <div className="font-minecraft text-xs font-black text-black">
                          THIRUKUMARAN P
                        </div>
                        <div className="text-[10px] text-[#059669] font-minecraft font-bold">
                          Lead Systems Architect
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-minecraft text-[#4B5563] border-t border-dashed border-[#DDD] pt-1.5 flex items-center justify-between">
                      <span>Core Engine & APIs</span>
                      <span className="text-[#00D285] font-bold">● ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Strip */}
              <div className="pt-3 border-t-2 border-dashed border-[#CCCCCC] flex flex-wrap items-center justify-between gap-2 text-[10px] font-minecraft text-[#666666]">
                <div className="flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-black" />
                  <span>NEXT.JS • TYPESCRIPT • TAILWIND • PRISMA</span>
                </div>
                <span className="px-2 py-0.5 bg-black text-white border border-black font-bold text-[9px]">
                  VER 2.6
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Retro Honor Marquee Banner */}
          <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 font-minecraft text-xs font-bold text-black">
              <span className="text-base">🚀</span>
              <span>SPECIAL THANKS TO ALL FACULTY MENTORS & SPRINT PARTICIPANTS</span>
            </div>
            <div className="flex items-center gap-2 font-minecraft text-xs text-[#555555]">
              <span>CRAFTED AT</span>
              <span className="font-black text-black bg-[#FFE873] px-2 py-0.5 border border-black">
                SONA COLLEGE OF TECHNOLOGY
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer className="border-t-2 border-black bg-[#FBFBFA] py-8 text-xs text-[#555555]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-black border border-black rounded-md text-white font-sans font-black italic text-xs flex items-center justify-center">
              //
            </div>
            <span className="font-minecraft font-bold text-black text-sm">BUILD//26</span>
            <span>•</span>
            <span className="font-medium">Collegiate Engineering Bootcamp Platform</span>
          </div>

          <div className="flex items-center gap-4 font-minecraft text-[11px]">
            <a href="#credits" className="hover:text-black hover:underline font-bold text-black">
              CREDITS
            </a>
            <span>•</span>
            <Link href="/login" className="hover:text-black hover:underline">
              SIGN IN
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-black hover:underline">
              ADMIN COMMAND
            </Link>
            <span>•</span>
            <span>© 2026 Sona College of Technology</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
