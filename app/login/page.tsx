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
    <div className="min-h-screen w-full bg-[#F7F7F5] grid grid-cols-1 lg:grid-cols-2 selection:bg-[#4E56E8] selection:text-white">
      {/* ========================================================= */}
      {/* LEFT COLUMN: EXACT 50% SPLIT (SIGN IN / SIGN UP)           */}
      {/* ========================================================= */}
      <div className="w-full min-h-screen flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 bg-white border-r-0 lg:border-r-2 lg:border-black overflow-y-auto">
        <div className="w-full max-w-md xl:max-w-lg mx-auto space-y-6">
          {/* Top Row: Back to Homepage Link & Status Pill */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-minecraft text-xs font-bold text-[#555555] hover:text-black transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>BACK TO HOMEPAGE</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1F1EF] border border-black/20 text-[10px] font-minecraft text-black font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D285] animate-pulse" />
              <span>SONA IT</span>
            </div>
          </div>

          {/* Official BUILD//26 Logo Brand Identity with Squircle Badge */}
          <div className="pt-1">
            <Link href="/" className="inline-flex items-center gap-3.5 group select-none">
              {/* Square Badge with Smooth Corners & // Slashes */}
              <div className="h-12 w-12 bg-black border-2 border-black rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0_0_#000] group-hover:scale-105 group-hover:shadow-none transition-all">
                <span className="font-sans font-black italic tracking-tighter text-2xl text-white select-none translate-x-[-1px]">
                  //
                </span>
              </div>

              <div>
                <div className="font-minecraft text-2xl sm:text-3xl font-black text-black tracking-tight leading-none flex items-center">
                  <span>BUILD</span>
                  <span className="text-[#4E56E8] italic font-sans font-black mx-1">//</span>
                  <span>26</span>
                </div>
                <div className="font-minecraft text-[10px] sm:text-[11px] text-[#555555] tracking-wider mt-1.5 flex items-center gap-1.5">
                  <span className="text-black font-bold">6-DAY BOOTCAMP</span>
                  <span className="font-sans font-bold text-black text-xs leading-none">|</span>
                  <span>PARTICIPANT OS</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Auth Mode Toggle Tabs (Sign In vs Sign Up) */}
          <div className="p-1 bg-[#F1F1EF] border-2 border-black rounded-xl grid grid-cols-2 shadow-[2px_2px_0_0_#000]">
            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGNIN");
                setErrorMessage(null);
                setAccountExistsNotice(false);
                setNotFoundNotice(false);
              }}
              className={`py-2 px-3 text-xs font-minecraft font-bold rounded-lg transition-all flex items-center justify-center gap-2 tracking-wider ${
                authMode === "SIGNIN"
                  ? "bg-black text-white shadow-xs"
                  : "text-[#666666] hover:text-black"
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>SIGN IN</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGNUP");
                setErrorMessage(null);
                setAccountExistsNotice(false);
                setNotFoundNotice(false);
              }}
              className={`py-2 px-3 text-xs font-minecraft font-bold rounded-lg transition-all flex items-center justify-center gap-2 tracking-wider ${
                authMode === "SIGNUP"
                  ? "bg-black text-white shadow-xs"
                  : "text-[#666666] hover:text-black"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>SIGN UP</span>
            </button>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl border-2 border-black bg-rose-50 text-rose-900 text-xs space-y-2 shadow-[2px_2px_0_0_#000] animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="leading-relaxed font-semibold">{errorMessage}</div>
              </div>

              {/* Quick Action: Account Exists -> Prompt Sign In */}
              {accountExistsNotice && (
                <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
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
                    className="font-bold underline text-rose-950 hover:text-black flex items-center gap-1 text-[11px]"
                  >
                    <span>Switch to Sign In</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Quick Action: Not Found -> Prompt Sign Up */}
              {notFoundNotice && (
                <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
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
                    className="font-bold underline text-rose-950 hover:text-black flex items-center gap-1 text-[11px]"
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
            <div className="p-4 rounded-xl border-2 border-black bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2.5 shadow-[2px_2px_0_0_#000] animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Primary Form Card */}
          <div className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0_0_#000]">
            {authMode === "SIGNIN" ? (
              /* ================= SIGN IN (Wireframe Section 03) ================= */
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="pb-3 border-b-2 border-black/10 space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] border border-black text-[10px] font-minecraft font-bold text-[#B45309]">
                    PARTICIPANT / ADMIN
                  </div>
                  <h2 className="text-xl font-black font-minecraft text-black tracking-tight">
                    WELCOME BACK
                  </h2>
                  <p className="text-xs text-[#555555]">
                    Enter your registered email address to access the bootcamp dashboard.
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                    <Mail className="h-3.5 w-3.5 text-[#555555]" />
                    <span>EMAIL ADDRESS</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. participant@college.edu or admin@build26.org"
                    value={signInData.email}
                    onChange={handleSignInChange}
                    className="w-full h-11 px-3.5 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                      <Lock className="h-3.5 w-3.5 text-[#555555]" />
                      <span>PASSWORD</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold text-[#4E56E8] hover:underline"
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
                      className="w-full h-11 px-3.5 pr-10 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#666666] hover:text-black cursor-pointer"
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
                    className="w-full text-xs font-minecraft font-black gap-2 uppercase tracking-wider py-3.5 rounded-xl border-2 border-black bg-black text-white hover:bg-[#00D285] hover:text-black shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                    isLoading={loading}
                  >
                    <span>SIGN IN TO BUILD//26</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="text-center text-xs text-[#555555] pt-1">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("SIGNUP");
                      setErrorMessage(null);
                    }}
                    className="font-minecraft font-bold text-[#4E56E8] hover:underline uppercase tracking-wider ml-1 cursor-pointer"
                  >
                    [ SIGN UP ]
                  </button>
                </div>
              </form>
            ) : (
              /* ================= SIGN UP (Wireframe Section 02) ================= */
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div className="pb-3 border-b-2 border-black/10 space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-[#DCFCE7] border border-black text-[10px] font-minecraft font-bold text-[#15803D]">
                    NEW SPRINTER
                  </div>
                  <h2 className="text-xl font-black font-minecraft text-black tracking-tight">
                    CREATE YOUR ACCOUNT
                  </h2>
                  <p className="text-xs text-[#555555]">
                    Register for the 6-Day Engineering Sprint at Sona College of Technology.
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                    <User className="h-3.5 w-3.5 text-[#555555]" />
                    <span>FULL NAME</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Alex Kumar"
                    value={signUpData.name}
                    onChange={handleSignUpChange}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                  />
                </div>

                {/* College / Institution */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                    <Building2 className="h-3.5 w-3.5 text-[#555555]" />
                    <span>COLLEGE / INSTITUTION</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    required
                    placeholder="e.g. Sona College of Technology"
                    value={signUpData.college}
                    onChange={handleSignUpChange}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                  />
                </div>

                {/* College Email & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                      <Mail className="h-3.5 w-3.5 text-[#555555]" />
                      <span>COLLEGE EMAIL</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="student@college.edu"
                      value={signUpData.email}
                      onChange={handleSignUpChange}
                      className="w-full h-10 px-3.5 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                      <Phone className="h-3.5 w-3.5 text-[#555555]" />
                      <span>PHONE NUMBER</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={signUpData.phone}
                      onChange={handleSignUpChange}
                      className="w-full h-10 px-3.5 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                      <Lock className="h-3.5 w-3.5 text-[#555555]" />
                      <span>PASSWORD</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="••••••••"
                        value={signUpData.password}
                        onChange={handleSignUpChange}
                        className="w-full h-10 px-3.5 pr-8 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-[#666666] hover:text-black cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-black flex items-center gap-1.5 font-minecraft">
                      <Lock className="h-3.5 w-3.5 text-[#555555]" />
                      <span>CONFIRM</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        value={signUpData.confirmPassword}
                        onChange={handleSignUpChange}
                        className="w-full h-10 px-3.5 pr-8 text-xs rounded-xl border-2 border-black bg-white text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4E56E8] shadow-[2px_2px_0_0_#000]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-[#666666] hover:text-black cursor-pointer"
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
                      className="mt-0.5 h-4 w-4 rounded border-2 border-black text-[#4E56E8] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px] text-[#555555] leading-snug">
                      I agree to the Build26 bootcamp rules, daily worklog logging &amp; team consensus protocol.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="w-full text-xs font-minecraft font-black gap-2 uppercase tracking-wider py-3.5 rounded-xl border-2 border-black bg-black text-white hover:bg-[#00D285] hover:text-black shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                    isLoading={loading}
                  >
                    <span>CREATE SPRINTER ACCOUNT</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="text-center text-xs text-[#555555] pt-1">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("SIGNIN");
                      setErrorMessage(null);
                    }}
                    className="font-minecraft font-bold text-[#4E56E8] hover:underline uppercase tracking-wider ml-1 cursor-pointer"
                  >
                    [ SIGN IN ]
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Demo Switcher helper (Super Admin) */}
          <div className="p-3.5 rounded-xl border-2 border-black bg-[#FAF9F5] shadow-[2px_2px_0_0_#000] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-minecraft font-bold text-black uppercase tracking-wider">
                QUICK ACCESS (SUPER ADMIN)
              </span>
              <span className="text-[9px] font-minecraft text-[#666666]">1-CLICK</span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@build26.org")}
                className="text-[11px] px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black hover:bg-black hover:text-white font-minecraft font-bold shadow-[2px_2px_0_0_#000] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>👑</span>
                <span>Super Admin (admin@build26.org)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="w-full max-w-md mx-auto pt-6 text-center text-[11px] text-[#777777] font-minecraft">
          <span>© 2026 Sona College of Technology • Department of IT</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: EXACT 50% GRID CELL WITH BLUEPRINT SCHEMATIC */}
      {/* ========================================================= */}
      <div className="hidden lg:flex w-full min-h-screen bg-[#F8F8F6] bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:28px_28px] p-6 sm:p-8 xl:p-12 flex-col justify-between relative overflow-hidden select-none sticky top-0 h-screen">
        {/* Top Header Status Ribbon */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-black pb-4 bg-white/80 backdrop-blur-xs -mx-2 px-3 py-2 rounded-xl border border-black shadow-[2px_2px_0_0_#000]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-black border-2 border-black rounded-lg flex items-center justify-center text-white font-sans font-black italic text-sm shadow-[2px_2px_0_0_#000]">
              //
            </div>
            <div>
              <div className="font-minecraft text-xs font-bold text-black tracking-wider flex items-center gap-2">
                <span>BUILD//26 ARCHITECTURE SPEC</span>
                <span className="w-2 h-2 rounded-full bg-[#00D285] animate-ping" />
              </div>
              <div className="font-minecraft text-[10px] text-[#666666]">
                SONA COLLEGE OF TECHNOLOGY • DEPT OF IT
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#FFE873] border border-black text-black font-minecraft text-[10px] font-bold">
              OFFICIAL BLUEPRINT
            </span>
            <span className="px-2.5 py-1 rounded bg-[#DCFCE7] border border-black text-[#15803D] font-minecraft text-[10px] font-bold">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Main Centerpiece: User Blueprint Architecture Image */}
        <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl xl:max-w-2xl group relative">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0_0_#000] relative space-y-3">
              {/* Window Header / Title Bar */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-minecraft">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-black" />
                  <span className="font-bold text-black tracking-wider">
                    SPEC_SHEET // DEPLOY_FLOW &amp; LEARN_MAP
                  </span>
                </div>
                <span className="bg-[#E0E7FF] px-2 py-0.5 border border-black font-bold text-[#3730A3] text-[10px]">
                  B26-SCHEMATIC
                </span>
              </div>

              {/* The User-Provided Blueprint Image */}
              <div className="relative rounded-xl overflow-hidden border-2 border-black bg-white shadow-xs">
                <img
                  src="/auth-blueprint.png"
                  alt="BUILD//26 Architecture Blueprint Diagram"
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>

              {/* Blueprint Sub-caption & Flow Metadata */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-minecraft text-[#555555]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">CODE</span>
                  <span>→</span>
                  <span className="font-bold text-black">DEPLOY</span>
                  <span>→</span>
                  <span className="font-bold text-black">SCALE</span>
                  <span>→</span>
                  <span className="font-bold text-[#4E56E8]">SHIP//26</span>
                </div>
                <span className="font-bold text-black bg-[#F1F1EF] px-1.5 py-0.5 rounded border border-black/30">
                  REF // 26
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner & Highlights */}
        <div className="relative z-10 pt-4 border-t-2 border-black flex flex-col gap-2.5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0_0_#000] text-center">
              <div className="font-minecraft text-xs font-bold text-black">DAY 01 - 06</div>
              <div className="font-minecraft text-[9px] text-[#666666] mt-0.5">Rapid Lifecycle</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0_0_#000] text-center">
              <div className="font-minecraft text-xs font-bold text-[#4E56E8]">120+ COHORTS</div>
              <div className="font-minecraft text-[9px] text-[#666666] mt-0.5">Sona College IT</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0_0_#000] text-center">
              <div className="font-minecraft text-xs font-bold text-[#00A86B]">LIVE SHIP</div>
              <div className="font-minecraft text-[9px] text-[#666666] mt-0.5">Jury Pitch Deck</div>
            </div>
          </div>

          <div className="text-center font-minecraft text-[10px] text-[#555555] tracking-wider">
            &ldquo;FROM PROBLEM STATEMENT TO LIVE PRODUCTION IN 6 DAYS.&rdquo;
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
