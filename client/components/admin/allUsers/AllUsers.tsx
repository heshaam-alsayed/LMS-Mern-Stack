"use client";

import { getAllCourses } from "@/lib/api/getAllCourses";
import { getAllUsers } from "@/lib/api/getAllUsers";
import { CoursesResponseAdmin } from "@/types/course.type";
import {
  CreateNewMember,
  EditingMember,
  SelectedMember,
  UpdateMemberData,
  UsersResponseAdmin,
} from "@/types/user.type";

import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import UsersFilter from "./UsersFilter";
import UsersTable from "./UsersTable";
import { PaginationData } from "@/components/shared/Pagination";
import { createUser } from "@/lib/api/createUser";
import { toast } from "sonner";
import { changeRole } from "@/lib/api/changeRole";
import MemberModal from "@/components/modal/MemberModal";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal";
import { toggleDeletedUser } from "@/lib/api/toggleUserDeleted";

export default function AllUsers() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  console.log(pathName);
  const [data, setData] = useState<UsersResponseAdmin | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingData, setEditingData] = useState<EditingMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const initialPagination: PaginationData = {
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  const [hasFetched, setHasFetched] = useState(false);
  const isTeam = pathName.includes("/team");
  const getAllUsersMutation = useMutation({
    mutationFn: (queryString: string) => {
      return getAllUsers(queryString, isTeam);
    },

    onSuccess: (data) => {
      setData(data);
      setHasFetched(true);
    },

    onError: () => {
      setHasFetched(true);
    },
  });

  useEffect(() => {
    getAllUsersMutation.mutate(searchParams.toString());
  }, [searchParams]);

  const createMemberMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      getAllUsersMutation.mutate(searchParams.toString());
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
      getAllUsersMutation.mutate(searchParams.toString());
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
      getAllUsersMutation.mutate(searchParams.toString());
      setOpenDelete(false);
      toast.success("user deleted status changed");
    },
    onError: (error) => {
      setOpenDelete(false);
      toast.error(error.message);
    },
  });
  const isLoading =
    !hasFetched || getAllUsersMutation.isPending || editUserMutation.isPending;

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
  return (
    <div className="space-y-4">
      <UsersFilter
        pagination={data?.pagination ?? initialPagination}
        onClickAdd={onClickAdd}
      />

      <UsersTable
        users={data?.users ?? []}
        isLoading={isLoading}
        error={getAllUsersMutation.error}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
      {open && (
        <MemberModal
          key={editingData?._id ?? "create"}
          onClose={onCloseModal}
          handleCreateMember={handleCreateMember}
          handleUpdateMember={handleUpdateMember}
          isLoading={isLoading}
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
