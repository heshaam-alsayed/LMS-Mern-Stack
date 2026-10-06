import { createHash } from "crypto";
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
  /** purchased content (lectures + links + video ids), identical for every
   * buyer so one key per course (the access check still runs per request) */
  content: (courseId: string) => `course:content:${courseId}`,
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
    courseCacheKeys.content(courseId),
  ];

  if (organizationId) {
    keys.push(courseCacheKeys.organization(String(organizationId), courseId));
  }

  try {
    await redis.del(...keys);

    // any course write can change list contents (ratings, published flag),
    // so orphan every cached catalog page at the same time
    await bumpCatalogGeneration();
  } catch (error) {
    // a cache that cannot be reached must never fail the write that triggered
    // the invalidation, the next read just goes back to mongo
    console.error("course cache invalidation failed:", error);
  }
};

/* ---------------------------------------------------------------------------
 * public catalog list cache.
 *
 * the same page bytes go to every anonymous visitor, so the list is cached
 * under `course:list:{generation}:{normalized query hash}`. a write bumps the
 * generation counter (O(1), no SCAN) which orphans every old list key at once.
 * ------------------------------------------------------------------------- */

/** how long a catalog page stays fresh */
export const CATALOG_CACHE_TTL = 300;

const catalogGenerationKey = "course:catalog:gen";

export const getCatalogGeneration = async (): Promise<number> => {
  try {
    const raw = await redis.get(catalogGenerationKey);
    const gen = Number(raw);
    return Number.isFinite(gen) && gen > 0 ? gen : 0;
  } catch {
    return 0;
  }
};

/** bump the generation so every cached list page is orphaned */
export const bumpCatalogGeneration = async () => {
  try {
    const gen = await redis.incr(catalogGenerationKey);
    // keep the counter from growing forever; the increment itself re-arms the
    // expiry so the counter can not vanish while the app is actively writing
    await redis.expire(catalogGenerationKey, 60 * 60 * 24 * 7);
    return gen;
  } catch {
    return 0;
  }
};

/** the params the public list query actually consumes (apiFeatures) */
const CATALOG_PARAMS = [
  "page",
  "limit",
  "search",
  "sort",
  "price",
  "estimatePrice",
  "level",
  "ratings",
  "reviewsCount",
  "totalLectures",
  "category",
];

/**
 * fold the query string into one stable string so `?page=1&limit=10` and
 * `?limit=10&page=1` (and every default) share the same cache key
 */
export const normalizeListQuery = (queryString: any): string => {
  const parts: string[] = [];

  if (!queryString || typeof queryString !== "object") {
    return "";
  }

  for (const key of CATALOG_PARAMS) {
    const raw = queryString[key];

    if (
      raw === undefined ||
      raw === null ||
      raw === "" ||
      raw === "undefined"
    ) {
      continue;
    }

    let rendered: string;

    if (raw && typeof raw === "object") {
      const values = Object.keys(raw)
        .sort()
        .map((op) => `${op}:${raw[op]}`);
      if (values.length === 0) continue;
      rendered = values.join(",");
    } else {
      rendered = String(raw).trim();
      if (rendered === "") continue;
    }

    parts.push(`${key}=${rendered}`);
  }

  return parts.sort().join("&");
};

/** build a single catalog page key for the current generation */
export const courseListKey = async (normalizedQuery: string): Promise<string> => {
  const generation = await getCatalogGeneration();
  const hash = createHash("sha1").update(normalizedQuery).digest("hex").slice(0, 12);
  return `course:list:${generation}:${hash}`;
};