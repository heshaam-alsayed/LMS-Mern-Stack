"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuItem = {
  label: string;
  href: string;
};

type InstructorMobileMenuProps = {
  contentItems: MenuItem[];
  studentsItems: MenuItem[];
  analyticsItems: MenuItem[];
};

export function InstructorMobileMenu({
  contentItems,
  studentsItems,
  analyticsItems,
}: InstructorMobileMenuProps) {
  return (
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem asChild>
            <Link href="/instructor">
              Dashboard
            </Link>
          </DropdownMenuItem>

          <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">
            Content
          </div>

          {contentItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">
            Students
          </div>

          {studentsItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">
            Analytics
          </div>

          {analyticsItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}