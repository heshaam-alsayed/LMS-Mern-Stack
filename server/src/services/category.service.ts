import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoriesPaginated,
  findCategoryById,
  findCategoryBySlug,
  findCategoryByTitle,
  updateCategory,
} from "../repositories/category.repo";
import AppError from "../utils/AppError";
import { slugify } from "../utils/helper";
import { delCached, getCached, setCached } from "../utils/redis";
import { bumpCatalogGeneration } from "../utils/courseCache";

const ALL_CATEGORIES_CACHE_KEY = "categories:all:v2";
const ALL_CATEGORIES_TTL = 300;

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

  const created = await createCategory({
    title: normalizedTitle,
    slug,
  });

  await delCached(ALL_CATEGORIES_CACHE_KEY);

  return created;
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

  const updated = await updateCategory(categoryId, {
    title: normalizedTitle,
    slug,
  });

  // filters reference category by slug/name, drop the list so pages pick up
  // the new title immediately
  await delCached(ALL_CATEGORIES_CACHE_KEY);
  await bumpCatalogGeneration();

  return updated;
};

export const getAllCategoriesService = async (
  options: { page?: number; limit?: number } = {},
) => {
  const { page, limit } = options;

  if (page && limit) {
    return findCategoriesPaginated({ page, limit });
  }

  const cached = await getCached<any>(ALL_CATEGORIES_CACHE_KEY);

  if (cached) {
    return {
      categories: cached,
      total: cached.length,
      totalPages: 1,
      page: 1,
      limit: cached.length,
    };
  }

  const categories = await findAllCategories();

  await setCached(ALL_CATEGORIES_CACHE_KEY, categories, ALL_CATEGORIES_TTL);

  return {
    categories,
    total: categories.length,
    totalPages: 1,
    page: 1,
    limit: categories.length,
  };
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

  const deleted = await deleteCategory(categoryId);

  await delCached(ALL_CATEGORIES_CACHE_KEY);
  await bumpCatalogGeneration();

  return deleted;
};
