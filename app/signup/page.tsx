import { Suspense } from "react";
import LoginPage from "@/app/login/page";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs text-secondary">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
