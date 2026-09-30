// npm run seed:users

// Seeds 20 realistic Egyptian users with a known password.
// Safe to re-run: it upserts by email, so nothing is duplicated.
import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import UserModel from "../models/user.model";

const ROLES = ["user", "instructor", "admin"] as const;
const STATUSES = ["pending", "active", "suspended"] as const;

const arg = (name: string, fallback: string) => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const SEED_PASSWORD = arg("password", "Password123");
const DOMAIN = arg("domain", "lms.test");
const LIMIT = Math.max(1, Number(arg("count", "20")) || 20);
const ROLE = arg("role", "user");
const STATUS = arg("status", "active");
const OUT = arg("out", "");

if (!ROLES.includes(ROLE as (typeof ROLES)[number])) {
  throw new Error(`--role must be one of ${ROLES.join(", ")}`);
}

if (!STATUSES.includes(STATUS as (typeof STATUSES)[number])) {
  throw new Error(`--status must be one of ${STATUSES.join(", ")}`);
}

// Egyptian names, each within the schema limit of 20 characters
const PEOPLE = [
  { name: "Youssef Hassan", handle: "youssef.hassan" },
  { name: "Omar Mahmoud", handle: "omar.mahmoud" },
  { name: "Mostafa Ahmed", handle: "mostafa.ahmed" },
  { name: "Abdelrahman Samir", handle: "abdelrahman.samir" },
  { name: "Amr Khaled", handle: "amr.khaled" },
  { name: "Tarek Mohamed", handle: "tarek.mohamed" },
  { name: "Islam Adel", handle: "islam.adel" },
  { name: "Ahmed Gamal", handle: "ahmed.gamal" },
  { name: "Mahmoud Ashraf", handle: "mahmoud.ashraf" },
  { name: "Karim Hossam", handle: "karim.hossam" },
  { name: "Mariam Adel", handle: "mariam.adel" },
  { name: "Nour Mohamed", handle: "nour.mohamed" },
  { name: "Aya Khaled", handle: "aya.khaled" },
  { name: "Salma Hassan", handle: "salma.hassan" },
  { name: "Menna Ahmed", handle: "menna.ahmed" },
  { name: "Esraa Mahmoud", handle: "esraa.mahmoud" },
  { name: "Nada Samir", handle: "nada.samir" },
  { name: "Hana Tarek", handle: "hana.tarek" },
  { name: "Reem Mostafa", handle: "reem.mostafa" },
  { name: "Farah Ibrahim", handle: "farah.ibrahim" },
];

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  // hashed up front because findOneAndUpdate never runs the pre("save") hook
  const password = await bcrypt.hash(SEED_PASSWORD, 10);
  const now = new Date();

  const people = PEOPLE.slice(0, LIMIT);

  const saved = [];

  for (const [index, person] of people.entries()) {
    const email = `${person.handle}@${DOMAIN}`.toLowerCase();

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          name: person.name,
          email,
          // the plain password is never stored, only the hash
          password,
          passwordUpdatedAt: now,
          phone: `+2010${String(10000000 + index)}`,
          role: ROLE,
          status: STATUS,
          provider: "local",
          isVerified: true,
          isDeleted: false,
        },
        $setOnInsert: { courses: [] },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    ).lean();

    saved.push({
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  }

  console.log(`\nseeded ${saved.length} user(s)  role=${ROLE}  status=${STATUS}`);
  console.log(`password for every account: ${SEED_PASSWORD}\n`);

  console.log("  #   name                 email                          id");
  console.log("  --- -------------------- ----------------------------- --------------------------------");

  saved.forEach((user, index) => {
    console.log(
      "  " +
        String(index + 1).padStart(3) +
        "  " +
        user.name.padEnd(20) +
        " " +
        user.email.padEnd(29) +
        " " +
        user._id,
    );
  });

  if (OUT) {
    fs.writeFileSync(OUT, JSON.stringify(saved, null, 2));

    console.log(`\nwrote ${saved.length} user record(s) to ${OUT}`);
  }

  console.log("");
};

run()
  .catch((error) => {
    console.error("SEED FAILED:", error && error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
