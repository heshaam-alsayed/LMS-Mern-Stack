import redis from "./redis";

/**
 * edit screens read a course, mutate it and come straight back, so a short
 * ttl keeps redis useful without serving a stale form
 */
export const COURSE_CACHE_TTL = 300;

/**
 * every course read is cached under its own namespace. the bare courseId is
 * already used by getPublicCourse for a redacted copy (no questions, no
 * links, free videos only), so sharing that key would either leak the full
 * course to the public route or hand the editor a stripped copy
 */
export const courseCacheKeys = {
  /** getPublicCourse, the redacted public copy. predates the namespacing */
  public: (courseId: string) => courseId,
  /** admin edit screen, full document */
  admin: (courseId: string) => `course:admin:${courseId}`,
  /** instructor edit screen, scoped to the owning organization */
  organization: (organizationId: string, courseId: string) =>
    `course:org:${organizationId}:${courseId}`,
};

/**
 * drop every cached copy of a course after a write. organizationId is passed
 * by callers that already know it, otherwise only the keys that can be
 * derived from the course id are cleared
 */
export const invalidateCourseCaches = async (
  courseId: string,
  organizationId?: string,
) => {
  const keys: string[] = [
    courseCacheKeys.public(courseId),
    courseCacheKeys.admin(courseId),
  ];

  if (organizationId) {
    keys.push(courseCacheKeys.organization(String(organizationId), courseId));
  }

  try {
    await redis.del(...keys);
  } catch (error) {
    // a cache that cannot be reached must never fail the write that triggered
    // the invalidation, the next read just goes back to mongo
    console.error("course cache invalidation failed:", error);
  }
};
