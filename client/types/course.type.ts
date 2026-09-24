import { IUser } from "./auth.type";
import { ICourseProgress } from "./courseProgress.type";

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
  _id?: string;
};

export type QuestionReply = {
  _id: string;
  user: IUser;
  answer: string;
  createdAt: string;
  updatedAt: string;
};
export type QuestionContent = {
  _id: string;
  user: IUser;
  question: string;
  questionReplies: QuestionReply[];
  createdAt: string;
  updatedAt: string;
};

export type ReviewReply = {
  _id: string;
  user: IUser;
  comment: string;
  createdAt: string;
  updatedAt: string;
};
export type reviewContent = {
  _id: string;
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: ReviewReply[];
  createdAt: string;
  updatedAt: string;
};
export type CoursePrerequisite = {
  title: string;
  _id?: string;
};

export type CourseLink = {
  title: string;
  url: string;
};

export type CourseContentData = {
  _id: string;
  videoUrl: string;
  videoLength: string;
  title: string;
  description: string;
  videoSection: string;
  links: CourseLink[];
  suggestion: string;
  isFree: boolean;
  questions: QuestionContent[];
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
  reviews: reviewContent[];
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
  categories: {
    slug: string;
    title: string;
    _id: string;
  }[];
  result: number;
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IReviewCourse {
  _id: string;
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: ReviewReply[];
  createdAt: string;
  updatedAt: string;
}
export interface ICoursePublicDetails {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    slug: string;
    title: string;
  };
  price: number;
  estimatePrice: number;
  tags: string;
  level: CourseLevelType;
  demoUrl: string;

  thumbnail?: {
    public_Id?: string;
    url?: string;
  };
  ratings: number;
  purchased: number;
  benefits: CourseBenefit[];
  prerequisites: CoursePrerequisite[];
  reviews: IReviewCourse[];
  courseData: CourseContentData[];
  createdAt?: string;
}
export interface IPublicCourseDetailsResponse {
  success: boolean;
  course: ICoursePublicDetails;
}

export interface IContentCourseResponse {
  success: boolean;
  course: ICoursePublicDetails;
  progress: ICourseProgress;
}
