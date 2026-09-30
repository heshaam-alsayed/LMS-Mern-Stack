"use client";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function InstructorDashboardLink() {
  const pathname = usePathname();

  const isActive = pathname === "/instructor";

  return (
    <Link
      href="/instructor"
      className={`flex h-8 items-center gap-2 mr-1 rounded-md px-2 text-xs font-medium transition-colors lg:h-9 lg:px-3 lg:text-sm ${
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted"
      }`}
    >
      <LayoutDashboard className="h-4 w-4" />
      Dashboard
    </Link>
  );
}
