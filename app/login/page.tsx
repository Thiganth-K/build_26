"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  User,
  Hash,
  Building2,
  Calendar,
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
  const [activeTab, setActiveTab] = React.useState<"PARTICIPANT" | "STAFF">("PARTICIPANT");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Participant form fields
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    admissionNumber: "",
    yearOfStudy: "3rd Year",
    department: "Computer Science & Engineering",
    mobileNumber: "",
  });

  // Staff form field
  const [staffEmail, setStaffEmail] = React.useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.admissionNumber.trim() ||
      !formData.yearOfStudy ||
      !formData.department ||
      !formData.mobileNumber.trim()
    ) {
      setErrorMessage("Please fill in all participant details.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "PARTICIPANT",
          name: formData.name.trim(),
          email: formData.email.trim(),
          admissionNumber: formData.admissionNumber.trim(),
          yearOfStudy: formData.yearOfStudy,
          department: formData.department,
          mobileNumber: formData.mobileNumber.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please check your inputs.");
        return;
      }

      router.push(data.redirectUrl || "/participant");
    } catch (err) {
      console.error(err);
      setErrorMessage("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!staffEmail.trim()) {
      setErrorMessage("Please provide your registered staff or mentor email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: staffEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "User not found in registered accounts.");
        return;
      }

      router.push(data.redirectUrl || "/admin");
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#111111] text-white items-center justify-center font-black text-base shadow-sm">
            B26
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">
            BUILD26 Authentication
          </h1>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            College Innovation & Product Building Bootcamp Management Platform.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-surface-subtle border border-border rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("PARTICIPANT");
              setErrorMessage(null);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "PARTICIPANT"
                ? "bg-surface text-[#111111] shadow-xs border border-border/80"
                : "text-secondary hover:text-[#111111]"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Participant Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("STAFF");
              setErrorMessage(null);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "STAFF"
                ? "bg-surface text-[#111111] shadow-xs border border-border/80"
                : "text-secondary hover:text-[#111111]"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin / Mentor</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Card Form */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-soft">
          {activeTab === "PARTICIPANT" ? (
            <form onSubmit={handleParticipantSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-[#111111]">
                  Participant Details & Verification
                </h2>
                <p className="text-[11px] text-secondary">
                  Please verify your credentials to log in or initialize your student workspace.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                  <User className="h-3 w-3 text-secondary" />
                  <span>Full Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Thiganth K."
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-secondary" />
                    <span>Email Address</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-secondary" />
                    <span>Mobile Number</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Admission Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                  <Hash className="h-3 w-3 text-secondary" />
                  <span>Admission Number / Roll No</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  required
                  placeholder="e.g. 21CS042 / ADM2026101"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  className="w-full h-9 px-3 text-xs font-mono-num rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Department & Year of Study */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-secondary" />
                    <span>Department</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
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
                  <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-secondary" />
                    <span>Year of Study</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
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

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  className="w-full text-xs font-semibold gap-2"
                  isLoading={loading}
                >
                  <span>Sign In to Participant Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="text-[11px] text-secondary text-center pt-1">
                Your workspace will link automatically to your team and daily submission board.
              </div>
            </form>
          ) : (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-[#111111]">
                  Staff & Mentor Command Center
                </h2>
                <p className="text-[11px] text-secondary">
                  Access restricted to registered faculty, mentors, and bootcamp administrators.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#111111] flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-secondary" />
                  <span>Registered Staff Email</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@build26.org"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  className="w-full text-xs font-semibold gap-2"
                  isLoading={loading}
                >
                  <span>Access Command Center</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border/70 text-[11px] text-secondary space-y-1">
                <div className="font-semibold text-[#111111]">Default Staff Accounts:</div>
                <div>• Super Admin: <span className="font-mono-num text-[#111111]">admin@build26.org</span></div>
                <div>• Operations: <span className="font-mono-num text-[#111111]">ops@build26.org</span></div>
                <div>• Lead Mentor: <span className="font-mono-num text-[#111111]">mentor.kumar@build26.org</span></div>
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
