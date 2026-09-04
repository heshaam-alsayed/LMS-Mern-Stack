import { NextFunction, Request, Response } from "express";

import layoutService from "../services/layout.service";
import { LayoutType } from "../interfaces/layoutInterface";

export const getAllLayouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("GET ALL LAYOUTS");

    const layouts = await layoutService.getAllLayouts();

    console.log("LAYOUTS:", layouts);

    res.status(200).json({
      success: true,
      count: layouts.length,
      layouts,
    });
  } catch (error) {
    console.error("GET ALL LAYOUTS ERROR:", error);
    next(error);
  }
};
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
    console.log("calling banner layout")
    const type = req?.params.type as LayoutType;

    const layout = await layoutService.getLayoutByType(type);

    res.status(200).json({
      success: true,
      layout,
    });
  } catch (error) {
    next(error);
  }
};
