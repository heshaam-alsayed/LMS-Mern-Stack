"use client";

import { useDebounce } from "@/customHooks/useDebounce";
import { getAllOrganizations } from "@/lib/api/getAllOrganizations";
import { Organization } from "@/types/organization.type";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (organization: Organization) => void;
  selectedOrganizationId?: string | null;
};

const LIMIT = 10;

export default function OrganizationSelectionModal({
  open,
  onClose,
  onSelect,
  selectedOrganizationId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const page = Number(searchParams.get("page") || "1");
  const urlSearch = searchParams.get("search") || "";

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  useEffect(() => {
    if (!open) return;

    if (debouncedSearch === urlSearch) {
      return;
    }

    updateQuery("search", debouncedSearch);
  }, [debouncedSearch, open]);

  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ["organizations", urlSearch, page, LIMIT],

    queryFn: () => {
      const queryString = searchParams.toString();
      return getAllOrganizations(queryString);
    },

    enabled: open,
    staleTime: 1000 * 60,
  });

  const organizations = data?.organizations ?? [];
  const pagination = data?.pagination;

  const handleSelect = (organization: Organization) => {
    onSelect(organization);
    onClose();
  };

  const handlePrevious = () => {
    if (page <= 1 || !pagination?.hasPreviousPage) {
      return;
    }

    updateQuery("page", String(page - 1));
  };

  const handleNext = () => {
    if (!pagination?.hasNextPage) {
      return;
    }

    updateQuery("page", String(page + 1));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          flex h-[90vh] w-[80vw] max-w-3xl
          flex-col
          overflow-hidden
          p-0
        ">
        {/* Header */}
        <DialogHeader
          className="
            shrink-0
            border-b
            px-4 py-2
          ">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            Select Organization
          </DialogTitle>

          <DialogDescription className="text-xs">
            Search and select the organization that will own this course.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="shrink-0 px-4 ">
          <div className="relative">
            <Search
              className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search organization..."
              className="
                h-10
                pl-9
                outline-none
                focus-visible:outline-none
                focus-visible:ring-0
                focus-visible:ring-offset-0
              "
              autoFocus
            />
          </div>
        </div>

        {/* Scrollable Results */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 ">
          {isPending ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm font-medium text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Failed to load organizations"}
              </p>
            </div>
          ) : organizations.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />

                <p className="text-sm font-medium">No organizations found</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try another organization name.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative space-y-1.5">
              {isFetching && (
                <div className="absolute right-2 top-2 z-10">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}

              {organizations.map((organization) => {
                const isSelected = selectedOrganizationId === organization._id;

                return (
                  <button
                    key={organization._id}
                    type="button"
                    onClick={() => handleSelect(organization)}
                    className={`
                      w-full
                      rounded-md
                      border
                      px-3 py-2
                      text-left
                      transition-colors
                      ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}>
                    <div className="flex items-center gap-3">
                      {/* Organization */}
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div
                          className="
                            flex h-8 w-8 shrink-0
                            items-center justify-center
                            rounded-md
                            bg-primary/10
                            text-primary
                          ">
                          <Building2 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {organization.name}
                          </p>

                          <p className="text-[11px] text-muted-foreground">
                            Organization
                          </p>
                        </div>
                      </div>

                      {/* Instructor */}
                      <div className="hidden min-w-0 flex-1 sm:block">
                        <p className="truncate text-[11px] text-muted-foreground">
                          Instructor
                        </p>

                        <p className="truncate text-sm font-medium">
                          {organization.instructor.name}
                        </p>
                      </div>

                      {/* Email */}
                      <div className="hidden min-w-0 flex-1 md:block">
                        <p className="truncate text-[11px] text-muted-foreground">
                          Email
                        </p>

                        <p className="truncate text-sm">
                          {organization.instructor.email}
                        </p>
                      </div>

                      {/* Selected */}
                      {isSelected && (
                        <span
                          className="
                            shrink-0
                            rounded-md
                            bg-primary/10
                            px-2 py-1
                            text-[11px]
                            font-medium
                            text-primary
                          ">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {pagination && pagination.totalPages > 0 && (
          <div
            className="
              flex shrink-0
              items-center justify-between
              border-t
              bg-background
              px-4 py-2
            ">
            <p className="text-xs text-muted-foreground">
              Page {page} of {pagination.totalPages}
              <span className="mx-1">•</span>
              {pagination.total} organizations
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={page === 1 || isFetching}
                className="
                  flex h-8 items-center gap-1
                  rounded-md
                  border border-input
                  bg-background
                  px-2.5
                  text-xs font-medium
                  transition-colors
                  hover:bg-muted
                  disabled:pointer-events-none
                  disabled:opacity-50
                ">
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={page === pagination.totalPages || isFetching}
                className="
                  flex h-8 items-center gap-1
                  rounded-md
                  border border-input
                  bg-background
                  px-2.5
                  text-xs font-medium
                  transition-colors
                  hover:bg-muted
                  disabled:pointer-events-none
                  disabled:opacity-50
                ">
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
