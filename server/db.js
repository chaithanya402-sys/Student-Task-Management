import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, "studydeck.db");
const db = new sqlite3.Database(dbFile);

// Helper to run query as promise
export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Password hashing & security helpers
export const hashPassword = (password, salt) => {
  return crypto.scryptSync(password, salt, 64).toString("hex");
};

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const logActivity = async (userId, action, entityType, entityId = null, details = "") => {
  try {
    const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString().replace("T", " ").slice(0, 19);
    await run(
      `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, action, entityType, entityId, details, createdAt]
    );
  } catch (err) {
    console.warn("Failed to log activity:", err.message);
  }
};

export const initDb = async () => {
  // Enable foreign keys
  await run("PRAGMA foreign_keys = ON;");

  // 1. Users table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL, -- 'student', 'faculty', 'chairman'
      department TEXT NOT NULL,
      initials TEXT NOT NULL,
      programme TEXT,
      year TEXT,
      institution TEXT DEFAULT 'Apex Institute of Technology',
      password_hash TEXT,
      salt TEXT,
      status TEXT DEFAULT 'active' -- 'active', 'pending_approval'
    );
  `);

  // Migrate users table columns if missing
  const userCols = await all("PRAGMA table_info(users)");
  const colNames = userCols.map(c => c.name);
  if (!colNames.includes("password_hash")) {
    await run("ALTER TABLE users ADD COLUMN password_hash TEXT;");
  }
  if (!colNames.includes("salt")) {
    await run("ALTER TABLE users ADD COLUMN salt TEXT;");
  }
  if (!colNames.includes("status")) {
    await run("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';");
  }

  // Sessions table for authenticated token management
  await run(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Activity logs table
  await run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 2. Courses table
  await run(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      faculty_id TEXT NOT NULL,
      semester TEXT NOT NULL,
      department TEXT NOT NULL,
      FOREIGN KEY (faculty_id) REFERENCES users(id)
    );
  `);

  // 3. Enrollments table
  await run(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrolled_at TEXT NOT NULL,
      UNIQUE(student_id, course_id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );
  `);

  // 4. Assignments table
  await run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      faculty_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      max_points INTEGER DEFAULT 100,
      status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published', 'closed'
      due_date TEXT NOT NULL,
      display_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (faculty_id) REFERENCES users(id)
    );
  `);

  // 5. Submissions table
  await run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      submitted_file TEXT,
      submitted_text TEXT,
      submitted_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'submitted', -- 'submitted', 'late', 'resubmitted', 'graded'
      marks REAL,
      feedback TEXT,
      graded_at TEXT,
      UNIQUE(assignment_id, student_id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (student_id) REFERENCES users(id)
    );
  `);

  // 6. Student Tasks table (both self-created and faculty-assigned)
  await run(`
    CREATE TABLE IF NOT EXISTS student_tasks (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      assignment_id TEXT,
      title TEXT NOT NULL,
      course_code TEXT,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'overdue'
      priority TEXT NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
      is_assigned INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id)
    );
  `);

  // 7. Notifications table
  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      course_code TEXT,
      meta TEXT,
      category TEXT NOT NULL, -- 'Overdue alerts', 'Reminders', 'Feedback', 'Submission'
      type TEXT NOT NULL, -- 'alert', 'reminder', 'feedback', 'submission'
      link TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    );
  `);

  // Check if seeded
  const userCount = await get("SELECT COUNT(*) as count FROM users");
  if (userCount.count === 0) {
    console.log("Seeding initial database...");
    await seedDatabase();
    console.log("Database seeded successfully.");
  }

  // Ensure default password hashes for users with missing password_hash
  const unhashedUsers = await all("SELECT id, email, role FROM users WHERE password_hash IS NULL");
  for (const u of unhashedUsers) {
    const salt = generateSalt();
    let defaultPass = "student123";
    if (u.role === "faculty") defaultPass = "faculty2026";
    else if (u.email === "alex.kumar@college.edu") defaultPass = "studydeck2026";
    else if (u.role === "chairman") defaultPass = "chairman2026";
    const hash = hashPassword(defaultPass, salt);
    await run("UPDATE users SET password_hash = ?, salt = ?, status = 'active' WHERE id = ?", [hash, salt, u.id]);
  }

  // Ensure Chancellor / Admin user exists
  const chancellor = await get("SELECT id FROM users WHERE email = 'admin.chancellor@college.edu'");
  if (!chancellor) {
    const salt = generateSalt();
    const hash = hashPassword("chairman2026", salt);
    await run(
      `INSERT INTO users (id, name, email, role, department, initials, programme, year, password_hash, salt, status)
       VALUES ('user-admin-chancellor', 'Admin Chancellor', 'admin.chancellor@college.edu', 'chairman', 'Academic Administration', 'AC', 'Administration', 'Staff', ?, ?, 'active')`,
      [hash, salt]
    );
  }

  // Migrate student_tasks table columns if missing
  const taskCols = await all("PRAGMA table_info(student_tasks)");
  const taskColNames = taskCols.map(c => c.name);
  if (!taskColNames.includes("category")) {
    await run("ALTER TABLE student_tasks ADD COLUMN category TEXT DEFAULT 'Personal';");
  }
  if (!taskColNames.includes("is_favorite")) {
    await run("ALTER TABLE student_tasks ADD COLUMN is_favorite INTEGER DEFAULT 0;");
  }
  if (!taskColNames.includes("is_archived")) {
    await run("ALTER TABLE student_tasks ADD COLUMN is_archived INTEGER DEFAULT 0;");
  }
  if (!taskColNames.includes("attachment_count")) {
    await run("ALTER TABLE student_tasks ADD COLUMN attachment_count INTEGER DEFAULT 0;");
  }

  // Ensure full 40 student tasks for Alex Kumar if fewer than 10 exist
  const alexTaskCount = await get("SELECT COUNT(*) as count FROM student_tasks WHERE student_id = 'user-student-alex'");
  if (alexTaskCount.count < 10) {
    await seedAllAlexTasks();
  }

  // Enrich Alex Kumar tasks to match StudyDeck reference cards
  await enrichAlexTasks();
};

const seedDatabase = async () => {
  // Seed Users
  // Faculty: Dr. S. Rao
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-faculty-rao', 'Dr. S. Rao', 'dr.rao@college.edu', 'faculty', 'Computer Science', 'SR', NULL, NULL);
  `);

  // Students:
  // Alex Kumar (our primary student)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-alex', 'Alex Kumar', 'alex.kumar@college.edu', 'student', 'Computer Science & Engineering', 'AK', 'B.Tech', '2');
  `);

  // Priya Nair (Student 2 in CS204)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-priya', 'Priya Nair', 'priya.nair@college.edu', 'student', 'Computer Science & Engineering', 'PN', 'B.Tech', '2');
  `);

  // Rahul Verma (Student 3 in CS204)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-rahul', 'Rahul Verma', 'rahul.verma@college.edu', 'student', 'Computer Science & Engineering', 'RV', 'B.Tech', '2');
  `);

  // Sneha Reddy (Student 4 in CS101)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-sneha', 'Sneha Reddy', 'sneha.reddy@college.edu', 'student', 'Computer Science & Engineering', 'SR', 'B.Tech', '2');
  `);

  // Imran Shaikh (Student 5 in CS402)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-imran', 'Imran Shaikh', 'imran.shaikh@college.edu', 'student', 'Computer Science & Engineering', 'IS', 'B.Tech', '4');
  `);

  // Ananya Rao (Student 6 in CS310)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-ananya', 'Ananya Rao', 'ananya.rao@college.edu', 'student', 'Computer Science & Engineering', 'AR', 'B.Tech', '3');
  `);

  // Kiran Das (Student with overdue check-in)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-kiran', 'Kiran Das', 'kiran.das@college.edu', 'student', 'Computer Science & Engineering', 'KD', 'B.Tech', '2');
  `);

  // Meera Joshi (Student with overdue check-in)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-meera', 'Meera Joshi', 'meera.joshi@college.edu', 'student', 'Computer Science & Engineering', 'MJ', 'B.Tech', '2');
  `);

  // Arjun Menon (Student with overdue check-in)
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-arjun', 'Arjun Menon', 'arjun.menon@college.edu', 'student', 'Computer Science & Engineering', 'AM', 'B.Tech', '2');
  `);

  // Non-enrolled student: Sarah Miller
  await run(`
    INSERT INTO users (id, name, email, role, department, initials, programme, year)
    VALUES ('user-student-sarah', 'Sarah Miller', 'sarah.miller@college.edu', 'student', 'Fine Arts & Literature', 'SM', 'B.A.', '1');
  `);

  // Seed Dr. Rao's 4 Courses (Autumn 2026) matching Faculty Screenshots
  await run(`
    INSERT INTO courses (id, code, name, faculty_id, semester, department)
    VALUES 
      ('course-cs101', 'CS101', 'Data Structures', 'user-faculty-rao', 'Autumn 2026', 'Computer Science'),
      ('course-cs204', 'CS204', 'Databases', 'user-faculty-rao', 'Autumn 2026', 'Computer Science'),
      ('course-cs310', 'CS310', 'Web Systems', 'user-faculty-rao', 'Autumn 2026', 'Computer Science'),
      ('course-cs402', 'CS402', 'Machine Learning', 'user-faculty-rao', 'Autumn 2026', 'Computer Science');
  `);

  // Seed Enrollments
  // Alex Kumar is enrolled in CS101, CS204
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-1', 'user-student-alex', 'course-cs101', '2026-08-01');`);
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-2', 'user-student-alex', 'course-cs204', '2026-08-01');`);

  // Priya Nair in CS204
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-3', 'user-student-priya', 'course-cs204', '2026-08-01');`);
  // Rahul Verma in CS204
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-4', 'user-student-rahul', 'course-cs204', '2026-08-01');`);
  // Sneha Reddy in CS101
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-5', 'user-student-sneha', 'course-cs101', '2026-08-01');`);
  // Imran Shaikh in CS402
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-6', 'user-student-imran', 'course-cs402', '2026-08-01');`);
  // Ananya Rao in CS310
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-7', 'user-student-ananya', 'course-cs310', '2026-08-01');`);
  // Kiran Das in CS204
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-8', 'user-student-kiran', 'course-cs204', '2026-08-01');`);
  // Meera Joshi in CS101, CS310
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-9', 'user-student-meera', 'course-cs101', '2026-08-01');`);
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-10', 'user-student-meera', 'course-cs310', '2026-08-01');`);
  // Arjun Menon in CS101
  await run(`INSERT INTO enrollments (id, student_id, course_id, enrolled_at) VALUES ('enr-11', 'user-student-arjun', 'course-cs101', '2026-08-01');`);

  // Seed Published Assignments matching Faculty Screenshots (CS204, CS101, CS310, CS402)
  await run(`
    INSERT INTO assignments (id, course_id, faculty_id, title, description, max_points, status, due_date, display_date, created_at)
    VALUES
      ('asg-ps8', 'course-cs204', 'user-faculty-rao', 'Problem Set 8', 'Relational algebra queries, SQL nested joins, and query optimization.', 100, 'published', '2026-10-18', '18 Oct 2026', '2026-10-08'),
      ('asg-midterm', 'course-cs101', 'user-faculty-rao', 'Midterm Project', 'Implement balanced AVL search trees and benchmark lookups versus Red-Black trees.', 100, 'published', '2026-10-20', '20 Oct 2026', '2026-10-09'),
      ('asg-sprint', 'course-cs310', 'user-faculty-rao', 'Sprint Report', 'Full-stack application architecture report and REST API test coverage statistics.', 100, 'published', '2026-10-22', '22 Oct 2026', '2026-10-10'),
      ('asg-ps7', 'course-cs204', 'user-faculty-rao', 'Problem Set 7', 'Entity-Relationship modeling and B-Tree indexing mechanisms.', 100, 'closed', '2026-10-12', '12 Oct 2026', '2026-10-01'),
      ('asg-capstone', 'course-cs402', 'user-faculty-rao', 'Capstone Draft', 'Initial methodology, baseline CNN loss curves, and validation metrics.', 100, 'closed', '2026-10-10', '10 Oct 2026', '2026-09-28'),
      ('asg-erlab', 'course-cs204', 'user-faculty-rao', 'ER Diagram Lab', 'Hospital management database design schema and normal forms.', 100, 'published', '2026-10-14', '14 Oct 2026', '2026-10-02'),
      ('asg-linkedlist', 'course-cs101', 'user-faculty-rao', 'Linked List Q & A', 'Singly and doubly linked lists traversal complexity proofs.', 50, 'published', '2026-10-14', '14 Oct 2026', '2026-10-03');
  `);

  // Seed Submissions matching Faculty Dashboard Recent Submissions
  await run(`
    INSERT INTO submissions (id, assignment_id, student_id, submitted_file, submitted_text, submitted_at, status, marks, feedback, graded_at)
    VALUES
      ('sub-1', 'asg-ps7', 'user-student-priya', 'priya_ps7.pdf', 'Completed ER modeling and questions 1-10.', '2026-10-14 18:20', 'submitted', NULL, NULL, NULL),
      ('sub-2', 'asg-erlab', 'user-student-rahul', 'rahul_er_diagram.pdf', 'ER diagram submission with cardinality annotations.', '2026-10-14 16:05', 'late', NULL, NULL, NULL),
      ('sub-3', 'asg-linkedlist', 'user-student-sneha', 'sneha_linked_list.pdf', 'Linked list implementation code and test outputs.', '2026-10-14 11:42', 'submitted', NULL, NULL, NULL),
      ('sub-4', 'asg-capstone', 'user-student-imran', 'imran_capstone_v2.pdf', 'Revised baseline training metrics as requested.', '2026-10-13 22:10', 'resubmitted', NULL, NULL, NULL),
      ('sub-5', 'asg-sprint', 'user-student-ananya', 'ananya_api_design.pdf', 'Sprint documentation with OpenAPI swagger definitions.', '2026-10-13 14:30', 'submitted', NULL, NULL, NULL),
      ('sub-6', 'asg-ps7', 'user-student-alex', 'alex_kumar_ps7.pdf', 'Alex Kumar solution to Problem Set 7.', '2026-10-12 17:00', 'graded', 88, 'Good database design. Pay closer attention to composite primary keys.', '2026-10-13 09:30');
  `);

  // Seed Alex Kumar's Student Tasks (matching the 40 student tasks)
  await run(`
    INSERT INTO student_tasks (id, student_id, assignment_id, title, course_code, due_date, status, priority, is_assigned, description)
    VALUES
      ('task-alex-1', 'user-student-alex', 'asg-ps8', 'Problem Set 8: Relational Algebra', 'CS204', '2026-10-18', 'pending', 'high', 1, 'Assigned by Dr. S. Rao for Databases'),
      ('task-alex-2', 'user-student-alex', 'asg-midterm', 'Midterm Project: AVL Search Tree', 'CS101', '2026-10-20', 'pending', 'high', 1, 'Assigned by Dr. S. Rao for Data Structures'),
      ('task-alex-3', 'user-student-alex', NULL, 'Review CS204 Lecture 6 Indexing', 'CS204', '2026-10-17', 'pending', 'medium', 0, 'Personal study on B-Trees'),
      ('task-alex-4', 'user-student-alex', 'asg-ps7', 'Problem Set 7', 'CS204', '2026-10-12', 'completed', 'high', 1, 'Graded: 88/100'),
      ('task-alex-5', 'user-student-alex', NULL, 'Lab 4 Code Cleanup', 'CS101', '2026-10-10', 'overdue', 'medium', 0, 'Format memory cleanup routines');
  `);

  // Seed Notifications
  await run(`
    INSERT INTO notifications (id, recipient_id, title, message, course_code, meta, category, type, link, is_read, created_at)
    VALUES
      ('notif-rao-1', 'user-faculty-rao', 'Priya Nair submitted Problem Set 7', 'New submission in CS204 Databases awaiting review.', 'CS204', 'CS204 · 14 Oct, 18:20', 'Submission', 'submission', '/faculty/submissions', 0, '2026-10-14 18:20'),
      ('notif-rao-2', 'user-faculty-rao', 'Rahul Verma submitted ER Diagram Lab (Late)', 'Submission in CS204 flagged as late submission.', 'CS204', 'CS204 · 14 Oct, 16:05', 'Submission', 'submission', '/faculty/submissions', 0, '2026-10-14 16:05'),
      ('notif-alex-1', 'user-student-alex', 'Problem Set 7 has been graded', 'Dr. S. Rao published your score: 88/100 with feedback.', 'CS204', 'CS204 · scored 88%', 'Feedback', 'feedback', '/assignments', 0, '2026-10-13 09:30'),
      ('notif-alex-2', 'user-student-alex', 'New Assignment: Problem Set 8', 'Published by Dr. S. Rao. Due 18 Oct 2026.', 'CS204', 'CS204 · due 18 Oct', 'Reminders', 'reminder', '/assignments', 0, '2026-10-08 10:00');
  `);
};

