"use client";

import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import Loader from "@/components/shared/Loader";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

type Props = {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function AvatarPreviewModal({
  isOpen,
  imageSrc,
  fileName,
  isLoading,
  onClose,
  onSave,
}: Props) {
  useModalBehavior({ isOpen, onClose });

  if (!isOpen || !imageSrc) return null;

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
        aria-label="Update profile picture"
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Profile picture
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Review your picture, then save it to your account.
              </p>
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

          <div className="mt-6 flex justify-center">
            <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40">
              <Image
                src={imageSrc}
                alt={fileName || "Selected profile picture"}
                width={256}
                height={256}
                unoptimized
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {fileName ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5 shrink-0" />

              <span className="max-w-[260px] truncate">{fileName}</span>
            </div>
          ) : null}

          <p className="mt-1 text-center text-xs text-muted-foreground">
            The whole image is uploaded as it is.
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onSave}
              disabled={isLoading}
              className="min-w-[110px]">
              {isLoading ? (
                <>
                  <Loader size={16} />

                  <span>Saving…</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
