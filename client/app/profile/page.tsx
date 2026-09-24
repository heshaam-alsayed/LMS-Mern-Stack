"use client";
import ProfileSideBar from "@/components/shared/ProfileSideBar";
import React, { useEffect, useState } from "react";
import { GraduationCap, KeyRound, LogOut, Menu, User } from "lucide-react";
import MyAccountForm from "@/components/form/MyAccountForm";
import ChangePasswordForm from "@/components/form/ChangePasswordForm";
import { useAppSelector } from "@/redux/hooks";
import ProfilePageSkeleton from "@/components/skeleton/ProfilePageSkeleton";
import Header from "@/components/shared/Header";
import EnrolledCourses from "@/components/enrolledCourses/EnrolledCourses";

type ProfileTab = "account" | "password" | "courses";

export type MenuItem = {
  id: ProfileTab | "logout";
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  danger?: boolean;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "account",
      title: "My Account",
      icon: User,
    },
    {
      id: "password",
      title: "Change Password",
      icon: KeyRound,
    },
    {
      id: "courses",
      title: "Enrolled Courses",
      icon: GraduationCap,
    },
    {
      id: "logout",
      title: "Logout",
      icon: LogOut,
      danger: true,
    },
  ];
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      document.title = `${user.name} - Profile | LMS`;
    }
  }, [user]);

  if (!user) {
    return <ProfilePageSkeleton />;
  }

  console.log(user)
  return (
    <div>
      <Header />

      {/* Mobile sidebar toggle */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-4 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-sm font-medium text-muted-foreground">
          Profile Menu
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:gap-8 lg:py-10 lg:pl-[270px]">
        <ProfileSideBar
          menuItems={menuItems}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1 px-4">
          {activeTab === "account" && <MyAccountForm />}

          {activeTab === "password" && <ChangePasswordForm />}

          {activeTab === "courses" && <EnrolledCourses/>}
        </div>
      </div>
    </div>
  );
}