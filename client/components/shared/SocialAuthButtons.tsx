"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.34-1.03 2.47-2.19 3.23v2.69h3.54c2.08-1.91 3.29-4.73 3.29-7.93z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.69c-.98.66-2.23 1.05-3.74 1.05-2.88 0-5.32-1.94-6.19-4.55H2.18v2.78A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.81 14.15A6.6 6.6 0 0 1 5.5 12c0-.75.11-1.47.31-2.15V7.07H2.18A11 11 0 0 0 1 12c0 1.77.45 3.45 1.18 4.93l3.63-2.78z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.63 2.78C6.68 7.32 9.12 5.38 12 5.38z"
    />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.74.11 3.03.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
  </svg>
);

export default function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        onClick={() =>
          signIn("google", {
            redirectTo: "/?login=success",
          })
        }
        type="button"
        variant="outline"
        className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50 dark:border-gray-500 dark:hover:bg-gray-100">
        <GoogleIcon className="mr-2 h-4 w-4" />
        Google
      </Button>

      <Button
        onClick={() =>
          signIn("github", {
            redirectTo: "/?login=success",
          })
        }
        type="button"
        variant="outline"
        className="w-full bg-[#1f2328] border-[#3d444d] text-white hover:bg-[#32383f]">
        <GithubIcon className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}