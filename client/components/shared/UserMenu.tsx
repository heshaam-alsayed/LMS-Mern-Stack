"use client";

import Image from "next/image";
import Profile from "@/public/user-profile-icon-flat-style-600nw-2748799073.webp";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  LogIn,
  Settings,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import Loader from "./Loader";
import { useAppSelector } from "@/redux/hooks";

export default function UserMenu() {
  const router = useRouter();

  const { status } = useSession();

  const user = useAppSelector((state) => state.auth.user);

  const isProviderUser = status === "authenticated";

  const isEmailUser = !!user;

  const isAuthenticated = isProviderUser || isEmailUser;

  const isLoading = status === "loading";

  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary/40">
          {/* Avatar ring */}
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-border bg-muted transition-all group-hover:border-primary/40 group-hover:shadow-md">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader />
              </div>
            ) : (
              <Image
                src={user?.avatar?.url || Profile}
                alt="User Avatar"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* Online indicator */}
          {isAuthenticated && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[290px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border/60 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl">
        {isAuthenticated ? (
          <>
            {/* User Header */}
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-background">
                    <Image
                      src={user?.avatar?.url || Profile}
                      alt="User Avatar"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {user?.name || "User"}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user?.email || "No email"}
                  </p>

                  {user?.role && (
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          isAdmin
                            ? "bg-primary/10 text-primary"
                            : "bg-background text-muted-foreground"
                        }`}>
                        {isAdmin && <ShieldCheck className="h-3 w-3" />}

                        {user.role}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="my-1.5 h-px bg-border/60" />

            {/* Profile */}
            <DropdownMenuItem
              className="group cursor-pointer rounded-xl px-3 py-3 outline-none focus:bg-muted"
              onClick={() => router.push("/profile")}>
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-background">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">My Profile</p>

                <p className="text-[11px] text-muted-foreground">
                  Manage your account
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
            </DropdownMenuItem>


            {/* Admin */}
            {isAdmin && (
              <>
                <div className="my-1.5 h-px bg-border/60" />

                <DropdownMenuItem
                  className="group cursor-pointer rounded-xl bg-primary/[0.06] px-3 py-3 text-primary outline-none focus:bg-primary/10"
                  onClick={() => router.push("/admin")}>
                  <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">Admin Dashboard</p>

                    <p className="text-[11px] text-primary/60">
                      Manage your platform
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-primary/50 transition-transform group-hover:translate-x-0.5" />
                </DropdownMenuItem>
              </>
            )}

            <div className="my-1.5 h-px bg-border/60" />

            {/* Logout */}
            <DropdownMenuItem
              className="group cursor-pointer rounded-xl px-3 py-3 text-destructive outline-none focus:bg-destructive/10 focus:text-destructive"
              onClick={handleLogout}>
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <LogOut className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">Sign out</p>

                <p className="text-[11px] text-destructive/60">
                  Sign out of your account
                </p>
              </div>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* Guest Header */}
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-background">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Welcome back</h3>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Sign in to continue
                  </p>
                </div>
              </div>
            </div>

            <div className="my-1.5 h-px bg-border/60" />

            <DropdownMenuItem
              className="group cursor-pointer rounded-xl px-3 py-3 outline-none focus:bg-primary/10"
              onClick={() => router.push("/login")}>
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <LogIn className="h-4 w-4 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Sign in</p>

                <p className="text-[11px] text-muted-foreground">
                  Access your account
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
