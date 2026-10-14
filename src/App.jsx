import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudyDeckProvider } from "./context/StudyDeckContext";
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

export default function App() {
  return (
    <StudyDeckProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Student Portal Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StudyDeckProvider>
  );
}
