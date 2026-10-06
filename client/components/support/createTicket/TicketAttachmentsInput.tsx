"use client";

import { useRef, useState } from "react";
import { FileText, Paperclip, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_SIZE,
} from "@/hooks/support/useCreateTicketForm";

type Props = {
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function TicketAttachmentsInput({
  files,
  onAdd,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const isFull = files.length >= MAX_ATTACHMENTS;

  const handleSelect = (fileList: FileList | null) => {
    if (!fileList) return;

    onAdd(Array.from(fileList));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    handleSelect(event.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="attachments" className="text-sm font-medium">
          Attachments
        </label>

        <span className="text-xs text-muted-foreground">
          {files.length}/{MAX_ATTACHMENTS}
        </span>
      </div>

      <div
        onClick={() => !isFull && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();

          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={isFull ? -1 : 0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (!isFull) inputRef.current?.click();
          }
        }}
        aria-disabled={isFull}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition",
          isFull
            ? "cursor-not-allowed border-border bg-muted/20 opacity-60"
            : "hover:border-primary/50 hover:bg-muted/20",
          isDragging && "border-primary bg-primary/5",
        )}>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Paperclip className="size-5" />
        </div>

        <p className="text-sm font-medium text-foreground">
          {isFull
            ? "Attachment limit reached"
            : "Drop files here or click to browse"}
        </p>

        <p className="text-xs text-muted-foreground">
          Up to {MAX_ATTACHMENTS} files, {formatSize(MAX_ATTACHMENT_SIZE)} each
        </p>

        <input
          id="attachments"
          ref={inputRef}
          type="file"
          multiple
          disabled={isFull}
          onChange={(event) => {
            handleSelect(event.target.files);

            event.target.value = "";
          }}
          className="hidden"
        />
      </div>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                <FileText className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatSize(file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${file.name}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}