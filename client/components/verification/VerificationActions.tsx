import React from "react";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";

type VerificationActionsProps = {
  isCompleted: boolean;
  countdown: number;
  isResending: boolean;
  isPending: boolean;
  handleSubmit: () => void;
  handleResendCode: () => Promise<void>;
};

export default function VerificationActions({
  isCompleted,
  countdown,
  isResending,
  handleSubmit,
  handleResendCode,
  isPending,
}: VerificationActionsProps) {
  return (
    <div className="space-y-4">
      <Button
        className="w-full h-10"
        disabled={!isCompleted || isPending}
        onClick={handleSubmit}>
        {isPending ? <Loader /> : "Verify Account"}
      </Button>

      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-muted-foreground text-sm">
            Resend code in {countdown}s
          </p>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled={isResending}
            onClick={handleResendCode}>
            {isResending ? "Sending..." : "Resend Code"}
          </Button>
        )}
      </div>
    </div>
  );
}
