"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck, Timer, X } from "lucide-react";

import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { style } from "@/app/utils/style";

import Loader from "../shared/Loader";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
  const {
    form,
    onSubmit,
    isPending,
    isSent,
    countdown,
    countdownLabel,
  } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useModalBehavior({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Forgot password"
        className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Close">
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25">
              <KeyRound className="size-7" />
            </div>

            <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Password Recovery
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Forgot your password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter the email address you use to sign in and we&apos;ll send
              you a secure link to reset your password.
            </p>
          </div>

          {isSent && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-left">
              <MailCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Check your inbox
                </p>

                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  If that email is registered, a reset link has been sent. Don&apos;t
                  forget to check your spam folder.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
            <div className="space-y-2">
              <label className={style.label} htmlFor="forgot-email">
                Email address
              </label>

              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email?.message)}
                className={`${style.input} h-11`}
                {...register("email")}
              />

              {errors.email?.message && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || (isSent && countdown > 0)}>
              {isPending ? (
                <Loader />
              ) : isSent && countdown > 0 ? (
                <>
                  <Timer className="size-4" />
                  Resend in {countdownLabel}
                </>
              ) : isSent ? (
                "Resend reset link"
              ) : (
                "Send reset link"
              )}
            </Button>

            {isSent && countdown === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                You can request a new link every 3 minutes.
              </p>
            )}
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/forgot-password"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="size-3.5" />
              Open full page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
