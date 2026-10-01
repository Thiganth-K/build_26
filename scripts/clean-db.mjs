import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import readline from "readline";

// 1. Auto-load .env.local or .env if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            // remove surrounding quotes
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {
        // ignore read error
      }
    }
  }
}

loadEnv();

// Parse CLI flags and arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: node scripts/clean-db.mjs [options] [mongodb-uri]
   or: npm run db:clean [-- options]

Options:
  --force, -f, -y, --yes    Bypass confirmation prompt
  --drop                    Drop collections completely (instead of deleteMany)
  --drop-db                 Drop entire database
  --uri=<uri>               Specify MongoDB connection URI
  --help, -h                Show this help message

Examples:
  npm run db:clean
  npm run db:clean -- --force
  npm run db:clean -- --drop
  node scripts/clean-db.mjs mongodb://127.0.0.1:27017/build26 --force
`);
  process.exit(0);
}

const isForce =
  args.includes("--force") ||
  args.includes("-f") ||
  args.includes("-y") ||
  args.includes("--yes");
const isDropCollections = args.includes("--drop");
const isDropDatabase = args.includes("--drop-db");

let cliUri = null;
for (const arg of args) {
  if (arg.startsWith("--uri=")) {
    cliUri = arg.slice(6);
  } else if (!arg.startsWith("-")) {
    cliUri = arg;
  }
}

const uri = cliUri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/build26";

function maskUri(rawUri) {
  try {
    const url = new URL(rawUri);
    if (url.password) url.password = "********";
    if (url.username) url.username = "***";
    return url.toString();
  } catch {
    return rawUri.replace(/\/\/[^@]+@/, "//***:***@");
  }
}

async function askConfirmation(promptMessage) {
  if (isForce || !process.stdin.isTTY) {
    return true;
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(promptMessage, (answer) => {
      rl.close();
      const val = answer.trim().toLowerCase();
      resolve(val === "y" || val === "yes");
    });
  });
}

async function cleanDatabase() {
  console.log("==========================================");
  console.log("       BUILD26 Database Cleaner           ");
  console.log("==========================================");
  console.log(`Target URI: ${maskUri(uri)}`);
  console.log(
    `Mode:       ${
      isDropDatabase
        ? "Drop entire database (--drop-db)"
        : isDropCollections
        ? "Drop collections (--drop)"
        : "Delete all documents (preserves indexes)"
    }`
  );

  const confirmed = await askConfirmation(
    "\n⚠️  WARNING: This will permanently ERASE data in this database!\nAre you sure you want to proceed? (y/N): "
  );

  if (!confirmed) {
    console.log("\n[ABORTED] Operation cancelled by user. No data was modified.\n");
    process.exit(0);
  }

  console.log("\nConnecting to MongoDB...");
  const startTime = Date.now();

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });

    const elapsed = Date.now() - startTime;
    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    console.log(`[CONNECTED] Connected to "${dbName}" in ${elapsed}ms ✅\n`);

    if (isDropDatabase) {
      console.log(`Dropping database "${dbName}"...`);
      await db.dropDatabase();
      console.log(`✓ Database "${dbName}" dropped completely.`);
    } else {
      const collections = await db.listCollections().toArray();
      const userCollections = collections.filter(
        (c) => !c.name.startsWith("system.")
      );

      if (userCollections.length === 0) {
        console.log("ℹ️  Database is already empty. No collections found.");
      } else {
        console.log(`Found ${userCollections.length} collection(s) to clean:`);
        let totalDocsRemoved = 0;

        for (const col of userCollections) {
          const collection = db.collection(col.name);
          const count = await collection.countDocuments();

          if (isDropCollections) {
            await collection.drop();
            console.log(
              `  • Dropped collection "${col.name}" (${count} document(s) removed)`
            );
          } else {
            const res = await collection.deleteMany({});
            console.log(
              `  • Emptied collection "${col.name}" (${res.deletedCount} document(s) deleted)`
            );
          }
          totalDocsRemoved += count;
        }

        console.log(`\n------------------------------------------`);
        console.log(`Total Collections Processed : ${userCollections.length}`);
        console.log(`Total Documents Erased      : ${totalDocsRemoved}`);
        console.log(`------------------------------------------`);
      }
    }

    console.log("\n==========================================");
    console.log("Database clean completed successfully! ✅");
    console.log("==========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error("\n[FAILED] Database Clean Error ❌");
    console.error(`- Elapsed Time: ${elapsed}ms`);
    console.error(`- Error Name: ${err.name}`);
    console.error(`- Error Message: ${err.message}`);

    console.error("\nDiagnostic Tips:");
    if (err.message && err.message.includes("querySrv")) {
      console.error("• DNS SRV Resolution Issue (Atlas):");
      console.error("  Change DNS to 8.8.8.8 or verify connection to your Atlas cluster.");
      console.error("  Or clean a local/Docker database by running:");
      console.error("    npm run db:clean -- mongodb://127.0.0.1:27017/build26");
    } else if (err.name === "MongooseServerSelectionError") {
      console.error("• Server Selection / Network Access Issue:");
      console.error("  1. If Atlas: Ensure your IP is whitelisted under Network Access in Atlas.");
      console.error("  2. If Local: Ensure MongoDB or Docker is active (`docker compose up -d`).");
    }

    console.error("==========================================\n");
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

cleanDatabase();
