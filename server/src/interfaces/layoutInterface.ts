import { Document } from "mongoose";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface ICategory {
  title: string;
}

export interface IBannerImage {
  public_Id: string;
  url: string;
}

// ✅ MongoDB Document
export interface ILayoutDocument extends Document {
  type: string;

  faq?: IFaqItem[];

  categories?: ICategory[];

  banner?: {
    image: IBannerImage;
    title: string;
    subtitle: string;
  };
}

// ✅ DTO / req.body
export interface ICreateLayoutData {
  type: "banner" | "faq" | "categories";

  faq?: IFaqItem[];

  categories?: ICategory[];

  image?: string;

  title?: string;

  subtitle?: string;
}
