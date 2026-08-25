import { CourseData } from "./course.type";

export interface IRequestBodyCategory {
  title: string;
}

export interface ICategory {
  _id: string;
  title: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
  courses: CourseData[];
}

export interface ICategory {
  _id: string;
  title: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
}
