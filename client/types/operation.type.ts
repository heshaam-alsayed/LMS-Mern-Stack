export interface IAdminUserResponse {
  success: boolean;
  message: string;
  data: {
    user: IAdminUser;
    statistics: IAdminUserStatistics;
    courses: IAdminUserCourse[];
    orders: IAdminUserOrder[];
  };
}

export interface IAdminUser {
  _id: string;
  name: string;
  email: string;

  avatar?: {
    public_Id?: string;
    url?: string;
  };

  role: "user" | "instructor" | "admin";

  isDeleted: boolean;
  isVerified: boolean;

  courses: string[];

  createdAt: string;
  updatedAt: string;

  __v?: number;
}

export interface IAdminUserStatistics {
  totalCourses: number;
  completedCourses: number;
  notStartedCourses: number;
  totalSpent: number;
}

export interface IAdminCourse {
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
}

export interface IAdminUserCourse {
  course: IAdminCourse;

  purchase: {
    _id: string;
    price: number;
    createdAt: string;
    paymentInfo?: IAdminPaymentInfo;
  };

  progress?: IAdminUserCourseProgress;
}

export interface IAdminUserCourseProgress {
  _id: string;

  user: string;

  course: {
    _id: string;
    name: string;

    thumbnail?: {
      public_Id?: string;
      url?: string;
    };

    level: "beginner" | "intermediate" | "advanced";

    ratings: number;
  };

  currentLecture?: {
    _id: string;
    title: string;
    videoUrl?: string;
  } | null;

  completedLectures: string[];

  completedCount: number;

  totalLectures: number;

  progressPercentage: number;

  lastAccessedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
}

export interface IAdminUserOrder {
  _id: string;

  user: string;

  course: IAdminCourse;

  price: number;

  paymentInfo?: IAdminPaymentInfo;

  createdAt: string;

  updatedAt: string;

  __v?: number;
}

export interface IAdminPaymentInfo {
  id: string;

  amount: number;

  currency: string;

  status: string;

  payment_method: string;

  created: number;

  metadata: {
    userId: string;
    courseId: string;
  };
}

export interface ICourseDetailsResponse {
  success: boolean;
  data: {
    course: ICourseDetails;
    statistics: ICourseStatistics;
    orders: ICourseOrder[];
  };
}

export interface ICourseDetails {
  thumbnail: ICloudinaryImage;
  _id: string;
  name: string;
  description: string;
  category: {
    slug:string;
    title:string;
    _id:string;
  };
  price: number;
  estimatePrice: number;
  level: string;
  ratings: number;
  purchased: number;
  reviews: ICourseReview[];
}

export interface ICloudinaryImage {
  public_Id: string;
  url: string;
}

export interface ICourseStatistics {
  totalStudents: number;
  totalRevenue: number;
}

export interface ICourseReview {
  user: IReviewUser;
  rating: number;
  comment: string;
  _id: string;
  commentReplies: ICommentReply[];
  createdAt: string;
  updatedAt: string;
}

export interface ICommentReply {
  user: IReplyUser;
  comment: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean;
  isVerified: boolean;
  courses: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar?: ICloudinaryImage;
}

export interface IReplyUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  courses?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  avatar?: ICloudinaryImage;
}

export interface ICourseOrder {
  _id: string;
  user: IOrderUser;
  course: string;
  price: number;
  paymentInfo: IPaymentInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOrderUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean;
  isVerified: boolean;
  courses: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar?: ICloudinaryImage;
}

export interface IPaymentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created: number;
  metadata: IPaymentMetadata;
}

export interface IPaymentMetadata {
  userId: string;
  courseId: string;
}
