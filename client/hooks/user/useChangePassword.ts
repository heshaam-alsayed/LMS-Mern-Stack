import { updatePassword } from "@/lib/api/updatePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(1, "Current password is required"),

    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(100),

    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export const useChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
        reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update password");
    },
  });
  const onSubmit = (data: ChangePasswordSchema) => {
    console.log("Submitting password change:", data);
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
  };
};
