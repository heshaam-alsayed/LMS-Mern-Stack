import { apiClient } from "./apiClient";

export type VdoVideoState =
  | "ready"
  | "queued"
  | "processing"
  | "failed"
  | "unknown";

export type VdoVideoStatusResponse = {
  videoId: string;
  state: VdoVideoState;
  status: string;
  title?: string;
  lengthSeconds: number;
  posterCount: number;
  sizeBytes: number;
  uploadTime?: number;
  streamType?: string;
};

const LENGTH_POLL_INTERVAL = 5000;
const LENGTH_POLL_ATTEMPTS = 120;
const MAX_CONSECUTIVE_ERRORS = 3;

export const secondsToMinutes = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 0;
  }

  return Math.max(1, Math.round(seconds / 60));
};

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getVideoUploadStatus = async (
  videoId: string,
): Promise<VdoVideoStatusResponse> => {
  const res = await apiClient("/vdocipher/video/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Could not read the video status");
  }

  return data.data as VdoVideoStatusResponse;
};

export const waitForVideoLengthMinutes = async (
  videoId: string,
): Promise<number> => {
  let consecutiveErrors = 0;

  for (let attempt = 0; attempt < LENGTH_POLL_ATTEMPTS; attempt += 1) {
    try {
      const status = await getVideoUploadStatus(videoId);

      consecutiveErrors = 0;

      if (status.lengthSeconds > 0) {
        return secondsToMinutes(status.lengthSeconds);
      }

      if (status.state === "failed") {
        return 0;
      }
    } catch {
      consecutiveErrors += 1;

      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        return 0;
      }
    }

    await wait(LENGTH_POLL_INTERVAL);
  }

  return 0;
};
