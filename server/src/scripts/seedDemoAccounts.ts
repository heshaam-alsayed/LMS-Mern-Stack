// npm run seed:demo
//
// Upserts the three live-demo accounts used by the client demo badges so that
// each has the correct role:
//   youssef.hassan@lms.test -> user
//   omar.mahmoud@lms.test   -> instructor
//   mostafa.ahmed@lms.test  -> admin
//
// Safe to re-run: it upserts by email and always re-applies the target role.
// The password is hashed up front (findOneAndUpdate never runs pre("save")).
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import UserModel from "../models/user.model";

const DEMO_PASSWORD = process.env.DEMO_SEED_PASSWORD || "Password123";

const DEMO_ACCOUNTS = [
  { email: "youssef.hassan@lms.test", name: "Youssef Hassan", role: "user" },
  { email: "omar.mahmoud@lms.test", name: "Omar Mahmoud", role: "instructor" },
  { email: "mostafa.ahmed@lms.test", name: "Mostafa Ahmed", role: "admin" },
] as const;

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const now = new Date();

  const result = [];

  for (const account of DEMO_ACCOUNTS) {
    const user = await UserModel.findOneAndUpdate(
      { email: account.email },
      {
        $set: {
          name: account.name,
          email: account.email,
          password,
          passwordUpdatedAt: now,
          role: account.role,
          status: "active",
          provider: "local",
          isVerified: true,
          isDeleted: false,
        },
        $setOnInsert: { courses: [] },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    ).lean();

    result.push({ email: user.email, role: user.role, status: user.status });
  }

  console.table(result);
  console.log(`password for every demo account: ${DEMO_PASSWORD}`);
};

run()
  .catch((error) => {
    console.error("SEED DEMO FAILED:", error && error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });