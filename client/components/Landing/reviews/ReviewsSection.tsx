"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { LandingReview } from "@/lib/api/getLatestReviews";
import { getLatestReviews } from "@/lib/api/getLatestReviews";
import { useSectionInView } from "@/hooks/useSectionInView";
import Ratings from "../../shared/Ratings";

const FALLBACK_AVATAR = "/user-profile-icon-flat-style-600nw-2748799073.webp";

function ReviewsSkeleton() {
  return (
    <div className="mt-16 columns-1 md:columns-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="mb-5 break-inside-avoid rounded-2xl border border-primary/10 bg-primary/5 p-3">
          <div className="flex items-center gap-3">
            <div className="size-12 shrink-0 animate-pulse rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>

          <div className="my-5 h-px bg-primary/10" />

          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewItem({ review }: { review: LandingReview }) {
  const name = review.user?.name || "Student";
  const avatar = review.user?.avatar?.url || FALLBACK_AVATAR;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-primary/[0.05] hover:shadow-lg dark:bg-primary/[0.06] dark:hover:bg-primary/[0.09]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
            <Image
              src={avatar}
              alt={`${name} avatar`}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="48px"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {name}
            </h3>

            <p className="mt-1 truncate text-xs text-muted-foreground">
              {review.course?.name || "Course review"}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Ratings rating={review.rating} />
        </div>
      </div>

      <div className="my-5 h-px bg-primary/10" />

      <p className="pl-4 text-sm leading-7 text-primary">{review.comment}</p>
    </article>
  );
}

export default function ReviewsSection() {
  const { ref, hasEnteredView } = useSectionInView<HTMLDivElement>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["landing-latest-reviews"],
    queryFn: () => getLatestReviews(6),
    enabled: hasEnteredView,
    staleTime: 5 * 60 * 1000,
  });

  const reviews = data?.data?.reviews ?? [];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
          Student Reviews
        </span>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          What Our Students <span className="text-primary">Say About Us</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Discover what our students think about their learning experience. Real
          feedback from learners who have improved their skills and achieved
          their goals through our courses.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Join thousands of learners and start your journey with practical,
          high-quality courses designed to help you grow.
        </p>
      </div>

      <div ref={ref}>
        {!hasEnteredView || isLoading ? (
          <ReviewsSkeleton />
        ) : isError ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            Reviews are unavailable right now.
          </p>
        ) : reviews.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <div className="mt-16 columns-1 md:columns-2">
            {reviews.map((review) => (
              <div key={review._id} className="mb-5 break-inside-avoid">
                <ReviewItem review={review} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
