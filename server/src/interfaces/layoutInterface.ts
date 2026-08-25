import { Document } from "mongoose";

export type LayoutType = "banner" | "faq" | "categories";

export interface IBannerImage {
  public_Id: string;
  url: string;
}

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface ICategory {
  title: string;
}

// MongoDB Document
export interface ILayoutDocument extends Document {
  type: LayoutType;

  faq?: IFaqItem[];

  categories?: ICategory[];

  banner?: {
    lightBanner: IBannerImage;
    darkBanner: IBannerImage;
    title: string;
    subtitle: string;
  };
}

// Create / Update request data
export interface ILayoutData {
  type: LayoutType;

  lightBanner?: string;
  darkBanner?: string;

  title?: string;
  subtitle?: string;

  faq?: IFaqItem[];

}

export interface ICreateLayoutData {
  type: LayoutType;

  lightBanner?: string;
  darkBanner?: string;

  title?: string;
  subtitle?: string;

  faq?: IFaqItem[];

}

export interface IUpdateLayoutData {
  type: LayoutType;

  lightBanner?: string;
  darkBanner?: string;

  title?: string;
  subtitle?: string;

  faq?: IFaqItem[];

}
