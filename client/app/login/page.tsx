"use client";

import LoginForm from "@/components/form/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className=" flex justify-center px-4 mt-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-5 text-center">
          <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
             Welcome back
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Sign in to continue
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Access your courses, track your learning progress, and pick up
            exactly where you left off.
          </p>
        </div>

        <LoginForm mode="login" toggleMode={() => router.push("/signup")} />
      </div>
    </div>
  );
}
