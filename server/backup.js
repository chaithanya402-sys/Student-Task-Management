import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "studydeck.db");
const backupDir = path.join(__dirname, "backups");

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Creates a timestamped backup of the SQLite database.
 * @returns {string} The path to the created backup file.
 */
export const createBackup = () => {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found at: ${dbPath}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFileName = `studydeck_backup_${timestamp}.db`;
  const targetPath = path.join(backupDir, backupFileName);

  fs.copyFileSync(dbPath, targetPath);
  const stats = fs.statSync(targetPath);

  return {
    success: true,
    backupFile: backupFileName,
    backupPath: targetPath,
    sizeBytes: stats.size,
    timestamp: new Date().toISOString()
  };
};

/**
 * Lists all available backup files.
 * @returns {Array<Object>} List of backups with metadata.
 */
export const listBackups = () => {
  if (!fs.existsSync(backupDir)) return [];

  const files = fs.readdirSync(backupDir).filter((f) => f.endsWith(".db"));
  return files.map((fileName) => {
    const fullPath = path.join(backupDir, fileName);
    const stats = fs.statSync(fullPath);
    return {
      fileName,
      path: fullPath,
      sizeBytes: stats.size,
      created: stats.birthtime.toISOString()
    };
  });
};

/**
 * Restores the database from a specified backup file.
 * Automatically creates a pre-restore safety copy first.
 * @param {string} backupFilePath 
 */
export const restoreBackup = (backupFilePath) => {
  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file does not exist: ${backupFilePath}`);
  }

  // Verify backup is not 0 bytes
  const backupStats = fs.statSync(backupFilePath);
  if (backupStats.size === 0) {
    throw new Error("Cannot restore from an empty backup file.");
  }

  // Pre-restore safety snapshot
  const preRestorePath = path.join(__dirname, "studydeck.pre_restore.db");
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, preRestorePath);
  }

  // Restore
  fs.copyFileSync(backupFilePath, dbPath);

  return {
    success: true,
    restoredFrom: backupFilePath,
    restoredSizeBytes: backupStats.size,
    preRestoreSnapshot: preRestorePath
  };
};
