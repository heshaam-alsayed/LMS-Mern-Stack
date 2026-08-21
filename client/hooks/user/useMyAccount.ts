"use client";

import { useEffect, useRef, useState } from "react";
import AvatarEditor, { AvatarEditorRef } from "react-avatar-editor";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateAvatar } from "@/lib/api/updateAvatar";
import { updateMe } from "@/lib/api/updateMe";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

export function useMyAccount() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditorRef>(null);
  const tempPreview = useRef("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [preview, setPreview] = useState("/image.png");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1.2);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name,
      email: user.email,
    });

    setPreview(user.avatar?.url || "/image.png");
  }, [user]);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setScale(1.2);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
    setIsOpen(true);

    e.target.value = "";
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: updateAvatar,

    onSuccess: (data) => {
      toast.success("Avatar uploaded successfully!");

      dispatch(setUser(data.user));

      if (tempPreview.current) {
        setPreview(tempPreview.current);
      }

      handleCloseModal();
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to upload avatar. Please try again.",
      );
    },
  });

  const editProfileMutation = useMutation({
    mutationFn: updateMe,

    onSuccess: (data) => {
      toast.success("Profile updated successfully!");

      dispatch(setUser(data.user));
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to update profile. Please try again.",
      );
    },
  });

  const handleSave = () => {
    const canvas = editorRef.current?.getImageScaledToCanvas();

    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      tempPreview.current = URL.createObjectURL(blob);

      const reader = new FileReader();

      reader.onloadend = () => {
        uploadAvatarMutation.mutate(reader.result as string);
      };

      reader.readAsDataURL(blob);
    }, "image/png");
  };

  const handleUpdateProfile = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    const oldName = user?.name ?? "";

    if (formData.name.trim() === oldName.trim()) {
      toast.error("No changes detected.");
      return;
    }

    editProfileMutation.mutate({
      name: formData.name.trim(),
    });
  };

  return {
    user,

    formData,
    setFormData,

    preview,

    selectedImage,
    isOpen,
    scale,
    setScale,

    fileInputRef,
    editorRef,

    handleSelectImage,
    handleFileChange,
    handleSave,
    handleCloseModal,
    handleUpdateProfile,

    uploadLoading: uploadAvatarMutation.isPending,
    updateLoading: editProfileMutation.isPending,
  };
}