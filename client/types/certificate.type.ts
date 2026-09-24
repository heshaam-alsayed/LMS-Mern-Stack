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
