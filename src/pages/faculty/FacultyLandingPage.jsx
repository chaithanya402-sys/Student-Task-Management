import React from "react";
import { Link } from "react-router-dom";
import { StudyDeckLogo } from "../../components/common/StudyDeckLogo";
import {
  BookOpen,
  FileText,
  UploadCloud,
  Users,
  BarChart2,
  Bell,
  ArrowRight,
  GraduationCap
} from "lucide-react";

export const FacultyLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 selection:bg-[#0f1f38] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><StudyDeckLogo /></Link>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[11px] font-bold text-blue-800 border border-blue-200">
              For Faculty
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
            <a href="#features" className="hover:text-[#0f1f38]">Features</a>
            <a href="#workflow" className="hover:text-[#0f1f38]">How It Works</a>
            <Link to="/faculty/dashboard" className="text-blue-700 font-bold hover:underline">
              Live Faculty Portal
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
            >
              Log in
            </Link>
            <Link
              to="/faculty/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs"
            >
              Open Faculty Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section matching Image 1 */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-600">
              teaching dashboard for faculty
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0f1f38] tracking-tight leading-[1.08]">
              Grade with focus. Support every student.
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              StudyDeck gives faculty one place to publish assignments, review submissions, track grading and spot students who need a check-in.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/faculty/dashboard"
                className="px-6 py-3 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-md transition-all cursor-pointer"
              >
                Start for free
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
              >
                Explore features
              </a>
            </div>
          </div>

          {/* Right Visual Preview Card matching Image 1 */}
          <div className="lg:col-span-5 bg-[#8795a7] p-3 sm:p-5 rounded-3xl shadow-2xl border border-white/60">
            <div className="bg-white rounded-2xl p-5 shadow-inner space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0f1f38] text-white p-4 rounded-xl">
                  <div className="text-[10px] text-white/70">Awaiting Grading</div>
                  <div className="text-3xl font-extrabold">46</div>
                  <div className="text-[10px] text-white/60">Oldest waiting 6 days</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex flex-col justify-between">
                  <div className="text-[10px] text-gray-400 font-semibold">Grading Progress</div>
                  <div className="text-2xl font-extrabold text-[#0f1f38]">85%</div>
                  <div className="text-[10px] text-gray-500">266 of 312 graded</div>
                </div>
              </div>

              {/* Course Progress mini */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-[11px]">
                <div className="font-bold text-gray-700 text-xs">Submission progress by course</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>CS101 Data Structures</span>
                    <span className="font-semibold text-gray-800">85%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#0f1f38]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>CS204 Databases</span>
                    <span className="font-semibold text-gray-800">78%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[78%] h-full bg-[#0f1f38]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid matching Image 1 */}
      <section id="features" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Features</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f38] mt-1">
              Everything you need to run your courses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Course overview</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                See all four courses with enrollment and submission progress in one place.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Assignment publishing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Create assignments, track what is active and see what is due this week.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Submission review</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Review work in one queue, with Submitted, Late and Resubmitted tags.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex items-center justify-center">
                <Users size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Student check-ins</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Spot students with several overdue items and send a supportive message.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex items-center justify-center">
                <BarChart2 size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Analytics and reports</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Follow grading progress and score distribution, and download reports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex items-center justify-center">
                <Bell size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Timely alerts</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Get notified about late work, resubmissions and the grading backlog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section matching Image 1 */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#8795a7] text-white rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bring your courses into one clear view.
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            Set up StudyDeck for Faculty in a minute.
          </p>
          <div className="pt-2">
            <Link
              to="/faculty/dashboard"
              className="px-6 py-3 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-md transition-all inline-block"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StudyDeckLogo />
            <span>&copy; {new Date().getFullYear()} StudyDeck</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <Link to="/login" className="hover:text-gray-900">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
