"use client";

import { getLayout } from "@/lib/api/getLayout";
import { useQuery } from "@tanstack/react-query";
import FaqList from "./FaqList";

export default function FaqSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["faq-layout"],
    queryFn: () => getLayout("faq"),
    staleTime: 15 * 24 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
        </div>
      </section>
    );
  }

  if (isError || !data?.layout?.faq) {
    return null;
  }

  return <FaqList faqs={data.layout.faq} />;
}
