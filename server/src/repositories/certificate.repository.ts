import { ICertificate } from "../interfaces/certificate";
import CertificateModel from "../models/certificate.model";

export const findCertificateByUserAndCourse = async (
  userId: string,
  courseId: string,
) => {
  return CertificateModel.findOne({
    user: userId,
    course: courseId,
  });
};

export const createCertificate = async (
  data: ICertificate,
) => {
  return CertificateModel.create(data);
};

export const findCertificatesByUser = async (
  userId: string,
) => {
  return CertificateModel.find({
    user: userId,
  })
    .populate("course", "title thumbnail")
    .sort({
      issuedAt: -1,
    });
};