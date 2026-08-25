import mongoose, { Model, Schema, Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

categorySchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "category",
});
const CategoryModel: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema,
);
export default CategoryModel;
