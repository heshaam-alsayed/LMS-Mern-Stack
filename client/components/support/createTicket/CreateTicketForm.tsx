"use client";

import { AlertCircle, LoaderCircle, Send } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TICKET_CATEGORIES } from "@/lib/ticketCategories";

import {
  type CreateTicketFormValues,
} from "@/hooks/support/useCreateTicketForm";

import TicketAttachmentsInput from "./TicketAttachmentsInput";

type Props = {
  form: UseFormReturn<CreateTicketFormValues>;
  onSubmit: (values: CreateTicketFormValues) => void;
  attachments: File[];
  onAddAttachments: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

export default function CreateTicketForm({
  form,
  onSubmit,
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  isAuthenticated,
  isAuthLoading,
  isPending,
  isError,
  error,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const category = watch("category");

  const message = watch("message") ?? "";

  const emailLabel = isAuthenticated ? "Email (optional)" : "Email";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {isError && error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

          <p className="text-sm leading-5 text-destructive">{error.message}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          {emailLabel}
        </label>

        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          disabled={isPending || isAuthLoading}
          {...register("email")}
        />

        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : isAuthenticated ? (
          <p className="text-xs text-muted-foreground">
            Leave empty to use your account email.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Required, we use it to match your existing account.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>

        <Input
          id="subject"
          placeholder="Briefly describe your issue"
          aria-invalid={!!errors.subject}
          disabled={isPending}
          {...register("subject")}
        />

        {errors.subject ? (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Category</label>

        <Select
          value={category}
          onValueChange={(value) =>
            setValue(
              "category",
              value as CreateTicketFormValues["category"],
              { shouldValidate: true },
            )
          }>
          <SelectTrigger
            className="w-full"
            disabled={isPending}
            aria-label="Ticket category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent>
            {TICKET_CATEGORIES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category ? (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>

          <span className="text-xs text-muted-foreground">
            {message.length}/5000
          </span>
        </div>

        <Textarea
          id="message"
          rows={7}
          placeholder="Explain the problem in detail so we can help faster."
          aria-invalid={!!errors.message}
          disabled={isPending}
          {...register("message")}
        />

        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <TicketAttachmentsInput
        files={attachments}
        onAdd={onAddAttachments}
        onRemove={onRemoveAttachment}
      />

      <Button type="submit" className="h-11 w-full gap-2" disabled={isPending}>
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}

        Submit ticket
      </Button>
    </form>
  );
}