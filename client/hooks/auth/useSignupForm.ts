"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signupAction } from "@/serverActions/signup";
import { registerUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

// ✅ Schema
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Type
export type SignupFormData = z.infer<typeof signupSchema>;

export function useSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupAction,
    onSuccess: (data) => {
      console.log("Signup Data:", data);
      router.push("/verification");
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const onSubmit = (data: SignupFormData) => {
    console.log(data);
    signupMutation.mutate(data);
  };
  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    isPending: signupMutation.isPending,
    error: signupMutation.error,
    showPassword,
    setShowPassword,
  };
}
