import { spawn, execSync, SpawnOptions } from "child_process";
import os from "os";
import path from "path";
import fs from "fs";

/**
 * Check if MongoDB is already running
 */
const isMongoRunning = (): boolean => {
  try {
    const platform = os.platform();
    const cmd =
      platform === "win32" ? "tasklist | findstr mongod" : "pgrep mongod";

    const output = execSync(cmd);
    return !!output.toString().trim();
  } catch {
    return false;
  }
};

/**
 * Start MongoDB with a default db path if not already running
 */
const startMongo = (): void => {
  if (isMongoRunning()) {
    console.log("✅ MongoDB is already running.");
    return;
  }

  console.log("🟡 MongoDB not running. Attempting to start...");

  const dbPath = path.join(os.homedir(), "data", "db");

  // Ensure the DB directory exists
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
    // console.log(`📁 Created MongoDB data directory at: ${dbPath}`);
  }

  // Use valid stdio options for spawn
  const options: SpawnOptions = {
    detached: true,
    stdio: ["ignore", "ignore", "ignore"], // silence output
  };

  try {
    const mongoProcess = spawn("mongod", [`--dbpath=${dbPath}`], options);
    mongoProcess.unref();
    console.log("✅ MongoDB process started successfully.");
  } catch (err) {
    console.error("❌ Failed to start MongoDB:", err);
  }
};

export default startMongo;
