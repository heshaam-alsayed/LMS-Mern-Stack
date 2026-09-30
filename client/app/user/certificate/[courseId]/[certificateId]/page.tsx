"use client";

import { CertificateTemplate } from "@/components/certificate/CertificateTemplate";
import { verifyCertificate } from "@/lib/api/verifiyCertificate";
import { GetCertificateResponse } from "@/types/certificate.type";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useParams } from "next/navigation";

export default function CertificatePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-verify-certificate"],
    queryFn: () => {
      if (!courseId) return;
      return verifyCertificate(courseId);
    },
  });
  if (!data) return;
  const { certificate } = data as GetCertificateResponse;  
  return (
    <div>
      <CertificateTemplate
        recipientName={certificate?.studentName ?? ""}
        courseName={certificate?.courseTitle??""}
        issuedDate={formatDate(certificate?.issuedAt ?? "", "MMMM d, yyyy")}
        credentialId={certificate?.certificateId ?? ""}
        learningHours={certificate?.learningHours ?? 0}
      />
    </div>
  );
}
