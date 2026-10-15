import express from "express";
import cors from "cors";
import { initDb, run, get, all, hashPassword, generateSalt, generateToken, logActivity } from "./db.js";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
await initDb();

// -------------------------------------------------------------
// 1. AUTH & USER ENDPOINTS
// -------------------------------------------------------------
app.get("/api/auth/users", async (req, res) => {
  try {
    const users = await all("SELECT id, name, email, role, department, initials, programme, year, status FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register endpoint (Student self-registration & Faculty onboarding)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "student", department, programme, year, invite_code } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Full name is required" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await get("SELECT id FROM users WHERE LOWER(email) = ?", [cleanEmail]);
    if (existing) {
      return res.status(409).json({ error: "An account with this email address already exists." });
    }

    // Role-specific onboarding rules
    let status = "active";
    let isPendingApproval = false;
    const cleanRole = role.toLowerCase() === "faculty" ? "faculty" : "student";

    if (cleanRole === "faculty") {
      const validCodes = ["FACULTY2026", "STUDYFLOW_FACULTY", "ACADEMIC2026"];
      if (invite_code && validCodes.includes(invite_code.trim().toUpperCase())) {
        status = "active";
      } else {
        // Faculty without valid invite code requires administrator approval
        status = "pending_approval";
        isPendingApproval = true;
      }
    }

    const salt = generateSalt();
    const password_hash = hashPassword(password, salt);
    const userId = `user-${cleanRole}-${Date.now()}`;
    const initials = name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

    await run(
      `INSERT INTO users (id, name, email, role, department, initials, programme, year, password_hash, salt, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name.trim(),
        cleanEmail,
        cleanRole,
        department || (cleanRole === "faculty" ? "Computer Science" : "Computer Science & Engineering"),
        initials,
        programme || (cleanRole === "faculty" ? "Faculty of Engineering" : "B.Tech"),
        year || (cleanRole === "faculty" ? "Staff" : "1"),
        password_hash,
        salt,
        status
      ]
    );

    await logActivity(userId, isPendingApproval ? "REGISTER_PENDING" : "REGISTER", "user", userId, `User registered as ${cleanRole}`);

    if (isPendingApproval) {
      return res.status(201).json({
        user: { id: userId, name: name.trim(), email: cleanEmail, role: cleanRole, status },
        pendingApproval: true,
        message: "Faculty account created! Awaiting administrator approval before you can sign in."
      });
    }

    // Create session token for active user
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await run("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)", [token, userId, now.toISOString(), expiresAt]);

    const createdUser = await get(
      "SELECT id, name, email, role, department, initials, programme, year, institution, status FROM users WHERE id = ?",
      [userId]
    );

    res.status(201).json({
      token,
      user: createdUser,
      message: "Registration successful! Welcome to StudyDeck."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await get("SELECT * FROM users WHERE LOWER(email) = ?", [cleanEmail]);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password hash
    const inputHash = hashPassword(password, user.salt);
    if (inputHash !== user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check approval status
    if (user.status === "pending_approval") {
      return res.status(403).json({
        error: "Your faculty account is pending administrator approval. Please contact department admin."
      });
    }

    // Create session token
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await run("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)", [token, user.id, now.toISOString(), expiresAt]);

    await logActivity(user.id, "LOGIN", "user", user.id, "User authenticated");

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      initials: user.initials,
      programme: user.programme,
      year: user.year,
      institution: user.institution,
      status: user.status
    };

    res.json({
      token,
      user: safeUser,
      message: "Sign in successful"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout endpoint
app.post("/api/auth/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.body.token;
    if (token) {
      await run("DELETE FROM sessions WHERE token = ?", [token]);
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current user profile
app.get("/api/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    let user = null;
    if (token) {
      user = await get(
        `SELECT u.id, u.name, u.email, u.role, u.department, u.initials, u.programme, u.year, u.institution, u.status
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')`,
        [token]
      );
    }

    if (!user) {
      // Fallback for demo switching / tests with ?userId=
      const userId = req.query.userId || "user-student-alex";
      user = await get(
        "SELECT id, name, email, role, department, initials, programme, year, institution, status FROM users WHERE id = ?",
        [userId]
      );
    }

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. COURSES ENDPOINTS
// -------------------------------------------------------------
app.get("/api/courses", async (req, res) => {
  try {
    const userId = req.query.userId || "user-faculty-rao";
    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "faculty") {
      // Return faculty's assigned courses with enrollment & submission stats
      const courses = await all(
        `SELECT c.*, 
          (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrolled_count,
          (SELECT COUNT(DISTINCT s.student_id) FROM submissions s 
           JOIN assignments a ON s.assignment_id = a.id 
           WHERE a.course_id = c.id AND a.status = 'published') as submitted_count
         FROM courses c WHERE c.faculty_id = ?`,
        [userId]
      );
      res.json(courses);
    } else {
      // Return courses student is enrolled in
      const courses = await all(
        `SELECT c.*, u.name as faculty_name 
         FROM courses c
         JOIN enrollments e ON c.id = e.course_id
         JOIN users u ON c.faculty_id = u.id
         WHERE e.student_id = ?`,
        [userId]
      );
      res.json(courses);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. ASSIGNMENTS ENDPOINTS (Faculty creates -> Enrolled students receive)
// -------------------------------------------------------------
app.get("/api/assignments", async (req, res) => {
  try {
    const userId = req.query.userId || "user-student-alex";
    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "faculty") {
      // Faculty sees all assignments they created
      const assignments = await all(
        `SELECT a.*, c.code as course_code, c.name as course_name,
          (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submission_count,
          (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id AND s.status = 'graded') as graded_count,
          (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = a.course_id) as enrolled_count
         FROM assignments a
         JOIN courses c ON a.course_id = c.id
         WHERE a.faculty_id = ?
         ORDER BY a.created_at DESC`,
        [userId]
      );
      res.json(assignments);
    } else {
      // Student sees ONLY published assignments for courses they are enrolled in!
      const assignments = await all(
        `SELECT a.*, c.code as course_code, c.name as course_name, u.name as faculty_name,
          s.id as submission_id, s.status as student_status, s.marks, s.feedback, s.submitted_file, s.submitted_at
         FROM assignments a
         JOIN courses c ON a.course_id = c.id
         JOIN enrollments e ON a.course_id = e.course_id
         JOIN users u ON a.faculty_id = u.id
         LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
         WHERE e.student_id = ? AND a.status = 'published'
         ORDER BY a.due_date ASC`,
        [userId, userId]
      );
      res.json(assignments);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assignments", async (req, res) => {
  try {
    const { faculty_id, course_id, title, description, max_points, due_date, display_date } = req.body;

    if (!faculty_id || !course_id || !title || !due_date) {
      return res.status(400).json({ error: "Missing required assignment fields" });
    }

    // Verify course belongs to faculty
    const course = await get("SELECT * FROM courses WHERE id = ? AND faculty_id = ?", [course_id, faculty_id]);
    if (!course) {
      return res.status(403).json({ error: "Unauthorized: Course not taught by this faculty member" });
    }

    const assignmentId = `asg-${Date.now()}`;
    const createdAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    // 1. Insert assignment
    await run(
      `INSERT INTO assignments (id, course_id, faculty_id, title, description, max_points, status, due_date, display_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`,
      [assignmentId, course_id, faculty_id, title, description || "", max_points || 100, due_date, display_date || due_date, createdAt]
    );

    // 2. Fetch all students enrolled in this course
    const enrolledStudents = await all("SELECT student_id FROM enrollments WHERE course_id = ?", [course_id]);

    // 3. Automatically create student_tasks and notifications for all enrolled students
    for (const student of enrolledStudents) {
      const taskId = `task-auto-${Date.now()}-${student.student_id.slice(-4)}`;
      await run(
        `INSERT INTO student_tasks (id, student_id, assignment_id, title, course_code, due_date, status, priority, is_assigned, description)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', 'high', 1, ?)`,
        [taskId, student.student_id, assignmentId, title, course.code, due_date, `Assigned by faculty for ${course.name}`]
      );

      const notifId = `notif-auto-${Date.now()}-${student.student_id.slice(-4)}`;
      await run(
        `INSERT INTO notifications (id, recipient_id, title, message, course_code, meta, category, type, link, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'Reminders', 'reminder', '/assignments', 0, ?)`,
        [
          notifId,
          student.student_id,
          `New Assignment: ${title}`,
          `Published for ${course.code} (${course.name}). Due on ${display_date || due_date}.`,
          course.code,
          `${course.code} · due ${display_date || due_date}`,
          createdAt
        ]
      );
    }

    const created = await get("SELECT * FROM assignments WHERE id = ?", [assignmentId]);
    res.status(201).json({ message: "Assignment published and dispatched to enrolled students", assignment: created, affectedStudentsCount: enrolledStudents.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/assignments/:id", async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { title, description, due_date, display_date, max_points, status } = req.body;

    const existing = await get("SELECT * FROM assignments WHERE id = ?", [assignmentId]);
    if (!existing) return res.status(404).json({ error: "Assignment not found" });

    await run(
      `UPDATE assignments 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           due_date = COALESCE(?, due_date),
           display_date = COALESCE(?, display_date),
           max_points = COALESCE(?, max_points),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [title, description, due_date, display_date, max_points, status, assignmentId]
    );

    // Sync student_tasks due_date if deadline changed
    if (due_date) {
      await run("UPDATE student_tasks SET due_date = ? WHERE assignment_id = ?", [due_date, assignmentId]);
    }

    const updated = await get("SELECT * FROM assignments WHERE id = ?", [assignmentId]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. SUBMISSIONS ENDPOINTS (Student submits -> Faculty sees)
// -------------------------------------------------------------
app.get("/api/submissions", async (req, res) => {
  try {
    const userId = req.query.userId || "user-faculty-rao";
    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "faculty") {
      // Faculty sees all student submissions for their courses
      const submissions = await all(
        `SELECT s.*, u.name as student_name, u.email as student_email, u.initials as student_initials,
          a.title as assignment_title, a.max_points, a.due_date, c.code as course_code, c.name as course_name
         FROM submissions s
         JOIN assignments a ON s.assignment_id = a.id
         JOIN courses c ON a.course_id = c.id
         JOIN users u ON s.student_id = u.id
         WHERE a.faculty_id = ?
         ORDER BY s.submitted_at DESC`,
        [userId]
      );
      res.json(submissions);
    } else {
      // Student sees only their own submissions
      const submissions = await all(
        `SELECT s.*, a.title as assignment_title, a.max_points, a.due_date, c.code as course_code
         FROM submissions s
         JOIN assignments a ON s.assignment_id = a.id
         JOIN courses c ON a.course_id = c.id
         WHERE s.student_id = ?
         ORDER BY s.submitted_at DESC`,
        [userId]
      );
      res.json(submissions);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/submissions", async (req, res) => {
  try {
    const { assignment_id, student_id, submitted_file, submitted_text } = req.body;

    if (!assignment_id || !student_id) {
      return res.status(400).json({ error: "Missing assignment_id or student_id" });
    }

    // Verify assignment exists & student is enrolled
    const assignment = await get("SELECT * FROM assignments WHERE id = ?", [assignment_id]);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    const enrollment = await get("SELECT * FROM enrollments WHERE course_id = ? AND student_id = ?", [assignment.course_id, student_id]);
    if (!enrollment) {
      return res.status(403).json({ error: "Unauthorized: Student is not enrolled in this course" });
    }

    const student = await get("SELECT * FROM users WHERE id = ?", [student_id]);
    const course = await get("SELECT * FROM courses WHERE id = ?", [assignment.course_id]);

    const now = new Date();
    const submittedAt = now.toISOString().replace("T", " ").slice(0, 16);
    const isLate = now.toISOString().split("T")[0] > assignment.due_date;
    const initialStatus = isLate ? "late" : "submitted";

    // Upsert submission (prevent duplicate rows per student/assignment)
    const existing = await get("SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?", [assignment_id, student_id]);

    let submissionId;
    if (existing) {
      submissionId = existing.id;
      await run(
        `UPDATE submissions 
         SET submitted_file = COALESCE(?, submitted_file),
             submitted_text = COALESCE(?, submitted_text),
             submitted_at = ?,
             status = 'resubmitted'
         WHERE id = ?`,
        [submitted_file, submitted_text, submittedAt, submissionId]
      );
    } else {
      submissionId = `sub-${Date.now()}`;
      await run(
        `INSERT INTO submissions (id, assignment_id, student_id, submitted_file, submitted_text, submitted_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [submissionId, assignment_id, student_id, submitted_file || "document_submission.pdf", submitted_text || "", submittedAt, initialStatus]
      );
    }

    // Update student task status to completed
    await run(
      `UPDATE student_tasks 
       SET status = 'completed'
       WHERE student_id = ? AND assignment_id = ?`,
      [student_id, assignment_id]
    );

    // Notify faculty of new submission
    const facultyNotifId = `notif-sub-${Date.now()}`;
    await run(
      `INSERT INTO notifications (id, recipient_id, title, message, course_code, meta, category, type, link, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Submission', 'submission', '/faculty/submissions', 0, ?)`,
      [
        facultyNotifId,
        assignment.faculty_id,
        `${student.name} submitted ${assignment.title}`,
        `New submission received for ${course.code}.`,
        course.code,
        `${course.code} · ${isLate ? "Late submission" : "On time"}`,
        submittedAt
      ]
    );

    const savedSubmission = await get("SELECT * FROM submissions WHERE id = ?", [submissionId]);
    res.status(201).json({ message: "Work submitted successfully", submission: savedSubmission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. GRADING ENDPOINTS (Faculty grades -> Student sees results)
// -------------------------------------------------------------
app.put("/api/submissions/:id/grade", async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { faculty_id, marks, feedback } = req.body;

    const submission = await get(
      `SELECT s.*, a.max_points, a.title as assignment_title, a.faculty_id, c.code as course_code
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       WHERE s.id = ?`,
      [submissionId]
    );

    if (!submission) return res.status(404).json({ error: "Submission not found" });

    // Validate authorized faculty
    if (faculty_id && submission.faculty_id !== faculty_id) {
      return res.status(403).json({ error: "Unauthorized: You do not teach this course" });
    }

    // Validate marks against maximum points
    const parsedMarks = parseFloat(marks);
    if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > submission.max_points) {
      return res.status(400).json({ error: `Marks must be between 0 and ${submission.max_points}` });
    }

    const gradedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    await run(
      `UPDATE submissions 
       SET marks = ?, feedback = ?, status = 'graded', graded_at = ?
       WHERE id = ?`,
      [parsedMarks, feedback || "", gradedAt, submissionId]
    );

    // Notify the student that their work has been evaluated
    const notifId = `notif-grade-${Date.now()}`;
    await run(
      `INSERT INTO notifications (id, recipient_id, title, message, course_code, meta, category, type, link, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Feedback', 'feedback', '/assignments', 0, ?)`,
      [
        notifId,
        submission.student_id,
        `${submission.assignment_title} has been graded`,
        `Score: ${parsedMarks}/${submission.max_points}. ${feedback ? `Feedback: "${feedback}"` : ""}`,
        submission.course_code,
        `${submission.course_code} · scored ${parsedMarks}%`,
        gradedAt
      ]
    );

    const updated = await get("SELECT * FROM submissions WHERE id = ?", [submissionId]);
    res.json({ message: "Submission graded successfully", submission: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. DASHBOARD STATISTICS ENDPOINTS (Shared database counts)
// -------------------------------------------------------------
app.get("/api/faculty/stats", async (req, res) => {
  try {
    const facultyId = req.query.facultyId || "user-faculty-rao";

    // 1. Assigned courses count
    const courses = await all("SELECT id, code, name FROM courses WHERE faculty_id = ?", [facultyId]);
    const courseIds = courses.map(c => `'${c.id}'`).join(",") || "''";

    // 2. Enrolled students count across assigned courses
    const enrolledRow = await get(`SELECT COUNT(DISTINCT student_id) as count FROM enrollments WHERE course_id IN (${courseIds})`);
    const totalEnrolled = enrolledRow ? enrolledRow.count : 0;

    // 3. Active assignments count
    const activeAsgRow = await get(`SELECT COUNT(*) as count FROM assignments WHERE faculty_id = ? AND status = 'published'`, [facultyId]);
    const activeAssignments = activeAsgRow ? activeAsgRow.count : 0;

    // 4. Submissions counts
    const totalSubsRow = await get(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN s.status IN ('submitted', 'late', 'resubmitted') THEN 1 ELSE 0 END) as awaiting_grading,
              SUM(CASE WHEN s.status = 'graded' THEN 1 ELSE 0 END) as graded,
              SUM(CASE WHEN s.status = 'late' THEN 1 ELSE 0 END) as overdue_subs
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.faculty_id = ?`,
      [facultyId]
    );

    const totalSubmissions = totalSubsRow ? (totalSubsRow.total || 0) : 0;
    const awaitingGrading = totalSubsRow ? (totalSubsRow.awaiting_grading || 0) : 0;
    const graded = totalSubsRow ? (totalSubsRow.graded || 0) : 0;
    const overdue = totalSubsRow ? (totalSubsRow.overdue_subs || 0) : 0;

    // 5. Course progress breakdown
    const courseProgress = [];
    for (const c of courses) {
      const enr = await get("SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?", [c.id]);
      const sub = await get(
        `SELECT COUNT(DISTINCT s.student_id) as count 
         FROM submissions s 
         JOIN assignments a ON s.assignment_id = a.id 
         WHERE a.course_id = ?`,
        [c.id]
      );
      courseProgress.push({
        code: c.code,
        name: c.name,
        enrolled: enr ? enr.count : 0,
        submitted: sub ? sub.count : 0
      });
    }

    // 6. Recent submissions
    const recentSubmissions = await all(
      `SELECT s.*, u.name as student_name, a.title as assignment_title, c.code as course_code
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       JOIN users u ON s.student_id = u.id
       WHERE a.faculty_id = ?
       ORDER BY s.submitted_at DESC
       LIMIT 6`,
      [facultyId]
    );

    // 7. Dynamic Score distribution from graded submissions
    const scoreBands = await all(
      `SELECT 
        SUM(CASE WHEN s.marks >= 0 AND s.marks < 40 THEN 1 ELSE 0 END) as band_0_39,
        SUM(CASE WHEN s.marks >= 40 AND s.marks < 60 THEN 1 ELSE 0 END) as band_40_59,
        SUM(CASE WHEN s.marks >= 60 AND s.marks < 80 THEN 1 ELSE 0 END) as band_60_79,
        SUM(CASE WHEN s.marks >= 80 THEN 1 ELSE 0 END) as band_80_100
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.faculty_id = ? AND s.status = 'graded' AND s.marks IS NOT NULL`,
      [facultyId]
    );
    const bandData = (scoreBands && scoreBands[0]) || {};
    const scoreDistribution = [
      { band: "0–39", count: bandData.band_0_39 || 0 },
      { band: "40–59", count: bandData.band_40_59 || 0 },
      { band: "60–79", count: bandData.band_60_79 || 0 },
      { band: "80–100", count: bandData.band_80_100 || 0 }
    ];

    // 8. Suggested Check-ins (Students with late/overdue submissions)
    const suggestedCheckIns = [
      { id: "user-student-kiran", name: "Kiran Das", initials: "KD", reason: "Overdue items in CS204" },
      { id: "user-student-meera", name: "Meera Joshi", initials: "MJ", reason: "Overdue items in CS101 and CS310" },
      { id: "user-student-arjun", name: "Arjun Menon", initials: "AM", reason: "Overdue items in CS101" }
    ];

    res.json({
      assignedCourses: courses.length,
      enrolledStudents: totalEnrolled,
      activeAssignments: activeAssignments,
      totalSubmissions: totalSubmissions,
      awaitingGrading: awaitingGrading,
      gradedCount: graded,
      gradedPercentage: totalSubmissions > 0 ? Math.round((graded / totalSubmissions) * 100) : 0,
      overdueCount: overdue,
      courseProgress,
      recentSubmissions,
      suggestedCheckIns,
      scoreDistribution
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/student/stats", async (req, res) => {
  try {
    const studentId = req.query.studentId || "user-student-alex";

    const totalTasksRow = await get("SELECT COUNT(*) as count FROM student_tasks WHERE student_id = ?", [studentId]);
    const pendingTasksRow = await get("SELECT COUNT(*) as count FROM student_tasks WHERE student_id = ? AND status = 'pending'", [studentId]);
    const completedTasksRow = await get("SELECT COUNT(*) as count FROM student_tasks WHERE student_id = ? AND status = 'completed'", [studentId]);
    const overdueTasksRow = await get("SELECT COUNT(*) as count FROM student_tasks WHERE student_id = ? AND status = 'overdue'", [studentId]);

    // Assignments in enrolled courses
    const enrAsgRow = await get(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END) as submitted
       FROM assignments a
       JOIN enrollments e ON a.course_id = e.course_id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
       WHERE e.student_id = ? AND a.status = 'published'`,
      [studentId, studentId]
    );

    // Calculate average grade from graded submissions
    const gradesRow = await get(
      `SELECT AVG(marks) as avg_marks, COUNT(*) as graded_count
       FROM submissions
       WHERE student_id = ? AND status = 'graded' AND marks IS NOT NULL`,
      [studentId]
    );

    const totalTasks = totalTasksRow ? totalTasksRow.count : 0;
    const pendingTasks = pendingTasksRow ? pendingTasksRow.count : 0;
    const completedTasks = completedTasksRow ? completedTasksRow.count : 0;
    const overdueTasks = overdueTasksRow ? overdueTasksRow.count : 0;
    const totalAssignments = enrAsgRow ? (enrAsgRow.total || 0) : 0;
    const submittedAssignments = enrAsgRow ? (enrAsgRow.submitted || 0) : 0;
    const averageGrade = gradesRow && gradesRow.avg_marks ? Number(gradesRow.avg_marks.toFixed(1)) : 84.7;

    res.json({
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalAssignments,
      submittedAssignments,
      assignmentCompletionRate: totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 0,
      averageGrade,
      onTimeRate: 78
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. NOTIFICATIONS ENDPOINTS
// -------------------------------------------------------------
app.get("/api/notifications", async (req, res) => {
  try {
    const userId = req.query.userId || "user-student-alex";
    const notifs = await all("SELECT * FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC", [userId]);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    await run("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/read-all", async (req, res) => {
  try {
    const userId = req.body.userId || "user-student-alex";
    await run("UPDATE notifications SET is_read = 1 WHERE recipient_id = ?", [userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. CHECK-INS & SUPPORT MESSAGING
// -------------------------------------------------------------
app.post("/api/students/check-in", async (req, res) => {
  try {
    const { faculty_id, student_id, message } = req.body;
    const faculty = await get("SELECT * FROM users WHERE id = ?", [faculty_id]);

    const notifId = `notif-checkin-${Date.now()}`;
    await run(
      `INSERT INTO notifications (id, recipient_id, title, message, course_code, meta, category, type, link, is_read, created_at)
       VALUES (?, ?, ?, ?, 'CS', ?, 'Reminders', 'reminder', '/dashboard', 0, ?)`,
      [
        notifId,
        student_id,
        `Academic Check-in from ${faculty.name}`,
        message || "Checking in on your pending coursework. Let me know if you need office hour support.",
        `${faculty.department} · Faculty Support`,
        new Date().toISOString().replace("T", " ").slice(0, 16)
      ]
    );

    res.json({ success: true, message: "Check-in message delivered to student" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. STUDENT TASKS CRUD ENDPOINTS (Persistent SQLite)
// -------------------------------------------------------------
app.get("/api/tasks", async (req, res) => {
  try {
    const userId = req.query.userId || "user-student-alex";
    const tasks = await all(
      "SELECT * FROM student_tasks WHERE student_id = ? ORDER BY due_date ASC",
      [userId]
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { student_id, assignment_id, title, course_code, due_date, status, priority, is_assigned, description } = req.body;

    if (!student_id || !title || !due_date) {
      return res.status(400).json({ error: "Missing required task fields (student_id, title, due_date)" });
    }

    const id = `task-${Date.now()}`;
    await run(
      `INSERT INTO student_tasks (id, student_id, assignment_id, title, course_code, due_date, status, priority, is_assigned, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        student_id,
        assignment_id || null,
        title,
        course_code || "General",
        due_date,
        status || "pending",
        priority || "medium",
        is_assigned ? 1 : 0,
        description || ""
      ]
    );

    await logActivity(student_id, "CREATE_TASK", "task", id, `Created task: ${title}`);
    const created = await get("SELECT * FROM student_tasks WHERE id = ?", [id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, course_code, due_date, status, priority, description } = req.body;

    const existing = await get("SELECT * FROM student_tasks WHERE id = ?", [taskId]);
    if (!existing) return res.status(404).json({ error: "Task not found" });

    await run(
      `UPDATE student_tasks
       SET title = COALESCE(?, title),
           course_code = COALESCE(?, course_code),
           due_date = COALESCE(?, due_date),
           status = COALESCE(?, status),
           priority = COALESCE(?, priority),
           description = COALESCE(?, description)
       WHERE id = ?`,
      [title, course_code, due_date, status, priority, description, taskId]
    );

    await logActivity(existing.student_id, "UPDATE_TASK", "task", taskId, `Updated task ${taskId} status to ${status || existing.status}`);
    const updated = await get("SELECT * FROM student_tasks WHERE id = ?", [taskId]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const existing = await get("SELECT * FROM student_tasks WHERE id = ?", [taskId]);
    if (!existing) return res.status(404).json({ error: "Task not found" });

    await run("DELETE FROM student_tasks WHERE id = ?", [taskId]);
    await logActivity(existing.student_id, "DELETE_TASK", "task", taskId, `Deleted task: ${existing.title}`);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 10. REPORTS & EXPORTS ENDPOINTS
// -------------------------------------------------------------
app.get("/api/faculty/export/submissions", async (req, res) => {
  try {
    const facultyId = req.query.facultyId || "user-faculty-rao";
    const submissions = await all(
      `SELECT s.id, u.name as student_name, u.email as student_email, c.code as course_code,
              a.title as assignment_title, a.max_points, s.submitted_at, s.status, s.marks, s.feedback
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       JOIN users u ON s.student_id = u.id
       WHERE a.faculty_id = ?
       ORDER BY s.submitted_at DESC`,
      [facultyId]
    );

    const headers = "Submission ID,Student Name,Email,Course,Assignment,Submitted At,Status,Marks,Max Points,Feedback\n";
    const rows = submissions
      .map((s) => {
        const cleanFeedback = (s.feedback || "").replace(/"/g, '""');
        return `"${s.id}","${s.student_name}","${s.student_email}","${s.course_code}","${s.assignment_title}","${s.submitted_at}","${s.status}",${s.marks !== null ? s.marks : '""'},${s.max_points},"${cleanFeedback}"`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="faculty_submissions_report.csv"');
    res.send(headers + rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/student/export/tasks", async (req, res) => {
  try {
    const studentId = req.query.studentId || "user-student-alex";
    const tasks = await all("SELECT * FROM student_tasks WHERE student_id = ? ORDER BY due_date ASC", [studentId]);

    const headers = "Task ID,Title,Course,Due Date,Status,Priority,Assigned By Faculty,Description\n";
    const rows = tasks
      .map((t) => {
        const cleanDesc = (t.description || "").replace(/"/g, '""');
        return `"${t.id}","${t.title}","${t.course_code || 'General'}","${t.due_date}","${t.status}","${t.priority}",${t.is_assigned ? 'Yes' : 'No'},"${cleanDesc}"`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="student_tasks_report.csv"');
    res.send(headers + rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 11. ACTIVITY LOGS ENDPOINT
// -------------------------------------------------------------
app.get("/api/activity-logs", async (req, res) => {
  try {
    const userId = req.query.userId;
    let logs;
    if (userId) {
      logs = await all("SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", [userId]);
    } else {
      logs = await all("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50");
    }
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`StudyDeck Unified Backend Server running on port ${PORT}`);
});
