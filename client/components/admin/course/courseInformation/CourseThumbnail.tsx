"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
};

export default function CourseThumbnail({ value, onChange, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      onChange(base64);
    };

    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    handleFile(selectedFile);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    handleFile(droppedFile);
  };

  // Open file browser
  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Course Thumbnail</label>

      {!value ? (
        <div
          onClick={handleOpenFile}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20 hover:border-primary/50",
          )}>
          <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />

          <p className="text-sm font-medium">Drag & drop your thumbnail</p>

          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            PNG, JPG, WEBP · Max 5MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border">
          <Image
            src={value}
            alt="Course thumbnail"
            width={800}
            height={500}
            className=" w-full object-cover"
          />

          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
