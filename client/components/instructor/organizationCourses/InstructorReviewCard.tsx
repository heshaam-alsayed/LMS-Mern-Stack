"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock3, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { addReplyReviewCourse } from "@/lib/api/AddReplyReviewCourse";
import { OrganizationCourseReview } from "@/types/organization.type";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Ratings from "@/components/shared/Ratings";

const FALLBACK_AVATAR =
  "/user-profile-icon-flat-style-600nw-2748799073.webp";

const timeAgo = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return formatDistanceToNow(date, { addSuffix: true });
};

type Props = {
  review: OrganizationCourseReview;
  courseId: string | undefined;
  queryKey: string[];
}
export default function InstructorReviewCard({
  review,
  courseId,
  queryKey,
}: Props) {
  const queryClient = useQueryClient();

  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(review.replies.length > 0);
  const [comment, setComment] = useState("");

  const replyMutation = useMutation({
    mutationKey: ["instructor-reply-review", review._id],
    mutationFn: async () => {
      const trimmed = comment.trim();
      if(!courseId) return
      await addReplyReviewCourse({
        comment: trimmed,
        courseId,
        reviewId: review._id,
      });
    },
    onSuccess: () => {
      setComment("");
      setIsReplying(false);
      setShowReplies(true);

      queryClient.invalidateQueries({ queryKey });

      toast.success("Reply posted");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to post reply",
      );
    },
  });

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error("Write a reply first");

      return;
    }

    replyMutation.mutate();
  };

  const replyCount = review.replies.length;

  return (
    <article className="rounded-xl border border-border bg-background p-5">
      <div className="flex gap-3">
        <div className="size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
          <Image
            src={review.user?.avatar?.url || FALLBACK_AVATAR}
            alt={review.user?.name || "Student avatar"}
            width={40}
            height={40}
            className="size-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h4 className="text-sm font-semibold capitalize text-foreground">
              {review.user?.name || "Student"}
            </h4>

            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="size-3" />
              {timeAgo(review.createdAt)}
            </span>
          </div>

          <div className="mt-1">
            <Ratings rating={review.rating} />
          </div>

          <p className="mt-2 text-sm leading-6 text-foreground/85">
            {review.comment}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowReplies((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <MessageCircle className="size-3.5" />
              {replyCount > 0
                ? showReplies
                  ? "Hide replies"
                  : `All replies (${replyCount})`
                : "No replies yet"}
            </button>

            <button
              type="button"
              onClick={() => setIsReplying((prev) => !prev)}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
              {isReplying ? "Cancel" : "Reply"}
            </button>
          </div>

          {showReplies && replyCount > 0 && (
            <div className="mt-4 space-y-4 border-l border-border pl-4">
              {review.replies.map((reply) => (
                <div key={reply._id} className="flex gap-3">
                  <div className="size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                    <Image
                      src={reply.repliedBy?.avatar?.url || FALLBACK_AVATAR}
                      alt={reply.repliedBy?.name || "Instructor avatar"}
                      width={32}
                      height={32}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold capitalize text-foreground">
                      {reply.repliedBy?.name || "Instructor"}
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-foreground/80">
                      {reply.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isReplying && (
            <div className="mt-4 space-y-3">
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Write your reply to this review"
                rows={3}
                className="resize-none"
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    replyMutation.isPending || !comment.trim()
                  }>
                  {replyMutation.isPending ? (
                    <>
                      Posting
                      <Loader />
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      Post reply
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
