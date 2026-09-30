// Aligns the database with the model relations:
//   1. remove organizations whose instructor user no longer exists (dangling
//      relation), so every Organization.instructor points at a real user
//   2. promote every remaining organization owner to role=instructor
//   3. close every pending InstructorApplication, approving the ones that are
//      valid through the real service so the name and slug stay unique
// Dry run by default, pass --yes to write.
import "dotenv/config";
import mongoose from "mongoose";

import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrganizationModel from "../models/organization.model";
import InstructorApplicationModel from "../models/instructorApplication.model";
import { approveInstructorApplicationService } from "../services/instructorApplication.service";
import redis from "../utils/redis";

const arg = (name: string, fallback = "") => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const flag = (name: string) => process.argv.includes(`--${name}`);

const CONFIRMED = flag("yes") || arg("confirm", "") === "yes";
const DELETE_ORPHANS = flag("delete-orphans");
const DO_PROMOTE = !flag("no-promote");
const DO_APPROVE = !flag("no-approve");

// what to do with a request whose user already owns an organization
const ON_CONFLICT = arg("conflict", "reject");

const findAdminId = async () => {
  const admin = await UserModel.findOne({ role: "admin" }).select("_id");

  if (admin) {
    return admin._id;
  }

  return (await UserModel.findOne({ role: "instructor" }).select("_id"))!._id;
};

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const adminId = String(await findAdminId());

  // 1. organizations with a dangling instructor reference
  const orgs = await OrganizationModel.find().populate("instructor", "name email role").lean();

  const orphans = orgs.filter((org) => !org.instructor);

  console.log("");
  console.log(`=== 1. organizations (${orgs.length} total) ===`);

  if (!orphans.length) {
    console.log("  dangling instructor references: 0");
  } else if (!DELETE_ORPHANS) {
    console.log(`  dangling instructor references: ${orphans.length}  (pass --delete-orphans to remove)`);
  } else {
    const orphanIds = orphans.map((org) => org._id);
    const courses = await CourseModel.countDocuments({ organization: { $in: orphanIds } });

    console.log(`  dangling instructor references: ${orphans.length}`);
    console.log(`  courses pointing at them: ${courses}`);

    if (CONFIRMED) {
      const result = await OrganizationModel.deleteMany({ _id: { $in: orphanIds } });

      console.log(`  deleted ${result.deletedCount} orphaned organization(s)`);
    } else {
      console.log("  would delete them (re-run with --yes)");
    }
  }

  // 2. owners that exist but are not instructors yet
  const owners = await OrganizationModel.find().populate("instructor", "role").lean();

  const promote = owners.filter(
    (org) => org.instructor && (org.instructor as any).role !== "instructor",
  );

  console.log(`\n=== 2. organization owners (${owners.length} organization(s) left) ===`);
  console.log(`  owners that are not role=instructor: ${promote.length}`);

  if (!promote.length) {
    console.log("  nothing to promote");
  } else if (!DO_PROMOTE) {
    console.log("  skipped (--no-promote)");
  } else if (CONFIRMED) {
    let changed = 0;

    for (const org of promote) {
      const result = await UserModel.updateOne(
        { _id: (org.instructor as any)._id, role: { $ne: "instructor" } },
        { $set: { role: "instructor", status: "active" } },
      );

      changed += result.modifiedCount;
    }

    console.log(`  promoted ${changed} user(s) to instructor + active`);
  } else {
    console.log("  would promote them (re-run with --yes)");
  }

  // 3. pending requests
  const pending = await InstructorApplicationModel.find({ status: "pending" })
    .populate("user", "name email role")
    .lean();

  console.log(`\n=== 3. pending instructor applications (${pending.length}) ===`);

  const approved = [];
  const rejected = [];
  const problems = [];
  let wouldApprove = 0;

  for (const application of pending) {
    const user = application.user as any;

    const ownsOrg = await OrganizationModel.findOne({ instructor: user._id }).lean();

    if (ownsOrg) {
      // one organization per instructor, so this request cannot be approved
      const reason = `already owns the organization "${ownsOrg.name}"`;

      if (ON_CONFLICT === "skip" || ON_CONFLICT === "delete") {
        if (ON_CONFLICT === "delete" && CONFIRMED) {
          await InstructorApplicationModel.deleteOne({ _id: application._id });
        }

        problems.push({ name: application.organizationName, reason });
      } else {
        if (CONFIRMED) {
          await InstructorApplicationModel.updateOne(
            { _id: application._id },
            {
              $set: {
                status: "rejected",
                rejectionReason: `You already own the organization "${ownsOrg.name}"`,
                reviewedAt: new Date(),
                reviewedBy: adminId,
              },
            },
          );
        }

        rejected.push({ name: application.organizationName, reason });
      }

      continue;
    }

    if (ON_CONFLICT !== "delete" && user.role !== "instructor" && CONFIRMED) {
      await UserModel.updateOne(
        { _id: user._id },
        { $set: { role: "instructor", status: "active" } },
      );
    }

    if (!DO_APPROVE) {
      problems.push({ name: application.organizationName, reason: "--no-approve" });

      continue;
    }

    if (!CONFIRMED) {
      wouldApprove++;

      continue;
    }

    try {
      await approveInstructorApplicationService(String(application._id), adminId);

      const organization = await OrganizationModel.findOne({
        instructor: user._id,
      }).lean();

      approved.push({
        name: application.organizationName,
        organizationName: organization?.name,
        organizationSlug: organization?.slug,
      });
    } catch (error: any) {
      problems.push({ name: application.organizationName, reason: error?.message });
    }
  }

  console.log(
    `  would approve: ${wouldApprove}  |  approved: ${approved.length}  |  rejected: ${rejected.length}  |  problems: ${problems.length}`,
  );

  if (approved.length) {
    console.log("\n  approved:");

    approved.forEach((row) => {
      console.log(
        `    ${String(row.name).padEnd(32)} -> ${String(row.organizationName).padEnd(34)} ${row.organizationSlug}`,
      );
    });
  }

  if (rejected.length) {
    console.log("\n  rejected:");

    rejected.forEach((row) => {
      console.log(`    ${String(row.name).padEnd(32)} -> ${row.reason}`);
    });
  }

  if (problems.length) {
    console.log("\n  problems:");

    problems.forEach((row) => {
      console.log(`    ${String(row.name).padEnd(32)} -> ${row.reason}`);
    });
  }

  console.log(
    CONFIRMED
      ? "\n  repair done\n"
      : "\n  DRY RUN, nothing was written. re-run with --yes.\n",
  );

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
