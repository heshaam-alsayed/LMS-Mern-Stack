export type VideoUploadCredentials = {
  videoId: string;
  clientPayload: {
    policy: string;
    key: string;
    "x-amz-signature": string;
    "x-amz-algorithm": string;
    "x-amz-date": string;
    "x-amz-credential": string;
    uploadLink: string;
  };
};

type GetVideoUploadCredentialsResponse = {
  success: boolean;
  data: VideoUploadCredentials;
};

export const getVideoUploadCredentials = async (
  title: string,
): Promise<GetVideoUploadCredentialsResponse> => {
  const response = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URI}/vdocipher/upload/credentials`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title,
    }),
  },
);

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get video upload credentials");
  }

  return data;
};
