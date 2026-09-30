import {
  Course,
  CourseResponseAdmin,
  CourseStatusType,
  IChartAnalyticsCourses,
} from "./course.type";
import { IChartAnalyticsOrders } from "./order.type";

export type OrganizationStatus = "active" | "suspended";

export type OrganizationInstructor = {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_Id?: string;
    url?: string;
  };
  role?: string;
  status?: string;
  createdAt?: string;
};

export type Organization = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  instructor: OrganizationInstructor;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationPagination = {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type GetOrganizationsResponse = {
  success: boolean;
  organizations: Organization[];
  result: number;
  pagination: OrganizationPagination;
};

export type GetOrganizationDetailsResponse = {
  success: boolean;
  organization: Organization;
  result: number;
  courses: Course[];
  pagination: OrganizationPagination;
};

export type OrganizationsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrganizationStatus;
};

export type UpdateOrganizationPayload = {
  name?: string;
  status?: OrganizationStatus;
};

export type UpdateOrganizationResponse = {
  success: boolean;
  message: string;
  organization: Organization;
};

export type DeleteOrganizationResponse = {
  success: boolean;
  message: string;
  id: string;
  name: string;
  deletedCourses: number;
};

export type OrganizationCoursesStatistics = {
  totalCourses: number;
  coursesCreated: number;
  totalPurchases: number;
  averageRating: number;
};

export type GetOrganizationCoursesAnalyticsResponse = {
  success: boolean;
  data: {
    statistics: OrganizationCoursesStatistics;
    monthly: IChartAnalyticsCourses[];
  };
};

export type OrganizationInstructorDetails = {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_Id?: string;
    url?: string;
  };
  role?: string;
  status?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GetOrganizationInstructorResponse = {
  success: boolean;
  data: {
    instructor: OrganizationInstructorDetails;
    coursesCount: number;
  };
};

export type OrganizationOrdersStatistics = {
  totalOrders: number;
  newOrders: number;
  totalRevenue: number;
  yearlyRevenue: number;
};

export type GetOrganizationOrdersAnalyticsResponse = {
  success: boolean;
  data: {
    statistics: OrganizationOrdersStatistics;
    monthly: IChartAnalyticsOrders[];
  };
};

export type MyOrganization = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
};

export type GetMyOrganizationResponse = {
  success: boolean;
  organization: MyOrganization;
};

export type OrganizationDashboardStatistics = {
  totalStudents: number;
  totalCourses: number;
  totalOrders: number;
  totalCertificates: number;
  totalLearningHours: number;
};

export type GetOrganizationDashboardStatisticsResponse = {
  success: boolean;
  organization: MyOrganization;
  statistics: OrganizationDashboardStatistics;
};

export type OrganizationCoursePerformance = {
  _id: string;
  course: string;
  students: number;
  revenue: number;
  rating: number;
  completion: number;
};

export type GetMyOrganizationCoursesPerformanceResponse = {
  success: boolean;
  organization: MyOrganization;
  result: number;
  statistics: OrganizationCoursePerformance[];
  pagination: OrganizationPagination;
};

export type MyOrganizationCoursesPerformanceParams = {
  page?: number;
  limit?: number;
};

export type CourseOrdersMonthly = {
  year: number;
  month: number;
  monthName: string;
  orders: number;
  revenue: number;
};

export type GetMyOrganizationCourseResponse = {
  success: boolean;

  organization: {
    _id: string;
    name: string;
    slug: string;
  };

  category: {
    _id: string;
    title: string;
    slug: string;
  } | null;

  course: CourseResponseAdmin["course"] & {
    _id: string;
    organization: string;
    instructor: string;
    createdBy: string;
    purchased?: number;
    ratings?: number;
    updatedAt?: string;
  };
};

export type GetCourseOrdersAnalyticsResponse = {
  success: boolean;
  course: {
    _id: string;
    name: string;
  };
  totalOrders: number;
  totalRevenue: number;
  monthly: CourseOrdersMonthly[];
};

export type RecentActivityUser = {
  _id: string;
  name: string;
  avatar?: {
    public_Id?: string;
    url?: string;
  };
};

export type RecentEnrollment = {
  _id: string;
  user: RecentActivityUser;
  course: {
    _id: string;
    name: string;
  };
  price: number;
  createdAt: string;
};

export type GetRecentEnrollmentsResponse = {
  success: boolean;
  organization: MyOrganization;
  result: number;
  enrollments: RecentEnrollment[];
};

export type RecentReview = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  course: {
    _id: string;
    name: string;
  };
  user: RecentActivityUser;
};

