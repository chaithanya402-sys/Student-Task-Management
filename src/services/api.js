const API_BASE = "/api";

export const api = {
  // Users & Auth
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },
  getCurrentUser: async (userId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/auth/me?userId=${userId}`, { headers });
    return res.json();
  },
  login: async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  },
  logout: async (token) => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ token })
    });
    return res.json();
  },

  // Student Tasks (Persistent SQLite)
  getTasks: async (userId) => {
    const res = await fetch(`${API_BASE}/tasks?userId=${userId}`);
    return res.json();
  },
  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create task");
    return data;
  },
  updateTask: async (id, taskData) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update task");
    return data;
  },
  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete task");
    return data;
  },
  toggleTaskFavorite: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/favorite`, {
      method: "PUT"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to toggle favorite");
    return data;
  },
  archiveTask: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/archive`, {
      method: "PUT"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to archive task");
    return data;
  },

  // Courses
  getCourses: async (userId) => {
    const res = await fetch(`${API_BASE}/courses?userId=${userId}`);
    return res.json();
  },

  // Assignments
  getAssignments: async (userId) => {
    const res = await fetch(`${API_BASE}/assignments?userId=${userId}`);
    return res.json();
  },
  createAssignment: async (assignmentData) => {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignmentData)
    });
    return res.json();
  },
  updateAssignment: async (id, data) => {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Submissions
  getSubmissions: async (userId) => {
    const res = await fetch(`${API_BASE}/submissions?userId=${userId}`);
    return res.json();
  },
  submitWork: async (submissionData) => {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData)
    });
    return res.json();
  },
  gradeSubmission: async (submissionId, gradeData) => {
    const res = await fetch(`${API_BASE}/submissions/${submissionId}/grade`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gradeData)
    });
    return res.json();
  },

  // Stats
  getFacultyStats: async (facultyId) => {
    const res = await fetch(`${API_BASE}/faculty/stats?facultyId=${facultyId}`);
    return res.json();
  },
  getStudentStats: async (studentId) => {
    const res = await fetch(`${API_BASE}/student/stats?studentId=${studentId}`);
    return res.json();
  },

  // Notifications
  getNotifications: async (userId) => {
    const res = await fetch(`${API_BASE}/notifications?userId=${userId}`);
    return res.json();
  },
  markNotificationRead: async (id) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PUT" });
    return res.json();
  },
  markAllNotificationsRead: async (userId) => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Check-ins
  sendCheckIn: async (data) => {
    const res = await fetch(`${API_BASE}/students/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Activity Logs
  getActivityLogs: async (userId) => {
    const query = userId ? `?userId=${userId}` : "";
    const res = await fetch(`${API_BASE}/activity-logs${query}`);
    return res.json();
  },

  // Exports
  getFacultySubmissionsExportUrl: (facultyId) => `${API_BASE}/faculty/export/submissions?facultyId=${facultyId}`,
  getStudentTasksExportUrl: (studentId) => `${API_BASE}/student/export/tasks?studentId=${studentId}`
};
