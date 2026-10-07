export interface IRequestBodyCategory {
  title: string;
}

export interface CategoryCourseRef {
  _id: string;
}

export interface ICategory {
  _id: string;
  title: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
  courses: CategoryCourseRef[];
}

export interface ListCategoriesParams {
  page?: number;
  limit?: number;
}

export interface ListCategoriesResponse {
  success: boolean;
  results: number;
  categories: ICategory[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}