export type CourseInfo = {
  name: string;
  description: string;
  price: number;
  estimatePrice: number;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
};

export type CourseBenefit = {
  title: string;
};

export type CoursePrerequisite = {
  title: string;
};

export type CourseLink = {
  title: string;
  url: string;
};

export type CourseContentData = {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  links: CourseLink[];
  suggestion: string;
};

export type CourseData = {
  name: string;
  description: string;
  price: number;
  estimatePrice: number;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
  totalVideos: number;
  benefits: CourseBenefit[];
  prerequisites: CoursePrerequisite[];
  courseData: CourseContentData[];
  createdAt?: string;
};

export interface Course {
  _id: string;

  name: string;

  description: string;

  price: number;

  estimatePrice: number;

  thumbnail?: {
    public_Id?: string;
    url?: string;
  };

  level: "beginner" | "intermediate" | "advanced";

  ratings: number;

  purchased: number;

  createdAt: string;

  updatedAt: string;
}

export type CoursesResponseAdmin = {
  success: boolean;
  courses: Course[];
  result: number;
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
