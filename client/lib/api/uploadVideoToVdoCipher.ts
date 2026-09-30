import axios from "axios";

import type { VideoUploadCredentials } from "./getVideoUploadCredentials";

const CLIENT_PAYLOAD_FIELDS = [
  "policy",
  "key",
  "x-amz-signature",
  "x-amz-algorithm",
  "x-amz-date",
  "x-amz-credential",
] as const;

const UPLOAD_TIMEOUT = 1000 * 60 * 30;

export const uploadVideoToVdoCipher = async (
  file: File,
  clientPayload: VideoUploadCredentials["clientPayload"],
  onProgress?: (percent: number) => void,
) => {
  if (!clientPayload?.uploadLink) {
    throw new Error("Upload link is missing. Please try again.");
  }

  const formData = new FormData();

  CLIENT_PAYLOAD_FIELDS.forEach((field) => {
    formData.append(field, clientPayload[field] ?? "");
  });

  formData.append("success_action_status", "201");
  formData.append("success_action_redirect", "");
  formData.append("file", file, file.name);

  try {
    const response = await axios.post(clientPayload.uploadLink, formData, {
      timeout: UPLOAD_TIMEOUT,
      onUploadProgress: (event:any) => {
        const total = event.total || file.size || 0;

        if (!total) {
          return;
        }

        onProgress?.(Math.min(99, Math.round((event.loaded / total) * 100)));
      },
    });

    onProgress?.(100);

    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (error?.code === "ECONNABORTED") {
      throw new Error("The upload timed out. Please try a smaller file.");
    }

    if (error?.message === "Network Error" || status === 0) {
      throw new Error(
        "Could not reach the video storage. This is often a CORS block on the video host - ask the host to allow uploads from this domain.",
      );
    }

    if (status === 403) {
      throw new Error(
        "Video storage rejected the upload. The upload link may have expired - please try again.",
      );
    }

    if (status === 400) {
      throw new Error(
        "Video storage rejected the upload data (400). Please try again.",
      );
    }

    throw new Error(
      `Video storage rejected the upload${status ? ` (status ${status})` : ""}. Please try again.`,
    );
  }
};
