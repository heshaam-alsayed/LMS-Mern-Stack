"use client";

import { Star } from "lucide-react";

import { timeAgo } from "@/lib/utils";

import { RecentReview } from "@/types/organization.type";

import RecentActivityUserAvatar from "./RecentActivityUserAvatar";

type Props = {
  review: RecentReview;
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

export default function RecentReviewRow({ review }: Props) {
  return (
    <div className="px-6 py-4 transition-colors hover:bg-muted/40">
      <div className="flex items-start gap-3">
        <RecentActivityUserAvatar user={review.user} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-sm font-medium text-foreground">
              {review.user.name}
            </p>

            <RatingStars rating={review.rating} />
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {review.comment}
          </p>

          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground/80">
            <span className="truncate">{review.course.name}</span>

            <span aria-hidden="true">&middot;</span>

            <span className="shrink-0">{timeAgo(review.createdAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
