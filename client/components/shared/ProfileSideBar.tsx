"use client";

import { cn } from "@/lib/utils";
import { MenuItem } from "@/app/profile/page";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { LayoutDashboard, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  open: boolean;
  onClose: () => void;
};

export default function ProfileSideBar({
  menuItems,
  activeTab,
  setActiveTab,
  open,
  onClose,
}: Props) {
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      dispatch(logoutUser());

      await signOut({
        callbackUrl: "/",
      });

      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Logout failed. Please try again.",
      );
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[270px] max-w-[85vw] shrink-0",
          "border-r border-border/60 bg-background",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:top-16",
        )}>
        <div className="p-3">
          {/* Mobile drawer header */}
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-foreground">
              Profile Menu
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-2xl  p-3">
            {/* ================= USER INFO ================= */}
            <div className="relative rounded-xl bg-muted/40 px-4 py-4">
              {user?.role && (
                <span
                  className={cn(
                    "absolute right-4 top-4 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize",
                    user.role === "admin" &&
                      "border-primary/20 bg-primary/10 text-primary",
                    user.role === "instructor" &&
                      "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
                    user.role === "user" &&
                      "border-border bg-background text-muted-foreground",
                  )}>
                  {user.role}
                </span>
              )}

              <div className="min-w-0 pr-20">
                <h2 className="truncate text-base font-semibold text-foreground">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>

            {/* ================= NAV ================= */}
            <nav className="mt-4 space-y-1">
              {/* Admin (optional) */}
              {user?.role === "admin" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/admin");
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-primary/5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-medium text-foreground">
                      Admin Dashboard
                    </span>
                  </button>

                  <div className="my-2 h-px bg-border/60" />
                </>
              )}

              {/* Menu items */}
              {menuItems.map((item) => {
                const Icon = item.icon;

                const isActive = activeTab === item.id;

                const isLogout = item.id === "logout";

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (isLogout) {
                        handleLogout();
                        return;
                      }

                      setActiveTab(item.id);

                      onClose();
                    }}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                      isActive && !item.danger && "bg-accent shadow-sm",
                      !isActive && !item.danger && "hover:bg-muted/70",
                      item.danger && "hover:bg-destructive/10",
                    )}>
                    {/* Active line */}
                    {isActive && !item.danger && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive &&
                          !item.danger &&
                          "bg-primary text-primary-foreground",
                        !isActive &&
                          !item.danger &&
                          "bg-muted text-muted-foreground group-hover:bg-background",
                        item.danger && "bg-destructive/10 text-destructive",
                      )}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Label */}
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm",
                        !item.danger &&
                          isActive &&
                          "font-semibold text-foreground",
                        !item.danger &&
                          !isActive &&
                          "text-muted-foreground group-hover:text-foreground",
                        item.danger && "font-medium text-destructive",
                      )}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}