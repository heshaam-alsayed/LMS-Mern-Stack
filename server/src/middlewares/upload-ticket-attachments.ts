import { NextFunction, Request, Response } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

type Attchments = {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
};
export const uploadTicketAttachments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];
    const attachments: Attchments[] = [];
    if (!files.length) {
      req.body.attachments = attachments;
      next();
    }
    for (const file of files) {
      const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";
      const result: any = await uploadToCloudinary(
        file.buffer,
        "LMS/tickets",
        resourceType,
      );
      attachments.push({
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      });
    }

    req.body.attachments = attachments;
    return next();
  } catch (error) {
    next(error);
  }
};
