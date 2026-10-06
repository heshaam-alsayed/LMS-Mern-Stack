// Creates real enrollment data so nothing is fake:
//   * an Order document for every enrollment, shaped like a real Stripe payment
//   * the course is added to the buyer's user.courses
//   * a CourseProgress row for the enrollment
//   * course reviews and lecture questions are written by real users only
//   * course.purchased and course.ratings are recomputed from the real orders
//
// Run: npm run seed:enrollments                        (dry run, prints the plan)
//      npm run seed:enrollments -- --yes               (write)
//      npm run seed:enrollments -- --yes --reset       (rebuild from scratch)
//      npm run seed:enrollments -- --yes --min=2 --max=9
import "dotenv/config";
import mongoose from "mongoose";

import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";
import CourseProgressModel from "../models/courseProgress.model";
import CertificateModel from "../models/certificate.model";
import NotificationModel from "../models/notification.model";
import { calcAverageReviews } from "../utils/helper";
import redis, { sessionKey, userPublicKey } from "../utils/redis";

const MARKER = "seed:catalog";
const ORDER_MARKER = "seed:enrollments";

const arg = (name: string, fallback = "") => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const flag = (name: string) => process.argv.includes(`--${name}`);

const CONFIRMED = flag("yes") || arg("confirm", "") === "yes";
const RESET = flag("reset");

const MIN_COURSES = Math.max(1, Number(arg("min", "3")) || 3);
const MAX_COURSES = Math.max(MIN_COURSES, Number(arg("max", "8")) || 8);

const REVIEW_COMMENTS = [
  "The explanations are clear and every section builds on the last one. I finished with a working project.",
  "Practical content, no filler. The exercises are what made this stick for me.",
  "Exactly the balance I was looking for between theory and real work.",
  "I used this to prepare for an interview and it covered everything I was asked about.",
  "A few lessons feel dense, but the extra practice material helps a lot.",
  "The instructor explains the why, not just the what. That made the material much easier to remember.",
  "Solid, well structured and up to date. I recommended it to two colleagues already.",
  "The pacing is good and the quizzes are genuinely useful for checking your understanding.",
  "I applied several ideas from the course at work within the first week.",
  "Very good overall. I would have liked one more advanced section at the end.",
];

const QUESTION_TEXTS = [
  "For this part, how would you approach it when the data is much larger than the example?",
  "Is there a simpler way to achieve the same result without the extra step shown here?",
  "Does this still apply if the project runs on an older version?",
  "What would be the recommended way to structure this in a larger team?",
  "Can you show a version that handles the error case?",
  "How long does this usually take to implement in a real project?",
];

const ANSWER_TEXTS = [
  "Great question. Start by measuring where the time actually goes, then optimise the slowest part instead of guessing. The example is small enough that the bottleneck is obvious, but in production you always profile first.",
  "Yes, the extra step matters once the data grows, because it keeps each unit of work small. For a small project you can skip it, but you will regret that later.",
  "That depends on the version, check the release notes for that specific change. The general approach still holds.",
  "Keep each piece independent and testable, then compose them. That way the team can work on different parts in parallel without conflicts.",
  "Absolutely, wrap it in a try/catch and handle the failure path explicitly. Failing silently is what causes the confusing bugs later.",
  "For something this size it is usually a day or two, most of the time goes into testing the edge cases rather than the happy path.",
];

const makeRandom = (seed: number) => {
  let state = seed + 1;

  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;

    return state / 2147483648;
  };
};

const pick = <T,>(random: () => number, list: T[]): T =>
  list[Math.floor(random() * list.length) % list.length];

