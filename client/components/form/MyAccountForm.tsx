"use client";

import { Camera } from "lucide-react";
import Image from "next/image";

import Loader from "../shared/Loader";
import AvatarPreviewModal from "@/components/modal/AvatarPreviewModal";
import { useMyAccount } from "@/hooks/user/useMyAccount";

export default function MyAccountForm() {
  const {
    formData,
    setFormData,
    preview,
    previewImage,
    pendingFileName,
    isPreviewOpen,
    fileInputRef,
    handleSelectImage,
    handleFileChange,
    releasePreview,
    saveAvatar,
    handleUpdateProfile,
    uploadLoading,
    updateLoading,
  } = useMyAccount();

  return (
    <>
      <div className="mx-auto w-full max-w-2xl rounded-xl">
        <div className="mb-8 flex justify-center">
          <div
            className="group relative cursor-pointer"
            onClick={handleSelectImage}
          >
            <Image
              src={preview}
              alt="Profile"
              width={120}
              height={120}
              className="h-30 w-30 rounded-full border border-border bg-muted/40 object-contain transition group-hover:brightness-75"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectImage();
              }}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-md opacity-0 transition group-hover:opacity-100"
            >
              <Camera className="h-5 w-5 text-foreground" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="fullName"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email Address
            </label>

            <input
              id="email"
              disabled
              value={formData.email}
              className="h-11 w-full rounded-lg border border-input bg-muted px-4 text-muted-foreground outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={updateLoading}
              className="flex h-10 w-[180px] items-center justify-center rounded-lg bg-primary px-6 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateLoading ? <Loader /> : "Update Profile"}
            </button>
          </div>
        </form>
      </div>

      <AvatarPreviewModal
        isOpen={isPreviewOpen}
        imageSrc={previewImage}
        fileName={pendingFileName}
        isLoading={uploadLoading}
        onClose={releasePreview}
        onSave={saveAvatar}
      />
    </>
  );
}
