import mongoose from "mongoose";
import fs from "fs";
import path from "path";

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
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
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

// Allow CLI argument override or fallback
const cliUri = process.argv[2];
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

async function checkConnection() {
  console.log("==========================================");
  console.log("  BUILD26 MongoDB Connectivity Checker    ");
  console.log("==========================================");
  console.log(`Target URI: ${maskUri(uri)}`);
  console.log("Connecting (timeout: 6000ms)...");

  const startTime = Date.now();

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });

    const elapsed = Date.now() - startTime;
    const db = mongoose.connection.db;

    // Ping test
    const pingResult = await db.admin().ping();

    console.log("\n[SUCCESS] MongoDB Connected Successfully! ✅");
    console.log(`- Response Time: ${elapsed}ms`);
    console.log(`- Database Name: ${db.databaseName}`);
    console.log(`- Connection State: ${mongoose.STATES[mongoose.connection.readyState]}`);
    console.log(`- Host: ${mongoose.connection.host || "Atlas / Remote Cluster"}`);
    console.log(`- Ping Status: ok=${pingResult.ok}`);

    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\nFound ${collections.length} Collection(s):`);
    if (collections.length === 0) {
      console.log("  (Database is currently empty. Run `npm run seed` to populate it.)");
    } else {
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  • ${col.name.padEnd(20)} : ${count} document(s)`);
      }
    }

    console.log("\n==========================================");
    console.log("MongoDB is healthy and ready for BUILD26.");
    console.log("==========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error("\n[FAILED] MongoDB Connection Error ❌");
    console.error(`- Elapsed Time: ${elapsed}ms`);
    console.error(`- Error Name: ${err.name}`);
    console.error(`- Error Message: ${err.message}`);

    console.error("\nDiagnostic Analysis & Fixes:");

    if (err.message && err.message.includes("querySrv")) {
      console.error("• DNS SRV Resolution Issue (Atlas):");
      console.error("  Your local network / ISP DNS could not resolve the Atlas `mongodb+srv://` record.");
      console.error("  Fix 1: Change your Windows DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1).");
      console.error("  Fix 2: Ensure your cluster name is spelled correctly and the cluster is not paused in Atlas.");
      console.error("  Fix 3: Test local Docker database instead by running:");
      console.error("         npm run db:check mongodb://127.0.0.1:27017/build26");
    } else if (err.name === "MongooseServerSelectionError") {
      console.error("• Server Selection / Network Access Issue:");
      console.error("  1. If using MongoDB Atlas:");
      console.error("     - Go to MongoDB Atlas -> Network Access.");
      console.error("     - Add your current IP address (or 0.0.0.0/0 for global access during testing).");
      console.error("     - Verify username and password in MONGODB_URI.");
      console.error("  2. If using Docker / Local MongoDB:");
      console.error("     - Ensure Docker container is running: `docker compose up -d`");
      console.error("     - Target host: `mongodb://127.0.0.1:27017/build26`");
    } else {
      console.error("• Check your MONGODB_URI string formatting and credentials.");
    }

    console.error("==========================================\n");
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

checkConnection();
