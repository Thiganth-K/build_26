"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "SIGNUP" : "SIGNIN";

  const [authMode, setAuthMode] = React.useState<"SIGNIN" | "SIGNUP">(initialMode);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Status banners
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [accountExistsNotice, setAccountExistsNotice] = React.useState(false);
  const [notFoundNotice, setNotFoundNotice] = React.useState(false);

  // Sign In state (Section 03)
  const [signInData, setSignInData] = React.useState({
    email: "",
    password: "",
  });

  // Sign Up state (Section 02)
  const [signUpData, setSignUpData] = React.useState({
    name: "",
    college: "Sona College of Technology",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
    if (notFoundNotice) setNotFoundNotice(false);
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMessage) setErrorMessage(null);
    if (accountExistsNotice) setAccountExistsNotice(false);
  };

  // Sign In Handler (Section 03)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setNotFoundNotice(false);

    if (!signInData.email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: signInData.email.trim(),
          password: signInData.password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.notFound) {
          setNotFoundNotice(true);
          setErrorMessage(data.error || "No registered account found. Please sign up first.");
        } else {
          setErrorMessage(data.error || "Authentication failed. Please check your credentials.");
        }
        return;
      }

      setSuccessMessage(data.message || "Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/participant");
      }, 600);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler (Section 02)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setAccountExistsNotice(false);

    // Validation
    if (!signUpData.name.trim()) {
      setErrorMessage("Full Name is required.");
      return;
    }
    if (!signUpData.college.trim()) {
      setErrorMessage("College / Institution is required.");
      return;
    }
    if (!signUpData.email.trim()) {
      setErrorMessage("College Email is required.");
      return;
    }
    if (!signUpData.phone.trim()) {
      setErrorMessage("Phone Number is required.");
      return;
    }
    if (!signUpData.password) {
      setErrorMessage("Password is required.");
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (!signUpData.agreeTerms) {
      setErrorMessage("You must agree to the Build26 participation terms.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name.trim(),
          college: signUpData.college.trim(),
          email: signUpData.email.trim(),
          phone: signUpData.phone.trim(),
          password: signUpData.password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.accountExists) {
          setAccountExistsNotice(true);
          // Wireframe Section 02 exact message:
          setErrorMessage("Account already exists. Please sign in.");
        } else {
          setErrorMessage(data.error || "Registration failed. Please check inputs.");
        }
        return;
      }

      setSuccessMessage("Account created successfully! Directing to participant workspace...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/participant");
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click login helper
  const handleQuickLogin = (email: string) => {
    setSignInData({ email, password: "password123" });
    setAuthMode("SIGNIN");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 py-12 selection:bg-accent selection:text-white">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-accent transition-colors">
              B26
            </div>
            <span className="text-xl font-black text-[#111111] tracking-tight">
              BUILD26
            </span>
          </Link>
          <p className="text-xs text-secondary font-mono-num font-semibold uppercase tracking-wider">
            BUILD • COLLABORATE • SHIP
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
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              authMode === "SIGNIN"
                ? "bg-surface text-[#111111] shadow-xs border border-border"
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
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              authMode === "SIGNUP"
                ? "bg-surface text-[#111111] shadow-xs border border-border"
                : "text-secondary hover:text-[#111111]"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed font-semibold">{errorMessage}</div>
            </div>

            {/* Quick Action: Account Exists -> Prompt Sign In */}
            {accountExistsNotice && (
              <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                <span className="text-[11px] text-rose-700">Already registered?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNIN");
                    setSignInData((prev) => ({
                      ...prev,
                      email: signUpData.email,
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
                <span className="text-[11px] text-rose-700">New participant?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNUP");
                    setSignUpData((prev) => ({
                      ...prev,
                      email: signInData.email,
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

        {/* Primary Form Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card">
          {authMode === "SIGNIN" ? (
            /* ================= SIGN IN (Wireframe Section 03) ================= */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="text-center pb-2 border-b border-border/70 space-y-1">
                <h2 className="text-lg font-bold text-[#111111]">
                  WELCOME BACK
                </h2>
                <p className="text-[11px] text-secondary">
                  Sign in with your email to continue your Build26 journey.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. participant@college.edu or admin@build26.org"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-secondary" />
                    <span>Password</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-accent hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className="w-full h-10 px-3.5 pr-10 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-secondary hover:text-[#111111]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  className="w-full text-xs font-bold gap-2 uppercase tracking-wider py-3 shadow-sm"
                  isLoading={loading}
                >
                  <span>SIGN IN</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="text-center text-xs text-secondary pt-2">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNUP");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-accent hover:underline uppercase tracking-wider ml-1"
                >
                  [ SIGN UP ]
                </button>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP (Wireframe Section 02) ================= */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="text-center pb-2 border-b border-border/70 space-y-1">
                <h2 className="text-lg font-bold text-[#111111]">
                  CREATE YOUR ACCOUNT
                </h2>
                <p className="text-[11px] text-secondary">
                  Join Build26 — A 6-Day Product Building Bootcamp.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-secondary" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Thiganth K"
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* College / Institution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-secondary" />
                  <span>College / Institution</span>
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="e.g. Sona College of Technology"
                  value={signUpData.college}
                  onChange={handleSignUpChange}
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* College Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-secondary" />
                    <span>College Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@college.edu"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-secondary" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={signUpData.phone}
                    onChange={handleSignUpChange}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-secondary" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={signUpData.password}
                      onChange={handleSignUpChange}
                      className="w-full h-10 px-3.5 pr-8 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-secondary hover:text-[#111111]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-secondary" />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      value={signUpData.confirmPassword}
                      onChange={handleSignUpChange}
                      className="w-full h-10 px-3.5 pr-8 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-secondary hover:text-[#111111]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={signUpData.agreeTerms}
                    onChange={handleSignUpChange}
                    className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-accent cursor-pointer"
                  />
                  <span className="text-[11px] text-secondary leading-snug">
                    I agree to the Build26 participation terms and bootcamp rules
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  className="w-full text-xs font-bold gap-2 uppercase tracking-wider py-3 shadow-sm"
                  isLoading={loading}
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="text-center text-xs text-secondary pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNIN");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-accent hover:underline uppercase tracking-wider ml-1"
                >
                  [ SIGN IN ]
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Demo Switcher helper */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-surface-subtle/60 text-xs space-y-2">
          <div className="text-[10px] font-mono-num font-bold text-secondary uppercase tracking-wider">
            Quick Testing Credentials (1-Click)
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@build26.org")}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-border bg-surface text-[#111111] hover:border-accent hover:text-accent font-medium transition-all"
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("thiganth@college.edu")}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-border bg-surface text-[#111111] hover:border-accent hover:text-accent font-medium transition-all"
            >
              👤 Thiganth K (Team Lead)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("neha@college.edu")}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-border bg-surface text-[#111111] hover:border-accent hover:text-accent font-medium transition-all"
            >
              👤 Neha Prapti (Participant)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center p-8 text-xs text-secondary font-mono">Loading authentication...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
