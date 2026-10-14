import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { FilterModal } from "../common/FilterModal";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Maximize2, Minimize2 } from "lucide-react";

export const AppLayout = () => {
  const { isAuthenticated, user, stats } = useStudyDeck();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFramedView, setIsFramedView] = useState(true);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Derive title & subtitle based on current route
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case "/dashboard":
        return {
          title: `Welcome back, ${user.fullName.split(" ")[0]}`,
          subtitle: "Here is your workload for this week."
        };
      case "/tasks":
        return {
          title: "My Tasks",
          subtitle: `${stats.pendingTasks} pending · ${stats.overdueTasks} overdue · ${stats.completedTasks} completed`
        };
      case "/assignments":
        return {
          title: "Assignments",
          subtitle: `${stats.submittedAssignments} of ${stats.totalAssignments} assignments submitted (${stats.assignmentCompletionRate}%)`
        };
      case "/calendar":
        return {
          title: "Academic Calendar",
          subtitle: "Deadlines and scheduled coursework events."
        };
      case "/notifications":
        return {
          title: "Notifications",
          subtitle: `${stats.unreadNotifications} unread`
        };
      case "/progress":
        return {
          title: "My Progress",
          subtitle: `Average grade ${stats.averageGrade}%`
        };
      case "/profile":
        return {
          title: "My Profile",
          subtitle: "Account details"
        };
      case "/settings":
        return {
          title: "Settings",
          subtitle: "System preferences and configurations"
        };
      default:
        return {
          title: "StudyDeck",
          subtitle: "Student task management platform"
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isFramedView
          ? "bg-[#8795a7] py-3 sm:py-6 px-2 sm:px-6 flex flex-col items-center justify-center"
          : "bg-[#f4f6f9]"
      }`}
    >
      {/* View switch pill (Allows toggling between screenshot framing and full responsive window) */}
      <div className="w-full max-w-[1440px] flex items-center justify-between pb-2 px-2 text-xs text-white/90 font-medium">
        <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
          StudyDeck Academic Portal &bull; Student Dashboard
        </span>
        <button
          onClick={() => setIsFramedView(!isFramedView)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs transition-colors cursor-pointer backdrop-blur-xs"
        >
          {isFramedView ? (
            <>
              <Maximize2 size={13} />
              <span>Full Screen View</span>
            </>
          ) : (
            <>
              <Minimize2 size={13} />
              <span>Framed Screenshot View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container matching screenshot roundness and white card layout */}
      <div
        className={`w-full max-w-[1440px] bg-white transition-all duration-300 ${
          isFramedView
            ? "rounded-3xl sm:rounded-[32px] shadow-2xl p-4 sm:p-7 md:p-8 border border-white/50"
            : "min-h-screen p-4 sm:p-6"
        } flex flex-col lg:flex-row gap-6 relative`}
      >
        {/* Sidebar */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <TopNav
            title={title}
            subtitle={subtitle}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 mt-2">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Filter Modal */}
      <FilterModal />
    </div>
  );
};
