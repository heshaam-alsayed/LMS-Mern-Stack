"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck, Timer } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { style } from "@/app/utils/style";
import Loader from "../shared/Loader";

export default function ForgotPasswordForm() {
  const {
    form,
    onSubmit,
    isPending,
    isSent,
    countdown,
    canSubmit,
    countdownLabel,
  } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25">
          <KeyRound className="size-7" />
        </div>

        <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Password Recovery
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter the email address you used to sign up and we&apos;ll send you a
          secure link to reset your password.
        </p>
      </div>


      {isSent && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-left">
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

     
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className={style.label} htmlFor="email">
            Email address
          </label>

          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email?.message)}
              className={`${style.input} pr-9`}
              {...register("email")}
            />
          </div>

          {errors.email?.message && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !canSubmit}
        >
          {isPending ? (
            <Loader />
          ) : !canSubmit ? (
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

        {!canSubmit && (
          <p className="text-center text-xs text-muted-foreground">
            You can request a new link every 3 minutes.
          </p>
        )}
      </form>
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="size-3.5" />
          Back to login
        </Link>
      </div>
    </div>
  );
}