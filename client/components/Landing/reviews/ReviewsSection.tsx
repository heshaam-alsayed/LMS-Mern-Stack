"use client";

import { FakeReviews } from "@/lib/fakeData/FakeReview";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      {/* Section Intro */}
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

      {/* Reviews Cards */}
      <div className="mt-16 columns-1 md:columns-2">
        {FakeReviews.map((review) => (
          <div key={review.id} className="mb-5 break-inside-avoid">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </section>
  );
}
