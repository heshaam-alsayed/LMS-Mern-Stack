"use client";

import { useQuery } from "@tanstack/react-query";

import { getLayout } from "@/lib/api/getLayout";
import HeroBadge from "./HeroBadge";
import HeroSearch from "./HeroSearch";
import HeroImage from "./HeroImage";
import HeroActions from "./HeroActions";
import HeroStats from "./HeroStats";
import HeroSkeleton from "@/components/skeleton/HeroSkeleton";

export default function Hero() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["banner-layout"],
    queryFn: () => getLayout("banner"),
    staleTime: 15 * 24 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (isError || !data?.layout?.banner) {
    return null;
  }

  const banner = data.layout.banner;

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* LEFT */}
          <div className="text-center lg:pt-8 lg:text-left">
            <HeroBadge />

            <h1
              className="
                text-4xl
                font-extrabold
                tracking-tight
                text-foreground
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
                xl:text-5xl
              ">
              {banner.title}
            </h1>

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-sm
                leading-relaxed
                text-muted-foreground
                sm:text-base
                md:text-lg
                lg:mx-0
              ">
              {banner.subtitle}
            </p>

            <HeroSearch />
          </div>

          {/* RIGHT */}
          <HeroImage
            lightBanner={banner.lightBanner?.url}
            darkBanner={banner.darkBanner?.url}
          />
        </div>

        <HeroActions />

        <HeroStats />
      </div>
    </section>
  );
}
