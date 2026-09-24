"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type {
  InstructorApplication,
  RejectInstructorApplicationData,
} from "@/types/instructorApplication.type";
import { Badge } from "@/components/ui/badge";

type Props = {
  application: InstructorApplication;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: (data: RejectInstructorApplicationData) => void;
};

export default function InstructorApplicationActions({
  application,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
}: Props) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  const isPending = isApproving || isRejecting;

  const handleReject = () => {
    const reason = rejectionReason.trim();

    if (!reason) return;

    onReject({
      rejectionReason: reason,
    });

    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  if (application.status !== "pending") {
    const isApproved = application.status === "approved";

    return (
      <Card className="overflow-hidden border-border">
        <CardHeader className="border-b border-border bg-muted/20 ">
          <CardTitle className="text-base font-semibold">
            Review Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div
            className={`flex items-start gap-4 rounded-lg border p-4 ${
              isApproved
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            }`}>
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                isApproved
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}>
              {isApproved ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <XCircle className="size-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  Application {isApproved ? "Approved" : "Rejected"}
                </p>

                <Badge
                  variant="outline"
                  className={
                    isApproved
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                  }>
                  {application.status}
                </Badge>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                This instructor application has already been{" "}
                <span className="font-medium text-foreground">
                  {application.status}
                </span>
                . No further review actions are available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Review Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-5 ">
          <p className="text-sm leading-6 text-muted-foreground">
            Review the submitted information before approving or rejecting this
            instructor application.
          </p>

          <Button
            className="w-full gap-2"
            onClick={onApprove}
            disabled={isPending}>
            {isApproving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}

            {isApproving ? "Approving Application..." : "Approve Application"}
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setRejectDialogOpen(true)}
            disabled={isPending}>
            <XCircle className="size-4" />
            Reject Application
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          if (!isRejecting) {
            setRejectDialogOpen(open);
          }
        }}>
        <DialogContent className="max-w-md py-6">
          <DialogHeader>
            <DialogTitle>Reject Instructor Application</DialogTitle>

            <DialogDescription>
              Please provide a reason for rejecting this application. The reason
              will be stored with the application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 flex flex-col">
            <label htmlFor="rejectionReason block">Rejection Reason</label>

            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter the reason for rejecting this application..."
              rows={5}
              disabled={isRejecting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isRejecting}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
              className="gap-2">
              {isRejecting && <Loader2 className="size-4 animate-spin" />}

              {isRejecting ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
