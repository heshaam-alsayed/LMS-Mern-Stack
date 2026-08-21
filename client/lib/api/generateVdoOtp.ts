import { apiClient } from "./apiClient";

export type VdoOtpResponse = {
  otp: string;
  playbackInfo: string;
};

export const generateVdoOtp = async ({
  videoId,
}: {
  videoId: string;
}): Promise<VdoOtpResponse> => {
  const res = await apiClient("/courses/getVdoCipherOTP", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoId,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error generating VdoCipher OTP");
  }

  return data;
};
