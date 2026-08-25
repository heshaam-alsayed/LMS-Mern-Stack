import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  findCategoryByTitle,
  updateCategory,
} from "../repositories/category.repo";
import AppError from "../utils/AppError";
import { slugify } from "../utils/helper";

export const createCategoryService = async (title: string) => {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    throw new AppError("Category title is required", 400);
  }

  const existingCategory = await findCategoryByTitle(normalizedTitle);

  if (existingCategory) {
    throw new AppError("Category already exists", 409);
  }

  const slug = slugify(normalizedTitle);

  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug) {
    throw new AppError("Category slug already exists", 409);
  }

  return await createCategory({
    title: normalizedTitle,
    slug,
  });
};

export const updateCategoryService = async (
  categoryId: string,
  title: string,
) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    throw new AppError("Category title is required", 400);
  }

  const existingCategory = await findCategoryByTitle(normalizedTitle);

  if (existingCategory && existingCategory._id.toString() !== categoryId) {
    throw new AppError("Category already exists", 409);
  }

  const slug = slugify(normalizedTitle);

  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug && existingSlug._id.toString() !== categoryId) {
    throw new AppError("Category slug already exists", 409);
  }

  return await updateCategory(categoryId, {
    title: normalizedTitle,
    slug,
  });
};

export const getAllCategoriesService = async () => {
  return await findAllCategories();
};

export const getCategoryByIdService = async (categoryId: string) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const deleteCategoryService = async (categoryId: string) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return await deleteCategory(categoryId);
};
