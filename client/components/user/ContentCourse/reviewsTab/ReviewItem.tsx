"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { IReviewCourse } from "@/types/course.type";
import Ratings from "@/components/shared/Ratings";
import { LucideBadgeCheck } from "lucide-react";

type Props = {
  review: IReviewCourse;

  isRepliesExpanded: boolean;

  onShowReplies: (reviewId: string) => void;
};

export default function ReviewItem({
  review,
  isRepliesExpanded,
  onShowReplies,
}: Props) {
  const hasReplies = review.commentReplies?.length > 0;

  return (
    <article className="flex gap-3">
      {/* Review Avatar */}
      <div className="size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
        <Image
          src={
            review.user?.avatar?.url ||
            "/user-profile-icon-flat-style-600nw-2748799073.webp"
          }
          alt={review.user?.name || "User avatar"}
          width={40}
          height={40}
          className="size-full object-cover"
        />
      </div>

      {/* Review Content */}
      <div className="min-w-0 flex-1">
        {/* Name + Date */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold capitalize text-foreground">
            {review.user?.name}
          </h4>

          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-1">
          <Ratings rating={review.rating} />
        </div>

        {/* Comment */}
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {review.comment}
        </p>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4">
          {/* Show Replies - All Users */}
          {hasReplies && (
            <button
              type="button"
              onClick={() => onShowReplies(review._id)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground">
              {isRepliesExpanded
                ? "Hide Replies"
                : `Show Replies (${review.commentReplies.length})`}
            </button>
          )}
        </div>

        {/* Replies */}
        {hasReplies && isRepliesExpanded && (
          <div className="mt-5 space-y-4 border-l border-border pl-4">
            {[...review.commentReplies].reverse().map((reply) => (
              <div key={reply._id} className="flex gap-3">
                {/* Reply Avatar */}
                <div className="size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                  <Image
                    src={
                      reply.user?.avatar?.url ||
                      "/user-profile-icon-flat-style-600nw-2748799073.webp"
                    }
                    alt={reply.user?.name || "User avatar"}
                    width={32}
                    height={32}
                    className="size-full object-cover"
                  />
                </div>

                {/* Reply Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <h5 className="text-sm font-semibold capitalize text-foreground">
                        {reply.user?.name}
                      </h5>
                      {reply.user?.role === "admin" && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-blue-700">
                          <LucideBadgeCheck className="size-4 text-white" />
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-foreground/80">
                    {reply.comment}
                  </p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}