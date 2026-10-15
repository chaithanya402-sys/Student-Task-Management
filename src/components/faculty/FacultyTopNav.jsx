import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen, Menu, ChevronDown, Check, UserCheck, Bell, Sun, Moon } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const FacultyTopNav = ({ title, subtitle, onToggleMobileMenu, onOpenCreateModal }) => {
  const {
    currentUserId,
    allUsers,
    switchUser,
    facultyStats,
    facultySearchQuery,
    setFacultySearchQuery,
    theme,
    toggleTheme
  } = useStudyDeck();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  const currentUser = allUsers.find((u) => u.id === currentUserId) || {
    name: "Dr. S. Rao",
    department: "Computer Science",
    initials: "SR",
    role: "faculty"
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 select-none">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Action controls matching screenshot */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-56 md:w-64">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={facultySearchQuery}
            onChange={(e) => setFacultySearchQuery(e.target.value)}
            placeholder="Search students or assignments"
            className="w-full bg-[#f1f3f6] dark:bg-slate-800/90 hover:bg-[#ebeeef] dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-xs text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 pl-9 pr-3.5 py-2 rounded-xl border border-transparent focus:border-gray-200 dark:focus:border-slate-700 focus:outline-none transition-all shadow-2xs"
          />
        </div>

        {/* "+ Create assignment" button matching screenshot */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus size={14} />
          <span>Create assignment</span>
        </button>

        {/* "View courses" button matching screenshot */}
        <button
          onClick={() => navigate("/faculty/courses")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#f1f3f6] dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-[#e5e8ed] dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/60 transition-colors cursor-pointer active:scale-95"
        >
          <span>View courses</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-[#f1f3f6] dark:bg-slate-800 hover:bg-[#e5e8ed] dark:hover:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-slate-200 transition-all cursor-pointer border border-transparent dark:border-slate-700/60 active:scale-95 shadow-2xs"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={16} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon size={16} className="text-slate-700 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Quick Role & Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 text-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors cursor-pointer active:scale-95"
            title="Switch between Dr. Rao (Faculty) and Students"
          >
            <UserCheck size={14} />
            <span className="hidden sm:inline">Switch Account</span>
            <ChevronDown size={13} />
          </button>

          {isSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-xs font-bold text-[#0f1f38] dark:text-white">Interactive Account Switcher</span>
                <p className="text-[10px] text-gray-400 dark:text-slate-400">Test connected faculty & student workflows</p>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800/60 pt-1">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUserId;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsSwitcherOpen(false);
                        if (u.role === "faculty") {
                          navigate("/faculty/dashboard");
                        } else {
                          navigate("/dashboard");
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/70 flex items-center justify-between cursor-pointer transition-colors ${
                        isCurrent ? "bg-blue-50/70 dark:bg-slate-800" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {u.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400 capitalize">
                            {u.role} · {u.department}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <Check size={14} className="text-blue-700 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Faculty Profile Badge matching screenshot: SR Dr. S. Rao */}
        <Link
          to="/faculty/profile"
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-gray-100/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-wider shadow-2xs">
            {currentUser.initials || "SR"}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-[#0f1f38] dark:text-slate-100 truncate max-w-[120px]">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate max-w-[120px]">
              {currentUser.department}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
