"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { IReviewCourse } from "@/types/course.type";
import { addNewReviewCourse } from "@/lib/api/AddNewReviewCourse";
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
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const queryClient = useQueryClient();

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

      // the stored review count feeds the course details page and every card
      queryClient.invalidateQueries({ queryKey: ["course-details", courseId] });
      queryClient.invalidateQueries({ queryKey: ["public-courses-user"] });
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

  const handleShowReplies = (reviewId: string) => {
    if (expandedReviewId === reviewId) {
      setExpandedReviewId(null);
    } else {
      setExpandedReviewId(reviewId);
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

      <ReviewForm
        rating={rating}
        review={review}
        isPending={addReviewMutation.isPending}
        setRating={setRating}
        setReview={setReview}
        onSubmit={handleSubmit}
      />

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
                isRepliesExpanded={expandedReviewId === item._id}
                onShowReplies={handleShowReplies}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}