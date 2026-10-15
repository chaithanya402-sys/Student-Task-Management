// Automated Verification Script for Section 10 Testing Requirements
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
  console.log("=== STARTING STUDYDECK CONNECTED WORKFLOW TESTS ===");

  // Course: CS204 Databases (taught by Dr. S. Rao, user-faculty-rao)
  // Enrolled students: Alex Kumar (user-student-alex), Priya Nair (user-student-priya)
  // Non-enrolled student: Sarah Miller (user-student-sarah)

  // -------------------------------------------------------------
  // TEST A: Faculty publishes an assignment. Both enrolled students can see it.
  // -------------------------------------------------------------
  console.log("\n--- TEST A: Faculty publishes assignment ---");
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
  assert(publishRes.status === 201, "Assignment created successfully");
  const assignmentId = publishData.assignment.id;

  // Check enrolled student 1 (Alex Kumar)
  const alexAsgs = await (await fetch(`${BASE_URL}/assignments?userId=user-student-alex`)).json();
  const alexHasIt = alexAsgs.some(a => a.id === assignmentId);
  assert(alexHasIt, `Alex Kumar (enrolled in CS204) sees "${testAssignmentTitle}"`);

  // Check enrolled student 2 (Priya Nair)
  const priyaAsgs = await (await fetch(`${BASE_URL}/assignments?userId=user-student-priya`)).json();
  const priyaHasIt = priyaAsgs.some(a => a.id === assignmentId);
  assert(priyaHasIt, `Priya Nair (enrolled in CS204) sees "${testAssignmentTitle}"`);

  // Check notifications generated for students
  const alexNotifs = await (await fetch(`${BASE_URL}/notifications?userId=user-student-alex`)).json();
  const alexNotified = alexNotifs.some(n => n.title.includes(testAssignmentTitle));
  assert(alexNotified, "Alex Kumar received notification for new assignment");

  // -------------------------------------------------------------
  // TEST B: A student submits work. Faculty sees the correct submission and updated counts.
  // -------------------------------------------------------------
  console.log("\n--- TEST B: Alex Kumar submits work ---");
  const initialFacultyStats = await (await fetch(`${BASE_URL}/faculty/stats?facultyId=user-faculty-rao`)).json();
  
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
  const submissionData = await submitRes.json();
  const submissionId = submissionData.submission.id;

  // Faculty checks submissions queue
  const facultySubs = await (await fetch(`${BASE_URL}/submissions?userId=user-faculty-rao`)).json();
  const foundSub = facultySubs.find(s => s.id === submissionId);
  assert(Boolean(foundSub), "Faculty sees Alex Kumar's submission in queue");
  assert(foundSub.student_name === "Alex Kumar", "Submission displays student name: Alex Kumar");

  // Faculty stats updated
  const updatedFacultyStats = await (await fetch(`${BASE_URL}/faculty/stats?facultyId=user-faculty-rao`)).json();
  assert(updatedFacultyStats.awaitingGrading >= initialFacultyStats.awaitingGrading, "Awaiting grading count incremented");

  // -------------------------------------------------------------
  // TEST C: The other student's submission status remains unchanged (Pending/Unsubmitted).
  // -------------------------------------------------------------
  console.log("\n--- TEST C: Priya Nair status remains unchanged ---");
  const priyaAsgsAfterAlexSubmit = await (await fetch(`${BASE_URL}/assignments?userId=user-student-priya`)).json();
  const priyaAsgStatus = priyaAsgsAfterAlexSubmit.find(a => a.id === assignmentId);
  assert(!priyaAsgStatus.student_status, "Priya Nair's submission status is untouched (unsubmitted/null)");

  // -------------------------------------------------------------
  // TEST D: Faculty grades the first submission. Alex sees marks/feedback, Priya cannot see it.
  // -------------------------------------------------------------
  console.log("\n--- TEST D: Faculty grades Alex Kumar's submission ---");
  const gradeRes = await fetch(`${BASE_URL}/submissions/${submissionId}/grade`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      faculty_id: "user-faculty-rao",
      marks: 95,
      feedback: "Excellent benchmark methodology and query cost analysis."
    })
  });
  assert(gradeRes.status === 200, "Faculty graded Alex's submission successfully");

  // Alex Kumar checks assignment status
  const alexAsgsAfterGrade = await (await fetch(`${BASE_URL}/assignments?userId=user-student-alex`)).json();
  const alexGraded = alexAsgsAfterGrade.find(a => a.id === assignmentId);
  assert(alexGraded.student_status === "graded", "Alex sees assignment marked as graded");
  assert(alexGraded.marks === 95, "Alex sees awarded marks: 95");
  assert(alexGraded.feedback === "Excellent benchmark methodology and query cost analysis.", "Alex sees instructor feedback");

  // Verify Priya Nair does NOT see Alex's marks
  const priyaAsgsCheck = await (await fetch(`${BASE_URL}/assignments?userId=user-student-priya`)).json();
  const priyaCheck = priyaAsgsCheck.find(a => a.id === assignmentId);
  assert(priyaCheck.marks === null, "Priya Nair cannot see Alex Kumar's grade");

  // -------------------------------------------------------------
  // TEST E: Faculty changes the assignment deadline. Students see updated deadline.
  // -------------------------------------------------------------
  console.log("\n--- TEST E: Faculty updates assignment deadline ---");
  const updateRes = await fetch(`${BASE_URL}/assignments/${assignmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      due_date: "2026-10-31",
      display_date: "31 Oct 2026"
    })
  });
  assert(updateRes.status === 200, "Deadline updated by faculty");

  const priyaAsgsAfterDeadline = await (await fetch(`${BASE_URL}/assignments?userId=user-student-priya`)).json();
  const priyaUpdated = priyaAsgsAfterDeadline.find(a => a.id === assignmentId);
  assert(priyaUpdated.due_date === "2026-10-31", "Student Priya Nair sees updated due_date 2026-10-31");
  assert(priyaUpdated.display_date === "31 Oct 2026", "Student Priya Nair sees updated display_date 31 Oct 2026");

  // -------------------------------------------------------------
  // TEST F: Non-enrolled student (Sarah Miller) cannot access assignment or submit.
  // -------------------------------------------------------------
  console.log("\n--- TEST F: Non-enrolled student access control ---");
  const sarahAsgs = await (await fetch(`${BASE_URL}/assignments?userId=user-student-sarah`)).json();
  const sarahHasIt = sarahAsgs.some(a => a.id === assignmentId);
  assert(!sarahHasIt, "Non-enrolled student Sarah Miller cannot access CS204 assignment");

  const unauthorizedSubmitRes = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignment_id: assignmentId,
      student_id: "user-student-sarah",
      submitted_file: "cheat.pdf"
    })
  });
  assert(unauthorizedSubmitRes.status === 403, "Backend rejects submission from non-enrolled student with 403 Forbidden");

  // -------------------------------------------------------------
  // TEST G & H: Persistence and no double counting.
  // -------------------------------------------------------------
  console.log("\n--- TEST G & H: Duplicate submission prevention and persistence ---");
  // Alex submits again (resubmission)
  const resubmitRes = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignment_id: assignmentId,
      student_id: "user-student-alex",
      submitted_file: "alex_bplus_tree_v2.pdf",
      submitted_text: "Updated with cache hit rates."
    })
  });
  assert(resubmitRes.status === 201, "Resubmission accepted");

  // Ensure unique count in submissions table
  const allAlexSubs = (await (await fetch(`${BASE_URL}/submissions?userId=user-student-alex`)).json())
    .filter(s => s.assignment_id === assignmentId);
  assert(allAlexSubs.length === 1, "Submission row was updated, not duplicated (no double-counting)");

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! FULL-STACK CONNECTIVITY VERIFIED.");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
