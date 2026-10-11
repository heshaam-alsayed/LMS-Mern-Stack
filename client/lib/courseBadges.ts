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
  bestseller: { label: "Bestseller", bg: "#8FAEAC", color: "#172D30" },
  highestRated: { label: "Highest Rated", bg: "#D6BD95", color: "#563622" },
  new: { label: "New", bg: "#C7DDAF", color: "#263D20" },
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