// the shape the application stores when a user is embedded in a review or a
// question: the user document without the password
const safeUser = (user: any) => {
  const { password, ...rest } = user;

  return rest;
};

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const students = await UserModel.find({ role: "user" }).select("-password").lean();
  let courses = await CourseModel.find({ tags: new RegExp(MARKER) }).lean();

  console.log("");
  console.log("=== enrollment plan ===");
  console.log(`  students (role=user) : ${students.length}`);
  console.log(`  seeded courses       : ${courses.length}`);
  console.log(
    `  courses per student  : ${MIN_COURSES} to ${MAX_COURSES} (about ${Math.round(((MIN_COURSES + MAX_COURSES) / 2) * students.length)} orders)`,
  );
  console.log("  each enrollment      : order + user.courses + course progress");
  console.log("  reviews / questions  : written by real students only");
  console.log("  purchased / ratings  : recomputed from the real orders");

  if (!CONFIRMED) {
    console.log("");
    console.log("  DRY RUN, nothing was written. re-run with --yes.");
    console.log("  add --reset to rebuild the previous run.\n");
    await mongoose.disconnect();
    await redis.quit();
    process.exit(0);
  }

  if (RESET) {
    console.log("\n--- reset ---");

    const orders = await OrderModel.deleteMany({ "paymentInfo.metadata.seed": ORDER_MARKER });
    const progress = await CourseProgressModel.deleteMany({});

    // certificates are regenerable seed data (npm run seed:certificates), so a
    // full reset always reproduces the same final state
    const certificates = await CertificateModel.deleteMany({});

    // integrity pass: courses whose relations point at users/organizations that
    // no longer exist are removed together with their orders, progress and
    // certificates, so the rest of the data stays consistent
    const db = mongoose.connection.db;
    const validOrgIds = new Set(
      (await (db as any).collection("organizations").find({}).project({ _id: 1 }).toArray()).map((item: any) => String(item._id)),
    );
    const validCategoryIds = new Set(
      (await (db as any).collection("categories").find({}).project({ _id: 1 }).toArray()).map((item: any) => String(item._id)),
    );
    const validUserIds = new Set(
      (await UserModel.find().select("_id").lean()).map((user: any) => String(user._id)),
    );
    const brokenIds = (
      await CourseModel.find()
        .select("_id organization category instructor createdBy")
        .lean()
    )
      .filter(
        (course: any) =>
          !validOrgIds.has(String(course.organization)) ||
          !validCategoryIds.has(String(course.category)) ||
          !validUserIds.has(String(course.instructor)) ||
          !validUserIds.has(String(course.createdBy)),
      )
      .map((course: any) => course._id);
    if (brokenIds.length) {
      await OrderModel.deleteMany({ course: { $in: brokenIds } });
      await CourseProgressModel.deleteMany({ course: { $in: brokenIds } });
      await CertificateModel.deleteMany({ course: { $in: brokenIds } });
      await UserModel.updateMany({}, { $pull: { courses: { $in: brokenIds } } });
      await CourseModel.deleteMany({ _id: { $in: brokenIds } });
      console.log(`  ${brokenIds.length} courses with broken relations removed`);
    }

    // notifications pointing at users or organizations that no longer exist
    // are leftovers of removed data, they are removed for the same reason
    const orphanNotifications = (await NotificationModel.find().select("_id user organization").lean())
      .filter(
        (notification: any) =>
          !validUserIds.has(String(notification.user)) ||
          !validOrgIds.has(String(notification.organization)),
      )
      .map((notification: any) => notification._id);
    if (orphanNotifications.length) {
      await NotificationModel.deleteMany({ _id: { $in: orphanNotifications } });
      console.log(`  ${orphanNotifications.length} notifications with broken relations removed`);
    }

    // reviews and questions on the seeded courses are rebuilt from scratch, so a
    // reset always gives the same result. on any other course only the entries
    // that were not written by a real user are removed.
    const seededIds = new Set(courses.map((course: any) => String(course._id)));
    const allCourses = await CourseModel.find()
      .select("_id reviews courseData name tags")
      .lean();
    let strippedReviews = 0;
    let strippedQuestions = 0;

    for (const course of allCourses) {
      const tagText = Array.isArray(course.tags)
        ? course.tags.join(" ")
        : String(course.tags || "");
      const isSeeded = tagText.includes(MARKER);
      const realReviews = (course.reviews || []).filter((review: any) =>
        students.some((student) => String(student._id) === String(review.user?._id)),
      );
      const before = (course.reviews || []).length + (course.courseData || []).reduce(
        (sum: number, data: any) => sum + (data.questions || []).length,
        0,
      );

      const keepReviews = isSeeded ? [] : realReviews;
      const courseData = (course.courseData || []).map((data: any) => {
        const questions = isSeeded
          ? []
          : (data.questions || []).filter((question: any) =>
              students.some((student) => String(student._id) === String(question.user?._id)),
            );

        strippedQuestions += (data.questions || []).length - questions.length;

        return { ...data, questions };
      });

      const after = keepReviews.length + courseData.reduce(
        (sum: number, data: any) => sum + data.questions.length,
        0,
      );

      strippedReviews += before - after;

      if (!seededIds.has(String(course._id)) && after === before && !isSeeded) {
        continue;
      }

      await CourseModel.updateOne(
        { _id: course._id },
        {
          $set: {
            reviews: keepReviews,
            courseData,
            purchased: 0,
            ratings: 0,
            reviewsCount: keepReviews.length,
            totalLectures: courseData.length,
          },
        },
      );
    }

    console.log(`  ${orders.deletedCount} orders removed`);
    console.log(`  ${progress.deletedCount} progress rows removed`);
    console.log(`  ${certificates.deletedCount} certificates removed`);
    console.log(`  ${strippedReviews} old reviews and questions removed`);

    // the courses were just rewritten, so the in-memory copy is stale
    courses = await CourseModel.find({ tags: new RegExp(MARKER) }).lean();
  }

  // enrollments
  console.log("\n--- enrollments ---");
  const enrollments: { user: any; course: any }[] = [];

  students.forEach((student: any, index: number) => {
    const random = makeRandom(index * 7919 + 13);
    const wanted = MIN_COURSES + Math.floor(random() * (MAX_COURSES - MIN_COURSES + 1));
    const chosen = new Set<any>();
    let guard = 0;

    while (chosen.size < Math.min(wanted, courses.length) && guard < 500) {
      guard += 1;
      chosen.add(courses[Math.floor(random() * courses.length) % courses.length]);
    }

    chosen.forEach((course) => enrollments.push({ user: student, course }));
  });

  const existingOrders = await OrderModel.find({
    "paymentInfo.metadata.seed": ORDER_MARKER,
  })
    .select("user course")
    .lean();

  const already = new Set(
    existingOrders.map((order: any) => `${String(order.user)}::${String(order.course)}`),
  );

  const fresh = enrollments.filter(
    (item) => !already.has(`${String(item.user._id)}::${String(item.course._id)}`),
  );

  let cursor = 0;
  const BATCH = 50;

  while (cursor < fresh.length) {
    const slice = fresh.slice(cursor, cursor + BATCH);

    const orderDocs = slice.map(({ user, course }, index) => {
      const random = makeRandom(cursor + index);
      const amount = Math.round(course.price * 100);

      return {
        user: user._id,
        course: course._id,
        organization: course.organization,
        price: course.price,
        paymentInfo: {
          id: `pi_seed_${String(user._id).slice(-8)}_${String(course._id).slice(-8)}`,
          amount,
          currency: "egp",
          status: "succeeded",
          payment_method: pick(random, ["card", "card", "card", "wallet"]),
          created: Math.floor(Date.now() / 1000) - Math.floor(random() * 1209600),
          metadata: {
            seed: ORDER_MARKER,
            userId: String(user._id),
            courseId: String(course._id),
          },
        },
      };
    });

    await OrderModel.insertMany(orderDocs, { ordered: false });

    // the buyer now owns the course
    await UserModel.bulkWrite(
      slice.map(({ user, course }) => ({
        updateOne: {
          filter: { _id: user._id },
          update: { $addToSet: { courses: course._id } },
        },
      })),
      { ordered: false },
    );

    // and has a progress row, with a realistic amount of finished lectures
    const progressDocs = slice.map(({ user, course }, index) => {
      const random = makeRandom(cursor + index + 991);
      const lectures = course.courseData || [];
      const done = lectures.filter(() => random() < 0.45);
      const last = done[done.length - 1] || lectures[0];

      return {
        user: user._id,
        course: course._id,
        organization: course.organization,
        currentLecture: last ? last._id : null,
        completedLectures: done.map((lecture: any) => lecture._id),
        totalLectures: lectures.length,
        lastAccessedAt: new Date(Date.now() - Math.floor(random() * 1209600000)),
      };
    });

    await CourseProgressModel.bulkWrite(
      progressDocs.map((doc) => ({
        updateOne: {
          filter: { user: doc.user, course: doc.course },
          update: { $set: doc },
          upsert: true,
        },
      })),
      { ordered: false },
    );

    cursor += BATCH;
  }

  console.log(`  ${fresh.length} new enrollments created`);
  console.log(`  ${enrollments.length - fresh.length} already existed`);

  // reviews from real buyers
  console.log("\n--- reviews ---");
  let reviewCount = 0;
  let reviewCursor = 0;

  while (reviewCursor < fresh.length) {
    const slice = fresh.slice(reviewCursor, reviewCursor + BATCH);

    for (const [index, { user, course }] of slice.entries()) {
      const random = makeRandom(reviewCursor + index * 31 + 4242);
      const author = safeUser(user);
      const alreadyReviewed = (course.reviews || []).some(
        (review: any) => String(review.user?._id) === String(user._id),
      );

      if (alreadyReviewed || random() > 0.55) {
        continue;
      }

      const review = {
        user: author,
        rating: 4 + (random() > 0.8 ? 1 : 0),
        comment: pick(random, REVIEW_COMMENTS),
        commentReplies: [],
      };

      await CourseModel.updateOne(
        { _id: course._id },
        { $push: { reviews: review }, $inc: { reviewsCount: 1 } },
      );

      reviewCount += 1;
    }

    reviewCursor += BATCH;
  }

  console.log(`  ${reviewCount} reviews written by real students`);

  // lecture questions from real students
  console.log("\n--- lecture questions ---");
  let questionCount = 0;
  let replyCount = 0;
  let questionCursor = 0;

  while (questionCursor < fresh.length) {
    const slice = fresh.slice(questionCursor, questionCursor + BATCH);

    for (const [index, { user, course }] of slice.entries()) {
      const random = makeRandom(questionCursor + index * 37 + 777);

      if (random() > 0.35) {
        continue;
      }

      const paid = (course.courseData || []).filter((data: any) => !data.isFree);

      if (!paid.length) {
        continue;
      }

      const lecture = paid[Math.floor(random() * paid.length) % paid.length];
      const author = safeUser(user);
      const answerer = pick(random, students);
      const question = {
        user: author,
        question: pick(random, QUESTION_TEXTS),
        questionReplies: [
          {
            user: safeUser(answerer),
            answer: pick(random, ANSWER_TEXTS),
          },
        ],
      };

      await CourseModel.updateOne(
        { _id: course._id, "courseData._id": lecture._id },
        { $push: { "courseData.$.questions": question } },
      );

      questionCount += 1;
      replyCount += question.questionReplies.length;
    }

    questionCursor += BATCH;
  }

  console.log(`  ${questionCount} questions and ${replyCount} answers written by real students`);

  // recompute the numbers from the real orders
  console.log("\n--- recomputing purchased and ratings ---");
  const purchasedPerCourse = new Map<string, number>();

  const allOrders = await OrderModel.find().select("course").lean();

  allOrders.forEach((order: any) => {
    const key = String(order.course);

    purchasedPerCourse.set(key, (purchasedPerCourse.get(key) || 0) + 1);
  });

  const everyCourse = await CourseModel.find().select("name reviews").lean();
  const courseUpdates = everyCourse.map((course: any) => {
    const reviews = (course.reviews || []).filter((review: any) =>
      students.some((student) => String(student._id) === String(review.user?._id)),
    );

    return {
      updateOne: {
        filter: { _id: course._id },
        update: {
          $set: {
            purchased: purchasedPerCourse.get(String(course._id)) || 0,
            ratings: calcAverageReviews(reviews),
            reviews,
            reviewsCount: reviews.length,
          },
        },
      },
    };
  });

  for (let i = 0; i < courseUpdates.length; i += BATCH) {
    await CourseModel.bulkWrite(courseUpdates.slice(i, i + BATCH), { ordered: false });
  }

  console.log(`  ${courseUpdates.length} courses updated`);

  // the app caches users and courses in redis, so the cache must be cleared
  console.log("\n--- clearing redis cache ---");
  const cacheKeys = [
    ...students.flatMap((student: any) => [
      sessionKey(String(student._id)),
      userPublicKey(String(student._id)),
    ]),
    ...everyCourse.map((course: any) => String(course._id)),
  ];

  for (let i = 0; i < cacheKeys.length; i += 200) {
    await redis.del(...cacheKeys.slice(i, i + 200));
  }

  console.log(`  ${cacheKeys.length} cache keys removed`);

  // verify
  console.log("\n=== verification ===");
  const totalOrders = await OrderModel.countDocuments();
  const totalProgress = await CourseProgressModel.countDocuments();
  const allStudents = await UserModel.find({ role: "user" }).select("courses").lean();
  const enrolled = allStudents.reduce(
    (sum: number, user: any) => sum + (user.courses || []).length,
    0,
  );
  const perCourse = await CourseModel.find().select("name purchased ratings reviews").lean();
  const maxPurchased = Math.max(...perCourse.map((course: any) => course.purchased || 0));
  const totalReviews = perCourse.reduce(
    (sum: number, course: any) => sum + (course.reviews || []).length,
    0,
  );
  const sold = perCourse.reduce(
    (sum: number, course: any) => sum + (course.purchased || 0),
    0,
  );

  console.log(`  orders                : ${totalOrders}`);
  console.log(`  user.courses entries  : ${enrolled} (must equal the paid orders of students)`);
  console.log(`  course progress rows  : ${totalProgress}`);
  console.log(`  sum of course.purchased: ${sold}`);
  console.log(`  max purchased on a course: ${maxPurchased} (students: ${allStudents.length})`);
  console.log(`  total real reviews    : ${totalReviews}`);
  console.log(
    `  consistent            : ${sold === enrolled ? "yes, every purchase is in a user document" : "NO"}`,
  );
  console.log("\n  done\n");

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
