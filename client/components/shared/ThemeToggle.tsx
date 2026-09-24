"use client";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";
import { CiDark, CiLight, CiMonitor } from "react-icons/ci";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function ThemeToggle({ isOpen }: { isOpen?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = resolvedTheme || theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          {current === "dark" ? (
            <CiDark className="h-4 w-4" />
          ) : current === "light" ? (
            <CiLight className="h-4 w-4" />
          ) : (
            <CiMonitor className="h-4 w-4" />
          )}
          Theme
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`z-500 ${isOpen ? "ml-20" : ""}`}
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <CiLight className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <CiDark className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          <CiMonitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
