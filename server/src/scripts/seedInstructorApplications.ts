// npm run seed:applications

// Seeds 20 Egyptian instructors, each with one PENDING instructor application.
// The organization is NOT created here: that happens when the application is
// approved, so the flow matches the real app. Safe to re-run (upserts by email).
import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import UserModel from "../models/user.model";
import InstructorApplicationModel from "../models/instructorApplication.model";

const arg = (name: string, fallback: string) => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const SEED_PASSWORD = arg("password", "Password123");
const DOMAIN = arg("domain", "lms.test");
const LIMIT = Math.max(1, Number(arg("count", "20")) || 20);
const OUT = arg("out", "");

// organization names are latin on purpose: slugify() strips non ascii
// characters, so an arabic organization name would produce an empty slug
const INSTRUCTORS = [
  {
    name: "Hassan Abdullah",
    handle: "inst.hassan",
    org: "Cairo Digital Academy",
  },
  {
    name: "Mahmoud El Sayed",
    handle: "inst.mahmoud",
    org: "Nile Technology Institute",
  },
  {
    name: "Salma Mohamed",
    handle: "inst.salma",
    org: "Delta Business Academy",
  },
  {
    name: "Karim Abdelaziz",
    handle: "inst.karim",
    org: "Alexandria Coding Institute",
  },
  { name: "Sara Gamal", handle: "inst.sara", org: "Pyramids Design Academy" },
  {
    name: "Mohamed Ragab",
    handle: "inst.mohamed",
    org: "Luxor Creative Academy",
  },
  { name: "Aya Ibrahim", handle: "inst.aya", org: "Sinai Technology Center" },
  {
    name: "Khaled Hassan",
    handle: "inst.khaled",
    org: "Giza Digital Institute",
  },
  {
    name: "Menna Mostafa",
    handle: "inst.menna",
    org: "Aswan Language Academy",
  },
  {
    name: "Ahmed Shawky",
    handle: "inst.ahmed",
    org: "Port Said Maritime Academy",
  },
  {
    name: "Youssef Adel",
    handle: "inst.youssef",
    org: "Dahab Diving Institute",
  },
  { name: "Nourhan Sami", handle: "inst.nourhan", org: "Sphinx Data Academy" },
  { name: "Omar Fouad", handle: "inst.omar", org: "Karnak Art Institute" },
  {
    name: "Abdelrahman Ali",
    handle: "inst.abdelrahman",
    org: "Rosetta Language Academy",
  },
  {
    name: "Mariam Khaled",
    handle: "inst.mariam",
    org: "Zamalek Music Institute",
  },
  { name: "Tarek Mahmoud", handle: "inst.tarek", org: "Maadi Finance Academy" },
  {
    name: "Dalia Ahmed",
    handle: "inst.dalia",
    org: "Heliopolis Tech Institute",
  },
  {
    name: "Islam Sameh",
    handle: "inst.islam",
    org: "Siwa Environmental Academy",
  },
  { name: "Shady Nabil", handle: "inst.shady", org: "Fayoum Arts Institute" },
  {
    name: "Ramy Hamdy",
    handle: "inst.ramy",
    org: "Ras El Bar Training Academy",
  },
];

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  // hashed here because findOneAndUpdate never runs the pre("save") hook
  const password = await bcrypt.hash(SEED_PASSWORD, 10);
  const now = new Date();

  const people = INSTRUCTORS.slice(0, LIMIT);
  const rows = [];

  for (const [index, person] of people.entries()) {
    const email = `${person.handle}@${DOMAIN}`.toLowerCase();

    // 1. the real user row, role stays "user" until the application is approved
    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          name: person.name,
          email,
          password,
          passwordUpdatedAt: now,
          phone: `+2011${String(10000000 + index)}`,
          role: "user",
          status: "active",
          provider: "local",
          isVerified: true,
          isDeleted: false,
        },
        $setOnInsert: { courses: [] },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    ).lean();

    // 2. the pending request, linked by the real user id
    const application = await InstructorApplicationModel.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          user: user._id,
          organizationName: person.org,
          organizationDescription: `${person.org} is a learning center in Egypt.`,
          status: "pending",
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    ).lean();

    rows.push({
      userId: String(user._id),
      name: user.name,
      email: user.email,
      applicationId: String(application._id),
      organizationName: application.organizationName,
      status: application.status,
    });
  }

  console.log(
    `\nseeded ${rows.length} instructor(s) with a PENDING application`,
  );
  console.log(`password for every account: ${SEED_PASSWORD}`);
  console.log("their role is still 'user' until the application is approved\n");

  console.log(
    "  #   name                 email                        applicationId",
  );
  console.log(
    "  --- -------------------- ---------------------------- --------------------------------",
  );

  rows.forEach((row, index) => {
    console.log(
      "  " +
        String(index + 1).padStart(3) +
        "  " +
        row.name.padEnd(20) +
        " " +
        row.email.padEnd(28) +
        " " +
        row.applicationId,
    );
  });

  if (OUT) {
    fs.writeFileSync(OUT, JSON.stringify(rows, null, 2));

    console.log(`\nwrote ${rows.length} record(s) to ${OUT}`);
  }

  console.log(
    "\nnext: npm run seed:approve   (approves all pending, creates the organizations)\n",
  );
};

run()
  .catch((error) => {
    console.error("SEED FAILED:", error && error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
