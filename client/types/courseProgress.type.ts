export interface ICourseThumbnail {
  public_Id?: string;
  url?: string;
}

export interface IEnrolledCourse {
  _id: string;
  name: string;
  thumbnail?: ICourseThumbnail;
  level: "beginner" | "intermediate" | "advanced";
  ratings: number;
}

export interface ICurrentLecture {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength?: number;
  videoPlayer?: string;
  links?: {
    _id: string;
    title: string;
    url: string;
  }[];
  suggestion?: string;
  isFree: boolean;
  questions?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseProgress {
  _id: string;
  user: string;

  course: IEnrolledCourse;

  currentLecture?: ICurrentLecture | null;

  completedLectures: string[];

  completedCount: number;

  totalLectures: number;

  progressPercentage: number;

  lastAccessedAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface IEnrolledCoursesResponse {
  success: boolean;
  progress: ICourseProgress[];
}