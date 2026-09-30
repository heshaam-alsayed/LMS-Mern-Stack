"use client";

import { InstructorHeader } from "@/components/instructor/header/InstructorHeader";

type Props = {
  children: React.ReactNode;
};

export default function InstructorLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <InstructorHeader />
      <main className="p-3 sm:p-6">{children}</main>
    </div>
  );
}