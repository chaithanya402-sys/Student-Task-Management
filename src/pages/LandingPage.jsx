import React from "react";
import { Link } from "react-router-dom";
import { StudyDeckLogo } from "../components/common/StudyDeckLogo";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  BarChart2,
  FileText,
  Clock,
  ShieldCheck,
  User,
  GraduationCap
} from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 selection:bg-[#0f1f38] selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <StudyDeckLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
            <a href="#features" className="hover:text-[#0f1f38] transition-colors">
              Features
            </a>
            <a href="#roles" className="hover:text-[#0f1f38] transition-colors">
              Who It's For
            </a>
            <a href="#metrics" className="hover:text-[#0f1f38] transition-colors">
              Productivity
            </a>
            <Link to="/dashboard" className="text-blue-700 hover:text-blue-900 transition-colors">
              Live Dashboard Preview
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-[#0f1f38] hover:bg-gray-100 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <GraduationCap size={15} />
            <span>Academic Workload & Deadline Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0f1f38] tracking-tight leading-[1.1]">
            Every assignment and deadline in one place.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            One unified system for students, faculty and the institution. Built on identical records so everyone sees the exact same academic picture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-xs transition-all cursor-pointer"
            >
              Sign In to Portal
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-all cursor-pointer"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>

        {/* Hero Interactive App Preview */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-20"></div>
          <div className="relative bg-[#8795a7] p-3 sm:p-5 rounded-3xl shadow-2xl border border-white/50">
            {/* Embedded Mini StudyDeck Interface Preview */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <StudyDeckLogo />
                  <span className="text-xs text-gray-400 font-medium">| Student Portal</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-gray-600">Active Semester 2026</span>
                </div>
              </div>

              {/* Sample 4 summary cards preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0f1f38] text-white p-3.5 rounded-xl">
                  <div className="text-[11px] text-white/70">Total Tasks</div>
                  <div className="text-2xl font-bold">40</div>
                  <div className="text-[10px] text-white/60">28 personal, 12 assigned</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                  <div className="text-[11px] text-gray-500">Pending</div>
                  <div className="text-2xl font-bold text-[#0f1f38]">12</div>
                  <div className="text-[10px] text-gray-400">5 due within 7 days</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                  <div className="text-[11px] text-gray-500">Completed</div>
                  <div className="text-2xl font-bold text-[#0f1f38]">24</div>
                  <div className="text-[10px] text-gray-400">60% of all tasks</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                  <div className="text-[11px] text-gray-500">Overdue</div>
                  <div className="text-2xl font-bold text-[#0f1f38]">4</div>
                  <div className="text-[10px] text-red-500 font-semibold">Needs attention</div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1.5"
                >
                  Click to launch full interactive dashboard experience <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Showcase matching Image 2 */}
      <section id="roles" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f38]">
              Designed for Higher Education
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              One unified platform catering to every role in the academic workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student */}
            <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-[#0f1f38] transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0f1f38] text-white flex items-center justify-center">
                <User size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0f1f38]">Student</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Track coursework tasks, submit assignments with verified timestamps, view instructor feedback, and monitor progress across all enrolled subjects.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700">
                Personal & assigned study management &rarr;
              </div>
            </div>

            {/* Faculty */}
            <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-[#0f1f38] transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0f1f38] text-white flex items-center justify-center">
                <FileText size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0f1f38]">Faculty</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Publish assignment criteria, set due dates and rubrics, review submitted student coursework, and provide structured grading with feedback.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700">
                Streamlined curriculum grading &rarr;
              </div>
            </div>

            {/* Chairman */}
            <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-[#0f1f38] transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0f1f38] text-white flex items-center justify-center">
                <BarChart2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0f1f38]">Chairman</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Monitor departmental completion statistics, average grade distributions, on-time submissions, and academic integrity metrics campus-wide.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700">
                Institutional oversight & analytics &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Metrics section */}
      <section id="metrics" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f1f38] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
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
                Demonstrated performance across Biology, Mathematics, and History.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StudyDeckLogo />
            <span className="text-xs text-gray-400 ml-2">
              &copy; {new Date().getFullYear()} StudyDeck Academic Systems. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
            <Link to="/login" className="hover:text-gray-900">Sign In</Link>
            <Link to="/register" className="hover:text-gray-900">Register</Link>
            <Link to="/dashboard" className="hover:text-gray-900">Student Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
