"use client";

import { openLoginModal } from "@/redux/features/ui/uiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { verificationUserAction } from "@/serverActions/verificationUser";
import { verificationResponse } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useVerification(length = 6) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string[]>(Array(length).fill(""));

  const [invalidError, setInvalidError] = useState(false);

  const [countdown, setCountdown] = useState(60);

  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setInvalidError(false);

    const digit = value.slice(-1);

    const updated = [...code];
    updated[index] = digit;

    setCode(updated);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const updated = [...code];
        updated[index] = "";
        setCode(updated);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    const updated = Array(length).fill("");

    pasted.split("").forEach((char, index) => {
      updated[index] = char;
    });

    setCode(updated);

    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  const verificationMutation = useMutation({
    mutationFn: verificationUserAction,

    onSuccess: (data: verificationResponse) => {
      toast.success(data.message || "Verification successful");
      router.push("/login");
    },

    onError: () => {
      setInvalidError(true);
    },
  });

  const handleSubmit = () => {
    const verifyCode = code.join("");

    if (verifyCode.length !== length) {
      setInvalidError(true);
      return;
    }

    verificationMutation.mutate(verifyCode);
  };
  const handleResendCode = async () => {
    try {
      setIsResending(true);

      // await resendCode()

      setCountdown(60);
    } finally {
      setIsResending(false);
    }
  };

  return {
    code,
    invalidError,
    countdown,
    isResending,
    inputRefs,
    verifyCode: code.join(""),
    isCompleted: code.join("").length === length,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResendCode,
    isPending: verificationMutation.isPending,
    error: verificationMutation.error,
  };
}
