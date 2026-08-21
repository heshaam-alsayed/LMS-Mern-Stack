"use client";

import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Loader from "../shared/Loader";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isOpen: boolean;
  title: string;
  header: string;
  confirmationText: string;
  description?: string;
};

export default function DeleteConfirmationModal({
  onClose,
  onConfirm,
  isLoading,
  isOpen,
  title,
  header,
  confirmationText,
  description,
}: Props) {
  const [value, setValue] = useState("");

  const isConfirmed = value === confirmationText;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConfirmed || isLoading) {
      return;
    }

    onConfirm();
  };

  useModalBehavior({
    isOpen,
    onClose,
  });
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          {/* ==================== HEADER ==================== */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Warning Icon */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>

              {/* Header Content */}

              <div className="pt-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {header}
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {description ??
                    `Are you sure you want to delete ${title}? This action cannot be undone.`}
                </p>
              </div>
            </div>

            {/* ==================== CLOSE ==================== */}

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ==================== CONFIRMATION ==================== */}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2.5">
              <label
                htmlFor="delete-confirmation"
                className="text-sm font-medium text-foreground">
                Type the following to confirm:
              </label>

              {/* Confirmation Text */}

              <div className="flex min-h-10 items-center rounded-lg border border-border bg-muted/50 px-3">
                <code className="break-all text-sm font-semibold text-foreground">
                  {confirmationText}
                </code>
              </div>

              {/* Input */}

              <div className="relative">
                <Input
                  id="delete-confirmation"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`Type "${confirmationText}"`}
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck={false}
                  className={`h-11 pr-10 transition-colors ${
                    value.length > 0
                      ? isConfirmed
                        ? "border-green-500 focus-visible:ring-green-500/30"
                        : "border-destructive focus-visible:ring-destructive/30"
                      : ""
                  }`}
                />

                {value.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isConfirmed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>

              {/* Validation message */}

              {value.length > 0 && !isConfirmed && (
                <p className="text-xs text-destructive">
                  The confirmation text does not match.
                </p>
              )}

              {isConfirmed && (
                <p className="text-xs text-green-600 dark:text-green-500">
                  Confirmation text matches.
                </p>
              )}
            </div>

            {/* ==================== BUTTONS ==================== */}

            <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="destructive"
                disabled={!isConfirmed || isLoading}
                className="min-w-[100px]">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
