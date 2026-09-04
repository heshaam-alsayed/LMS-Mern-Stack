import Image from "next/image";
import React from "react";
import Ratings from "../../shared/Ratings";
import { Review } from "@/lib/fakeData/FakeReview";

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-primary/[0.05] hover:shadow-lg dark:bg-primary/[0.06] dark:hover:bg-primary/[0.09]">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        {/* User */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
            <Image
              src={review.avatar}
              alt={`${review.name} avatar`}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="48px"
            />
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {review.name}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {review.profession}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div>
          <Ratings rating={review.rating} />
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-primary/10" />

      {/* Comment */}
      <p className="pl-4 text-sm leading-7 text-primary">{review.comment}</p>
    </article>
  );
}
