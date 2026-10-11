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
  bestseller: { label: "Bestseller", bg: "#eceb98", color: "#3d3c0a" },
  highestRated: { label: "Highest Rated", bg: "#f3eaff", color: "#5624d0" },
  new: { label: "New", bg: "#f3ca8c", color: "#3d2305" },
};

export const getCourseBadges = (
  course: Pick<Course, "isBestseller" | "isHighestRated" | "isNew">,
): CourseBadge[] => {
  const badges: CourseBadge[] = [];

  if (course.isBestseller) badges.push(COURSE_BADGES.bestseller);
  if (course.isHighestRated) badges.push(COURSE_BADGES.highestRated);
  if (course.isNew) badges.push(COURSE_BADGES.new);

  return badges;
};