"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import AvatarEditor from "react-avatar-editor";

import Loader from "../shared/Loader";
import { useMyAccount } from "@/hooks/user/useMyAccount";

export default function MyAccountForm() {
  const {
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
              className="h-30 w-30 rounded-full border border-border object-cover transition group-hover:brightness-75"
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

        {/* Form */}
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

      {/* Crop Modal */}
      {isOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-6 text-center text-lg font-semibold">
              Crop Profile Photo
            </h2>

            <div className="flex justify-center">
              <AvatarEditor
                ref={editorRef}
                image={selectedImage}
                width={250}
                height={250}
                border={20}
                borderRadius={125}
                scale={scale}
              />
            </div>

            <div className="mt-6">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={uploadLoading}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={uploadLoading}
                className="flex min-w-24 items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadLoading ? <Loader /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}