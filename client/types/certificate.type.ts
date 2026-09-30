import { MyOrganization, OrganizationPagination } from "./organization.type";

export interface Certificate {
  _id: string;
  certificateId: string;
  user: string;
  course: string;
  studentName: string;
  courseTitle: string;
  learningHours: number;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCertificateResponse {
  success: boolean;
  certificate: Certificate | null;
}

export interface GenerateCertificateResponse {
  success: boolean;
  message: string;
  certificate: Certificate;
}

export type CertificateUser = {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_Id?: string;
    url?: string;
  };
};

export type CertificateCourse = {
  _id: string;
  name: string;
  thumbnail: string;
};

export type OrganizationCertificate = {
  _id: string;
  certificateId: string;
  user: CertificateUser;
  course: CertificateCourse;
  organization: string;
  studentName: string;
  courseTitle: string;
  learningHours: number;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CertificateStats = {
  totalCertificates: number;
  totalStudents: number;
  totalCourses: number;
  totalLearningHours: number;
};

export type GetOrganizationCertificatesResponse = {
  success: boolean;
  organization: MyOrganization;
  result: number;
  stats: CertificateStats;
  certificates: OrganizationCertificate[];
  pagination: OrganizationPagination;
};
