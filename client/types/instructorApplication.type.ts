export type InstructorApplicationStatus = "pending" | "approved" | "rejected";

export type UserRole = "user" | "instructor" | "admin";

export type UserStatus = "pending" | "active" | "blocked";

export interface CreateInstructorApplicationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  organizationDescription?: string;
}

export interface InstructorApplicationUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface InstructorApplicationReviewer {
  _id: string;
  name: string;
  email?: string;
}

export interface InstructorApplication {
  _id: string;

  user: string | InstructorApplicationUser;

  organizationName: string;

  organizationDescription?: string;

  status: InstructorApplicationStatus;

  reviewedAt?: string | null;

  rejectionReason?: string | null;

  reviewedBy?: InstructorApplicationReviewer | null;

  createdAt: string;

  updatedAt: string;
}

export interface CreateInstructorApplicationResponse {
  success: boolean;
  message: string;
  application: InstructorApplication;
}

export interface GetInstructorApplicationResponse {
  success: boolean;
  application: InstructorApplication | null;
}

export interface GetInstructorApplicationsResponse {
  success: boolean;
  applications: InstructorApplication[];
  pagination: InstructorApplicationsPagination;
}

export interface InstructorApplicationsPagination {
  totalApplications: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApproveInstructorApplicationResponse {
  success: boolean;
  message: string;
  application: InstructorApplication;
}

export interface RejectInstructorApplicationResponse {
  success: boolean;
  message: string;
  application: InstructorApplication;
}

export interface RejectInstructorApplicationData {
  rejectionReason: string;
}
