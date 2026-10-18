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
} from "lucide-react";

export default function HomePage() {
  const [session, setSession] = React.useState<any>(null);
  const [activeNav, setActiveNav] = React.useState("HOME");

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setSession(d);
      })
      .catch(() => {});
  }, []);

  const isAuthenticated = Boolean(session?.user);

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
      {/* 1. NAVBAR (White Background + BUILD//26 official logo)    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
        <div className="w-full px-3 sm:px-6 md:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Left: Brand Identity with official // logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            {/* Circle Badge with // Slashes */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 bg-black border-2 border-black rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_#000] group-hover:scale-105 group-hover:shadow-none transition-all">
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
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-minecraft text-xs font-bold tracking-wider text-black select-none">
            <Link
              href="/"
              onClick={() => setActiveNav("HOME")}
              className="relative py-1 text-black hover:text-black transition-colors flex flex-col items-center"
            >
              <span>HOME</span>
              {activeNav === "HOME" && (
                <span className="w-full h-[3px] bg-[#00D285] mt-1.5" />
              )}
            </Link>

            <Link
              href={isAuthenticated ? "/participant/team" : "/login"}
              onClick={() => setActiveNav("MY TEAMS")}
              className="relative py-1 text-black hover:text-black transition-colors flex flex-col items-center"
            >
              <span>MY TEAMS</span>
              {activeNav === "MY TEAMS" && (
                <span className="w-full h-[3px] bg-[#00D285] mt-1.5" />
              )}
            </Link>

            <Link
              href="/participant/problem"
              onClick={() => setActiveNav("PROBLEMS")}
              className="relative py-1 text-black hover:text-black transition-colors flex flex-col items-center"
            >
              <span>PROBLEMS</span>
              {activeNav === "PROBLEMS" && (
                <span className="w-full h-[3px] bg-[#00D285] mt-1.5" />
              )}
            </Link>

            <Link
              href="/participant/milestones"
              onClick={() => setActiveNav("MILESTONES")}
              className="relative py-1 text-black hover:text-black transition-colors flex flex-col items-center"
            >
              <span>MILESTONES</span>
              {activeNav === "MILESTONES" && (
                <span className="w-full h-[3px] bg-[#00D285] mt-1.5" />
              )}
            </Link>
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
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex-1 flex flex-col justify-center pt-2 sm:pt-4 pb-6 lg:pb-8 min-h-[calc(100vh-5rem)]">
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
      {/* 3. HOW IT WORKS / YOUR JOURNEY (Exact Match to Screenshot)*/}
      {/* ========================================================= */}
      <section
        id="how-it-works"
        className="w-full border-t-2 border-black py-16 sm:py-24 scroll-mt-20"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="space-y-3">
          <div className="font-minecraft text-xs sm:text-sm font-bold tracking-widest text-[#4E56E8] uppercase">
            YOUR JOURNEY
          </div>
          <h2 className="font-minecraft text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-[#555555] font-sans font-normal max-w-2xl">
            A simple 6-day process to turn your ideas into real solutions.
          </p>
        </div>

        {/* 4 Steps Flow with Right Arrows */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
          {/* Step 01 */}
          <div className="flex flex-col items-start relative group">
            {/* Card Icon */}
            <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-[#DADBFF] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
              <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="hidden lg:flex items-center justify-center absolute top-10 -right-6 xl:-right-8 text-black pointer-events-none select-none">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="14 6 20 12 14 18" />
              </svg>
            </div>

            {/* Step Number */}
            <span className="font-minecraft text-sm sm:text-base font-bold text-black mt-5">
              01
            </span>

            {/* Step Title */}
            <h3 className="font-minecraft text-lg sm:text-xl font-bold text-black mt-1">
              Form Your Team
            </h3>

            {/* Step Description */}
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed font-sans max-w-[240px]">
              Create or join a team with like-minded peers.
            </p>
          </div>

          {/* Step 02 */}
          <div className="flex flex-col items-start relative group">
            {/* Card Icon */}
            <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-[#A7F3D0] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
              <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="5" width="24" height="26" rx="4" fill="#6EE7B7" stroke="#000000" strokeWidth="2.2" />
                <path d="M6 12 L30 12" stroke="#000000" strokeWidth="2.2" />
                <line x1="11" y1="18" x2="25" y2="18" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="11" y1="23" x2="21" y2="23" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Connecting Arrow (Desktop) */}
            <div className="hidden lg:flex items-center justify-center absolute top-10 -right-6 xl:-right-8 text-black pointer-events-none select-none">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="14 6 20 12 14 18" />
              </svg>
            </div>

            {/* Step Number */}
            <span className="font-minecraft text-sm sm:text-base font-bold text-black mt-5">
              02
            </span>

            {/* Step Title */}
            <h3 className="font-minecraft text-lg sm:text-xl font-bold text-black mt-1">
              Pick a Problem
            </h3>

            {/* Step Description */}
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed font-sans max-w-[240px]">
              Choose from real-world problem statements.
            </p>
          </div>

          {/* Step 03 */}
          <div className="flex flex-col items-start relative group">
            {/* Card Icon */}
            <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-[#FDE047] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
              <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6 C12.5 6 9 9.5 9 14.5 C9 18 11.5 20.5 13 22.5 L13 25 C13 25.5 13.5 26 14 26 L22 26 C22.5 26 23 25.5 23 25 L23 22.5 C24.5 20.5 27 18 27 14.5 C27 9.5 23.5 6 18 6 Z" fill="#FEF08A" stroke="#000000" strokeWidth="2.2" strokeLinejoin="round" />
                <line x1="14" y1="29" x2="22" y2="29" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M16 29 C16 30.5 17 31.5 18 31.5 C19 31.5 20 30.5 20 29" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Connecting Arrow (Desktop) */}
            <div className="hidden lg:flex items-center justify-center absolute top-10 -right-6 xl:-right-8 text-black pointer-events-none select-none">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="14 6 20 12 14 18" />
              </svg>
            </div>

            {/* Step Number */}
            <span className="font-minecraft text-sm sm:text-base font-bold text-black mt-5">
              03
            </span>

            {/* Step Title */}
            <h3 className="font-minecraft text-lg sm:text-xl font-bold text-black mt-1">
              Build Your Solution
            </h3>

            {/* Step Description */}
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed font-sans max-w-[240px]">
              Plan, design and develop your idea.
            </p>
          </div>

          {/* Step 04 */}
          <div className="flex flex-col items-start relative group">
            {/* Card Icon */}
            <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-[#C7D2FE] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center transition-transform group-hover:-translate-y-1 select-none">
              <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="font-minecraft text-sm sm:text-base font-bold text-black mt-5">
              04
            </span>

            {/* Step Title */}
            <h3 className="font-minecraft text-lg sm:text-xl font-bold text-black mt-1">
              Submit & Grow
            </h3>

            {/* Step Description */}
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed font-sans max-w-[240px]">
              Share your work and make an impact.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 6-DAY SPRINT ROADMAP (Daily Milestone Checkpoints)     */}
      {/* ========================================================= */}
      <section
        id="sprint-roadmap"
        className="border-t-2 border-black bg-white py-16 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-[#DADBFF] border border-black font-minecraft text-[11px] font-bold text-[#312E81]">
                SPRINT ROADMAP
              </div>
              <h2 className="font-minecraft text-3xl sm:text-4xl font-black text-[#111111]">
                6 DAYS. 6 GATED MILESTONES.
              </h2>
              <p className="text-sm text-[#555555] max-w-xl">
                Sprint from team ideation to live product deployment with non-negotiable daily checkpoints.
              </p>
            </div>

            <Link href="/participant/milestones">
              <button
                type="button"
                className="h-10 px-4 bg-white hover:bg-[#F3F3F0] border-2 border-black shadow-[3px_3px_0_0_#000] font-minecraft text-xs font-bold text-black flex items-center gap-1.5 transition-all"
              >
                <span>VIEW SPRINT HUB</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          {/* 6 Stage Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                day: "DAY 01",
                title: "TEAM + IDEATION",
                desc: "Form your squad (3-4 members), allocate engineering roles, claim your problem statement, and upload your Solution Ideation PPT with 100% team consensus.",
                deliverable: "Solution PPT (.pptx / PDF)",
                badge: "Consensus Gate",
                badgeBg: "#DADBFF",
                badgeColor: "#312E81",
              },
              {
                day: "DAY 02",
                title: "WIREFRAME & UX",
                desc: "Map out end-to-end user journeys, structure application screens, construct interactive wireframes, and link team Figma design systems.",
                deliverable: "Wireframe PDF + Figma URL",
                badge: "UX Blueprint",
                badgeBg: "#E0F2FE",
                badgeColor: "#0369A1",
              },
              {
                day: "DAY 03",
                title: "BUILD CORE MVP",
                desc: "Initialize team GitHub repository with hygiene standards, configure frontend & backend architectures, and commit functioning boilerplate.",
                deliverable: "Public GitHub Repository",
                badge: "Code Base",
                badgeBg: "#DCFCE7",
                badgeColor: "#15803D",
              },
              {
                day: "DAY 04",
                title: "INTEGRATION & DB",
                desc: "Persist database models, connect client interfaces to REST APIs, and validate end-to-end authentication and logic flows.",
                deliverable: "DB & API Proof Evidence",
                badge: "Full Stack",
                badgeBg: "#FEF3C7",
                badgeColor: "#B45309",
              },
              {
                day: "DAY 05",
                title: "TEST & POLISH",
                desc: "Conduct cross-browser QA, eliminate console bugs, optimize mobile responsiveness, and rehearse product demo walk-throughs.",
                deliverable: "QA Stress-Test Audit",
                badge: "Stability",
                badgeBg: "#FCE7F3",
                badgeColor: "#BE185D",
              },
              {
                day: "DAY 06",
                title: "FINAL DEMO & SHIP",
                desc: "Deploy live working production build to Vercel/AWS, publish executive deck, and deliver pitch showcase to jury.",
                deliverable: "Live URL + Pitch Deck",
                badge: "Ship It 🚀",
                badgeBg: "#00D285",
                badgeColor: "#000000",
              },
            ].map((stage) => (
              <div
                key={stage.day}
                className="p-6 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
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

                  <h3 className="font-minecraft text-lg font-black text-[#111111]">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#CCCCCC] space-y-1">
                  <div className="text-[10px] font-minecraft text-[#888888]">REQUIRED LOOT:</div>
                  <div className="font-minecraft text-xs font-bold text-[#111111] flex items-center gap-1.5">
                    <span>📦</span>
                    <span>{stage.deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer className="border-t-2 border-black bg-[#FBFBFA] py-8 text-xs text-[#555555]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-black border border-black rounded-full text-white font-sans font-black italic text-xs flex items-center justify-center">
              //
            </div>
            <span className="font-minecraft font-bold text-black text-sm">BUILD//26</span>
            <span>•</span>
            <span className="font-medium">Collegiate Engineering Bootcamp Platform</span>
          </div>

          <div className="flex items-center gap-4 font-minecraft text-[11px]">
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
