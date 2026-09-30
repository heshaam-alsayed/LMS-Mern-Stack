"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { getAllOrganizations } from "@/lib/api/getAllOrganizations";
import { updateOrganization } from "@/lib/api/updateOrganization";
import { deleteOrganization } from "@/lib/api/deleteOrganization";

import {
  Organization,
  UpdateOrganizationPayload,
} from "@/types/organization.type";

import { PaginationData } from "@/components/shared/Pagination";

import OrganizationsFilter from "./OrganizationsFilter";
import OrganizationsTable from "./OrganizationsTable";

import EditOrganizationModal from "@/components/modal/EditOrganizationModal";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal";
import ViewInstructorModal from "@/components/modal/ViewInstructorModal";

const initialPagination: PaginationData = {
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function AllOrganizations() {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const queryString = searchParams.toString();

  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [instructorOrganization, setInstructorOrganization] =
    useState<Organization | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-organizations", queryString],
    queryFn: () => getAllOrganizations(queryString),
  });

  const invalidateOrganizations = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
  };

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrganizationPayload;
    }) => updateOrganization(id, payload),

    onSuccess: (response) => {
      toast.success(response.message || "Organization updated successfully");

      setEditingOrganization(null);

      invalidateOrganizations();
    },

    onError: (mutationError) => {
      toast.error(mutationError.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrganization(id),

    onSuccess: (response) => {
      toast.success(response.message || "Organization deleted successfully");

      setSelectedOrganization(null);

      invalidateOrganizations();
    },

    onError: (mutationError) => {
      toast.error(mutationError.message);
    },
  });

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleDelete = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  const handleSubmitEdit = (payload: UpdateOrganizationPayload) => {
    if (!editingOrganization) return;

    updateMutation.mutate({ id: editingOrganization._id, payload });
  };

  const handleConfirmDelete = () => {
    if (!selectedOrganization) return;

    deleteMutation.mutate(selectedOrganization._id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Organizations
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage all registered organizations on the platform.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {data?.pagination.total ?? 0} total
        </span>
      </div>

      <OrganizationsFilter pagination={data?.pagination ?? initialPagination} />

      <OrganizationsTable
        organizations={data?.organizations ?? []}
        isLoading={isLoading}
        error={isError ? (error as Error) : null}
        onClickEdit={handleEdit}
        onClickDelete={handleDelete}
        onClickViewInstructor={setInstructorOrganization}
      />

      {editingOrganization && (
        <EditOrganizationModal
          key={editingOrganization._id}
          organization={editingOrganization}
          isOpen={!!editingOrganization}
          isLoading={updateMutation.isPending}
          onClose={() => setEditingOrganization(null)}
          onSubmit={handleSubmitEdit}
        />
      )}

      {instructorOrganization && (
        <ViewInstructorModal
          key={instructorOrganization._id}
          id={instructorOrganization._id}
          organizationName={instructorOrganization.name}
          isOpen={!!instructorOrganization}
          onClose={() => setInstructorOrganization(null)}
        />
      )}

      {selectedOrganization && (
        <DeleteConfirmationModal
          key={selectedOrganization._id}
          title={selectedOrganization.name}
          header="Delete Organization"
          confirmationText={selectedOrganization.name}
          description={`Deleting ${selectedOrganization.name} and all of its courses is permanent. This action cannot be undone.`}
          isLoading={deleteMutation.isPending}
          onClose={() => setSelectedOrganization(null)}
          isOpen={!!selectedOrganization}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
