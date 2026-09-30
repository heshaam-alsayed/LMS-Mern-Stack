"use client";

import { useState } from "react";
import { Building2, Check, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Organization,
  OrganizationStatus,
  UpdateOrganizationPayload,
} from "@/types/organization.type";

import Loader from "../shared/Loader";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

const STATUS_OPTIONS: { value: OrganizationStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

type Props = {
  organization: Organization;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateOrganizationPayload) => void;
};

export default function EditOrganizationModal({
  organization,
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(organization.name);

  const [status, setStatus] = useState<OrganizationStatus>(
    organization.status,
  );

  const trimmedName = name.trim();

  const isNameValid = trimmedName.length >= 2 && trimmedName.length <= 120;

  const isDuplicateName =
    trimmedName.length >= 2 &&
    trimmedName.toLowerCase() === organization.name.toLowerCase() &&
    trimmedName === organization.name;

  const hasChanges =
    trimmedName !== organization.name || status !== organization.status;

  const isSubmitDisabled = !isNameValid || !hasChanges || isLoading;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    onSubmit({ name: trimmedName, status });
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
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>

              <div className="pt-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Edit Organization
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Update the organization name and status.
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
                  htmlFor="organization-name"
                  className="text-sm font-medium text-foreground">
                  Organization name
                </label>

                <span className="text-xs text-muted-foreground">
                  {trimmedName.length}/120
                </span>
              </div>

              <Input
                id="organization-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Organization name"
                disabled={isLoading}
                autoComplete="off"
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
                  Name must be between 2 and 120 characters.
                </p>
              )}

              {isDuplicateName && (
                <p className="text-xs text-muted-foreground">
                  Name is unchanged. Change it or update the status to save.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="organization-status"
                className="text-sm font-medium text-foreground">
                Status
              </label>

              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as OrganizationStatus)
                }>
                <SelectTrigger
                  id="organization-status"
                  disabled={isLoading}
                  className="h-11 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Suspending an organization blocks its instructor from managing
                courses.
              </p>
            </div>

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
                disabled={isSubmitDisabled}
                className="min-w-[150px]">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Save changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
