import { createBackup, listBackups, restoreBackup } from "./backup.js";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "studydeck.db");

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
};

async function testBackupRestore() {
  console.log("=== STARTING BACKUP & RESTORE VERIFICATION TEST ===");

  // 1. Create a backup
  console.log("\n1. Testing backup creation...");
  const backupResult = createBackup();
  assert(backupResult.success === true, "Backup created successfully");
  assert(backupResult.sizeBytes > 0, `Backup file size is positive (${backupResult.sizeBytes} bytes)`);

  // 2. List backups
  console.log("\n2. Testing backup listing...");
  const backups = listBackups();
  assert(backups.length > 0, `Found ${backups.length} backup file(s) in backups directory`);
  const found = backups.find((b) => b.fileName === backupResult.backupFile);
  assert(Boolean(found), `Newly created backup ${backupResult.backupFile} is listed in backups`);

  // 3. Test restore procedure
  console.log("\n3. Testing restore procedure...");
  const restoreResult = restoreBackup(backupResult.backupPath);
  assert(restoreResult.success === true, "Database restored successfully from backup");
  assert(Boolean(restoreResult.preRestoreSnapshot), "Pre-restore safety snapshot created");

  // 4. Verify SQLite database readability after restore
  console.log("\n4. Verifying database readability and table counts after restore...");
  const db = new sqlite3.Database(dbPath);

  await new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) return reject(err);
      const tableNames = tables.map((t) => t.name);
      assert(tableNames.includes("users"), "users table exists after restore");
      assert(tableNames.includes("student_tasks"), "student_tasks table exists after restore");
      assert(tableNames.includes("assignments"), "assignments table exists after restore");
      assert(tableNames.includes("submissions"), "submissions table exists after restore");

      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) return reject(err);
        assert(row.count >= 10, `Users preserved in restored database (${row.count} users)`);
        db.close(resolve);
      });
    });
  });

  console.log("\n🎉 ALL BACKUP & RESTORE TESTS PASSED SUCCESSFULLY!");
}

testBackupRestore().catch((err) => {
  console.error("Backup/Restore test error:", err);
  process.exit(1);
});
