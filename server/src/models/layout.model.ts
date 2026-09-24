import mongoose, { Model, Schema } from "mongoose";

import {
  IBannerImage,
  IFaqItem,
  ILayoutDocument,
} from "../interfaces/layoutInterface";

const faqSchema = new Schema<IFaqItem>({
  question: String,
  answer: String,
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
      enum: ["banner", "faq", "categories"],
    },

    faq: [faqSchema],

    banner: {
      lightBanner: bannerImageSchema,
      darkBanner: bannerImageSchema,
      title: String,
      subtitle: String,
    },
  },
  {
    timestamps: true,
  },
);

const LayoutModel: Model<ILayoutDocument> = mongoose.model<ILayoutDocument>(
  "Layout",
  layoutSchema,
);

export default LayoutModel;
