"use client";

import { Award, ShieldCheck } from "lucide-react";
import Image from "next/image";

type CertificatePaperProps = {
  recipientName: string;
  courseName: string;
  issuedDate: string;
  credentialId: string;
  learningHours: number;
  issuerName: string;
  signatureSrc: string;
};

export function CertificatePaper({
  recipientName,
  courseName,
  issuedDate,
  credentialId,
  learningHours,
  issuerName,
  signatureSrc,
}: CertificatePaperProps) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-[3px] bg-[#f7f4ed] p-3 shadow-[0_24px_70px_rgba(33,38,38,0.16)] sm:p-5">
      <div className="relative flex min-h-[610px] flex-col justify-between overflow-hidden border-[10px] border-[#d2ad63] bg-[#f8f7f1] px-4 py-9 sm:min-h-[660px] sm:px-16 sm:py-12">
        <div className="pointer-events-none absolute inset-2 border border-[#d2ad63]/55" />

        <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full border border-[#d2ad63]/30" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full border border-[#d2ad63]/30" />

        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d2ad63]/15 to-transparent" />

        {/* Certificate Header */}
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-16 place-items-center rounded-full bg-[#18252b] text-[#d9b46b] shadow-[0_10px_24px_rgba(24,37,43,0.2)]">
              <Award className="size-8" />
            </div>

            <div>
              <p className="font-serif text-lg">{issuerName}</p>

              <p className="text-[9px] uppercase tracking-[0.24em] text-[#8b6b3f]">
                Learning institute
              </p>
            </div>
          </div>

          <p className="ml-auto min-w-0 max-w-[60%] text-right text-[10px] uppercase tracking-[0.24em] text-[#8b6b3f]">
            Credential
            <br />
            No. {credentialId}
          </p>
        </div>

        {/* Certificate Main Content */}
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4 text-[#d2ad63]">
            <span className="h-px w-16 bg-[#d2ad63]" />
            <span className="text-xl">✦</span>
            <span className="h-px w-16 bg-[#d2ad63]" />
          </div>

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.42em] text-[#8b6b3f]">
            Certificate of achievement
          </p>

          <h2 className="font-serif text-3xl leading-[1.05] tracking-[-0.045em] text-[#18252b] sm:text-7xl">
            {recipientName}
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-6 text-[#596268]">
            has successfully completed the advanced learning program and
            demonstrated exceptional command of the subject.
          </p>

          <div className="my-8 h-px bg-[#d2ad63]/70" />

          <p className="font-serif text-2xl italic text-[#263b42] sm:text-3xl">
            {courseName}
          </p>

          <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-[#8b6b3f]">
            Professional certificate · {learningHours} learning{" "}
            {learningHours === 1 ? "hour" : "hours"}
          </p>
        </div>

        {/* Certificate Footer */}
        <div className="relative grid grid-cols-3 items-end gap-3 text-center text-[10px] text-[#596268] sm:gap-5">
          <div>
            <div className="mx-auto h-16 w-28 overflow-hidden sm:h-24 sm:w-64">
              <Image
                src={signatureSrc}
                alt="Authorized signature"
                sizes="256px"
                className="object-contain mix-blend-multiply"
                width={600}
                height={550}
              />
            </div>

            <div className="mx-auto mt-2 h-px w-24 bg-[#667176] sm:w-36" />

            <p className="mt-2 uppercase tracking-[0.16em] text-[#8b6b3f]">
              Authorized signature
            </p>
          </div>

          <div className="mx-auto grid size-14 place-items-center rounded-full border-2 border-[#d2ad63] bg-[#f8f1df] text-[#8b6b3f] shadow-[0_8px_18px_rgba(139,107,63,0.12)] sm:size-24">
            <ShieldCheck className="size-8 sm:size-10" />
            <span className="sr-only">Verified certificate</span>
          </div>

          <div>
            <div className="mx-auto mb-2 h-px w-20 bg-[#667176] sm:w-28" />

            <p>{issuedDate}</p>

            <p className="mt-1 uppercase tracking-[0.16em] text-[#8b6b3f]">
              Date issued
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
