"use client";

import { Building2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  total: number;
  status: string;
  limit: string;
  onChange: (key: string, value: string) => void;
};

const LIMIT_OPTIONS = ["5", "10", "15", "20"];

export default function OrganizationsHeader({
  total,
  status,
  limit,
  onChange,
}: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex w-full flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Organizations
              </h1>

              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {total.toLocaleString()}
              </span>
            </div>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Manage all registered organizations on the platform.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:items-center">
          <div className="min-w-0 sm:w-[180px]">
            <label className="mb-2 block text-xs font-medium text-foreground">
              Status
            </label>

            <Select
              value={status}
              onValueChange={(value) => onChange("status", value)}>
              <SelectTrigger className="w-full" aria-label="Filter by status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>

                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 sm:w-[130px]">
            <label className="mb-2 block text-xs font-medium text-foreground">
              Show
            </label>

            <Select
              value={limit}
              onValueChange={(value) => onChange("limit", value)}>
              <SelectTrigger className="w-full" aria-label="Rows per page">
                <SelectValue placeholder="Show" />
              </SelectTrigger>

              <SelectContent>
                {LIMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
