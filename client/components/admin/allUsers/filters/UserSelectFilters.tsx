"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname } from "next/navigation";

interface UserSelectFiltersProps {
  searchParams: URLSearchParams;
  updateQuery: (key: string, value: string) => void;
}

export default function UserSelectFilters({
  searchParams,
  updateQuery,
}: UserSelectFiltersProps) {
  const pathName = usePathname();

  const isTeam = pathName.includes("/team");

  return (
    <div className="flex items-end gap-4">
      {/* ==================== ROLE ==================== */}
      {!isTeam && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Role</label>

          <Select
            value={searchParams.get("role") || "all"}
            onValueChange={(value) => updateQuery("role", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>

              <SelectItem value="user">User</SelectItem>

              <SelectItem value="instructor">Instructor</SelectItem>

              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ==================== VERIFICATION ==================== */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Verification
        </label>

        <Select
          value={searchParams.get("isVerified") || "all"}
          onValueChange={(value) => updateQuery("isVerified", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select verification" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>

            <SelectItem value="true">Verified</SelectItem>

            <SelectItem value="false">Not Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ==================== SORT ==================== */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Sort by</label>

        <Select
          value={searchParams.get("sort") || "all"}
          onValueChange={(value) => updateQuery("sort", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Default</SelectItem>

            <SelectItem value="-createdAt">Newest</SelectItem>

            <SelectItem value="createdAt">Oldest</SelectItem>

            <SelectItem value="name">Name: A-Z</SelectItem>

            <SelectItem value="-name">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
