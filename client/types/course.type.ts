export type CourseLevelType = "" | "beginner" | "intermediate" | "advanced";
export type CourseInfo = {
  name: string;
  description: string;
  category?: string;
  price: string;
  estimatePrice: string;
  tags: string;
  level: CourseLevelType;
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
  videoLength: string;
  title: string;
  description: string;
  videoSection: string;
  links: CourseLink[];
  suggestion: string;
};

export type CourseData = {
  name: string;
  description: string;
  category: string;
  price: number;
  estimatePrice: number;
  tags: string;
  level: CourseLevelType;
  demoUrl: string;
  thumbnail: string;
  totalVideos: number;
  benefits: CourseBenefit[];
  prerequisites: CoursePrerequisite[];
  courseData: CourseContentData[];
  createdAt?: string;
};

/**
 * Shape returned by GET /admin/course/:id
 */

export type CourseResponseAdmin = {
  success: boolean;
  course: {
    name: string;
    description: string;
    category: string;
    price: number;
    estimatePrice: number;
    tags: string;
    level: CourseLevelType;
    demoUrl: string;

    thumbnail?: {
      public_Id?: string;
      url?: string;
    };

    benefits: CourseBenefit[];
    prerequisites: CoursePrerequisite[];
    courseData: CourseContentData[];
    createdAt?: string;
  };
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

  level: CourseLevelType;

  ratings: number;

  purchased: number;
  courseData?: CourseContentData[];
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

export interface ICoursesStatistics {
  totalCourses: number;
  coursesCreated: number;
  totalPurchases: number;
  averageRating: number;
}

export interface ICoursesStatisticsResponse {
  success: boolean;
  data: ICoursesStatistics;
}

export interface IChartAnalyticsCourses {
  month: string;
  count: number;
}

export interface ITopSellingCourse {
  _id: string;
  name: string;
  price: number;
  purchased: number;
}

export interface ITopSellingCoursesResponse {
  success: boolean;
  courses: ITopSellingCourse[];
}

export interface IPublicCoursesResponse {
  success: boolean;
  courses: Course[];
}
