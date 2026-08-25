import { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "../services/category.service";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body;

    const category = await createCategoryService(title);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.categoryId as string;
    const { title } = req.body;

    const category = await updateCategoryService(categoryId, title);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getAllCategoriesService();

    res.status(200).json({
      success: true,
      results: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.categoryId as string;

    const category = await getCategoryByIdService(categoryId);

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.categoryId as string;

    await deleteCategoryService(categoryId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
