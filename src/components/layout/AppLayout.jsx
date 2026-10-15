import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { FilterModal } from "../common/FilterModal";
import { StudyFlowTopPreviewBar } from "../common/StudyFlowTopPreviewBar";
import { StudyCoachModal } from "../common/StudyCoachModal";
import { AuthDemoAccountsModal } from "../common/AuthDemoAccountsModal";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Maximize2, Minimize2 } from "lucide-react";

export const AppLayout = () => {
  const {
    isAuthenticated,
    user,
    stats,
    isSidebarCollapsed,
    isStudyCoachOpen,
    setIsStudyCoachOpen,
    isAuthSwitcherOpen,
    setIsAuthSwitcherOpen
  } = useStudyDeck();

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
          title: "StudyFlow",
          subtitle: "Student task management platform"
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isFramedView
          ? "bg-[#8795a7] dark:bg-[#070b12] py-3 sm:py-6 px-2 sm:px-6 flex flex-col items-center justify-center"
          : "bg-[#f4f6f9] dark:bg-[#090d16]"
      }`}
    >
      {/* Frame top indicator */}
      <div className="w-full max-w-[1440px] flex items-center justify-between pb-2 px-2 text-xs text-white/90 font-medium">
        <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
          StudyFlow Academic Portal &bull; Student Dashboard
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

      {/* Main Container matching screenshot roundness */}
      <div
        className={`w-full max-w-[1440px] bg-white dark:bg-[#0e1626] text-slate-900 dark:text-slate-100 transition-all duration-300 ${
          isFramedView
            ? "rounded-3xl sm:rounded-[32px] shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-4 sm:p-7 md:p-8 border border-white/50 dark:border-slate-800/80"
            : "min-h-screen p-4 sm:p-6"
        } flex flex-col lg:flex-row gap-6 relative`}
      >
        {/* Sidebar (Expands or Collapses without covering main content) */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Horizontal Preview Bar:
              - Appears ONLY when sidebar is collapsed
              - Hidden when sidebar is expanded */}
          {isSidebarCollapsed && (
            <StudyFlowTopPreviewBar
              onOpenCoach={() => setIsStudyCoachOpen(true)}
              onOpenAuth={() => setIsAuthSwitcherOpen(true)}
            />
          )}

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

      {/* Global Modals */}
      <FilterModal />
      <StudyCoachModal
        isOpen={isStudyCoachOpen}
        onClose={() => setIsStudyCoachOpen(false)}
      />
      <AuthDemoAccountsModal
        isOpen={isAuthSwitcherOpen}
        onClose={() => setIsAuthSwitcherOpen(false)}
      />
    </div>
  );
};
