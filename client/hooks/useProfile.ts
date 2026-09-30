"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateAvatar } from "@/lib/api/updateAvatar";
import { updateMe } from "@/lib/api/updateMe";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { IUpdateUserInfo } from "@/types/auth.type";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function useProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const releasePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    pendingFileRef.current = null;

    setPreviewImage(null);
    setPendingFileName("");
    setIsPreviewOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5 MB.");

      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const url = URL.createObjectURL(file);

    previewUrlRef.current = url;
    pendingFileRef.current = file;

    setPreviewImage(url);
    setPendingFileName(file.name);
    setIsPreviewOpen(true);
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: updateAvatar,

    onSuccess: (data) => {
      toast.success("Avatar updated successfully!");

      dispatch(setUser(data.user));

      releasePreview();
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload avatar.");
    },
  });

  const saveAvatar = () => {
    const file = pendingFileRef.current;

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      uploadAvatarMutation.mutate(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateMe,

    onSuccess: (data) => {
      toast.success("Profile updated successfully!");

      dispatch(setUser(data.user));
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });

  const saveProfile = (
    payload: IUpdateUserInfo,
    onSuccess?: () => void,
  ) => {
    updateProfileMutation.mutate(payload, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return {
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

    isUploadingAvatar: uploadAvatarMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
