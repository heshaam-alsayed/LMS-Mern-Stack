// Backfills CourseProgress rows to match the current course content:
//   * totalLectures: rows created before the field existed get the lecture
//     count of their course at current state; stale snapshots get the latest
//   * organization: rows created through the purchase flow never stored it,
//     so it is filled from the course they belong to
// Writes only with --yes, else it is a dry run.
// Run: npm run db:progress               (dry run)
//      npm run db:progress -- --yes      (write)
import "dotenv/config";
import mongoose from "mongoose";

import CourseModel from "../models/course.model";
import CourseProgressModel from "../models/courseProgress.model";

const yes = process.argv.includes("--yes");

(async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const courses = await CourseModel.find()
    .select("_id organization courseData")
    .lean();

  const infoByCourse = new Map<string, { totalLectures: number; organization: any }>(
    courses.map((course: any) => [
      String(course._id),
      {
        totalLectures: (course.courseData || []).length,
        organization: course.organization,
      },
    ]),
  );

  const rows = await CourseProgressModel.find()
    .select("course organization totalLectures")
    .lean();

  let ok = 0;
  let missing = 0;
  let stale = 0;
  let orgFixed = 0;
  const bulk: any[] = [];

  const flush = async () => {
    if (!bulk.length) {
      return;
    }

    if (yes) {
      await CourseProgressModel.bulkWrite(bulk, { ordered: false });
    }

    bulk.length = 0;
  };

  for (const row of rows as any[]) {
    const info = infoByCourse.get(String(row.course));

    const current = row.totalLectures;
    const total = info?.totalLectures ?? 0;

    const patch: any = {};

    // totalLectures snapshot matching the current course content
    if (total > 0 && (typeof current !== "number" || current !== total)) {
      if (typeof current !== "number") {
        missing += 1;
      } else {
        stale += 1;
      }

      patch.totalLectures = total;
    }

    // rows created through the purchase flow never stored the organization
    if (
      info?.organization &&
      String(row.organization || "") !== String(info.organization)
    ) {
      patch.organization = info.organization;
      orgFixed += 1;
    }

    if (Object.keys(patch).length) {
      bulk.push({
        updateOne: {
          filter: { _id: row._id },
          update: { $set: patch },
        },
      });

      if (bulk.length >= 2000) {
        await flush();
      }

      continue;
    }

    ok += 1;
  }

  await flush();

  console.log(`courses                : ${courses.length}`);
  console.log(`progress rows          : ${rows.length}`);
  console.log(`already in sync        : ${ok}`);
  console.log(`missing totalLectures  : ${missing}`);
  console.log(`stale totalLectures    : ${stale}`);
  console.log(`missing organization   : ${orgFixed}`);
  console.log(`mode                   : ${yes ? "write" : "dry-run"}`);

  const completed = await CourseProgressModel.aggregate([
    {
      $project: {
        done: { $size: { $ifNull: ["$completedLectures", []] } },
        total: { $ifNull: ["$totalLectures", 0] },
      },
    },
    {
      $group: {
        _id: null,
        rows: { $sum: 1 },
        full: {
          $sum: { $cond: [{ $gte: ["$done", "$total"] }, 1, 0] },
        },
      },
    },
  ]);

  const summary = completed[0] || { rows: 0, full: 0 };

  console.log("after state:");
  console.log(`  rows                : ${summary.rows}`);
  console.log(`  at/above 100%       : ${summary.full}`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});