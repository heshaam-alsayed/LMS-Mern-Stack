export type BannerImage = {
  public_Id: string;
  url: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Category = {
  title: string;
};

export type LayoutType = "banner" | "categories" | "faq";

export type Layout = {
  _id: string;
  type: LayoutType;

  faq?: Faq[];

  categories?: Category[];

  banner?: {
    lightBanner: BannerImage;
    darkBanner: BannerImage;
    title: string;
    subtitle: string;
  };

  createdAt: string;
  updatedAt: string;
};

export type LayoutRequestBody = {
  type: LayoutType;

  faq?: Faq[];

  categories?: Category[];

  banner?: {
    lightBanner: BannerImage;
    darkBanner: BannerImage;
    title: string;
    subtitle: string;
  };
};

export interface IGetAllLayoutsResponse {
  success: boolean;
  count: number;
  layouts: Layout[];
}

export interface IUpdateLayoutData {
  type: LayoutType;
  lightBanner?: string;
  darkBanner?: string;
  title?: string;
  subtitle?: string;
  faq?: Faq[];
  categories?: Category[];
}

export interface IHeroStatsResponse {
  success: boolean;
  stats: {
    totalStudents: number;
    totalCourses: number;
    totalCertificates: number;
    totalEnrollments: number;
  };
}
