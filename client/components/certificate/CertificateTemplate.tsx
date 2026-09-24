"use client";

import { useRef, useState } from "react";
import { Award, Download, Loader2, Share2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CertificatePaper } from "./CertificatePaper";
import { CredentialDetails } from "./CredentialDetails";

export type CertificateTemplateProps = {
  recipientName: string;
  courseName: string;
  issuedDate: string;
  credentialId: string;
  learningHours: number;

  issuerName?: string;
  signatureSrc?: string;
};

export function CertificateTemplate({
  recipientName,
  courseName,
  issuedDate,
  credentialId,
  learningHours,
  issuerName = "Northstar",
  signatureSrc = "/hisham-signature.png",
}: CertificateTemplateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImage , setIsDownloadingImage] = useState(false)
  const handleDownload = async () => {
    if (!certificateRef.current || isDownloading) return;

    setIsDownloading(true);

    try {
      // Convert HTML to Canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#f7f4ed",
        logging: false,
      });

      // Convert Canvas to PNG
      const imageData = canvas.toDataURL("image/png", 1.0);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true,
      });

      // Add certificate image to PDF
      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height,
        undefined,
        "FAST",
      );

      // Download PDF
      pdf.save(`${recipientName}-certificate.pdf`);

      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Failed to generate certificate PDF:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate certificate PDF",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!certificateRef.current || isDownloading) return;

    setIsDownloadingImage(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#f7f4ed",
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");

      const link = document.createElement("a");

      link.download = `${recipientName}-certificate.png`;
      link.href = imageData;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Certificate image downloaded successfully");
    } catch (error) {
      console.error("Failed to generate certificate image:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate certificate image",
      );
    } finally {
      setIsDownloadingImage(false);
    }
  };
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-7">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-5 sm:p-6 lg:p-7">
            {/* Top Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Certificate Info */}
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm sm:size-14">
                  <Award className="size-6 sm:size-7" />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Learning Achievement
                    </span>

                    <span className="size-1 rounded-full bg-muted-foreground/40" />

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Certificate Issued
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Congratulations on Your Achievement
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Your certificate has been successfully issued and is ready
                    to download, share, and add to your professional profile.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="h-11 w-full gap-2 sm:w-auto">
                    {isDownloading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="size-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadImage}
                    disabled={isDownloadingImage}
                    className="h-11 w-full gap-2 sm:w-auto">
                    {isDownloadingImage ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Download className="size-4" />
                        Download PNG
                      </>
                    )}
                  </Button>
                </div>

                <Button className="h-11 w-full gap-2 shadow-sm sm:w-auto">
                  <Share2 className="size-4" />
                  Share Achievement
                </Button>
              </div>
            </div>

            {/* Credential Details */}
            <CredentialDetails
              recipientName={recipientName}
              issuedDate={issuedDate}
              credentialId={credentialId}
              learningHours={learningHours}
            />
          </div>
        </header>

        {/* Full Width Certificate */}
        <section className="min-w-0">
          <div ref={certificateRef}>
            <CertificatePaper
              recipientName={recipientName}
              courseName={courseName}
              issuedDate={issuedDate}
              credentialId={credentialId}
              learningHours={learningHours}
              issuerName={issuerName}
              signatureSrc={signatureSrc}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
