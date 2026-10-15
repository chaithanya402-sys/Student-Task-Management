import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { FacultySidebar } from "./FacultySidebar";
import { FacultyTopNav } from "./FacultyTopNav";
import { CreateAssignmentModal } from "./CreateAssignmentModal";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Maximize2, Minimize2 } from "lucide-react";

export const FacultyLayout = () => {
  const { isAuthenticated, user, facultyStats } = useStudyDeck();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFramedView, setIsFramedView] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const location = useLocation();

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
      className={`min-h-screen transition-all duration-300 ${
        isFramedView
          ? "bg-[#8795a7] py-3 sm:py-6 px-2 sm:px-6 flex flex-col items-center justify-center"
          : "bg-[#f4f6f9]"
      }`}
    >
      {/* View switch pill */}
      <div className="w-full max-w-[1440px] flex items-center justify-between pb-2 px-2 text-xs text-white/90 font-medium">
        <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
          StudyDeck Academic Portal &bull; Faculty Teaching Dashboard
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
        <FacultySidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <FacultyTopNav
            title={title}
            subtitle={subtitle}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />

          <main className="flex-1 mt-2">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
