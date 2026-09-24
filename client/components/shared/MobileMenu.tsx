"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import Profile from "@/public/user-profile-icon-flat-style-600nw-2748799073.webp";
import ThemeToggle from "./ThemeToggle";
import { Button } from "../ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Policy", href: "/policy" },
  { label: "FAQ", href: "/faq" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 220,
            }}
            className="
              fixed
              top-0
              right-0
              z-60
              flex
              h-screen
              max-w-90
              w-full
              flex-col
              border-l
              border-border
              bg-background
              shadow-2xl
            "
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="text-lg font-bold">Menu</h2>

              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User */}

            <div className="border-b border-border p-5">
              <div className="flex items-center gap-3">
                <Image
                  src={Profile}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />

                <div>
                  <p className="font-semibold">Hesham</p>

                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>
            </div>

            {/* Nav */}

            <nav className="flex flex-1 flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Footer */}

            <div className="border-t border-border p-4">
              <ThemeToggle isOpen />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
