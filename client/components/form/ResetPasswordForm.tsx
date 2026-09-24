"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheck, XCircle } from "lucide-react";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { style } from "@/app/utils/style";
import Loader from "../shared/Loader";

export default function ResetPasswordForm() {
  const {
    form,
    onSubmit,
    isPending,
    hasToken,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  if (!hasToken) {
    return (
      <div className="w-full text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <XCircle className="size-7" />
        </div>

        <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Invalid Link
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          This link is invalid or expired
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          The password reset link is missing or no longer valid. Please request
          a new one to reset your password.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/forgot-password">Request a new link</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/login">
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25">
          <ShieldCheck className="size-7" />
        </div>

        <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Reset Password
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Set a new password
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Choose a strong password you haven&apos;t used before, then confirm it
          below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className={style.label} htmlFor="password">
            New password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password?.message)}
              className={`${style.input} pr-10`}
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password?.message && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={style.label} htmlFor="confirmPassword">
            Confirm new password
          </label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword?.message)}
              className={`${style.input} pr-10`}
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }>
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword?.message && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader /> : "Reset password"}
        </Button>
      </form>

      {/* Footer */}
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