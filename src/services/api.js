const API_BASE = "/api";

export const api = {
  // Users & Auth
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },
  getCurrentUser: async (userId) => {
    const res = await fetch(`${API_BASE}/auth/me?userId=${userId}`);
    return res.json();
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
  }
};
