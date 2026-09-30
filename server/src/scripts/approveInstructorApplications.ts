// npm run seed:approve

// Approves instructor applications through the real service, so each approved
// request promotes the user to instructor and creates its organization with the
// real user id. Prints the real ids you need for the next seed scripts.
import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import UserModel from "../models/user.model";
import OrganizationModel from "../models/organization.model";
import InstructorApplicationModel from "../models/instructorApplication.model";
import { approveInstructorApplicationService } from "../services/instructorApplication.service";
// the service chain opens a redis client on import, so it has to be closed or
// the process never exits
import redis from "../utils/redis";

const arg = (name: string, fallback: string) => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const STATUS = arg("status", "pending");
const LIMIT = Number(arg("limit", "0")) || 0;
const EMAIL = arg("email", "");
const OUT = arg("out", "");
const ADMIN_EMAIL = arg("admin", "admin@lms.test");
const ADMIN_PASSWORD = arg("adminPassword", "Password123");

// reviewedBy needs a real admin id, so make sure one exists
const ensureAdmin = async () => {
  const email = ADMIN_EMAIL.toLowerCase();

  const existing = await UserModel.findOne({ email, role: "admin" });

  if (existing) {
    return existing;
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

  return await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Seed Admin",
        email,
        password,
        passwordUpdatedAt: new Date(),
        role: "admin",
        status: "active",
        provider: "local",
        isVerified: true,
        isDeleted: false,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
};

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const admin = await ensureAdmin();

  console.log(`\napproving applications with status="${STATUS}" as admin ${admin.email}\n`);

  const filter: Record<string, any> = { status: STATUS };

  if (EMAIL) {
    filter.user = await UserModel.findOne({ email: EMAIL.toLowerCase() }).then(
      (user) => user?._id,
    );

    if (!filter.user) {
      throw new Error(`No user found with email ${EMAIL}`);
    }
  }

  let applications = await InstructorApplicationModel.find(filter)
    .sort({ createdAt: 1 })
    .lean();

  if (LIMIT > 0) {
    applications = applications.slice(0, LIMIT);
  }

  if (!applications.length) {
    console.log(`nothing to approve (no applications with status "${STATUS}")\n`);

    return;
  }

  const rows = [];
  const failures = [];

  for (const application of applications) {
    try {
      await approveInstructorApplicationService(
        String(application._id),
        String(admin._id),
      );

      // read the rows the service just wrote, so the ids are the real ones
      const organization = await OrganizationModel.findOne({
        instructor: application.user,
      }).lean();

      const user = await UserModel.findById(application.user)
        .select("name email role")
        .lean();

      rows.push({
        userId: String(user!._id),
        name: user!.name,
        email: user!.email,
        role: user!.role,
        applicationId: String(application._id),
        organizationId: organization ? String(organization._id) : null,
        organizationName: organization?.name ?? null,
        organizationSlug: organization?.slug ?? null,
        organizationStatus: organization?.status ?? null,
      });
    } catch (error: any) {
      failures.push({
        applicationId: String(application._id),
        organizationName: application.organizationName,
        message: error?.message,
      });
    }
  }

  console.log("  #   instructor           organization                organizationId");
  console.log("  --- -------------------- ---------------------------- --------------------------------");

  rows.forEach((row, index) => {
    console.log(
      "  " +
        String(index + 1).padStart(3) +
        "  " +
        String(row.name).padEnd(20) +
        " " +
        String(row.organizationName).padEnd(28) +
        " " +
        String(row.organizationId),
    );
  });

  console.log(
    `\napproved ${rows.length} application(s), created ${rows.length} organization(s)`,
  );

  if (failures.length) {
    console.log(`\n${failures.length} failed:`);

    failures.forEach((failure) => {
      console.log(`  ${failure.organizationName}: ${failure.message}`);
    });

    process.exitCode = 1;
  }

  if (OUT) {
    fs.writeFileSync(OUT, JSON.stringify(rows, null, 2));

    console.log(`\nwrote ${rows.length} record(s) to ${OUT}`);
  }

  console.log("");
};

run()
  .catch((error) => {
    console.error("APPROVE FAILED:", error && error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
      await redis.quit();
    } catch (error: any) {
      console.error("shutdown failed:", error && error.message);
    }

    // a cli script should not wait on stray handles
    process.exit(process.exitCode ?? 0);
  });
