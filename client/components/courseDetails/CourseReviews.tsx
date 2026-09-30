"use client";

import Image from "next/image";
import { Star, ChevronDown, ChevronUp, LucideBadgeCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

import { IReviewCourse } from "@/types/course.type";
import Ratings from "../shared/Ratings";

type Props = {
  reviews: IReviewCourse[] | undefined;
};

export default function CourseReviews({ reviews }: Props) {
  const reviewList = reviews ?? [];

  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const reviewCount = reviewList.length;

  const averageRating =
    reviewCount > 0
      ? reviewList.reduce((total, review) => total + review.rating, 0) /
        reviewCount
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviewList.filter((review) => review.rating === rating).length,
  }));

  const handleToggleReplies = (reviewId: string) => {
    setExpandedReviewId((current) => (current === reviewId ? null : reviewId));
  };

  return (
    <section className="mt-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Student Reviews
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          See what students think about this course.
        </p>
      </div>

      {/* Rating Summary */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          {/* Average */}
          <div className="flex flex-col items-center justify-center border-b border-border pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              {averageRating.toFixed(1)}
            </span>

            <div className="mt-2 flex items-center gap-1">
              <Ratings rating={averageRating} />
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* progress bar */}
          <div className="flex flex-col justify-center gap-3">
            {ratingCounts.map(({ rating, count }) => {
              const percentage =
                reviewCount > 0 ? (count / reviewCount) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <div className="flex w-14 shrink-0 items-center gap-1">
                    <span className="font-medium text-foreground">
                      {rating}
                    </span>

                    <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                  </div>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-yellow-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        {reviewCount === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No reviews yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Be the first student to review this course.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {[...reviewList].reverse().map((review) => {
              const isExpanded = expandedReviewId === review._id;

              return (
                <article key={review._id} className="py-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                      <Image
                        src={
                          review.user?.avatar?.url ||
                          "/user-profile-icon-flat-style-600nw-2748799073.webp"
                        }
                        alt={review.user?.name || "User avatar"}
                        width={44}
                        height={44}
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* User Info */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold capitalize text-foreground">
                            {review.user?.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-2">
                            <Ratings rating={review.rating} />
                          </div>
                        </div>

                        <span className="mr-10 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                          {review.rating}.0
                        </span>
                      </div>

                      {/* Review */}
                      <p className=" text-sm  text-foreground/80">
                        {review.comment}
                      </p>
                      <p>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </p>

                      {/* Date */}

                      {/* Show / Hide Replies */}
                      {review.commentReplies?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleToggleReplies(review._id)}
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-sm
                            font-medium
                            text-primary
                            transition-colors
                            hover:text-primary/80
                          ">
                          {isExpanded ? (
                            <>
                              Hide Replies
                              <ChevronUp className="size-4" />
                            </>
                          ) : (
                            <>
                              Show Replies ({review.commentReplies.length})
                              <ChevronDown className="size-4" />
                            </>
                          )}
                        </button>
                      )}

                      {/* Replies */}
                      {isExpanded && review.commentReplies?.length > 0 && (
                        <div className="mt-5 space-y-4 border-l-2 border-border pl-4">
                          {[...review.commentReplies].reverse().map((reply) => (
                            <div key={reply._id} className="flex gap-3">
                              {/* Reply Avatar */}
                              <div className="size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                                <Image
                                  src={
                                    reply.user?.avatar?.url ||
                                    "/user-profile-icon-flat-style-600nw-2748799073.webp"
                                  }
                                  alt={reply.user?.name || "User avatar"}
                                  width={36}
                                  height={36}
                                  className="size-full object-cover"
                                />
                              </div>

                              {/* Reply Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-semibold capitalize text-foreground">
                                    {reply.user?.name}
                                  </h4>

                                  {reply.user?.role === "admin" && (
                                    <span className="flex size-4 items-center justify-center rounded-full bg-blue-700">
                                      <LucideBadgeCheck className="size-4 text-white" />
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 text-sm leading-6 text-foreground/80">
                                  {reply.comment}
                                </p>

                                <span className="text-[11px] text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(reply.createdAt),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
