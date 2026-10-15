import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StudyDeckLogo } from "../components/common/StudyDeckLogo";
import { useStudyDeck } from "../context/StudyDeckContext";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  BarChart2,
  FileText,
  Clock,
  ShieldCheck,
  User,
  GraduationCap,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Users,
  Check,
  Layers
} from "lucide-react";

export const LandingPage = () => {
  const { theme, toggleTheme, stats, facultyStats } = useStudyDeck();
  const [previewTab, setPreviewTab] = useState("student"); // 'student' | 'faculty'

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-gray-900 dark:text-slate-100 selection:bg-[#0f1f38] selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0e1626]/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <StudyDeckLogo brandName="StudyFlow" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600 dark:text-slate-300">
            <a href="#features" className="hover:text-[#0f1f38] dark:hover:text-white transition-colors">
              Platform Features
            </a>
            <a href="#roles" className="hover:text-[#0f1f38] dark:hover:text-white transition-colors">
              Academic Roles
            </a>
            <a href="#metrics" className="hover:text-[#0f1f38] dark:hover:text-white transition-colors">
              Productivity
            </a>
            <Link to="/dashboard" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 transition-colors font-bold">
              Student Portal
            </Link>
            <Link to="/faculty/dashboard" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 transition-colors font-bold">
              Faculty Portal
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-slate-200 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
              title="Toggle Dark / Light Mode"
            >
              {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
            </button>

            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:text-[#0f1f38] hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-xs transition-all active:scale-95"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs font-semibold">
            <GraduationCap size={15} />
            <span>Refined Academic Task Management & Connected Curriculum</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight leading-[1.1]">
            Every assignment and deadline in one unified system.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            One connected platform for students, faculty, and departments. When instructors publish coursework, students receive it instantly with synced grading and deadline pacing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>🎓 Student Dashboard</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/faculty/dashboard"
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>👩‍🏫 Faculty Teaching Portal</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Hero Interactive App Preview */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-20 dark:opacity-40"></div>
          <div className="relative bg-[#8795a7] dark:bg-[#070b12] p-3 sm:p-5 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800/80">
            {/* Embedded Mini StudyDeck Interface Preview */}
            <div className="bg-white dark:bg-[#0e1626] rounded-2xl p-4 sm:p-6 shadow-inner space-y-4 text-slate-900 dark:text-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <StudyDeckLogo brandName="StudyFlow" />
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                    | Connected Campus Preview
                  </span>
                </div>

                {/* Preview Switcher Tabs */}
                <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setPreviewTab("student")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      previewTab === "student"
                        ? "bg-white dark:bg-slate-900 text-[#0f1f38] dark:text-white shadow-xs font-bold"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
                    }`}
                  >
                    🎓 Student Experience
                  </button>
                  <button
                    onClick={() => setPreviewTab("faculty")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      previewTab === "faculty"
                        ? "bg-white dark:bg-slate-900 text-[#0f1f38] dark:text-white shadow-xs font-bold"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
                    }`}
                  >
                    👩‍🏫 Faculty Experience
                  </button>
                </div>
              </div>

              {previewTab === "student" ? (
                /* Student Preview Cards */
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#0f1f38] dark:bg-blue-600 text-white p-3.5 rounded-xl">
                      <div className="text-[11px] text-white/80">Total Tasks</div>
                      <div className="text-2xl font-bold">{stats.totalTasks}</div>
                      <div className="text-[10px] text-white/70">{stats.personalTasks} personal, {stats.assignedTasks} coursework</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl">
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">Pending</div>
                      <div className="text-2xl font-bold text-[#0f1f38] dark:text-white">{stats.pendingTasks}</div>
                      <div className="text-[10px] text-gray-400">5 due within 7 days</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl">
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">Completed</div>
                      <div className="text-2xl font-bold text-[#0f1f38] dark:text-white">{stats.completedTasks}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{stats.taskCompletionRate}% completion rate</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl">
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">Average Grade</div>
                      <div className="text-2xl font-bold text-[#0f1f38] dark:text-white">{stats.averageGrade}%</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Autumn 2026 Standing</div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-slate-300 font-medium">
                      📌 Next deadline: <strong>CS101 Binary Tree Implementation</strong> &bull; Due Oct 24
                    </span>
                    <Link
                      to="/dashboard"
                      className="px-3 py-1 bg-[#0f1f38] dark:bg-blue-600 text-white rounded-lg font-bold hover:bg-[#1a2e4f]"
                    >
                      Open Portal &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                /* Faculty Preview Cards */
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#0f1f38] dark:bg-blue-600 text-white p-3.5 rounded-xl">
                      <div className="text-[11px] text-white/80">Awaiting Review</div>
                      <div className="text-2xl font-bold">{facultyStats.awaitingGrading}</div>
                      <div className="text-[10px] text-white/70">Across 4 active courses</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl">
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">Graded</div>
                      <div className="text-2xl font-bold text-[#0f1f38] dark:text-white">{facultyStats.gradedCount}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{facultyStats.gradedPercentage}% evaluated</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl">
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">Enrolled Students</div>
                      <div className="text-2xl font-bold text-[#0f1f38] dark:text-white">{facultyStats.enrolledStudents}</div>
                      <div className="text-[10px] text-gray-400">Computer Science Dept</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3.5 rounded-xl">
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">Active Courses</div>
                      <div className="text-2xl font-bold text-[#0f1f38] dark:text-white">{facultyStats.assignedCourses}</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">CS101, CS204, CS310, CS402</div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-slate-300 font-medium">
                      📋 <strong>Dr. S. Rao</strong> has 46 student submissions ready for evaluation with rubric feedback.
                    </span>
                    <Link
                      to="/faculty/dashboard"
                      className="px-3 py-1 bg-[#0f1f38] dark:bg-blue-600 text-white rounded-lg font-bold hover:bg-[#1a2e4f]"
                    >
                      Open Faculty Portal &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Role Showcase */}
      <section id="roles" className="py-16 bg-white dark:bg-[#0e1626] border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f38] dark:text-white">
              Designed for Higher Education
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              One unified platform catering to every role in the academic workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student */}
            <div className="p-6 rounded-2xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-200/80 dark:border-slate-800 hover:border-[#0f1f38] dark:hover:border-blue-500 transition-all duration-200 space-y-3 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center">
                <User size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0f1f38] dark:text-white">Student</h3>
              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                Track coursework tasks, submit assignments with verified timestamps, view instructor feedback, and monitor progress across all enrolled subjects.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                Personal & assigned study management &rarr;
              </div>
            </div>

            {/* Faculty */}
            <div className="p-6 rounded-2xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-200/80 dark:border-slate-800 hover:border-[#0f1f38] dark:hover:border-blue-500 transition-all duration-200 space-y-3 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center">
                <FileText size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0f1f38] dark:text-white">Faculty</h3>
              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                Publish assignment criteria, set due dates and rubrics, review submitted student coursework, and provide structured grading with feedback.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                Streamlined curriculum grading &rarr;
              </div>
            </div>

            {/* Department Leadership */}
            <div className="p-6 rounded-2xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-200/80 dark:border-slate-800 hover:border-[#0f1f38] dark:hover:border-blue-500 transition-all duration-200 space-y-3 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center">
                <BarChart2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0f1f38] dark:text-white">Institutional Oversight</h3>
              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                Monitor departmental completion statistics, average grade distributions, on-time submissions, and academic integrity metrics campus-wide.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                Departmental metrics & reporting &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Metrics section */}
      <section id="metrics" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f1f38] dark:bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-transparent dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10 dark:divide-slate-800">
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">85%</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-300">
                Assignment Completion Rate
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                17 of 20 coursework submissions successfully turned in on schedule.
              </p>
            </div>

            <div className="space-y-2 pt-6 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">78%</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-300">
                On-time Submissions
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                Consistent adherence to academic calendar milestones.
              </p>
            </div>

            <div className="space-y-2 pt-6 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">84.7%</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-300">
                Average Academic Standing
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                Demonstrated performance across Data Structures, Databases, and Systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0e1626] border-t border-gray-100 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StudyDeckLogo brandName="StudyFlow" />
            <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">
              &copy; {new Date().getFullYear()} StudyFlow Academic Systems. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-slate-400 font-medium">
            <Link to="/login" className="hover:text-gray-900 dark:hover:text-white">Sign In</Link>
            <Link to="/dashboard" className="hover:text-gray-900 dark:hover:text-white">Student Portal</Link>
            <Link to="/faculty/dashboard" className="hover:text-gray-900 dark:hover:text-white">Faculty Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
