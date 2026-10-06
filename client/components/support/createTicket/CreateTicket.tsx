"use client";

import Link from "next/link";
import { ArrowLeft, Headphones, Info } from "lucide-react";

import Header from "@/components/shared/Header";
import { useCreateTicketForm } from "@/hooks/support/useCreateTicketForm";

import CreateTicketForm from "./CreateTicketForm";

export default function CreateTicket() {
  const {
    form,
    onSubmit,
    attachments,
    addAttachments,
    removeAttachment,
    isAuthenticated,
    isAuthLoading,
    isPending,
    isError,
    error,
  } = useCreateTicketForm();

  return (
    <div>
      <Header />

      <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />

          Back to home
        </Link>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create a support ticket
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Tell us what went wrong. An admin will accept your ticket and then
              you can chat with them in realtime.
            </p>
          </div>

          <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl border bg-primary/5 text-primary sm:flex">
            <Headphones className="size-6" />
          </div>
        </div>

        <div className="mb-8 rounded-2xl border bg-muted/30 p-4">
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">One message until accepted</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your first message opens the ticket. Once an admin accepts it,
                the chat unlocks and you can send as many messages as you need.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <CreateTicketForm
            form={form}
            onSubmit={onSubmit}
            attachments={attachments}
            onAddAttachments={addAttachments}
            onRemoveAttachment={removeAttachment}
            isAuthenticated={isAuthenticated}
            isAuthLoading={isAuthLoading}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        </div>
      </div>
      </main>
    </div>
  );
}