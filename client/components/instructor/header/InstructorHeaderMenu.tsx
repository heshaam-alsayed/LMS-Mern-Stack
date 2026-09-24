"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

type InstructorHeaderMenuProps = {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
};

export function InstructorHeaderMenu({
  title,
  icon: Icon,
  items,
}: InstructorHeaderMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const hasActiveItem = items.some((item) => isActive(item.href));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium outline-none hover:bg-muted ${
            hasActiveItem ? "bg-primary/10 text-primary" : ""
          }`}>
          <Icon className="h-4 w-4" />

          <span>{title}</span>

          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className={
                isActive(item.href) ? "bg-primary/10 text-primary" : ""
              }>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
