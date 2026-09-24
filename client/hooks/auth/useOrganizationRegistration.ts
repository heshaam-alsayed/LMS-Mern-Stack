"use client";

import { createInstructorApplication } from "@/lib/api/createInstructorApplication";
import { CreateInstructorApplicationData } from "@/types/instructorApplication.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const organizationRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain an uppercase letter, a lowercase letter and a number",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name is too long"),

    organizationDescription: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type OrganizationRegistrationFormValues = z.infer<
  typeof organizationRegistrationSchema
>;

export const useOrganizationRegistration = () => {
  const form = useForm<OrganizationRegistrationFormValues>({
    resolver: zodResolver(organizationRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      organizationDescription: "",
    },
  });

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (data: CreateInstructorApplicationData) =>
      createInstructorApplication(data),
  });

  const onSubmit = (values: OrganizationRegistrationFormValues) => {
    mutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      organizationName: values.organizationName,
      organizationDescription:
        values.organizationDescription?.trim() || undefined,
    });
  };

  return {
    // React Hook Form
    form,
    onSubmit,

    // Mutation states
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,

    // Request data
    data: mutation.data,

    // Error
    error: mutation.error,

    // Helpers
    reset: mutation.reset,
  };
};
