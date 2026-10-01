"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 py-12 selection:bg-accent selection:text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-accent transition-colors">
              B26
            </div>
            <span className="text-xl font-black text-[#111111] tracking-tight">
              BUILD26
            </span>
          </Link>
          <h1 className="text-xl font-black text-[#111111] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-secondary">
            Enter your college email to receive password reset instructions.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111111]">Instructions Sent</h3>
                <p className="text-xs text-secondary leading-relaxed">
                  We have sent reset instructions to <span className="font-semibold text-[#111111]">{email}</span>.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                  <span>College Email</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-border bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full text-xs font-bold gap-2 uppercase tracking-wider py-3 shadow-sm"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-secondary hover:text-[#111111] inline-flex items-center gap-1.5 font-medium"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
