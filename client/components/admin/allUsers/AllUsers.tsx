"use client";

import { getAllUsers } from "@/lib/api/getAllUsers";
import {
  CreateNewMember,
  EditingMember,
  SelectedMember,
  UpdateMemberData,
} from "@/types/user.type";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";

import { useState } from "react";
import UsersFilter from "./UsersFilter";
import UsersTable from "./UsersTable";
import { createUser } from "@/lib/api/createUser";
import { toast } from "sonner";
import { changeRole } from "@/lib/api/changeRole";
import MemberModal from "@/components/modal/MemberModal";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal";
import { toggleDeletedUser } from "@/lib/api/toggleUserDeleted";

export default function AllUsers() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingData, setEditingData] = useState<EditingMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const isTeam = pathName.includes("/team");
  const queryString = searchParams.toString();

  const { data, isFetching, error } = useQuery({
    queryKey: ["all-users", isTeam, queryString],
    queryFn: () => getAllUsers(queryString, isTeam),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const refetchUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["all-users", isTeam] });
  };

  const createMemberMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      refetchUsers();
      toast.success("member created successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setOpen(false);
    },
  });
  const handleCreateMember = (data: CreateNewMember) => {
    createMemberMutation.mutate(data);
  };

  const editUserMutation = useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      refetchUsers();
      toast.success("member updated successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: toggleDeletedUser,
    onSuccess: () => {
      refetchUsers();
      setOpenDelete(false);
      toast.success("user deleted status changed");
    },
    onError: (error) => {
      setOpenDelete(false);
      toast.error(error.message);
    },
  });
  const handleUpdateMember = (
    id: string,
    role: "user" | "admin" | "instructor",
  ) => {
    const body = {
      role,
      id,
    };
    editUserMutation.mutate(body);
  };
  const handleConfirmDelete = () => {
    if (!selectedMember?._id) return;
    deleteMutation.mutate(selectedMember?._id);
  };
  const onClickAdd = () => {
    setEditingData(null);
    setIsEditing(false);
    setOpen(true);
  };
  const onClickEdit = (member: EditingMember) => {
    setEditingData(member);
    setIsEditing(true);
    setOpen(true);
  };
  const onCloseModal = () => {
    setEditingData(null);
    setIsEditing(false);
    setOpen(false);
  };
  const onClickDelete = (member: SelectedMember) => {
    setSelectedMember(member);
    setOpenDelete(true);
  };
  const onCloseDelete = () => {
    setSelectedMember(null);
    setOpenDelete(false);
  };
  const isUsersLoading = isFetching && !data?.users?.length;
  const isMutationPending =
    createMemberMutation.isPending || editUserMutation.isPending;
  return (
    <div className="space-y-4">
      {(data?.pagination?.total ?? 0) > 0 ? (
        <UsersFilter pagination={data.pagination} onClickAdd={onClickAdd} />
      ) : null}

      <UsersTable
        users={data?.users ?? []}
        isLoading={isUsersLoading}
        error={error}
        isTeam={isTeam}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
      {open && (
        <MemberModal
          key={editingData?._id ?? "create"}
          onClose={onCloseModal}
          handleCreateMember={handleCreateMember}
          handleUpdateMember={handleUpdateMember}
          isLoading={isMutationPending}
          isEditing={isEditing}
          editingData={editingData}
          isOpen={open}
        />
      )}

      {openDelete && (
        <DeleteConfirmationModal
          title={selectedMember?.name || ""}
          header="Delete Member"
          confirmationText={selectedMember?.name || ""}
          description={`Are you sure you want to delete ${selectedMember?.name}? This action cannot be undone.`}
          isLoading={deleteMutation.isPending}
          onClose={onCloseDelete}
          isOpen={openDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
