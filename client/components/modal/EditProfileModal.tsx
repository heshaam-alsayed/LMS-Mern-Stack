"use client";

import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IUser, IUpdateUserInfo } from "@/types/auth.type";

import Loader from "../shared/Loader";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

const PHONE_PATTERN = /^\+?[\d\s()-]{6,20}$/;

const NAME_MIN = 3;
const NAME_MAX = 20;

type Props = {
  user: IUser;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: IUpdateUserInfo) => void;
};

export default function EditProfileModal({
  user,
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");

  useEffect(() => {
    if (!isOpen) return;

    setName(user.name);
    setPhone(user.phone ?? "");
  }, [isOpen, user.name, user.phone]);

  useModalBehavior({ isOpen, onClose });

  if (!isOpen) return null;

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  const isNameValid =
    trimmedName.length >= NAME_MIN && trimmedName.length <= NAME_MAX;

  const isPhoneValid =
    !trimmedPhone || PHONE_PATTERN.test(trimmedPhone);

  const hasChanges =
    trimmedName !== user.name.trim() || trimmedPhone !== (user.phone ?? "").trim();

  const isSubmitDisabled = !isNameValid || !isPhoneValid || !hasChanges || isLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) return;

    onSubmit({ name: trimmedName, phone: trimmedPhone });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (isLoading) return;

        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile"
        className="relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Pencil className="h-5 w-5 text-primary" />
              </div>

              <div className="pt-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Update your account name and phone number.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-foreground">
                  Full name
                </label>

                <span className="text-xs text-muted-foreground">
                  {trimmedName.length}/{NAME_MAX}
                </span>
              </div>

              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                disabled={isLoading}
                autoComplete="name"
                spellCheck={false}
                aria-invalid={name.length > 0 && !isNameValid}
                className={`h-11 transition-colors ${
                  name.length > 0 && !isNameValid
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : ""
                }`}
              />

              {name.length > 0 && !isNameValid && (
                <p className="text-xs text-destructive">
                  Name must be between {NAME_MIN} and {NAME_MAX} characters.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-email"
                className="text-sm font-medium text-foreground">
                Email address
              </label>

              <Input
                id="profile-email"
                value={user.email}
                disabled
                readOnly
                className="h-11 bg-muted text-muted-foreground"
              />

              <p className="text-xs text-muted-foreground">
                Email is your sign in identity and cannot be changed here.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-phone"
                className="text-sm font-medium text-foreground">
                Phone number
              </label>

              <Input
                id="profile-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Optional"
                disabled={isLoading}
                autoComplete="tel"
                inputMode="tel"
                aria-invalid={phone.length > 0 && !isPhoneValid}
                className={`h-11 transition-colors ${
                  phone.length > 0 && !isPhoneValid
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : ""
                }`}
              />

              {phone.length > 0 && !isPhoneValid ? (
                <p className="text-xs text-destructive">
                  Use 6 to 20 characters. Digits, spaces and + - ( ) only.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Leave empty to remove your phone number.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}>
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="min-w-[130px]">
                {isLoading ? (
                  <>
                    <Loader size={16} />

                    <span>Saving…</span>
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
