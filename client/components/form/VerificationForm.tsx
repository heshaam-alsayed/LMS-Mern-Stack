"use client";

import { useVerification } from "@/hooks/auth/useVerification";
import VerificationInputs from "../verification/VerificationInputs";
import VerificationHeader from "../verification/VerificationHeader";
import VerificationActions from "../verification/VerificationActions";

export default function VerificationForm() {
  const {
    code,
    invalidError,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    countdown,
    handleResendCode,
    isCompleted,
    isResending,
    isPending,
    error,
  } = useVerification();

  return (
    <div className="w-full max-w-[400px] px-4">
      <div className="space-y-8">
        <VerificationHeader />
        <VerificationInputs
          code={code}
          invalidError={invalidError}
          inputRefs={inputRefs}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
        />

        {invalidError && error && (
          <div className="bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-center text-sm">
            {error.message}
          </div>
        )}

        <VerificationActions
          countdown={countdown}
          isResending={isResending}
          isCompleted={isCompleted}
          handleResendCode={handleResendCode}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
