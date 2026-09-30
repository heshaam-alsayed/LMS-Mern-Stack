"use client";

import Image from "next/image";
import { Star, Send } from "lucide-react";
import Loader from "@/components/shared/Loader";


type Props = {
  rating: number;
  review: string;
  isPending: boolean;
  setRating: (rating: number) => void;
  setReview: (review: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ReviewForm({
  rating,
  review,
  isPending,
  setRating,
  setReview,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Image
          src="/user-profile-icon-flat-style-600nw-2748799073.webp"
          alt="Your avatar"
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />

        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Give your rating
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            How would you rate this lesson?
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isPending}
              onClick={() => setRating(star)}
              className="rounded-sm p-0.5 transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-50 sm:p-1"
            >
              <Star
                className={`size-5 sm:size-6 ${
                  star <= rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-transparent text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="review"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Write your review
        </label>

        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={isPending}
          placeholder="Share your thoughts about this course..."
          className="h-32 w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={rating === 0 || !review.trim() || isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-1">
              <span>Submitting...</span>
              <Loader />
            </span>
          ) : (
            <>
              <Send className="size-4" />
              Submit Review
            </>
          )}
        </button>
      </div>
    </form>
  );
}