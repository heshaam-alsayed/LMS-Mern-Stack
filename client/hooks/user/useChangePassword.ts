import { updatePassword } from "@/lib/api/updatePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(1, "Current password is required"),

    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/\d/, "Password must include a number"),

    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export const useChangePassword = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully");

      if (data.user) {
        dispatch(setUser(data.user));
      }

      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update password");
    },
  });
  const onSubmit = (data: ChangePasswordSchema) => {
    updatePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending: updatePasswordMutation.isPending,
    watch,
  };
};
