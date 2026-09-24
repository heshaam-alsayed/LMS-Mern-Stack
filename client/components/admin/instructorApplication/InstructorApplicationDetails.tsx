"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { approveInstructorApplication } from "@/lib/api/approveInstructorApplication";
import { rejectInstructorApplication } from "@/lib/api/rejectInstructorApplication";

import type { RejectInstructorApplicationData } from "@/types/instructorApplication.type";

import InstructorApplicationDetailsSkeleton from "@/components/skeleton/InstructorApplicationDetailsSkeleton";
import { fetchInstructorApplication } from "@/lib/api/fetchInstructorApplication";
import InstructorApplicationHeader from "./InstructorApplicationHeader";
import ApplicantInformation from "./ApplicantInformation";
import OrganizationInformation from "./OrganizationInformation";
import ApplicationStatusCard from "./ApplicationStatusCard";
import InstructorApplicationActions from "./InstructorApplicationActions";

type Props = {
  id: string;
};

export default function InstructorApplicationDetails({ id }: Props) {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["instructor-application", id],
    queryFn: () => fetchInstructorApplication(id),
    enabled: Boolean(id),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveInstructorApplication(id),

    onSuccess: async (response) => {
      toast.success(response.message);

      await queryClient.invalidateQueries({
        queryKey: ["instructor-application", id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["instructor-applications"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: RejectInstructorApplicationData) =>
      rejectInstructorApplication(id, payload),

    onSuccess: async (response) => {
      toast.success(response.message);

      await queryClient.invalidateQueries({
        queryKey: ["instructor-application", id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["instructor-applications"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <InstructorApplicationDetailsSkeleton />;
  }

  if (isError || !data?.application) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl border border-border bg-card px-6 py-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <RefreshCw className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Unable to Load Application
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {error?.message || "The instructor application could not be found."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/admin/instructor-applications">
                <ArrowLeft className="size-4" />
                Back to Applications
              </Link>
            </Button>

            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2">
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Try Again"}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const application = data.application;

  return (
    <main className="space-y-6">
      <InstructorApplicationHeader
        isFetching={isFetching}
        onRefresh={refetch}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <ApplicantInformation application={application} />

          <OrganizationInformation application={application} />
        </div>

        <div className="space-y-5">
          <ApplicationStatusCard application={application} />

          <InstructorApplicationActions
            application={application}
            isApproving={approveMutation.isPending}
            isRejecting={rejectMutation.isPending}
            onApprove={() => approveMutation.mutate()}
            onReject={(payload) => rejectMutation.mutate(payload)}
          />
        </div>
      </div>
    </main>
  );
}
