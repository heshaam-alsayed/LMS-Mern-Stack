// Makes the database consistent with the certificate rule in the backend:
// generateCertificateService only issues a certificate when the course progress
// is 100%. Rows created by seed scripts may have drifted, so this repair walks
// every certificate and, for each (user, course) pair, forces the underlying
// CourseProgress row to a true 100% completion (every lecture in the current
// courseData is in completedLectures).
//
// It only touches the database -- no backend/UI code is changed.
//   * certificate whose course is missing  -> cannot fix, reported
//   * course with zero lectures            -> impossible to reach 100%, reported
//   * everything else                      -> progress upserted to all lectures done
//
// Run: npm run db:fix:progress                (dry run)
//      npm run db:fix:progress -- --yes       (write)
import "dotenv/config";
import mongoose from "mongoose";

import CourseModel from "../models/course.model";
import CertificateModel from "../models/certificate.model";
import CourseProgressModel from "../models/courseProgress.model";
import redis, { sessionKey, userPublicKey } from "../utils/redis";

const flag = (name: string) => process.argv.includes(`--${name}`);
const arg = (name: string, fallback = "") => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const CONFIRMED = flag("yes") || arg("confirm", "") === "yes";

const lectureIdsOf = (course: any) =>
  (course.courseData || []).map((lecture: any) => lecture._id);

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const certificates = await CertificateModel.find()
    .select("user course issuedAt")
    .lean();

  const courses = await CourseModel.find()
    .select("_id organization courseData")
    .lean();

  const courseById = new Map(
    courses.map((course) => [String(course._id), course]),
  );

  console.log("");
  console.log("=== certificate progress repair ===");
  console.log(`  certificates : ${certificates.length}`);
  console.log(`  courses      : ${courses.length}`);
  console.log("  for every certificate the (user, course) progress is set to 100%");

  const report = {
    ok: 0,
    fix: 0,
    create: 0,
    missingCourse: 0,
    noLectures: 0,
  };

  const cacheKeys = new Set<string>();

  for (const certificate of certificates) {
    const course = courseById.get(String(certificate.course));

    if (!course) {
      report.missingCourse += 1;

      console.log(
        `  SKIP missing course  ${String(certificate.course)} (certificate ${String(certificate._id)})`,
      );

      continue;
    }

    const lectures = lectureIdsOf(course);

    if (lectures.length === 0) {
      report.noLectures += 1;

      console.log(
        `  SKIP no lectures     ${String(certificate.course)} (progress can not be 100%)`,
      );

      continue;
    }

    const existing = await CourseProgressModel.findOne({
      user: certificate.user,
      course: certificate.course,
    })
      .select("completedLectures")
      .lean();

    const completed = new Set(
      (existing?.completedLectures || []).map((id: any) => String(id)),
    );

    const alreadyDone = lectures.every((lectureId: any) =>
      completed.has(String(lectureId)),
    );

    if (alreadyDone) {
      report.ok += 1;

      continue;
    }

    if (!existing) {
      report.create += 1;
    } else {
      report.fix += 1;
    }

    if (!CONFIRMED) {
      continue;
    }

    await CourseProgressModel.updateOne(
      { user: certificate.user, course: certificate.course },
      {
        $set: {
          organization: course.organization,
          currentLecture: lectures[lectures.length - 1],
          completedLectures: lectures,
          totalLectures: lectures.length,
          lastAccessedAt: certificate.issuedAt || new Date(),
        },
      },
      { upsert: true },
    );

    cacheKeys.add(sessionKey(String(certificate.user)));
    cacheKeys.add(userPublicKey(String(certificate.user)));
  }

  if (CONFIRMED && cacheKeys.size) {
    for (let i = 0; i < cacheKeys.size; i += 200) {
      await redis.del(...[...cacheKeys].slice(i, i + 200));
    }

    console.log(`\n  ${cacheKeys.size} redis cache keys cleared`);
  }

  console.log("\n  summary:");
  console.log(`    already 100%           : ${report.ok}`);
  console.log(`    progress fixed         : ${report.fix}`);
  console.log(`    progress created       : ${report.create}`);
  console.log(`    missing course (skip)  : ${report.missingCourse}`);
  console.log(`    course has no lectures : ${report.noLectures}`);

  if (!CONFIRMED) {
    console.log("\n  DRY RUN, nothing was written. re-run with --yes.\n");
  } else {
    const progressRows = await CourseProgressModel.find()
      .select("user course completedLectures")
      .lean();

    const progressByPair = new Map(
      progressRows.map((row: any) => [
        `${String(row.user)}|${String(row.course)}`,
        row,
      ]),
    );

    let at100 = 0;

    for (const certificate of certificates) {
      const course = courseById.get(String(certificate.course));
      const size = course ? lectureIdsOf(course).length : 0;
      const row = progressByPair.get(
        `${String(certificate.user)}|${String(certificate.course)}`,
      );

      if (row && size && row.completedLectures.length >= size) {
        at100 += 1;
      }
    }

    console.log(
      `\n  verification: ${at100}/${certificates.length} certificates now have a truly 100% progress`,
    );
    console.log("\n  done\n");
  }

  await mongoose.disconnect();
  await redis.quit();
  process.exit(0);
};

run().catch(async (error) => {
  console.error("\nFAILED:", error && error.message);
  process.exitCode = 1;

  try {
    await mongoose.disconnect();
    await redis.quit();
  } catch {
    // ignore shutdown errors
  }

  process.exit(1);
});