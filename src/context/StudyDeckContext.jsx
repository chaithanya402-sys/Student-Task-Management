import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  initialUser,
  initialTasks,
  initialAssignments,
  initialNotifications,
  weeklyProductivityData,
  courseGradesData
} from "../data/initialData";

const StudyDeckContext = createContext(null);

export const StudyDeckProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("studydeck_user");
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("studydeck_auth");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("studydeck_tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("studydeck_assignments");
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("studydeck_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'overdue', 'pending', 'completed', 'high'
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("studydeck_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("studydeck_auth", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("studydeck_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("studydeck_assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("studydeck_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Computed metrics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const personalTasks = tasks.filter(t => !t.isAssigned).length;
    const assignedTasks = tasks.filter(t => t.isAssigned).length;
    const pendingTasks = tasks.filter(t => t.status === "pending").length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const overdueTasks = tasks.filter(t => t.status === "overdue").length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalAssignments = assignments.length;
    const submittedAssignments = assignments.filter(a => a.status === "Submitted").length;
    const assignmentCompletionRate = totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 0;

    const unreadNotifications = notifications.filter(n => !n.isRead).length;
    const overdueAlerts = notifications.filter(n => !n.isRead && n.type === "alert").length;
    const reminderAlerts = notifications.filter(n => !n.isRead && n.type === "reminder").length;
    const feedbackAlerts = notifications.filter(n => !n.isRead && n.type === "feedback").length;

    return {
      totalTasks,
      personalTasks,
      assignedTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
      taskCompletionRate,
      totalAssignments,
      submittedAssignments,
      assignmentCompletionRate,
      onTimeRate: 78,
      onTimeCount: 18,
      latePendingCount: 5,
      averageGrade: 84.7,
      gradeGap: 15.3,
      unreadNotifications,
      overdueAlerts,
      reminderAlerts,
      feedbackAlerts
    };
  }, [tasks, assignments, notifications]);

  // Task actions
  const addTask = (newTask) => {
    const task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: newTask.status || "pending",
      isAssigned: newTask.isAssigned || false
    };
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === "completed" ? "pending" : "completed";
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Assignment actions
  const submitAssignment = (id, fileName) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: "Submitted",
          submittedFile: fileName || "submission_document.pdf",
          submittedDate: new Date().toISOString().split("T")[0]
        };
      }
      return a;
    }));

    // Add a notification for assignment submission
    const target = assignments.find(a => a.id === id);
    if (target) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `${target.title} submitted`,
          course: target.course,
          meta: `${target.course} · on time`,
          timeAgo: "just now",
          type: "submission",
          category: "Recent",
          isRead: false,
          link: "/assignments"
        },
        ...prev
      ]);
    }
  };

  // Notification actions
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Profile actions
  const updateProfile = (data) => {
    setUser(prev => ({
      ...prev,
      ...data,
      initials: data.fullName
        ? data.fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : prev.initials
    }));
  };

  // Auth actions
  const login = (role = "student", email = "alex.kumar@college.edu") => {
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      role,
      email: email || prev.email
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const resetToDefaults = () => {
    setUser(initialUser);
    setTasks(initialTasks);
    setAssignments(initialAssignments);
    setNotifications(initialNotifications);
  };

  return (
    <StudyDeckContext.Provider
      value={{
        user,
        isAuthenticated,
        tasks,
        assignments,
        notifications,
        weeklyProductivityData,
        courseGradesData,
        stats,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        isFilterModalOpen,
        setIsFilterModalOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        submitAssignment,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        login,
        logout,
        resetToDefaults
      }}
    >
      {children}
    </StudyDeckContext.Provider>
  );
};

export const useStudyDeck = () => {
  const context = useContext(StudyDeckContext);
  if (!context) {
    throw new Error("useStudyDeck must be used within a StudyDeckProvider");
  }
  return context;
};
