import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { FacultySidebar } from "./FacultySidebar";
import { FacultyTopNav } from "./FacultyTopNav";
import { CreateAssignmentModal } from "./CreateAssignmentModal";
import { StudyFlowTopPreviewBar } from "../common/StudyFlowTopPreviewBar";
import { StudyCoachModal } from "../common/StudyCoachModal";
import { AuthDemoAccountsModal } from "../common/AuthDemoAccountsModal";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Maximize2, Minimize2 } from "lucide-react";

export const FacultyLayout = () => {
  const {
    isAuthenticated,
    user,
    facultyStats,
    isSidebarCollapsed,
    isStudyCoachOpen,
    setIsStudyCoachOpen,
    isAuthSwitcherOpen,
    setIsAuthSwitcherOpen
  } = useStudyDeck();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFramedView, setIsFramedView] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const location = useLocation();

  // Full Screen toggle handler syncing with browser Fullscreen API
  const toggleViewMode = () => {
    if (isFramedView) {
      setIsFramedView(false);
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFramedView(true);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Sync state if user exits browser fullscreen (e.g. Esc key or F11)
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isFramedView) {
        setIsFramedView(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isFramedView]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Derive title & subtitle based on current faculty route
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case "/faculty":
      case "/faculty/dashboard":
        return {
          title: "Welcome back, Dr. Rao",
          subtitle: `${facultyStats.awaitingGrading} submissions are waiting for your review.`
        };
      case "/faculty/courses":
        return {
          title: "My Courses",
          subtitle: `Autumn 2026 · ${facultyStats.assignedCourses} assigned courses`
        };
      case "/faculty/assignments":
        return {
          title: "Assignments",
          subtitle: "Assignments you have published"
        };
      case "/faculty/submissions":
        return {
          title: "Submissions & Grading",
          subtitle: `${facultyStats.awaitingGrading} pending evaluation · ${facultyStats.gradedCount} graded`
        };
      case "/faculty/students":
        return {
          title: "Enrolled Students",
          subtitle: `${facultyStats.enrolledStudents} students across 4 active courses`
        };
      case "/faculty/analytics":
        return {
          title: "Analytics & Reports",
          subtitle: "Autumn 2026 overview"
        };
      case "/faculty/notifications":
        return {
          title: "Faculty Notifications",
          subtitle: "Submission alerts and course activity updates"
        };
      case "/faculty/profile":
        return {
          title: "Faculty Profile",
          subtitle: "Department and course accreditation details"
        };
      default:
        return {
          title: "StudyDeck Faculty",
          subtitle: "Teaching & coursework management"
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div
      className={`min-h-screen w-full transition-all duration-300 ${
        isFramedView
          ? "bg-[#8795a7] dark:bg-[#070b12] py-3 sm:py-6 px-2 sm:px-6 flex flex-col items-center justify-center"
          : "bg-[#f4f6f9] dark:bg-[#090d16] flex flex-col"
      }`}
    >
      {/* Top Header / View Switcher Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isFramedView
            ? "max-w-[1440px] flex items-center justify-between pb-2 px-2 text-xs text-white/90 font-medium"
            : "px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-gray-700 dark:text-slate-300 font-medium bg-white/80 dark:bg-[#0e1626]/80 border-b border-gray-200/80 dark:border-slate-800/80 backdrop-blur-xs sticky top-0 z-40 shadow-2xs"
        }`}
      >
        <span className="hidden sm:inline-flex items-center gap-1.5 opacity-90">
          StudyDeck Academic Portal &bull; Faculty Teaching Dashboard
        </span>
        <button
          onClick={toggleViewMode}
          className={`ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isFramedView
              ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 shadow-2xs"
          }`}
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

      {/* Main Container: Expands across full viewport when in Full Screen mode */}
      <div
        className={`w-full bg-white dark:bg-[#0e1626] text-slate-900 dark:text-slate-100 transition-all duration-300 ${
          isFramedView
            ? "max-w-[1440px] rounded-3xl sm:rounded-[32px] shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-4 sm:p-7 md:p-8 border border-white/50 dark:border-slate-800/80"
            : "min-h-[calc(100vh-42px)] p-4 sm:p-6 lg:p-8 flex-1"
        } flex flex-col lg:flex-row gap-6 relative`}
      >
        <FacultySidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col w-full">
          {/* Top Horizontal Preview Bar:
              - Appears ONLY when sidebar is collapsed
              - Hidden when sidebar is expanded */}
          {isSidebarCollapsed && (
            <StudyFlowTopPreviewBar
              onOpenCoach={() => setIsStudyCoachOpen(true)}
              onOpenAuth={() => setIsAuthSwitcherOpen(true)}
            />
          )}

          <FacultyTopNav
            title={title}
            subtitle={subtitle}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />

          <main className="flex-1 mt-2 w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
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
