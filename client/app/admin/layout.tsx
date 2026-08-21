"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-end border-b border-border bg-background/90 px-6 backdrop-blur">
          <div className="flex items-center gap-2">
            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              disabled={!mounted}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                ))}
            </button>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell className="h-5 w-5" />

              {/* Notification indicator */}
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
