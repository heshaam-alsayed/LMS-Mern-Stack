"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAllNotifications } from "@/lib/api/getAllNotifications";
import { updateStatusNotification } from "@/lib/api/updateStatusNotification";

import {
  addNotification,
  setData,
  updateStatus,
} from "@/redux/features/notifications/notificationsSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell, Check, Circle, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { INotification } from "@/types/notification.type";
import { cn } from "@/lib/utils";
import { InstructorHeader } from "@/components/instructor/header/InstructorHeader";

type Props = {
  children: React.ReactNode;
};

export default function InstructorLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-background">
      <InstructorHeader />
      <main className="p-3 sm:p-6">{children}</main>
    </div>
  );
}
