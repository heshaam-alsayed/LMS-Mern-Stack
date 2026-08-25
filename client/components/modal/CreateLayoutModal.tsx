"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModalBehavior } from "@/customHooks/useModalBehavior";
import Loader from "../shared/Loader";

type LayoutType = "banner" | "faq" | "categories";

interface CreateLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: LayoutType) => void;
  isLoading: boolean;
}

export default function CreateLayoutModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateLayoutModalProps) {
  const [type, setType] = useState<LayoutType | "">("");

  const handleSubmit = () => {
    if (!type) return;

    onSubmit(type);
  };

  useModalBehavior({
    isOpen,
    onClose,
  });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Create Layout
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select the type of layout you want to create.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close modal">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Layout Type
            </label>

            <Select
              value={type}
              onValueChange={(value) => setType(value as LayoutType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select layout type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="banner">Banner</SelectItem>

                <SelectItem value="faq">FAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
            Cancel
          </button>

          <button
            type="button"
            disabled={!type || isLoading}
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader /> Creating...
              </span>
            ) : (
              " Create Layout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
