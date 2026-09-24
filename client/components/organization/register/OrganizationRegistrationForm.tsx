"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { OrganizationRegistrationFormValues } from "@/hooks/auth/useOrganizationRegistration";

interface OrganizationRegistrationFormProps {
  form: UseFormReturn<OrganizationRegistrationFormValues>;
  onSubmit: (values: OrganizationRegistrationFormValues) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrganizationRegistrationForm({
  form,
  onSubmit,
  isPending,
  isError,
  error,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}: OrganizationRegistrationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const organizationDescription = watch("organizationDescription");

  return (
    <section className="min-h-full px-5 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="w-full max-w-2xl">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 justify-between">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create your organization
            </h1>
            <div className="flex size-12 items-center justify-center rounded-xl border bg-primary/5 text-primary">
              <Building2 className="size-6" />
            </div>
          </div>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Create your account and submit your organization for approval. Once
            approved, you will get access to the instructor dashboard.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border bg-muted/30 p-4">
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LockKeyhole className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">Approval required</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your account will remain pending until an administrator reviews
                and approves your organization application.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Account Information */}
          <div>
            <div className="mb-5">
              <h2 className="text-base font-semibold">Account information</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                These details will be used for your instructor account.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="h-11 pl-10"
                    disabled={isPending}
                    {...register("name")}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 pl-10"
                    disabled={isPending}
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-11 pl-10 pr-10"
                    disabled={isPending}
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    disabled={isPending}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }>
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium">
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="h-11 pl-10 pr-10"
                    disabled={isPending}
                    {...register("confirmPassword")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    disabled={isPending}
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

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div>
            <div className="mb-5">
              <h2 className="text-base font-semibold">
                Organization information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about the organization you want to create.
              </p>
            </div>

            <div className="space-y-5">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="mb-2 block text-sm font-medium">
                  Organization name
                </label>

                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="organizationName"
                    placeholder="e.g. Code Academy"
                    className="h-11 pl-10"
                    disabled={isPending}
                    {...register("organizationName")}
                  />
                </div>

                {errors.organizationName && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              {/* Organization Description */}
              <div>
                <label
                  htmlFor="organizationDescription"
                  className="mb-2 block text-sm font-medium">
                  Organization description{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>

                <Textarea
                  id="organizationDescription"
                  placeholder="Briefly describe your organization, what you teach, and who your courses are for..."
                  className="min-h-32 resize-none"
                  disabled={isPending}
                  {...register("organizationDescription")}
                />

                <div className="flex items-start justify-between gap-4">
                  {errors.organizationDescription ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.organizationDescription.message}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="mt-1.5 shrink-0 text-xs text-muted-foreground">
                    {organizationDescription?.length ?? 0}/500
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* API Error */}
          {isError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                {error?.message || "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="space-y-4">
            <Button type="submit" className="h-11 w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting application...
                </>
              ) : (
                <>
                  Submit organization application
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs leading-5 text-muted-foreground">
              By submitting this application, you agree that your organization
              will be reviewed before instructor access is granted.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
