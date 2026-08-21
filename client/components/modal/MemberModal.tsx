"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { CreateNewMember, EditingMember, UserRole } from "@/types/user.type";

import Loader from "../shared/Loader";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  handleCreateMember: (data: CreateNewMember) => void;

  handleUpdateMember?: (id: string, role: UserRole) => void;

  isLoading: boolean;

  isEditing: boolean;

  editingData?: EditingMember | null;
};

export default function MemberModal({
  onClose,
  handleCreateMember,
  handleUpdateMember,
  isLoading,
  isEditing,
  editingData,
  isOpen,
}: Props) {
  const [name, setName] = useState(editingData?.name ?? "");

  const [email, setEmail] = useState(editingData?.email ?? "");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<UserRole>(editingData?.role ?? "user");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      if (!editingData || !handleUpdateMember) {
        return;
      }

      handleUpdateMember(editingData._id, role);

      return;
    }

    handleCreateMember({
      name,
      email,
      password,
      role,
    });
  };

  const isInvalid = isEditing
    ? !role
    : !name.trim() || !email.trim() || !password.trim() || !role;

  useModalBehavior({
    isOpen,
    onClose,
  });
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <div className="relative w-full max-w-[500px] rounded-xl border border-border bg-background p-6 shadow-xl">
        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        {/* Header */}

        <div className="mb-6 pr-8">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing ? "Edit Member" : "Add New Member"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing
              ? "Update the member role."
              : "Create a new team member and assign their role."}
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}

          <div className="space-y-2">
            <label
              htmlFor="member-name"
              className="text-sm font-medium text-foreground">
              Name
            </label>

            <Input
              id="member-name"
              type="text"
              placeholder="Enter member name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isEditing || isLoading}
              required
              className={isEditing ? "cursor-not-allowed bg-muted" : ""}
            />
          </div>

          {/* Email */}

          <div className="space-y-2">
            <label
              htmlFor="member-email"
              className="text-sm font-medium text-foreground">
              Email
            </label>

            <Input
              id="member-email"
              type="email"
              placeholder="Enter member email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEditing || isLoading}
              required
              className={isEditing ? "cursor-not-allowed bg-muted" : ""}
            />
          </div>

          {/* Password */}

          {!isEditing && (
            <div className="space-y-2">
              <label
                htmlFor="member-password"
                className="text-sm font-medium text-foreground">
                Password
              </label>

              <div className="relative">
                <Input
                  id="member-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Role */}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>

            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={isLoading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>

                <SelectItem value="user">User</SelectItem>

                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}>
              Cancel
            </Button>

            <Button type="submit" disabled={isInvalid || isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader />

                  {isEditing ? "Updating..." : "Creating..."}
                </span>
              ) : isEditing ? (
                "Update Role"
              ) : (
                "Create Member"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
