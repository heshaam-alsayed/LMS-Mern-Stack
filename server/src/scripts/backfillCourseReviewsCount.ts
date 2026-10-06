// Backfills the derived course counters from the embedded arrays:
//   reviewsCount  <- reviews.length
//   totalLectures <- courseData.length
//   totalHours    <- sum(courseData.videoLength) / 60   (videoLength is minutes)
// Writes only with --yes, else --dry-run.
import "dotenv/config";
import mongoose from "mongoose";

import CourseModel from "../models/course.model";

const yes = process.argv.includes("--yes");

const reviewsCount = {
  $size: { $ifNull: ["$reviews", []] },
};

const totalLectures = {
  $size: { $ifNull: ["$courseData", []] },
};

const totalMinutes = {
  $sum: {
    $map: {
      input: { $ifNull: ["$courseData", []] },
      as: "lecture",
      in: {
        $max: [
          0,
          {
            $convert: {
              input: "$$lecture.videoLength",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        ],
      },
    },
  },
};

const totalHours = {
  $round: [{ $divide: [totalMinutes, 60] }, 1],
};

const counterFilter = (field: string, expected: object) => ({
  $or: [
    { [field]: { $exists: false } },
    { $expr: { $ne: [{ $ifNull: [`$${field}`, 0] }, expected] } },
  ],
});

(async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const total = await CourseModel.countDocuments();

  const reviewsFilter = counterFilter("reviewsCount", reviewsCount);
  const lecturesFilter = counterFilter("totalLectures", totalLectures);
  const hoursFilter = counterFilter("totalHours", totalHours);

  const wrongReviews = await CourseModel.countDocuments(reviewsFilter);
  const wrongLectures = await CourseModel.countDocuments(lecturesFilter);
  const wrongHours = await CourseModel.countDocuments(hoursFilter);

  console.log(`courses total: ${total}`);
  console.log(`courses with a wrong reviewsCount: ${wrongReviews}`);
  console.log(`courses with a wrong totalLectures: ${wrongLectures}`);
  console.log(`courses with a wrong totalHours: ${wrongHours}`);
  console.log(`mode: ${yes ? "write" : "dry-run"}`);

  const sample = await CourseModel.aggregate([
    {
      $match: {
        $or: [reviewsFilter, lecturesFilter, hoursFilter],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        storedReviews: { $ifNull: ["$reviewsCount", 0] },
        actualReviews: reviewsCount,
        storedLectures: { $ifNull: ["$totalLectures", 0] },
        actualLectures: totalLectures,
        storedHours: { $ifNull: ["$totalHours", 0] },
        actualHours: totalHours,
      },
    },
    { $limit: 5 },
  ]);

  if (sample.length > 0) {
    console.log("sample:", JSON.stringify(sample, null, 2));
  }

  if (yes) {
    const pipelineOptions = { updatePipeline: true } as const;

    const reviewsResult = await CourseModel.updateMany(
      reviewsFilter,
      [{ $set: { reviewsCount } }],
      pipelineOptions,
    );

    const lecturesResult = await CourseModel.updateMany(
      lecturesFilter,
      [{ $set: { totalLectures } }],
      pipelineOptions,
    );

    const hoursResult = await CourseModel.updateMany(
      hoursFilter,
      [{ $set: { totalHours } }],
      pipelineOptions,
    );

    console.log(`reviewsCount updated: ${reviewsResult.modifiedCount}`);
    console.log(`totalLectures updated: ${lecturesResult.modifiedCount}`);
    console.log(`totalHours updated: ${hoursResult.modifiedCount}`);
  }

  const grouped = await CourseModel.aggregate([
    {
      $group: {
        _id: {
          reviewsInSync: {
            $eq: [{ $ifNull: ["$reviewsCount", 0] }, reviewsCount],
          },
          lecturesInSync: {
            $eq: [{ $ifNull: ["$totalLectures", 0] }, totalLectures],
          },
          hoursInSync: {
            $eq: [{ $ifNull: ["$totalHours", 0] }, totalHours],
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.reviewsInSync": -1,
        "_id.lecturesInSync": -1,
        "_id.hoursInSync": -1,
      },
    },
  ]);

  console.log("in sync:", JSON.stringify(grouped));

  await mongoose.disconnect();
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});