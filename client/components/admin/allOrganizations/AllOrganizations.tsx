"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import useAdminOrganizations from "@/hooks/admin/useAdminOrganizations";

import { updateOrganization } from "@/lib/api/updateOrganization";
import { deleteOrganization } from "@/lib/api/deleteOrganization";

import {
  Organization,
  UpdateOrganizationPayload,
} from "@/types/organization.type";

import OrganizationsHeader from "./OrganizationsHeader";
import OrganizationsTable from "./OrganizationsTable";
import OrganizationsToolbar from "./OrganizationsToolbar";

import EditOrganizationModal from "@/components/modal/EditOrganizationModal";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal";
import ViewInstructorModal from "@/components/modal/ViewInstructorModal";

export default function AllOrganizations() {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [instructorOrganization, setInstructorOrganization] =
    useState<Organization | null>(null);

  const {
    organizations,
    pagination,
    isLoading,
    isError,
    error,
    status,
    limit,
    updateQuery,
    handleNext,
    handlePrevious,
  } = useAdminOrganizations();

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
      <OrganizationsHeader
        total={pagination?.total ?? 0}
        status={status}
        limit={limit}
        onChange={updateQuery}
      />

      {(pagination?.total ?? 0) > 0 ? (
        <OrganizationsToolbar
          pagination={pagination}
          urlSearch={searchParams.get("search") || ""}
          updateQuery={updateQuery}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ) : null}

      <OrganizationsTable
        organizations={organizations}
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
