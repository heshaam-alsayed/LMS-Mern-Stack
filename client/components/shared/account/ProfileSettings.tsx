"use client";

import { useState } from "react";
import {
  Camera,
  Loader2,
  Mail,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { getShortName } from "@/app/utils/helper";
import useProfile from "@/hooks/useProfile";
import EditProfileModal from "@/components/modal/EditProfileModal";
import AvatarPreviewModal from "@/components/modal/AvatarPreviewModal";

import { IUpdateUserInfo } from "@/types/auth.type";

const DATE_FORMAT = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

type Props = {
  // shared by every role, so the wording follows whoever is signed in
  roleLabel?: string;
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfileSettings({ roleLabel = "administrator" }: Props) {
  const {
    user,
    fileInputRef,
    previewImage,
    pendingFileName,
    isPreviewOpen,
    handleSelectImage,
    handleFileChange,
    releasePreview,
    saveAvatar,
    saveProfile,
    isUploadingAvatar,
    isUpdatingProfile,
  } = useProfile();

  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="h-32 w-32 animate-pulse rounded-full bg-muted" />

          <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />

          <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", DATE_FORMAT)
    : "Not available";

  const handleSave = (payload: IUpdateUserInfo) => {
    saveProfile(payload, () => setIsEditOpen(false));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {user.name}
              </h1>

              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {user.role}
              </p>
            </div>

            <Button
              onClick={() => setIsEditOpen(true)}
              className="shrink-0 self-start">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <h2 className="mt-8 text-base font-semibold tracking-tight text-foreground">
            Account information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Details associated with your {roleLabel} account.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoRow
              icon={<Mail className="h-4 w-4 text-primary" />}
              label="Email address"
              value={user.email}
            />

            {user.phone ? (
              <InfoRow
                icon={<Phone className="h-4 w-4 text-primary" />}
                label="Phone number"
                value={user.phone}
              />
            ) : null}

            <InfoRow
              icon={<UserRound className="h-4 w-4 text-primary" />}
              label="Account created"
              value={createdAt}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center gap-4 border-t border-border bg-muted/20 p-6 sm:p-8 lg:w-[300px] lg:border-l lg:border-t-0">
          <div className="relative">
            <Avatar className="h-32 w-32 bg-muted/40 sm:h-36 sm:w-36">
              <AvatarImage
                src={user.avatar?.url}
                alt={user.name}
                className="object-contain"
              />

              <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                {getShortName(user.name) || <UserRound className="h-10 w-10" />}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={handleSelectImage}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
              aria-label="Change profile picture">
              {isUploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{user.name}</p>

            <p className="mt-0.5 text-xs capitalize text-muted-foreground">
              {user.role}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>

      <AvatarPreviewModal
        isOpen={isPreviewOpen}
        imageSrc={previewImage}
        fileName={pendingFileName}
        isLoading={isUploadingAvatar}
        onClose={releasePreview}
        onSave={saveAvatar}
      />

      <EditProfileModal
        user={user}
        isOpen={isEditOpen}
        isLoading={isUpdatingProfile}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}
