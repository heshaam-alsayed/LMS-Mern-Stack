// npm run db:clear -- --model=certificate --yes
// npm run db:clear -- --model=order,courseprogress --yes
//  npm run db:clear -- --model=notification --yes

// Removes documents from any model, or from every model at once.
// Dry run by default: nothing is deleted unless --yes is passed.
import "dotenv/config";
import fs from "fs";
import path from "path";

const arg = (name: string, fallback = "") => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const flag = (name: string) => process.argv.includes(`--${name}`);

const MODELS_DIR = path.join(__dirname, "..", "models");

// load every model file so the script keeps working when a model is added
const loadModels = () => {
  const models = [];

  for (const file of fs.readdirSync(MODELS_DIR)) {
    if (!file.endsWith(".model.ts")) {
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exported = require(path.join(MODELS_DIR, file));
    const model = exported.default ?? exported;

    if (model && model.modelName && model.collection) {
      models.push({ file, model });
    }
  }

  return models.sort((a, b) => a.model.modelName.localeCompare(b.model.modelName));
};

const list = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const run = async () => {
  // mongoose is required here so the models above can be registered first
  const mongoose = require("mongoose");

  const CONFIRMED = flag("yes") || flag("y") || arg("confirm", "") === "yes";

  const only = list(arg("model", arg("models", "")));
  const keep = list(arg("keep", ""));

  const all = loadModels();

  if (!all.length) {
    throw new Error("No models found in src/models");
  }

  const selected = only.length
    ? all.filter(
        (entry) =>
          only.includes(entry.model.modelName.toLowerCase()) ||
          only.includes(entry.file.replace(".model.ts", "").toLowerCase()),
      )
    : all;

  if (!selected.length) {
    throw new Error(
      `No model matched ${JSON.stringify(only)}. Available: ${all
        .map((entry) => entry.model.modelName)
        .join(", ")}`,
    );
  }

  const untouched = selected.filter(
    (entry) => !keep.includes(entry.model.modelName.toLowerCase()),
  );

  await mongoose.connect(process.env.DB_URL as string);

  console.log("");
  console.log("  collection                     documents   action");
  console.log("  ----------------------------- ----------- ----------------");

  for (const entry of selected) {
    const count = await entry.model.estimatedDocumentCount();
    const willDelete = untouched.includes(entry);

    console.log(
      "  " +
        entry.model.modelName.padEnd(29) +
        " " +
        String(count).padStart(11) +
        "   " +
        (willDelete ? "DELETE" : "keep"),
    );
  }

  if (!CONFIRMED) {
    const total = await Promise.all(
      untouched.map((entry) => entry.model.estimatedDocumentCount()),
    );

    console.log("");
    console.log("  DRY RUN, nothing was deleted.");
    console.log(
      `  ${untouched.length} collection(s) holding ${total.reduce(
        (sum, n) => sum + n,
        0,
      )} document(s) would be removed.`,
    );
    console.log("  re-run with --yes to actually delete.");
    console.log("");

    await mongoose.disconnect();
    process.exit(0);
  }

  console.log("");

  for (const entry of untouched) {
    const result = await entry.model.deleteMany({});

    console.log(`  deleted ${result.deletedCount} from ${entry.model.modelName}`);
  }

  console.log("");
  console.log(`  done, ${untouched.length} collection(s) cleared`);
  console.log("");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("\nFAILED:", error && error.message);
  console.error("");
  process.exit(1);
});
