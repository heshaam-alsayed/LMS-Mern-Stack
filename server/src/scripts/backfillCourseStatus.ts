// Backfills status for pre-existing courses.
// Existing courses are already live: published.
// Writes only with --yes, else --dry-run.
import "dotenv/config";
import mongoose from "mongoose";

import CourseModel from "../models/course.model";

const yes = process.argv.includes("--yes");

(async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const filter = {
    $or: [{ status: { $exists: false } }, { status: null }],
  };

  const count = await CourseModel.countDocuments(filter);

  console.log(`courses without status: ${count}`);
  console.log(`mode: ${yes ? "write" : "dry-run"}`);

  if (yes) {
    const result = await CourseModel.updateMany(
      filter,
      { $set: { status: "published" } },
    );

    console.log(`updated: ${result.modifiedCount}`);
  }

  const grouped = await CourseModel.aggregate([
    { $group: { _id: "$status", total: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  console.log("by status:", JSON.stringify(grouped));

  await mongoose.disconnect();
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
