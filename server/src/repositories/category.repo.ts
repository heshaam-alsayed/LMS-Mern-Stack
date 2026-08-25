import CategoryModel, { ICategory } from "../models/category.model";

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
  return await CategoryModel.find().populate("courses");
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
