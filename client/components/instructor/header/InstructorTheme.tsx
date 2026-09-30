"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function InstructorTheme() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ThemeIcon =
    theme === "dark"
      ? Moon
      : theme === "light"
        ? Sun
        : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-md px-2 hover:bg-muted lg:h-9"
        >
          <ThemeIcon className="h-5 w-5" />

          <span className="hidden text-xs capitalize xl:block">
            {theme}
          </span>

          <ChevronDown className="hidden h-3.5 w-3.5 xl:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="gap-2 px-2 py-1.5 text-xs"
        >
          <Sun className="h-3.5 w-3.5" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="gap-2 px-2 py-1.5 text-xs"
        >
          <Moon className="h-3.5 w-3.5" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="gap-2 px-2 py-1.5 text-xs"
        >
          <Monitor className="h-3.5 w-3.5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}