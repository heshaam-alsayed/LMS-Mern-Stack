"use client";

import CoursePlayerSkeleton from "@/components/skeleton/CoursePlayerSkeleton";
import { generateVdoOtp } from "@/lib/api/generateVdoOtp";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Props = {
  videoUrl: string | undefined;
  title: string | undefined;
};

export default function CoursePlayer({ title, videoUrl }: Props) {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  // يبدأ Loading مرة واحدة
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);

  const getOTPVdoMutation = useMutation({
    mutationFn: generateVdoOtp,

    onSuccess: (data) => {
      setVideoData({
        otp: data.otp,
        playbackInfo: data.playbackInfo,
      });
    },

    onError: (error) => {
      console.error("Failed to generate VdoCipher OTP:", error);

      // أوقف skeleton لو الـ OTP request فشل
      setIsPlayerLoading(false);
    },
  });

  useEffect(() => {
    if (!videoUrl) return;

    getOTPVdoMutation.mutate({
      videoId: videoUrl,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  const hasVideoData = videoData.otp && videoData.playbackInfo;

  return (
    <div className="relative w-full max-w-[900px]">
      {isPlayerLoading && <CoursePlayerSkeleton />}

      {getOTPVdoMutation.isError && (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted/40">
          <div className="text-center">
            <p className="text-sm font-medium text-destructive">
              Failed to load video
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {getOTPVdoMutation.error.message}
            </p>
          </div>
        </div>
      )}

      {/* Video */}
      {hasVideoData && (
        <div
          className={`aspect-video w-full overflow-hidden rounded-xl transition-opacity duration-300 ${
            isPlayerLoading ? "absolute opacity-0" : "relative opacity-100"
          }`}>
          <iframe
            title={title || "Course video"}
            src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(
              videoData.otp,
            )}&playbackInfo=${encodeURIComponent(videoData.playbackInfo)}`}
            className="h-full w-full border-0"
            allow="encrypted-media; fullscreen"
            allowFullScreen
            onLoad={() => {
              setIsPlayerLoading(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
