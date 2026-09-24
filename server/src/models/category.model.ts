import mongoose, { Model, Schema, Types } from "mongoose";

interface ICategory {
  _id: Types.ObjectId;
  title: string;
  slug: string;

  status: "pending" | "approved" | "rejected";

  requestedBy?: Types.ObjectId;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;

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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
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
