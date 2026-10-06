"use client";

import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useParams } from "next/navigation";

import { CertificateErrorState } from "@/components/user/certificate/CertificateErrorState";
import { CertificateTemplate } from "@/components/user/certificate/CertificateTemplate";
import { CertificatePageSkeleton } from "@/components/user/certificate/CertificatePageSkeleton";
import { verifyCertificate } from "@/lib/api/verifiyCertificate";
import { GetCertificateResponse } from "@/types/certificate.type";

const formatIssuedDate = (issuedAt?: string) => {
  if (!issuedAt) return "";

  const parsed = parseISO(issuedAt);

  return Number.isNaN(parsed.getTime()) ? "" : format(parsed, "MMMM d, yyyy");
};

export default function CertificatePage() {
  const params = useParams();

  const courseId = params.courseId as string;

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["get-verify-certificate", courseId],
    queryFn: () => verifyCertificate(courseId),
    enabled: Boolean(courseId),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <CertificatePageSkeleton />;

  const certificate = (data as GetCertificateResponse | undefined)
    ?.certificate;

  if (isError || !certificate) {
    return (
      <CertificateErrorState
        message={
          (error as Error | undefined)?.message ||
          "This certificate could not be verified. It may have been revoked, or the link may be incomplete."
        }
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  return (
    <div className={isFetching ? "opacity-60 transition-opacity" : undefined}>
      <CertificateTemplate
        recipientName={certificate.studentName ?? ""}
        courseName={certificate.courseTitle ?? ""}
        issuedDate={formatIssuedDate(certificate.issuedAt)}
        credentialId={certificate.certificateId ?? ""}
        learningHours={certificate.learningHours ?? 0}
      />
    </div>
  );
}