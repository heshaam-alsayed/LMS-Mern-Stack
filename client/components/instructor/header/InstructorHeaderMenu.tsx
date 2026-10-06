"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
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

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const hasActiveItem = items.some((item) => isActive(item.href));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`
            flex h-8 items-center gap-1.5
            rounded-md px-2.5
            text-xs font-medium
            outline-none
            transition-colors
            focus-visible:ring-2
            focus-visible:ring-ring
            lg:h-9 lg:text-sm 
            mr-1
            ${
              hasActiveItem
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }
          `}>
          <Icon className="h-4 w-4 shrink-0" />

          <span>{title}</span>

          {open ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-48 rounded-lg border bg-popover p-1 shadow-lg duration-150 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
        {items.map((item) => {
          const ItemIcon = item.icon;
          const active = isActive(item.href);

          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={`
                cursor-pointer
                rounded-md
                p-0
                outline-none
                transition-colors

                ${active ? "bg-primary/10 text-primary" : "text-foreground"}

                data-[highlighted]:bg-muted
                data-[highlighted]:text-foreground

                dark:data-[highlighted]:bg-muted/70
              `}>
              <Link
                href={item.href}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5">
                <span
                  className={`
                    flex size-6 shrink-0
                    items-center justify-center
                    rounded-md
                    transition-colors
                    ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/70 text-muted-foreground"
                    }
                  `}>
                  <ItemIcon className="h-3.5 w-3.5" />
                </span>

                <span className="truncate text-xs">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
