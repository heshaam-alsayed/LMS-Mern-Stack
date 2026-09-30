"use client";

import { Info, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemLabel?: string;
};

export default function RemoveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemLabel = "lecture",
}: Props) {
  useModalBehavior({ isOpen, onClose });

  if (!isOpen) {
    return null;
  }

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
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>

              <div className="pt-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Remove this {itemLabel}?
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {itemName ? (
                    <>
                      &quot;{itemName}&quot; will be removed from the course.
                    </>
                  ) : (
                    <>This {itemLabel} will be removed from the course.</>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="text-sm leading-5 text-muted-foreground">
              This only removes the {itemLabel} from the form. It is{" "}
              <span className="font-medium text-foreground">
                not saved yet
              </span>{" "}
              &mdash; the change is applied when you click{" "}
              <span className="font-medium text-foreground">Save</span> in the
              last step. If you leave the page without saving, the{" "}
              {itemLabel} stays in the course.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              className="gap-2">
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
