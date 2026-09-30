import axios from "axios";

import AppError from "../utils/AppError";

const VDOCIPHER_BASE_URL = "https://dev.vdocipher.com/api/videos";

export type VdoCipherVideoState =
  | "ready"
  | "queued"
  | "processing"
  | "failed"
  | "unknown";

export type VdoCipherVideoStatus = {
  videoId: string;
  state: VdoCipherVideoState;
  status: string;
  title?: string;
  lengthSeconds: number;
  posterCount: number;
  sizeBytes: number;
  uploadTime?: number;
  streamType?: string;
};

const FAILED_STATES = new Set([
  "failed",
  "failure",
  "error",
  "aborted",
  "cancelled",
  "canceled",
  "deleted",
  "removed",
]);

const READY_STATES = new Set([
  "ready",
  "complete",
  "completed",
  "done",
  "available",
]);

const PROCESSING_STATES = new Set([
  "processing",
  "transcoding",
  "encoding",
  "inprogress",
  "in-progress",
  "uploading",
  "running",
]);

const QUEUED_STATES = new Set([
  "queued",
  "pre-upload",
  "preupload",
  "pending",
  "waiting",
  "new",
  "",
]);

export const normaliseVideoState = (raw: unknown): VdoCipherVideoState => {
  const status = String(raw ?? "")
    .trim()
    .toLowerCase();

  if (FAILED_STATES.has(status)) return "failed";
  if (READY_STATES.has(status)) return "ready";
  if (PROCESSING_STATES.has(status)) return "processing";
  if (QUEUED_STATES.has(status)) return "queued";

  return "unknown";
};

const toPositiveInt = (value: unknown) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0;
};

const getApiSecret = () => {
  const secret = process.env.VIDEO_CIPHER_API_SECRET;

  if (!secret) {
    throw new AppError(
      "VdoCipher is not configured: VIDEO_CIPHER_API_SECRET is missing on the server",
      500,
    );
  }

  return secret;
};

const buildHeaders = () => ({
  Accept: "application/json",
  Authorization: `Apisecret ${getApiSecret()}`,
});

const readDetail = (body: any) => {
  if (typeof body === "string") {
    return body;
  }

  return body?.message || body?.error || body?.errors?.[0] || "";
};

const tidy = (text: string) => text.replace(/\s+/g, " ").trim();

const LIMIT_PATTERN =
  /trial limit|video limit|reach the limit|limit of \d+|quota|upgrade|subscription/i;

const toAppError = (error: any, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new AppError(fallback, 500);
  }

  const status = error.response?.status;
  const detail = tidy(readDetail(error.response?.data));

  if (detail && LIMIT_PATTERN.test(detail)) {
    return new AppError(
      `VdoCipher account limit reached. ${detail} Delete unused videos in the VdoCipher dashboard or upgrade the plan, then try again.`,
      403,
    );
  }

  if (detail) {
    return new AppError(`VdoCipher: ${detail}`, 502);
  }

  if (status === 401 || status === 403) {
    return new AppError(
      "VdoCipher rejected the server API secret. Check VIDEO_CIPHER_API_SECRET in server/.env",
      502,
    );
  }

  if (status === 429) {
    return new AppError(
      "VdoCipher upload rate limit reached. Try again in a few minutes",
      429,
    );
  }

  return new AppError(
    `${fallback}${status ? ` (status ${status})` : ""}`,
    502,
  );
};

export const getVideoUploadCredentials = async (title: string) => {
  try {
    const response = await axios.put(VDOCIPHER_BASE_URL, null, {
      params: { title },
      headers: buildHeaders(),
    });

    return response.data;
  } catch (error) {
    throw toAppError(error, "Could not start the video upload on VdoCipher");
  }
};

export const getVideoStatus = async (
  videoId: string,
): Promise<VdoCipherVideoStatus> => {
  let body: any;

  try {
    const response = await axios.get(`${VDOCIPHER_BASE_URL}/${videoId}`, {
      headers: buildHeaders(),
    });

    body = response.data;
  } catch (error) {
    throw toAppError(error, "Could not read the video status from VdoCipher");
  }

  const status = String(body?.status ?? "");

  return {
    videoId: String(body?.id ?? videoId),
    state: normaliseVideoState(status),
    status,
    title: body?.title,
    lengthSeconds: toPositiveInt(body?.length),
    posterCount: Array.isArray(body?.posters) ? body.posters.length : 0,
    sizeBytes: toPositiveInt(body?.totalSizeBytes),
    uploadTime: toPositiveInt(body?.upload_time) || undefined,
    streamType: body?.stream_type,
  };
};
