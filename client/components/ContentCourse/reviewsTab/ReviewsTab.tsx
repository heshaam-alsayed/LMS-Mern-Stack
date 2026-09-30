"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { IReviewCourse } from "@/types/course.type";
import { addNewReviewCourse } from "@/lib/api/AddNewReviewCourse";
import { addReplyReviewCourse } from "@/lib/api/AddReplyReviewCourse";
import { useAppSelector } from "@/redux/hooks";
import ReviewForm from "./reviewForm";
import ReviewItem from "./ReviewItem";



type Props = {
  reviews: IReviewCourse[] | undefined;
  courseId: string;
  refetchContent: () => void;
};

export default function ReviewsTab({
  reviews,
  courseId,
  refetchContent,
}: Props) {
  const user = useAppSelector((state) => state.auth.user);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewReply, setReviewReply] = useState("");

  // Review currently receiving a reply
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // Review currently showing replies
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const addReviewMutation = useMutation({
    mutationKey: ["add-review-course"],

    mutationFn: async () => {
      const body = {
        review: review.trim(),
        rating,
      };

      return addNewReviewCourse(body, courseId);
    },

    onSuccess: () => {
      toast.success("Review submitted successfully");

      setRating(0);
      setReview("");

      refetchContent();
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0 || !review.trim()) {
      toast.error("Please select a rating and write a review");
      return;
    }

    addReviewMutation.mutate();
  };

  const addReviewReplyMutation = useMutation({
    mutationKey: ["add-review-reply"],

    mutationFn: async () => {
      if (!activeReviewId) return;

      const body = {
        comment: reviewReply.trim(),
        courseId,
        reviewId: activeReviewId,
      };

      return addReplyReviewCourse(body);
    },

    onSuccess: () => {
      toast.success("Reply submitted successfully");

      setExpandedReviewId(activeReviewId);
      setActiveReviewId(null);
      setReviewReply("");

      refetchContent();
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit reply review");
    },
  });

  const handleReviewReplySubmit = () => {
    if (!reviewReply.trim()) {
      toast.error("Please write a Reply");
      return;
    }

    addReviewReplyMutation.mutate();
  };

  const handleShowReplies = (reviewId: string) => {
    if (expandedReviewId === reviewId) {
      setExpandedReviewId(null);
    } else {
      setExpandedReviewId(reviewId);
    }
  };

  const handleAddReply = (reviewId: string) => {
    if (activeReviewId === reviewId) {
      setActiveReviewId(null);
      setReviewReply("");
    } else {
      setActiveReviewId(reviewId);
      setReviewReply("");
    }
  };

  return (
    <section className="py-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Reviews
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Share your experience with this course.
        </p>
      </div>

      {/* Add Review */}
      <ReviewForm
        rating={rating}
        review={review}
        isPending={addReviewMutation.isPending}
        setRating={setRating}
        setReview={setReview}
        onSubmit={handleSubmit}
      />

      {/* Reviews */}
      <div className="mt-10 border-t border-border pt-8">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-foreground">
            {reviews?.length || 0}{" "}
            {reviews?.length === 1 ? "Review" : "Reviews"}
          </h3>
        </div>

        {reviews?.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-8 text-center">
            <p className="text-sm font-medium text-foreground">
              No reviews yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to share your experience with this course.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {[...(reviews ?? [])].reverse().map((item) => (
              <ReviewItem
                key={item._id}
                review={item}
                isAdmin={user?.role === "admin"}
                isRepliesExpanded={expandedReviewId === item._id}
                isAddingReply={activeReviewId === item._id}
                reviewReply={reviewReply}
                isReplyPending={addReviewReplyMutation.isPending}
                onShowReplies={handleShowReplies}
                onAddReply={handleAddReply}
                onReviewReplyChange={setReviewReply}
                onSubmitReply={handleReviewReplySubmit}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}