import type { Course } from "@/types/course.type";

export type CourseBadge = {
  label: string;
  bg: string;
  color: string;
};

export const COURSE_BADGES: Record<
  "bestseller" | "highestRated" | "new",
  CourseBadge
> = {
  bestseller: { label: "Bestseller", bg: "#E5EFEE", color: "#35514F" },
  highestRated: { label: "Highest Rated", bg: "#F7EBDD", color: "#6A5039" },
  new: { label: "New", bg: "#EDF3E5", color: "#405638" },
};

export const getCourseBadges = (
  course: Pick<Course, "isBestseller" | "isHighestRated" | "isNew">,
): CourseBadge[] => {
  const order = [
    ["bestseller", course.isBestseller],
    ["highestRated", course.isHighestRated],
    ["new", course.isNew],
  ] as const;

  return order
    .filter(([, on]) => on)
    .map(([key]) => COURSE_BADGES[key]);
};