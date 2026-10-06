"use client";

import { FileText, X } from "lucide-react";
import { toast } from "sonner";

import {
  MAX_TICKET_FILES,
  MAX_TICKET_FILE_SIZE,
  formatPendingSize,
} from "@/lib/ticketAttachments";

type Props = {
  inputId: string;
  disabled?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
};

export default function PendingTicketFiles({
  inputId,
  disabled = false,
  files,
  onChange,
}: Props) {
  const handleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files || [],
    );

    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    if (files.length + selectedFiles.length > MAX_TICKET_FILES) {
      toast.error(
        `You can attach up to ${MAX_TICKET_FILES} files`,
      );
      return;
    }

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > MAX_TICKET_FILE_SIZE) {
        toast.error(
          `${file.name} exceeds the ${MAX_TICKET_FILE_SIZE / (1024 * 1024)} MB limit`,
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    onChange([...files, ...validFiles]);
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, fileIndex) => {
      return fileIndex !== index;
    });

    onChange(newFiles);
  };

  return (
    <>
      <input
        id={inputId}
        type="file"
        multiple
        className="sr-only"
        onChange={handleSelect}
      />

      {files?.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {files?.map((file, index) => (
            <span
              key={`${file.name}-${index}`}
              className="inline-flex max-w-48 items-center gap-1.5 rounded-lg border bg-background/60 px-2 py-1 text-[10px] text-muted-foreground"
            >
              <FileText className="size-3.5 shrink-0" />

              <span className="truncate font-medium">
                {file.name}
              </span>

              <span className="shrink-0">
                {formatPendingSize(file.size)}
              </span>

              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => handleRemove(index)}
                  className="ml-0.5 shrink-0 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  );
}