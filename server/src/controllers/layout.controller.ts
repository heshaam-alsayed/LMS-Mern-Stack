import { NextFunction, Request, Response } from "express";

import layoutService from "../services/layout.service";

export const createLayout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const layout = await layoutService.createLayout(req.body);

    res.status(201).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLayout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const layout = await layoutService.updateLayout(req.body);

    res.status(201).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};

export const getLayoutByType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const type = req?.params.type as string;

    const layout = await layoutService.getLayoutByType(type);

    res.status(200).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};
