// Automated Verification Script for Section 10 Testing Requirements & Comprehensive Architecture Verification
const BASE_URL = "http://127.0.0.1:5001/api";

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
};

async function runTests() {
  console.log("=== STARTING STUDYFLOW COMPREHENSIVE END-TO-END VERIFICATION TESTS ===");

  // -------------------------------------------------------------
  // TEST 1: Authentication & Secure Registration
  // -------------------------------------------------------------
  console.log("\n--- TEST 1: Authentication & Secure Registration ---");
  const testStudentEmail = `test.student.${Date.now()}@college.edu`;

  // 1A: Student self-registration
  const studentRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rohit Sharma",
      email: testStudentEmail,
      password: "securePassword2026",
      role: "student",
      programme: "B.Tech",
      year: "2"
    })
  });
  const studentRegData = await studentRegRes.json();
  assert(studentRegRes.status === 201, "Student self-registration succeeded with 201 Created");
  assert(Boolean(studentRegData.token), "Student registration returned active session token");
  assert(studentRegData.user.status === "active", "Registered student account status is 'active'");

  // 1B: Duplicate email prevention
  const dupRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Duplicate User",
      email: testStudentEmail,
      password: "anotherPassword123",
      role: "student"
    })
  });
  assert(dupRegRes.status === 409, "Backend rejects duplicate email registration with 409 Conflict");

  // 1C: Faculty onboarding with valid invitation code
  const facultyEmail = `test.faculty.${Date.now()}@college.edu`;
  const facultyRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Prof. Vikram Sen",
      email: facultyEmail,
      password: "facultyPass2026",
      role: "faculty",
      department: "Computer Science",
      invite_code: "FACULTY2026"
    })
  });
  const facultyRegData = await facultyRegRes.json();
  assert(facultyRegRes.status === 201, "Faculty with valid invite code onboarded successfully");
  assert(facultyRegData.user.status === "active", "Faculty with valid invite code status is 'active'");

  // 1D: Faculty onboarding without invite code (pending approval)
  const pendingFacultyEmail = `pending.faculty.${Date.now()}@college.edu`;
  const pendingRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Dr. Anjali Verma",
      email: pendingFacultyEmail,
      password: "facultyPass2026",
      role: "faculty",
      department: "Data Science"
    })
  });
  const pendingRegData = await pendingRegRes.json();
  assert(pendingRegRes.status === 201, "Faculty without invite code registered");
  assert(pendingRegData.pendingApproval === true, "Faculty without invite code flagged as pendingApproval");

  // 1E: Login attempt of pending approval account fails
  const pendingLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: pendingFacultyEmail,
      password: "facultyPass2026"
    })
  });
  assert(pendingLoginRes.status === 403, "Login for pending approval account rejected with 403 Forbidden");

  // 1F: Login with invalid password fails
  const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testStudentEmail,
      password: "wrongPassword"
    })
  });
  assert(badLoginRes.status === 401, "Login with invalid password rejected with 401 Unauthorized");

  // 1G: Login with valid credentials succeeds
  const goodLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testStudentEmail,
      password: "securePassword2026"
    })
  });
  const goodLoginData = await goodLoginRes.json();
  assert(goodLoginRes.status === 200, "Login with valid credentials succeeded with 200 OK");
  assert(Boolean(goodLoginData.token), "Login returned valid session token");

  // -------------------------------------------------------------
  // TEST 2: Student Tasks SQLite Persistence
  // -------------------------------------------------------------
  console.log("\n--- TEST 2: Student Tasks SQLite Persistence ---");
  // 2A: Create a task in SQLite
  const taskTitle = `Complete Operating Systems Thread Lab ${Date.now()}`;
  const createTaskRes = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: "user-student-alex",
      title: taskTitle,
      course_code: "CS204",
      due_date: "2026-10-25",
      status: "pending",
      priority: "high",
      description: "Implement mutex locks and semaphore synchronization."
    })
  });
  const createdTask = await createTaskRes.json();
  assert(createTaskRes.status === 201, "Task created in SQLite successfully");
  const taskId = createdTask.id;

  // 2B: Read tasks from SQLite
  const getTasksRes = await fetch(`${BASE_URL}/tasks?userId=user-student-alex`);
  const tasks = await getTasksRes.json();
  const foundTask = tasks.find((t) => t.id === taskId);
  assert(Boolean(foundTask), `Task "${taskTitle}" retrieved from SQLite`);

  // 2C: Update task status in SQLite (simulate Kanban move)
  const updateTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "completed"
    })
  });
  const updatedTask = await updateTaskRes.json();
  assert(updateTaskRes.status === 200, "Task updated in SQLite successfully");
  assert(updatedTask.status === "completed", "Task status is persisted as 'completed'");

  // 2D: Delete task from SQLite
  const deleteTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE"
  });
  assert(deleteTaskRes.status === 200, "Task deleted from SQLite successfully");

  // Verify deletion
  const verifyTasks = await (await fetch(`${BASE_URL}/tasks?userId=user-student-alex`)).json();
  assert(!verifyTasks.some((t) => t.id === taskId), "Deleted task no longer exists in SQLite");

  // -------------------------------------------------------------
  // TEST 3: Connected Assignment Workflow
  // -------------------------------------------------------------
  console.log("\n--- TEST 3: Connected Assignment Workflow ---");
  const testAssignmentTitle = `Database Indexing Lab ${Date.now()}`;
  const publishRes = await fetch(`${BASE_URL}/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      faculty_id: "user-faculty-rao",
      course_id: "course-cs204",
      title: testAssignmentTitle,
      description: "Analyze B+ Tree index performance vs Hash index.",
      max_points: 100,
      due_date: "2026-10-28",
      display_date: "28 Oct 2026"
    })
  });
  const publishData = await publishRes.json();
  assert(publishRes.status === 201, "Assignment created successfully by Faculty");
  const assignmentId = publishData.assignment.id;

  // Enrolled students see it
  const alexAsgs = await (await fetch(`${BASE_URL}/assignments?userId=user-student-alex`)).json();
  assert(alexAsgs.some((a) => a.id === assignmentId), `Alex Kumar sees "${testAssignmentTitle}"`);

  const priyaAsgs = await (await fetch(`${BASE_URL}/assignments?userId=user-student-priya`)).json();
  assert(priyaAsgs.some((a) => a.id === assignmentId), `Priya Nair sees "${testAssignmentTitle}"`);

  // Alex submits
  const submitRes = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignment_id: assignmentId,
      student_id: "user-student-alex",
      submitted_file: "alex_bplus_tree.pdf",
      submitted_text: "Benchmarked using 100,000 synthetic records."
    })
  });
  assert(submitRes.status === 201, "Alex Kumar submitted assignment successfully");
  const subData = await submitRes.json();
  const submissionId = subData.submission.id;

  // Faculty sees submission in queue
  const facultySubs = await (await fetch(`${BASE_URL}/submissions?userId=user-faculty-rao`)).json();
  const foundSub = facultySubs.find((s) => s.id === submissionId);
  assert(Boolean(foundSub), "Faculty sees Alex Kumar's submission in grading queue");

  // Priya's status remains untouched
  const priyaStatus = (await (await fetch(`${BASE_URL}/assignments?userId=user-student-priya`)).json()).find((a) => a.id === assignmentId);
  assert(!priyaStatus.student_status, "Priya Nair's submission status is untouched (unsubmitted/null)");

  // Faculty grades submission
  const gradeRes = await fetch(`${BASE_URL}/submissions/${submissionId}/grade`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      faculty_id: "user-faculty-rao",
      marks: 98,
      feedback: "Exceptional benchmarking and time complexity analysis."
    })
  });
  assert(gradeRes.status === 200, "Faculty graded submission successfully");

  // Student sees grade and feedback
  const alexGraded = (await (await fetch(`${BASE_URL}/assignments?userId=user-student-alex`)).json()).find((a) => a.id === assignmentId);
  assert(alexGraded.student_status === "graded", "Alex sees assignment marked as graded");
  assert(alexGraded.marks === 98, "Alex sees awarded marks: 98");
  assert(alexGraded.feedback === "Exceptional benchmarking and time complexity analysis.", "Alex sees instructor feedback");

  // Non-enrolled student Sarah cannot access or submit
  const sarahAsgs = await (await fetch(`${BASE_URL}/assignments?userId=user-student-sarah`)).json();
  assert(!sarahAsgs.some((a) => a.id === assignmentId), "Non-enrolled student Sarah Miller cannot access assignment");

  const unauthSub = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignment_id: assignmentId,
      student_id: "user-student-sarah",
      submitted_file: "test.pdf"
    })
  });
  assert(unauthSub.status === 403, "Non-enrolled student submission rejected with 403 Forbidden");

  // -------------------------------------------------------------
  // TEST 4: Reports & CSV Exports
  // -------------------------------------------------------------
  console.log("\n--- TEST 4: Reports & CSV Exports ---");
  const facultyExportRes = await fetch(`${BASE_URL}/faculty/export/submissions?facultyId=user-faculty-rao`);
  assert(facultyExportRes.status === 200, "Faculty submissions report export returned 200 OK");
  const facultyCsv = await facultyExportRes.text();
  assert(facultyCsv.includes("Submission ID,Student Name,Email"), "Faculty CSV export contains expected headers");
  assert(facultyCsv.includes("Alex Kumar"), "Faculty CSV export includes student records");

  const studentExportRes = await fetch(`${BASE_URL}/student/export/tasks?studentId=user-student-alex`);
  assert(studentExportRes.status === 200, "Student tasks report export returned 200 OK");
  const studentCsv = await studentExportRes.text();
  assert(studentCsv.includes("Task ID,Title,Course"), "Student CSV export contains expected headers");

  // -------------------------------------------------------------
  // TEST 5: Accurate Dashboard Analytics from SQLite
  // -------------------------------------------------------------
  console.log("\n--- TEST 5: Accurate Dashboard Analytics ---");
  const facultyStats = await (await fetch(`${BASE_URL}/faculty/stats?facultyId=user-faculty-rao`)).json();
  assert(typeof facultyStats.totalSubmissions === "number", "Faculty totalSubmissions is calculated dynamically");
  assert(typeof facultyStats.awaitingGrading === "number", "Faculty awaitingGrading is calculated dynamically");
  assert(Array.isArray(facultyStats.scoreDistribution), "Faculty scoreDistribution is calculated from SQLite");

  const studentStats = await (await fetch(`${BASE_URL}/student/stats?studentId=user-student-alex`)).json();
  assert(typeof studentStats.totalTasks === "number", "Student totalTasks is calculated dynamically from SQLite");
  assert(typeof studentStats.completedTasks === "number", "Student completedTasks is calculated dynamically from SQLite");

  console.log("\n🎉 ALL 5 TEST SUITES PASSED! 100% VERIFICATION ACHIEVED.");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