export const seedAllAlexTasks = async () => {
  const fullTasks = [
    // 4 Overdue tasks
    { id: "task-1", title: "Poetry Analysis Final Draft", course: "English Lit", dueDate: "2026-10-12", status: "overdue", priority: "high", isAssigned: 1, description: "Complete and format final draft of Romantic poetry essay." },
    { id: "task-2", title: "Review Biology Week 4 Slides", course: "Biology 101", dueDate: "2026-10-11", status: "overdue", priority: "medium", isAssigned: 0, description: "Go over organelle slides and self-test questions." },
    { id: "task-3", title: "Arithmetic Practice Problem Set 6", course: "Arithmetic 2", dueDate: "2026-10-10", status: "overdue", priority: "high", isAssigned: 1, description: "Finish remaining exercises on algebraic systems." },
    { id: "task-4", title: "Library Book Return & History Readings", course: "History 201", dueDate: "2026-10-09", status: "overdue", priority: "low", isAssigned: 0, description: "Return reserve books and photocopy Industrial Revolution chapter." },

    // 12 Pending tasks (5 due within 7 days: Oct 15 - Oct 21)
    { id: "task-5", title: "Complete Cell Structure Lab Report", course: "Biology 101", dueDate: "2026-10-17", status: "pending", priority: "high", isAssigned: 1, description: "Compile microscope measurements and write conclusion." },
    { id: "task-6", title: "Solve Problem Set 7.c Exercises", course: "Arithmetic 2", dueDate: "2026-10-18", status: "pending", priority: "high", isAssigned: 1, description: "Draft solutions for problems 1 to 15." },
    { id: "task-7", title: "Revise Industrial Revolution Essay", course: "History 201", dueDate: "2026-10-20", status: "pending", priority: "high", isAssigned: 1, description: "Address instructor feedback regarding secondary sources." },
    { id: "task-8", title: "Read Chapter 5: Enzyme Kinetics", course: "Biology 101", dueDate: "2026-10-16", status: "pending", priority: "medium", isAssigned: 0, description: "Highlight key concepts on competitive inhibition." },
    { id: "task-9", title: "Set Up Chemistry Lab Notebook", course: "Chemistry 101", dueDate: "2026-10-19", status: "pending", priority: "medium", isAssigned: 0, description: "Pre-lab writeup for titration experiment." },
    { id: "task-10", title: "Chemistry Titration Worksheet", course: "Chemistry 101", dueDate: "2026-10-22", status: "pending", priority: "medium", isAssigned: 1, description: "Complete pre-lab calculations and titration curves." },
    { id: "task-11", title: "Arithmetic Quiz Prep Set", course: "Arithmetic 2", dueDate: "2026-10-24", status: "pending", priority: "medium", isAssigned: 1, description: "Work through practice quiz set for exam 2." },
    { id: "task-12", title: "Draft Outline for Midterm Project", course: "CS101", dueDate: "2026-10-26", status: "pending", priority: "high", isAssigned: 0, description: "Outline system architecture and UI components." },
    { id: "task-13", title: "Review English Lit Discussion Prompts", course: "English Lit", dueDate: "2026-10-28", status: "pending", priority: "low", isAssigned: 0, description: "Prepare talking points for seminar discussion." },
    { id: "task-14", title: "Read History 201 Primary Sources", course: "History 201", dueDate: "2026-10-29", status: "pending", priority: "medium", isAssigned: 0, description: "Examine parliamentary testimony excerpts." },
    { id: "task-15", title: "Organize Digital Study Notes", course: "General", dueDate: "2026-10-30", status: "pending", priority: "low", isAssigned: 0, description: "Consolidate week 1-6 lecture summaries into folder." },
    { id: "task-16", title: "Schedule Peer Study Group", course: "Arithmetic 2", dueDate: "2026-10-31", status: "pending", priority: "low", isAssigned: 0, description: "Book study room in central library for group revision." },

    // 24 Completed tasks
    { id: "task-17", title: "Genetics Problem Set", course: "Biology 101", dueDate: "2026-10-05", status: "completed", priority: "high", isAssigned: 1, description: "Pedigree charts and Punnett squares." },
    { id: "task-18", title: "Renaissance Art Presentation", course: "History 201", dueDate: "2026-09-28", status: "completed", priority: "medium", isAssigned: 1, description: "Slide deck on Florentine humanism." },
    { id: "task-19", title: "Photosynthesis Experiment Log", course: "Biology 101", dueDate: "2026-09-20", status: "completed", priority: "high", isAssigned: 1, description: "Spectrophotometer readings." },
    { id: "task-20", title: "Linear Systems Diagnostic", course: "Arithmetic 2", dueDate: "2026-09-15", status: "completed", priority: "high", isAssigned: 1, description: "Solving 3-variable systems." },
    { id: "task-21", title: "Hamlet Close Reading", course: "English Lit", dueDate: "2026-09-10", status: "completed", priority: "medium", isAssigned: 1, description: "Commentary on Act 3 Scene 1." },
    { id: "task-22", title: "Periodic Trends Data Sheet", course: "Chemistry 101", dueDate: "2026-09-05", status: "completed", priority: "medium", isAssigned: 1, description: "Atomic radii and electronegativity." },
    { id: "task-23", title: "Mitosis Sketchbook", course: "Biology 101", dueDate: "2026-08-30", status: "completed", priority: "medium", isAssigned: 0, description: "Root tip cell phase sketches." },
    { id: "task-24", title: "Vector Geometry Assignment", course: "Arithmetic 2", dueDate: "2026-08-25", status: "completed", priority: "high", isAssigned: 0, description: "Cross products and 3D planes." },
    { id: "task-25", title: "Enlightenment Matrix", course: "History 201", dueDate: "2026-08-20", status: "completed", priority: "medium", isAssigned: 0, description: "Philosophes comparison matrix." },
    { id: "task-26", title: "Victorian Era Poetry Comparison", course: "English Lit", dueDate: "2026-08-15", status: "completed", priority: "low", isAssigned: 0, description: "Tennyson vs Browning analysis." },
    { id: "task-27", title: "Stoichiometry Practice Set", course: "Chemistry 101", dueDate: "2026-08-10", status: "completed", priority: "high", isAssigned: 0, description: "Limiting reagent calculations." },
    { id: "task-28", title: "Cellular Respiration Quiz Review", course: "Biology 101", dueDate: "2026-08-05", status: "completed", priority: "medium", isAssigned: 0, description: "Krebs cycle pathway review." },
    { id: "task-29", title: "Trigonometric Identities Worksheet", course: "Arithmetic 2", dueDate: "2026-08-01", status: "completed", priority: "medium", isAssigned: 0, description: "Double-angle formulas." },
    { id: "task-30", title: "Feudal Systems Analysis", course: "History 201", dueDate: "2026-07-25", status: "completed", priority: "medium", isAssigned: 0, description: "Manorialism economics." },
    { id: "task-31", title: "Syllabus Review and Course Registration", course: "General", dueDate: "2026-07-20", status: "completed", priority: "low", isAssigned: 0, description: "Register for semester modules." },
    { id: "task-32", title: "Campus ID Card Renewal", course: "General", dueDate: "2026-07-18", status: "completed", priority: "low", isAssigned: 0, description: "Student services check-in." },
    { id: "task-33", title: "Download Textbook PDF Chapters", course: "Biology 101", dueDate: "2026-07-15", status: "completed", priority: "low", isAssigned: 0, description: "Download required readings." },
    { id: "task-34", title: "Calculator Battery Replacement", course: "Arithmetic 2", dueDate: "2026-07-12", status: "completed", priority: "low", isAssigned: 0, description: "Scientific calculator readiness." },
    { id: "task-35", title: "Set Up Lab Safety Goggles", course: "Chemistry 101", dueDate: "2026-07-10", status: "completed", priority: "low", isAssigned: 0, description: "Verify chemistry lab PPE kit." },
    { id: "task-36", title: "Join Discord Study Group", course: "General", dueDate: "2026-07-08", status: "completed", priority: "low", isAssigned: 0, description: "Coordinate with course peers." },
    { id: "task-37", title: "Install Graphing Software", course: "Arithmetic 2", dueDate: "2026-07-05", status: "completed", priority: "low", isAssigned: 0, description: "Setup plotting utility." },
    { id: "task-38", title: "History Timeline Flashcards", course: "History 201", dueDate: "2026-07-03", status: "completed", priority: "medium", isAssigned: 0, description: "Chronological flashcards." },
    { id: "task-39", title: "Grammar & Citation Handbook Reading", course: "English Lit", dueDate: "2026-07-02", status: "completed", priority: "low", isAssigned: 0, description: "MLA citation format guide." },
    { id: "task-40", title: "Semester Goal Setting Sheet", course: "General", dueDate: "2026-07-01", status: "completed", priority: "low", isAssigned: 0, description: "Set GPA and target milestones." }
  ];

  for (const t of fullTasks) {
    await run(
      `INSERT OR IGNORE INTO student_tasks (id, student_id, assignment_id, title, course_code, due_date, status, priority, is_assigned, description)
       VALUES (?, 'user-student-alex', NULL, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, t.title, t.course, t.dueDate, t.status, t.priority, t.isAssigned, t.description]
    );
  }
};

export const enrichAlexTasks = async () => {
  const keyCards = [
    {
      id: "task-showcase-1",
      title: "Complete Cell Structure Lab Report",
      course_code: "CS101 · Data Structures",
      due_date: "2026-10-17",
      status: "pending",
      priority: "high",
      category: "Personal",
      is_favorite: 0,
      attachment_count: 2,
      description: "Write the lab report and include all observations and results."
    },
    {
      id: "task-showcase-2",
      title: "Problem Set 8: Relational Algebra",
      course_code: "CS204 · Databases",
      due_date: "2026-10-18",
      status: "pending",
      priority: "high",
      category: "Assignment",
      is_favorite: 0,
      attachment_count: 1,
      description: "Solve problems 1-5 and upload solutions."
    },
    {
      id: "task-showcase-3",
      title: "Solve Problem Set 7: Exercises",
      course_code: "CS204 · Databases",
      due_date: "2026-10-18",
      status: "pending",
      priority: "medium",
      category: "Assignment",
      is_favorite: 0,
      attachment_count: 0,
      description: "Complete all exercise questions."
    },
    {
      id: "task-showcase-4",
      title: "Read Chapter 5: Enzyme Kinetics",
      course_code: "BIOLOGY 101 · Biology",
      due_date: "2026-10-20",
      status: "pending",
      priority: "medium",
      category: "Personal",
      is_favorite: 0,
      attachment_count: 0,
      description: "Read and make short notes."
    },
    {
      id: "task-showcase-5",
      title: "Build A Caching System",
      course_code: "CS101 · Data Structures",
      due_date: "2026-10-21",
      status: "in_progress",
      priority: "medium",
      category: "Project",
      is_favorite: 1,
      attachment_count: 3,
      description: "Implement Redis caching for the API."
    },
    {
      id: "task-showcase-6",
      title: "Data Structures Queues and Stacks",
      course_code: "CS101 · Data Structures",
      due_date: "2026-11-03",
      status: "in_progress",
      priority: "low",
      category: "Assignment",
      is_favorite: 0,
      attachment_count: 1,
      description: "Implement queue and stack operations."
    },
    {
      id: "task-showcase-7",
      title: "Design UI for Student Portal",
      course_code: "IT205 · Web Technologies",
      due_date: "2026-11-05",
      status: "in_progress",
      priority: "medium",
      category: "Project",
      is_favorite: 0,
      attachment_count: 2,
      description: "Create responsive UI components."
    },
    {
      id: "task-showcase-8",
      title: "Prepare Midterm Questions",
      course_code: "CS101 · Data Structures",
      due_date: "2026-11-08",
      status: "in_progress",
      priority: "high",
      category: "Personal",
      is_favorite: 0,
      attachment_count: 0,
      description: "Compile previous year questions."
    },
    {
      id: "task-showcase-9",
      title: "Lab 4 Code Cleanup",
      course_code: "CS204 · Databases",
      due_date: "2026-10-10",
      status: "overdue",
      priority: "high",
      category: "Assignment",
      is_favorite: 0,
      attachment_count: 2,
      description: "Fix bugs and clean up code."
    },
    {
      id: "task-showcase-10",
      title: "Arithmetic 2 Problem Set 6",
      course_code: "CS101 · Data Structures",
      due_date: "2026-10-11",
      status: "overdue",
      priority: "medium",
      category: "Assignment",
      is_favorite: 0,
      attachment_count: 1,
      description: "Complete remaining questions."
    },
    {
      id: "task-showcase-11",
      title: "Review Biology Week 4 Slides",
      course_code: "BIOLOGY 101 · Biology",
      due_date: "2026-10-12",
      status: "overdue",
      priority: "high",
      category: "Personal",
      is_favorite: 1,
      attachment_count: 0,
      description: "Go through slides and make notes."
    },
    {
      id: "task-showcase-12",
      title: "History Timeline Flashcards",
      course_code: "HISTORY 201 · History",
      due_date: "2026-10-13",
      status: "overdue",
      priority: "medium",
      category: "Study",
      is_favorite: 0,
      attachment_count: 1,
      description: "Complete flashcards for chapter 3."
    },
    {
      id: "task-showcase-13",
      title: "Semester Goal Setting Sheet",
      course_code: "General",
      due_date: "2026-10-07",
      status: "completed",
      priority: "low",
      category: "Personal",
      is_favorite: 0,
      attachment_count: 0,
      description: "Set GPA and target milestones."
    },
    {
      id: "task-showcase-14",
      title: "Grammar & Citation Handbook Reading",
      course_code: "English Lit",
      due_date: "2026-10-02",
      status: "completed",
      priority: "low",
      category: "Study",
      is_favorite: 0,
      attachment_count: 1,
      description: "MLA citation format guide."
    },
    {
      id: "task-showcase-15",
      title: "Arithmetic 2 Practice Set 1",
      course_code: "Arithmetic 2",
      due_date: "2026-10-01",
      status: "completed",
      priority: "low",
      category: "Assignment",
      is_favorite: 0,
      attachment_count: 0,
      description: "Solve first 10 problems."
    }
  ];

  for (const card of keyCards) {
    const existing = await get(
      "SELECT id FROM student_tasks WHERE student_id = 'user-student-alex' AND title = ?",
      [card.title]
    );
    if (existing) {
      await run(
        `UPDATE student_tasks 
         SET course_code = ?, due_date = ?, status = ?, priority = ?, category = ?, is_favorite = ?, attachment_count = ?, description = ?
         WHERE id = ?`,
        [card.course_code, card.due_date, card.status, card.priority, card.category, card.is_favorite, card.attachment_count, card.description, existing.id]
      );
    } else {
      await run(
        `INSERT INTO student_tasks (id, student_id, assignment_id, title, course_code, due_date, status, priority, is_assigned, description, category, is_favorite, attachment_count)
         VALUES (?, 'user-student-alex', NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [card.id, card.title, card.course_code, card.due_date, card.status, card.priority, card.category === 'Assignment' ? 1 : 0, card.description, card.category, card.is_favorite, card.attachment_count]
      );
    }
  }

  // Ensure remaining tasks have realistic categories
  await run(`
    UPDATE student_tasks
    SET category = CASE 
      WHEN is_assigned = 1 THEN 'Assignment'
      WHEN title LIKE '%Project%' OR title LIKE '%System%' OR title LIKE '%UI%' THEN 'Project'
      WHEN title LIKE '%Read%' OR title LIKE '%Study%' OR title LIKE '%Handbook%' OR title LIKE '%Flashcards%' THEN 'Study'
      ELSE 'Personal'
    END
    WHERE category IS NULL OR category = 'Personal' AND is_assigned = 1;
  `);

  await run(`
    UPDATE student_tasks
    SET attachment_count = CASE
      WHEN is_assigned = 1 THEN 1
      ELSE 0
    END
    WHERE attachment_count IS NULL;
  `);
};

export default db;
