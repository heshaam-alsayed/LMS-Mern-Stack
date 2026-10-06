"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2,
  FileVideo,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getVideoUploadCredentials } from "@/lib/api/getVideoUploadCredentials";
import { uploadVideoToVdoCipher } from "@/lib/api/uploadVideoToVdoCipher";
import { waitForVideoLengthMinutes } from "@/lib/api/getVideoUploadStatus";

type UploadPhase = "idle" | "preparing" | "uploading";

type Props = {
  title: string;
  videoUrl: string;
  onUploaded: (videoId: string) => void;
  onDurationResolved?: (minutes: number) => void;
  onLengthResolvingChange?: (resolving: boolean) => void;
};

const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);

  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }

  return `${(mb / 1024).toFixed(2)} GB`;
};

export default function VideoUploader({
  title,
  videoUrl,
  onUploaded,
  onDurationResolved,
  onLengthResolvingChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploadedVideoId, setUploadedVideoId] = useState(videoUrl);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // The parent fills videoUrl asynchronously when editing an existing course
  // so keep the uploaded state in sync with the incoming
  useEffect(() => {
    setUploadedVideoId(videoUrl);
  }, [videoUrl]);

  const { mutate: uploadVideo, isPending } = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(0);
      setUploadPhase("preparing");

      const { data } = await getVideoUploadCredentials(title.trim());

      if (!data?.videoId || !data?.clientPayload) {
        throw new Error(
          "The server did not return usable upload credentials. Please try again.",
        );
      }

      setUploadPhase("uploading");

      await uploadVideoToVdoCipher(
        file,
        data.clientPayload,
        setUploadProgress,
      );

      return data.videoId;
    },

    onSuccess: async (videoId) => {
      setUploadedVideoId(videoId);
      setSelectedVideo(null);
      setUploadProgress(0);
      setUploadPhase("idle");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onUploaded(videoId);
      toast.success("Video uploaded successfully");

      onLengthResolvingChange?.(true);

      try {
        const minutes = await waitForVideoLengthMinutes(videoId);

        if (minutes > 0 && isMounted.current) {
          onDurationResolved?.(minutes);
        }
      } finally {
        onLengthResolvingChange?.(false);
      }
    },

    onError: (error: Error) => {
      setUploadProgress(0);
      setUploadPhase("idle");

      toast.error(error.message);
    },
  });

  const handleSelectVideo = () => {
    inputRef.current?.click();
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedVideo(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file.");
      return;
    }

    setSelectedVideo(file);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUploadVideo = () => {
    if (!selectedVideo) return;

    if (!title.trim()) {
      toast.error("Please enter a video title first.");
      return;
    }

    uploadVideo(selectedVideo);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="hidden"
      />

      {!selectedVideo && !uploadedVideoId ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleSelectVideo();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();

            if (!isPending) {
              setIsDragging(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();

            if (!isPending) {
              setIsDragging(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();

            if (event.currentTarget === event.target) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
          onClick={handleSelectVideo}
          className={cn(
            "group cursor-pointer rounded-xl border border-dashed p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
          )}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border bg-background shadow-sm">
            <Upload className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold">
              {isDragging ? "Drop your video here" : "Upload your video"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Drag & drop your video here or{" "}
              <span className="font-medium text-primary">click to browse</span>
            </p>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">MP4, MOV, WEBM</p>
        </div>
      ) : null}

      {selectedVideo ? (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileVideo className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {selectedVideo.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {selectedVideo.type || "Video"} ·{" "}
                {formatFileSize(selectedVideo.size)}
              </p>
            </div>

            {!isPending ? (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove selected video">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {isPending ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />

                  {uploadPhase === "preparing"
                    ? "Preparing upload..."
                    : `Uploading video...`}
                </span>

                <span className="font-medium tabular-nums">
                  {uploadProgress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              onClick={handleUploadVideo}
              disabled={isPending}
              className="flex-1 gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}

              {isPending
                ? uploadProgress > 0
                  ? `Uploading ${uploadProgress}%`
                  : "Preparing..."
                : "Upload Video"}
            </Button>

            {!isPending ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectVideo}>
                Change
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {!selectedVideo && uploadedVideoId ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Video uploaded
              </p>

              <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                {uploadedVideoId}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectVideo}
              className="w-full gap-2 bg-background">
              <RefreshCw className="h-4 w-4" />
              Replace Video
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
