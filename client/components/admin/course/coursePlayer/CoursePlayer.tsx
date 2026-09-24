"use client";

import CoursePlayerSkeleton from "@/components/skeleton/CoursePlayerSkeleton";
import { generateVdoOtp } from "@/lib/api/generateVdoOtp";
import { useMutation } from "@tanstack/react-query";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  videoUrl: string | undefined;
  title: string | undefined;
  onVideoEnded?: () => void;
};

export default function CoursePlayer({ title, videoUrl, onVideoEnded }: Props) {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  const [isPlayerLoading, setIsPlayerLoading] = useState(true);
  const [isVdoApiReady, setIsVdoApiReady] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
      setIsPlayerLoading(false);
    },
  });


  
    // Get OTP every change video url
   
  useEffect(() => {
    if (!videoUrl) {
      return;
    }

    setVideoData({
      otp: "",
      playbackInfo: "",
    });

    setIsIframeReady(false);
    setIsPlayerLoading(true);

    getOTPVdoMutation.mutate({
      videoId: videoUrl,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  
   //Setup VdoCipher player
   
  const setupPlayer = useCallback(() => {
    if (!isVdoApiReady) {
      console.log("VdoPlayer API is not ready");
      return;
    }

    if (!isIframeReady) {
      console.log("Iframe is not ready");
      return;
    }

    if (!iframeRef.current) {
      console.log("Iframe ref is missing");
      return;
    }

    const vdoPlayer = (window as any).VdoPlayer;

    if (!vdoPlayer) {
      console.log("VdoPlayer is not available");
      return;
    }

    console.log("Creating VdoCipher player");

    const player = vdoPlayer.getInstance(iframeRef.current);

    console.log("VdoCipher player:", player);

    const handleVideoEnded = () => {
      console.log("VIDEO ENDED");

      onVideoEnded?.();
    };

    player.video.addEventListener("ended", handleVideoEnded);

    console.log("Ended listener attached");

    return () => {
      player.video.removeEventListener("ended", handleVideoEnded);

      console.log("Ended listener removed");
    };
  }, [isVdoApiReady, isIframeReady, onVideoEnded]);

  useEffect(() => {
    return setupPlayer();
  }, [setupPlayer]);

  const hasVideoData =
    Boolean(videoData.otp) && Boolean(videoData.playbackInfo);

  return (
    <div className="relative w-full">
      <Script
        src="https://player.vdocipher.com/v2/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("VdoCipher API script loaded");

          console.log("VdoPlayer:", (window as any).VdoPlayer);

          setIsVdoApiReady(true);
        }}
        onError={(error) => {
          console.error("VdoCipher API script failed to load:", error);
        }}
      />

      {isPlayerLoading && (
        <div className="aspect-video w-full">
          <CoursePlayerSkeleton />
        </div>
      )}

      {getOTPVdoMutation.isError && (
        <div className="flex aspect-video w-full items-center justify-center bg-muted/40">
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

      {hasVideoData && (
        <div
          className={`aspect-video w-full overflow-hidden transition-opacity duration-300 ${
            isPlayerLoading
              ? "absolute inset-0 opacity-0"
              : "relative opacity-100"
          }`}>
          <iframe
            key={videoData.playbackInfo}
            ref={iframeRef}
            title={title || "Course video"}
            src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(
              videoData.otp,
            )}&playbackInfo=${encodeURIComponent(videoData.playbackInfo)}`}
            className="block h-full w-full border-0"
            allow="encrypted-media; fullscreen"
            allowFullScreen
            onLoad={() => {
              console.log("VdoCipher iframe loaded");

              setIsIframeReady(true);
              setIsPlayerLoading(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
