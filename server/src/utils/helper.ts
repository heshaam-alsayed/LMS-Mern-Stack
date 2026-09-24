import mongoose from "mongoose";

export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const calcAverageReviews = (reviews: any[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, cur) => acc + Number(cur.rating || 0), 0);
  return sum / reviews.length;
};

export const slugify = (value: string): string => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


