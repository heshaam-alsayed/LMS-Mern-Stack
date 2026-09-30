"use client";

import { useState } from "react";
import { MessageSquareQuote } from "lucide-react";

import useMyOrganizationRecentReviews from "@/customHooks/useMyOrganizationRecentReviews";

import RecentActivityPanel from "./RecentActivityPanel";
import RecentReviewRow from "./RecentReviewRow";

const DEFAULT_TOP = "5";

export default function RecentReviewsPanel() {
  const [top, setTop] = useState(DEFAULT_TOP);

  const { reviews, isLoading, isError, error, refetch } =
    useMyOrganizationRecentReviews(Number(top));

  return (
    <RecentActivityPanel
      icon={MessageSquareQuote}
      title="Recent reviews"
      description="Latest feedback from your students"
      count={reviews.length}
      isEmpty={reviews.length === 0}
      emptyMessage="Once students review your courses, their feedback shows up here."
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      top={top}
      onTopChange={setTop}>
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <RecentReviewRow key={review._id} review={review} />
        ))}
      </div>
    </RecentActivityPanel>
  );
}
