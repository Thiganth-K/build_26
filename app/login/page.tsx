"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Hash,
  Building2,
  Calendar,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Electronics & Communication (ECE)",
  "Electrical & Electronics (EEE)",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = React.useState<"SIGNIN" | "SIGNUP">("SIGNIN");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Status banners
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [accountExistsNotice, setAccountExistsNotice] = React.useState(false);
  const [notFoundNotice, setNotFoundNotice] = React.useState(false);

  // Sign In state
  const [signInData, setSignInData] = React.useState({
    identifier: "",
    password: "",
  });

  // Sign Up state
  const [signUpData, setSignUpData] = React.useState({
    name: "",
    email: "",
    admissionNumber: "",
    yearOfStudy: "3rd Year",
    department: "Computer Science & Engineering",
    mobileNumber: "",
    password: "",
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
    if (notFoundNotice) setNotFoundNotice(false);
  };

  const handleSignUpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
    if (accountExistsNotice) setAccountExistsNotice(false);
  };

  // Sign In Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setNotFoundNotice(false);

    if (!signInData.identifier.trim()) {
      setErrorMessage("Please enter your registered email address or admission number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: signInData.identifier.trim(),
          password: signInData.password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.notFound) {
          setNotFoundNotice(true);
          setErrorMessage(data.error || "No registered account found.");
        } else {
          setErrorMessage(data.error || "Authentication failed. Please check credentials.");
        }
        return;
      }

      setSuccessMessage(data.message || "Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/participant");
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setAccountExistsNotice(false);

    // Validation
    if (
      !signUpData.name.trim() ||
      !signUpData.email.trim() ||
      !signUpData.admissionNumber.trim() ||
      !signUpData.yearOfStudy ||
      !signUpData.department ||
      !signUpData.mobileNumber.trim()
    ) {
      setErrorMessage("Please complete all participant registration fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name.trim(),
          email: signUpData.email.trim(),
          admissionNumber: signUpData.admissionNumber.trim(),
          yearOfStudy: signUpData.yearOfStudy,
          department: signUpData.department,
          mobileNumber: signUpData.mobileNumber.trim(),
          password: signUpData.password.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.accountExists) {
          setAccountExistsNotice(true);
          setErrorMessage(data.error || "An account already exists with these details.");
        } else {
          setErrorMessage(data.error || "Registration failed. Please check inputs.");
        }
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to workspace...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/participant");
      }, 800);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#111111] text-white items-center justify-center font-black text-base shadow-sm">
            B26
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">
            BUILD26 Authentication Portal
          </h1>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Collegiate product-building bootcamp command center & participant operating system.
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Sign Up) */}
        <div className="grid grid-cols-2 p-1 bg-surface-subtle border border-border rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode("SIGNIN");
              setErrorMessage(null);
              setAccountExistsNotice(false);
              setNotFoundNotice(false);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "SIGNIN"
                ? "bg-surface text-[#111111] shadow-xs border border-border/80"
                : "text-secondary hover:text-[#111111]"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("SIGNUP");
              setErrorMessage(null);
              setAccountExistsNotice(false);
              setNotFoundNotice(false);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "SIGNUP"
                ? "bg-surface text-[#111111] shadow-xs border border-border/80"
                : "text-secondary hover:text-[#111111]"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up (Register)</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>

            {/* Quick Action: Account Exists -> Prompt Sign In */}
            {accountExistsNotice && (
              <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                <span className="text-[11px] text-rose-700">Already have your account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNIN");
                    setSignInData((prev) => ({
                      ...prev,
                      identifier: signUpData.email || signUpData.admissionNumber,
                    }));
                    setErrorMessage(null);
                    setAccountExistsNotice(false);
                  }}
                  className="font-bold underline text-rose-900 hover:text-black flex items-center gap-1 text-[11px]"
                >
                  <span>Switch to Sign In</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Quick Action: Not Found -> Prompt Sign Up */}
            {notFoundNotice && (
              <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                <span className="text-[11px] text-rose-700">New participant to BUILD26?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNUP");
                    setSignUpData((prev) => ({
                      ...prev,
                      email: signInData.identifier.includes("@") ? signInData.identifier : prev.email,
                      admissionNumber: !signInData.identifier.includes("@")
                        ? signInData.identifier
                        : prev.admissionNumber,
                    }));
                    setErrorMessage(null);
                    setNotFoundNotice(false);
                  }}
                  className="font-bold underline text-rose-900 hover:text-black flex items-center gap-1 text-[11px]"
                >
                  <span>Create Account (Sign Up)</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Card Form */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft">
          {authMode === "SIGNIN" ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1 pb-1 border-b border-border/70">
                <h2 className="text-base font-bold text-[#111111]">Sign In to Your Workspace</h2>
                <p className="text-[11px] text-secondary">
                  Access your participant command center or administrative dashboard.
                </p>
              </div>

              {/* Identifier: Email or Admission Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                  <span>Email Address or Admission Number</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="identifier"
                  required
                  placeholder="e.g. thiganth@college.edu or 26ADM0101 or admin@build26.org"
                  value={signInData.identifier}
                  onChange={handleSignInChange}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-secondary" />
                    <span>Password</span>
                  </label>
                  <span className="text-[10px] text-secondary">Optional for seeded accounts</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter account password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className="w-full h-9 pl-3 pr-9 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-[#111111]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  className="w-full text-xs font-semibold gap-2"
                  isLoading={loading}
                >
                  <span>Sign In to BUILD26</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="text-center text-xs text-secondary pt-2">
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNUP");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-accent hover:underline"
                >
                  Sign Up here
                </button>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1 pb-1 border-b border-border/70">
                <h2 className="text-base font-bold text-[#111111]">
                  Participant Registration (Sign Up)
                </h2>
                <p className="text-[11px] text-secondary">
                  Register as a participant for BUILD26. After registration, you can create or join a squad.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-secondary" />
                  <span>Full Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Thiganth K."
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-secondary" />
                    <span>College Email</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@college.edu"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-secondary" />
                    <span>Mobile Number</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    placeholder="e.g. 9876543210"
                    value={signUpData.mobileNumber}
                    onChange={handleSignUpChange}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Admission Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-secondary" />
                  <span>Admission Number / Roll No</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  required
                  placeholder="e.g. 21CS042 / 26ADM0101"
                  value={signUpData.admissionNumber}
                  onChange={handleSignUpChange}
                  className="w-full h-9 px-3 text-xs font-mono-num rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent uppercase"
                />
              </div>

              {/* Department & Year of Study */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-secondary" />
                    <span>Department</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={signUpData.department}
                    onChange={handleSignUpChange}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-secondary" />
                    <span>Year of Study</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="yearOfStudy"
                    value={signUpData.yearOfStudy}
                    onChange={handleSignUpChange}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password (Optional or for future logins) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-secondary" />
                    <span>Create Password</span>
                  </label>
                  <span className="text-[10px] text-secondary">Optional (Min 6 chars)</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    className="w-full h-9 pl-3 pr-9 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-[#111111]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  className="w-full text-xs font-semibold gap-2"
                  isLoading={loading}
                >
                  <span>Create Account & Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="text-center text-xs text-secondary pt-2">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNIN");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-accent hover:underline"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-secondary">
          <Link href="/" className="hover:underline">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
