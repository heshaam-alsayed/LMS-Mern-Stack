"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      toast.success("Logged in successfully!");

      router.replace("/", {
        scroll: false,
      });
    }
  }, [searchParams, router]);

  return null;
}