import cloudinary from "../config/cloudinary";

export type CloudinaryResourceType = "image" | "raw";

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  resourceType: CloudinaryResourceType,
) => {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: CloudinaryResourceType,
) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
