"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useChangePassword } from "@/hooks/user/useChangePassword";

export default function ChangePasswordForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, errors, handleSubmit, isPending, onSubmit } =
    useChangePassword();

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Change Password
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Old Password */}
        <div>
          <label
            htmlFor="oldPassword"
            className="mb-2 block text-sm font-medium text-foreground">
            Current Password
          </label>

          <div className="relative">
            <input
              {...register("oldPassword")}
              id="oldPassword"
              type={showOld ? "text" : "password"}
              placeholder="Enter current password"
              className="h-11 w-full rounded-lg border border-input bg-background px-4 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {errors.oldPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.oldPassword.message}
          </p>
        )}

        <div className="flex w-full flex-col gap-4 md:flex-row md:items-start">
          {/* New Password */}
          <div className="flex-1">
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-foreground">
              New Password
            </label>

            <div className="relative">
              <input
                {...register("newPassword")}
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                className="h-11 w-full rounded-lg border border-input bg-background px-4 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex-1">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-foreground">
              Confirm Password
            </label>

            <div className="relative">
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="h-11 w-full rounded-lg border border-input bg-background px-4 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}
