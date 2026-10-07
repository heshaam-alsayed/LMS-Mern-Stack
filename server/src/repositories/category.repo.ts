import { ICategory } from "../interfaces/layoutInterface";
import CategoryModel from "../models/category.model";

export const createCategory = async (data: ICategory) => {
  return await CategoryModel.create(data);
};

export const findCategoryById = async (categoryId: string) => {
  return await CategoryModel.findById(categoryId);
};

export const findCategoryByTitle = async (title: string) => {
  return await CategoryModel.findOne({
    title: {
      $regex: `^${title}$`,
      $options: "i",
    },
  });
};

export const findCategoryBySlug = async (slug: string) => {
  return await CategoryModel.findOne({ slug });
};

export const findAllCategories = async () => {
  return await CategoryModel.find().populate("courses", "_id");
};

type FindCategoriesPaginatedOptions = {
  page: number;
  limit: number;
};

export const findCategoriesPaginated = async ({
  page,
  limit,
}: FindCategoriesPaginatedOptions) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    CategoryModel.find()
      .populate("courses", "_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    CategoryModel.countDocuments(),
  ]);

  return {
    categories,
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  };
};

export const updateCategory = async (categoryId: string, data: ICategory) => {
  return await CategoryModel.findByIdAndUpdate(categoryId, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteCategory = async (categoryId: string) => {
  return await CategoryModel.findByIdAndDelete(categoryId);
};
