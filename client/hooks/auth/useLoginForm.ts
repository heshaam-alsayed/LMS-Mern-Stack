import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/login";
import { toast } from "sonner";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";

// 1 define schema with zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters long" }),
});

// 2 generate types from schema
export type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      toast.success("login successfully");
      router.push("/profile");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  return {
    form,
    onSubmit,
    isPending: loginMutation.isPending,
    showPassword,
    setShowPassword,
  };
}
