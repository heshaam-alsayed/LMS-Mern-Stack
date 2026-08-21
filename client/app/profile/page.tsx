"use client";
import ProfileSideBar from "@/components/shared/ProfileSideBar";
import React, { useEffect, useState } from "react";
import { GraduationCap, KeyRound, LogOut, User } from "lucide-react";
import MyAccountForm from "@/components/form/MyAccountForm";
import ChangePasswordForm from "@/components/form/ChangePasswordForm";
import { useAppSelector } from "@/redux/hooks";
import ProfilePageSkeleton from "@/components/skeleton/ProfilePageSkeleton";
import Header from "@/components/shared/Header";

type ProfileTab = "account" | "password" | "courses";

export type MenuItem = {
  id: ProfileTab | "logout";
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  danger?: boolean;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");

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

  return (
    <div>
      <Header />
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        <ProfileSideBar
          menuItems={menuItems}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        <div className="flex-1  px-4 ">
          {activeTab === "account" && <MyAccountForm />}

          {activeTab === "password" && <ChangePasswordForm />}

          {activeTab === "courses" && <div>Enrolled Courses Content</div>}
        </div>
      </div>
    </div>
  );
}
