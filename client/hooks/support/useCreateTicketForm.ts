"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { createTicket } from "@/lib/api/createTicket";
import { TICKET_CATEGORIES } from "@/lib/ticketCategories";
import { useAppSelector } from "@/redux/hooks";

import type { CreateTicketPayload } from "@/types/ticket.type";

export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ticketSchema = z.object({
  email: z
    .string()
    .trim()
    .max(100, "Email is too long")
    .refine(
      (value) => value === "" || EMAIL_PATTERN.test(value),
      "Please enter a valid email address",
    ),

  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),

  category: z.enum([
    "payment",
    "course",
    "video",
    "account",
    "certificate",
    "other",
  ]),

  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be less than 5000 characters"),
});

export type CreateTicketFormValues = z.infer<typeof ticketSchema>;

export const useCreateTicketForm = () => {
  const router = useRouter();

  const { status } = useSession();

  const reduxUser = useAppSelector((state) => state?.auth?.user);
  const reduxLoading = useAppSelector((state) => state?.auth?.loading);

  const isAuthLoading = status === "loading" || reduxLoading;

  const isAuthenticated = !!reduxUser || status === "authenticated";

  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      email: reduxUser?.email ?? "",
      subject: "",
      category: "other",
      message: "",
    },
  });

  useEffect(() => {
    if (reduxUser?.email && !form.getValues("email")) {
      form.setValue("email", reduxUser.email);
    }
  }, [reduxUser?.email, form]);

  const addAttachments = (files: File[]) => {
    setAttachments((current) => {
      const next = [...current];

      for (const file of files) {
        if (next.length >= MAX_ATTACHMENTS) break;

        if (file.size > MAX_ATTACHMENT_SIZE) continue;

        next.push(file);
      }

      return next;
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) => current.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateTicketPayload) => createTicket(payload),

    onSuccess: (data) => {
      toast.success(data.message || "Ticket created successfully");

      router.push(`/support/tickets/${data.ticket._id}`);
    },

    onError: (error) => {
      toast.error(error.message || "Error in creating ticket");
    },
  });

  const onSubmit = (values: CreateTicketFormValues) => {
    if (!isAuthenticated && !values.email) {
      form.setError("email", {
        message: "Email is required",
      });

      return;
    }

    mutation.mutate({
      email: values.email,
      subject: values.subject,
      category: values.category,
      message: values.message,
      attachments,
    });
  };

  return {
    form,
    onSubmit,
    attachments,
    addAttachments,
    removeAttachment,
    isAuthenticated,
    isAuthLoading,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};