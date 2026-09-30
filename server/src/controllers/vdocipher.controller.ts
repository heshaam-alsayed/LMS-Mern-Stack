import { NextFunction, Request, Response } from "express";
import {
  getVideoStatus,
  getVideoUploadCredentials,
} from "../services/vdoCipher.service";

export const getUploadCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Video title is required",
      });
    }

    const data = await getVideoUploadCredentials(title.trim());

    return res.status(200).json({
      success: true,
      data: {
        videoId: data.videoId,
        clientPayload: data.clientPayload,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getVideoStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { videoId } = req.body;

    if (!videoId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Video id is required",
      });
    }

    const data = await getVideoStatus(videoId.trim());

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
