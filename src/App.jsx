import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudyDeckProvider, useStudyDeck } from "./context/StudyDeckContext";

// Student layout & pages
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TasksPage } from "./pages/TasksPage";
import { AssignmentsPage } from "./pages/AssignmentsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

// Faculty layout & pages matching screenshots
import { FacultyLayout } from "./components/faculty/FacultyLayout";
import { FacultyLandingPage } from "./pages/faculty/FacultyLandingPage";
import { FacultyDashboardPage } from "./pages/faculty/FacultyDashboardPage";
import { FacultyCoursesPage } from "./pages/faculty/FacultyCoursesPage";
import { FacultyAssignmentsPage } from "./pages/faculty/FacultyAssignmentsPage";
import { FacultySubmissionsPage } from "./pages/faculty/FacultySubmissionsPage";
import { FacultyStudentsPage } from "./pages/faculty/FacultyStudentsPage";
import { FacultyAnalyticsPage } from "./pages/faculty/FacultyAnalyticsPage";

// Role-verified Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useStudyDeck();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user && user.role) {
    if (!allowedRoles.includes(user.role)) {
      if (user.role === "student") {
        return <Navigate to="/dashboard" replace />;
      }
      if (user.role === "faculty") {
        return <Navigate to="/faculty/dashboard" replace />;
      }
    }
  }

  return children;
};

export default function App() {
  return (
    <StudyDeckProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/faculty/landing" element={<FacultyLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Student Portal Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["student", "chairman"]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Authenticated Faculty Portal Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["faculty", "chairman"]}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/faculty" element={<FacultyDashboardPage />} />
            <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
            <Route path="/faculty/courses" element={<FacultyCoursesPage />} />
            <Route path="/faculty/assignments" element={<FacultyAssignmentsPage />} />
            <Route path="/faculty/submissions" element={<FacultySubmissionsPage />} />
            <Route path="/faculty/students" element={<FacultyStudentsPage />} />
            <Route path="/faculty/analytics" element={<FacultyAnalyticsPage />} />
            <Route path="/faculty/notifications" element={<NotificationsPage />} />
            <Route path="/faculty/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StudyDeckProvider>
  );
}
