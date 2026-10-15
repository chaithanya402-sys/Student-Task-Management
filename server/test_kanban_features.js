import assert from "assert";

const BASE_URL = "http://127.0.0.1:5001/api";

const runKanbanTests = async () => {
  console.log("=== RUNNING KANBAN & TASK ENHANCEMENT TESTS ===");

  // 1. Create a task with enriched fields
  const uniqueTitle = `Kanban Test Task ${Date.now()}`;
  const createRes = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: "user-student-alex",
      title: uniqueTitle,
      course_code: "CS101 · Data Structures",
      due_date: "2026-10-25",
      status: "pending",
      priority: "high",
      category: "Project",
      is_favorite: 1,
      attachment_count: 3,
      description: "Testing enriched Kanban card functionality."
    })
  });

  assert.strictEqual(createRes.status, 201, "Task creation should return 201");
  const created = await createRes.json();
  console.log("✅ PASSED: Created enriched task with category 'Project', 3 attachments, favorited");
  assert.strictEqual(created.title, uniqueTitle);
  assert.strictEqual(created.category, "Project");
  assert.strictEqual(created.is_favorite, 1);
  assert.strictEqual(created.attachment_count, 3);

  // 2. Move status to 'in_progress'
  const moveRes = await fetch(`${BASE_URL}/tasks/${created.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "in_progress" })
  });
  assert.strictEqual(moveRes.status, 200);
  const moved = await moveRes.json();
  assert.strictEqual(moved.status, "in_progress");
  console.log("✅ PASSED: Task moved to 'in_progress' column successfully");

  // 3. Toggle favorite via dedicated endpoint
  const favRes = await fetch(`${BASE_URL}/tasks/${created.id}/favorite`, {
    method: "PUT"
  });
  assert.strictEqual(favRes.status, 200);
  const unfavorited = await favRes.json();
  assert.strictEqual(unfavorited.is_favorite, 0);
  console.log("✅ PASSED: Favorite toggled from 1 to 0");

  const favRes2 = await fetch(`${BASE_URL}/tasks/${created.id}/favorite`, {
    method: "PUT"
  });
  const refavorited = await favRes2.json();
  assert.strictEqual(refavorited.is_favorite, 1);
  console.log("✅ PASSED: Favorite toggled back from 0 to 1");

  // 4. Archive task
  const archiveRes = await fetch(`${BASE_URL}/tasks/${created.id}/archive`, {
    method: "PUT"
  });
  assert.strictEqual(archiveRes.status, 200);
  const archived = await archiveRes.json();
  assert.strictEqual(archived.is_archived, 1);
  console.log("✅ PASSED: Task archived successfully");

  // 5. Verify task is omitted by default from GET /api/tasks
  const getTasksRes = await fetch(`${BASE_URL}/tasks?userId=user-student-alex`);
  const activeTasks = await getTasksRes.json();
  const existsInActive = activeTasks.some(t => t.id === created.id);
  assert.strictEqual(existsInActive, false, "Archived task should not appear in active task list");
  console.log("✅ PASSED: Archived task filtered out from active task list");

  // 6. Cleanup
  const delRes = await fetch(`${BASE_URL}/tasks/${created.id}`, {
    method: "DELETE"
  });
  assert.strictEqual(delRes.status, 200);
  console.log("✅ PASSED: Cleaned up test task");

  console.log("\n🎉 ALL KANBAN & TASK ENHANCEMENT TESTS PASSED 100%!");
};

runKanbanTests().catch(err => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
