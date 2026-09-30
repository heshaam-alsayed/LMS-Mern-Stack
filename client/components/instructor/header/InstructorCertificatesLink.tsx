"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award } from "lucide-react";

export default function InstructorCertificatesLink() {
  const pathname = usePathname();

  const isActive =
    pathname === "/instructor/organization-certificates" ||
    pathname.startsWith("/instructor/organization-certificates/");

  return (
    <Link
      href="/instructor/organization-certificates"
      className={`
        flex h-8 items-center gap-2
        rounded-md px-2
        text-xs font-medium
        transition-colors
        lg:h-9 lg:px-3 lg:text-sm
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}>
      <Award className="h-4 w-4" />
      <span>Certificates</span>
    </Link>
  );
}
