import mongoose, { Model, Schema } from "mongoose";

import {
  IBannerImage,
  ICategory,
  IFaqItem,
  ILayoutDocument,
} from "../interfaces/layoutInterface";

const faqSchema = new Schema<IFaqItem>({
  question: String,
  answer: String,
});

const categorySchema = new Schema<ICategory>({
  title: String,
});

const bannerImageSchema = new Schema<IBannerImage>({
  public_Id: String,
  url: String,
});

const layoutSchema = new Schema<ILayoutDocument>(
  {
    type: {
      type: String,
      required: true,
    },

    faq: [faqSchema],

    categories: [categorySchema],

    banner: {
      image: bannerImageSchema,
      title: String,
      subtitle: String,
    },
  },
  {
    timestamps: true,
  },
);

const LayoutModel: Model<ILayoutDocument> = mongoose.model(
  "Layout",
  layoutSchema,
);

export default LayoutModel;
