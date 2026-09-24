import { Suspense } from "react";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center px-4 py-12">
      <div className="mb-5 w-full max-w-[440px]">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}