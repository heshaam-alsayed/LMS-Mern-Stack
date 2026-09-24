"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPassword } from "@/lib/api/forgotPassword";

const COOLDOWN_KEY = "forgot-password-cooldown";
const COOLDOWN_SECONDS = 3 * 60;

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function useForgotPassword() {
  const [countdown, setCountdown] = useState(0);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Restore cooldown after refresh
  useEffect(() => {
    const savedTime = localStorage.getItem(COOLDOWN_KEY);

    if (!savedTime) return;

    const remainingTime = Math.ceil((Number(savedTime) - Date.now()) / 1000);

    if (remainingTime > 0) {
      setCountdown(remainingTime);
      setIsSent(true);
    } else {
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((time) => {
        if (time <= 1) {
          clearInterval(timer);
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }

        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown > 0]);

  const mutation = useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      const expiresAt = Date.now() + COOLDOWN_SECONDS * 1000;

      localStorage.setItem(COOLDOWN_KEY, String(expiresAt));

      setCountdown(COOLDOWN_SECONDS);
      setIsSent(true);

      toast.success(
        "If that email is registered, we've sent a password reset link to it.",
      );
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  function onSubmit(data: ForgotPasswordFormData) {
    if (countdown > 0 || mutation.isPending) return;

    mutation.mutate(data);
  }

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    isSent,
    countdown,
    canSubmit: countdown === 0 && !mutation.isPending,
    countdownLabel: formatTime(countdown),
  };
}
