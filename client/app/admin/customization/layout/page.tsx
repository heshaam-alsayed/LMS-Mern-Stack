"use client";

import EmptyStateLayout from "@/components/admin/customization/layout/EmptyStateLayout";
import ErrorState from "@/components/admin/customization/layout/ErrorState";
import LayoutCard from "@/components/admin/customization/layout/LayoutCard";
import CreateLayoutModal from "@/components/modal/CreateLayoutModal";

import { createLayout } from "@/lib/api/createLayout";
import { getAllLayouts } from "@/lib/api/getAllLayouts";

import { IGetAllLayoutsResponse, LayoutType } from "@/types/layout.type";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

export default function LayoutPage() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: layoutsData,
    refetch,
    isLoading,
    isError,
    error,
  } = useQuery<IGetAllLayoutsResponse>({
    queryKey: ["layouts"],
    staleTime: 1000 * 60 * 30,
    queryFn: getAllLayouts,
  });

  const createLayoutMutation = useMutation({
    mutationFn: createLayout,

    onSuccess: () => {
      toast.success("Layout created successfully");

      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["layouts"],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create layout");
    },
  });

  const handleSubmit = (type: LayoutType) => {
    createLayoutMutation.mutate(type);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error.message} refetch={refetch} />;
  }

  if (!layoutsData?.layouts.length) {
    return (
      <>
        <EmptyStateLayout onOpen={() => setOpen(true)} />

        <CreateLayoutModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          isLoading={createLayoutMutation.isPending}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Layouts</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your platform layouts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30">
          <Plus className="size-4" />
          Create Layout
        </button>
      </div>

      {/* Layouts */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {layoutsData.layouts.map((layout) => (
          <LayoutCard key={layout._id} layout={layout} />
        ))}
      </div>

      {/* Create Modal */}
      <CreateLayoutModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createLayoutMutation.isPending}
      />
    </div>
  );
}