export type GetRecentReviewsResponse = {
  success: boolean;
  organization: MyOrganization;
  result: number;
  reviews: RecentReview[];
};

export type GetOrganizationCoursesResponse = {
  success: boolean;
  result: number;
  courses: Course[];
  pagination: OrganizationPagination;
};

export type OrganizationCoursesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  level?: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published" | "archived";
  "price[gte]"?: number;
  "price[lte]"?: number;
  "estimatePrice[gte]"?: number;
  "estimatePrice[lte]"?: number;
  "ratings[gte]"?: number;
  "purchased[gte]"?: number;
  sort?: string;
};

export type OrganizationOrderCustomer = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  avatar?: {
    public_Id?: string;
    url?: string;
  };
};

export type OrganizationOrderCourse = {
  _id: string;
  name: string;
  price: number;
  status?: CourseStatusType;
  ratings?: number;
  purchased?: number;
  category?: {
    _id: string;
    title: string;
  };
  thumbnail: {
    url: string;
  };
  level:string
};

export type OrganizationOrder = {
  _id: string;
  user: OrganizationOrderCustomer;
  course: OrganizationOrderCourse;
  price: number;
  paymentInfo?: {
    id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    payment_method?: string | null;
    created?: number;
  };
  createdAt: string;
  updatedAt?: string;
};

export type GetOrganizationOrdersResponse = {
  success: boolean;
  organization: MyOrganization;
  result: number;
  summary: {
    totalOrders: number;
    totalRevenue: number;
  };
  orders: OrganizationOrder[];
  pagination: OrganizationPagination;
};

export type OrganizationOrdersQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
  sort?: string;
};

export type OrganizationStudentStatus = "pending" | "active" | "suspended";

export type OrganizationStudent = {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_Id?: string;
    url?: string;
  };
  status: OrganizationStudentStatus;
  purchasedCount: number;
};

export type GetOrganizationStudentsResponse = {
  success: boolean;
  organization: MyOrganization;
  result: number;
  summary: {
    totalStudents: number;
  };
  students: OrganizationStudent[];
  pagination: OrganizationPagination;
};

export type OrganizationStudentsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export type StudentCourseProgress = {
  course: {
    _id: string;
    name: string;
    status?: CourseStatusType;
    thumbnail?: {
      url?: string;
    } | null;
    category: {
      _id: string;
      title: string;
    } | null;
  };
  totalLectures: number;
  completedCount: number;
  progressPercentage: number;
  currentLecture: string | null;
  lastAccessedAt: string | null;
};

export type GetStudentProgressResponse = {  success: boolean;
  organization: MyOrganization;
  student: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    status: OrganizationStudentStatus;
    avatar?: {
      public_Id?: string;
      url?: string;
    };
    createdAt: string;
  };
  summary: {
    totalCourses: number;
    completedCourses: number;
    startedCourses: number;
    notStartedCourses: number;
    totalLectures: number;
    completedLectures: number;
    overallPercentage: number;
  };
  courses: StudentCourseProgress[];
};

export type OrganizationCoursePerson = {
  _id: string;
  name: string;
  avatar?: {
    url?: string;
  } | null;
};

export type OrganizationCourseQuestion = {
  _id: string;
  question: string;
  lecture: {
    _id: string;
    title: string;
  };
  askedBy: OrganizationCoursePerson | null;
  replies: {
    _id: string;
    answer: string;
    repliedBy: OrganizationCoursePerson | null;
  }[];
  createdAt: string;
};

export type OrganizationCourseReview = {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  user: OrganizationCoursePerson | null;
  replies: {
    _id: string;
    comment: string;
    repliedBy: OrganizationCoursePerson | null;
  }[];
};

export type GetOrganizationCourseDetailResponse = {
  success: boolean;
  organization: {
    _id: string;
    name: string;
    status: string;
  };
  course: {
    _id: string;
    name: string;
    description?: string;
    status?: CourseStatusType;
    price?: number;
    level?: string;
    ratings: number;
    purchased: number;
    tags?: string;
    thumbnail?: string | null;
    category: {
      _id: string;
      title: string;
      slug?: string;
    } | null;
    createdAt: string | null;
    updatedAt: string | null;
    totalLectures: number;
    lectures: {
      _id: string;
      title: string;
      questionCount: number;
    }[];
  };
  summary: {
    totalQuestions: number;
    answeredQuestions: number;
    totalReviews: number;
    averageRating: number;
  };
  questions: OrganizationCourseQuestion[];
  reviews: OrganizationCourseReview[];
};
