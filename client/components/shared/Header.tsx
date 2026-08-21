"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openLoginModal } from "@/redux/features/ui/uiSlice";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthModalOpen } = useAppSelector((state) => state.ui);
  console.log(isAuthModalOpen);
  const pathname = usePathname();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "About", href: "/about" },
    { label: "Policy", href: "/policy" },
    { label: "FAQ", href: "/faq" },
  ];

  useEffect(() => {
    if (pathname === "/verification") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [pathname]);
  return (
    <>
      <header
        className="
          sticky
          top-0
          z-40
          w-full
        
        
          bg-background/80
          backdrop-blur-xl
        ">
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-4
            md:px-6
          ">
          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                bg-primary
                font-bold
                text-primary-foreground
              ">
              L
            </div>

            <div>
              <h1 className="text-lg font-bold">LMS</h1>

              <p className="text-xs text-muted-foreground hidden md:block">
                Learning Platform
              </p>
            </div>
          </Link>

          {/* Desktop */}

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant="ghost"
                      className={
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }>
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile */}

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              className="bg-accent text-accent-foreground"
              variant="ghost"
              onClick={() => dispatch(openLoginModal())}>
              Login
            </Button>

            <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
