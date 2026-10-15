import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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
      institution TEXT DEFAULT 'Apex Institute of Technology'
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

export default db;
