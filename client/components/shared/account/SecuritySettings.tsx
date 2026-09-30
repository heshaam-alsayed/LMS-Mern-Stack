"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useChangePassword } from "@/hooks/user/useChangePassword";
import { useAppSelector } from "@/redux/hooks";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

import ForgotPasswordModal from "@/components/modal/ForgotPasswordModal";

const DATE_FORMAT = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

const TIME_FORMAT = {
  hour: "numeric",
  minute: "2-digit",
} as const;

const RULES = [
  { id: "length", label: "At least 8 characters", test: (v: string) => v.trim().length >= 8 },
  { id: "lower", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { id: "upper", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "One number", test: (v: string) => /\d/.test(v) },
] as const;

type Props = {
  // shared by every role, so the wording follows whoever is signed in
  roleLabel?: string;
};

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  error,
  isVisible,
  onToggle,
  registration,
}: {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  isVisible: boolean;
  onToggle: () => void;
  registration: ReturnType<
    ReturnType<typeof useChangePassword>["register"]
  >;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <input
          {...registration}
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`h-11 w-full rounded-lg border bg-background px-4 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-input focus:border-primary focus:ring-primary/20"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}>
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function SecuritySettings({ roleLabel = "administrator" }: Props) {
  const user = useAppSelector((state) => state.auth.user);

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, errors, handleSubmit, onSubmit, isPending, watch } =
    useChangePassword();

  useModalBehavior({
    isOpen: isForgotOpen,
    onClose: () => setIsForgotOpen(false),
  });

  const newPassword = watch("newPassword") ?? "";

  if (!user) {
    return (
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="h-32 animate-pulse rounded-2xl border border-border bg-background lg:w-[360px] lg:shrink-0" />

        <div className="h-96 animate-pulse rounded-2xl border border-border bg-background lg:min-w-0 lg:flex-1" />
      </div>
    );
  }

  const lastUpdated = user.passwordUpdatedAt
    ? new Date(user.passwordUpdatedAt)
    : null;

  const isLocalProvider = user.provider === "local";

  const socialProviderLabel =
    user.provider === "google"
      ? "Google"
      : user.provider === "github"
        ? "GitHub"
        : null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="rounded-2xl border border-border bg-background p-6 lg:w-[360px] lg:shrink-0">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Security
            </h1>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage the password used to sign in to your {roleLabel} account.
            </p>
          </div>
        </div>

        {isLocalProvider ? (
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Password last updated
              </p>

              {lastUpdated ? (
                <p className="mt-1 text-sm font-medium text-foreground">
                  {lastUpdated.toLocaleDateString("en-US", DATE_FORMAT)}
                  <span className="text-muted-foreground">
                    {" at "}
                    {lastUpdated.toLocaleTimeString("en-US", TIME_FORMAT)}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm font-medium text-foreground">
                  Not recorded
                  <span className="block text-xs font-normal text-muted-foreground">
                    It will be tracked from your next password change.
                  </span>
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {isLocalProvider ? (
        <div className="rounded-2xl border border-border bg-background p-6 lg:min-w-0 lg:flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Change password
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use a strong password you have not used before.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <PasswordField
              id="current-password"
              label="Current password"
              placeholder="Enter current password"
              autoComplete="current-password"
              error={errors.oldPassword?.message}
              isVisible={showOld}
              onToggle={() => setShowOld((value) => !value)}
              registration={register("oldPassword")}
            />

            <PasswordField
              id="new-password"
              label="New password"
              placeholder="Enter new password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              isVisible={showNew}
              onToggle={() => setShowNew((value) => !value)}
              registration={register("newPassword")}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              isVisible={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
              registration={register("confirmPassword")}
            />

            {newPassword.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {RULES.map((rule) => {
                  const isValid = rule.test(newPassword);

                  return (
                    <li
                      key={rule.id}
                      className={`inline-flex items-center gap-2 text-xs ${
                        isValid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}>
                      {isValid ? (
                        <Check className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 shrink-0" />
                      )}

                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-sm font-medium text-primary transition-colors hover:underline">
                Forgot your password?
              </button>

              <Button type="submit" disabled={isPending} className="sm:w-48">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>

          <ForgotPasswordModal
            isOpen={isForgotOpen}
            onClose={() => setIsForgotOpen(false)}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-background p-6 lg:min-w-0 lg:flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Password
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {socialProviderLabel
                  ? `Your account is secured through ${socialProviderLabel}.`
                  : "Your account is secured through an external provider."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
