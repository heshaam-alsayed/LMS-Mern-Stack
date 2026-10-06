"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";

export default function InstructorStudentsLink() {
  const pathname = usePathname();

  const isActive =
    pathname === "/instructor/organization-students" ||
    pathname.startsWith("/instructor/organization-students/");

  return (
    <Link
      href="/instructor/organization-students"
      className={`
        flex h-8 items-center gap-2
        rounded-md px-2
        text-xs font-medium
        transition-colors
        lg:h-9 lg:px-3 lg:text-sm lg:ml-2
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}>
      <Users className="h-4 w-4" />
      <span>Students</span>
    </Link>
  );
}
