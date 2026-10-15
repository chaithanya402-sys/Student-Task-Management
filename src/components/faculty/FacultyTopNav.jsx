import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen, Menu, ChevronDown, Check, UserCheck, Bell } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const FacultyTopNav = ({ title, subtitle, onToggleMobileMenu, onOpenCreateModal }) => {
  const {
    currentUserId,
    allUsers,
    switchUser,
    facultyStats,
    facultySearchQuery,
    setFacultySearchQuery
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
          className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0f1f38] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 font-normal">
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={facultySearchQuery}
            onChange={(e) => setFacultySearchQuery(e.target.value)}
            placeholder="Search students or assignments"
            className="w-full bg-[#f1f3f6] hover:bg-[#ebeeef] focus:bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-3.5 py-2 rounded-xl border border-transparent focus:border-gray-200 focus:outline-none transition-all"
          />
        </div>

        {/* "+ Create assignment" button matching screenshot */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Create assignment</span>
        </button>

        {/* "View courses" button matching screenshot */}
        <button
          onClick={() => navigate("/faculty/courses")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#f1f3f6] text-gray-800 hover:bg-[#e5e8ed] transition-colors cursor-pointer"
        >
          <span>View courses</span>
        </button>

        {/* Quick Role & Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
            title="Switch between Dr. Rao (Faculty) and Students"
          >
            <UserCheck size={14} />
            <span className="hidden sm:inline">Switch Account</span>
            <ChevronDown size={13} />
          </button>

          {isSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#0f1f38]">Interactive Account Switcher</span>
                <p className="text-[10px] text-gray-400">Test connected faculty & student workflows</p>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 pt-1">
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
                      className={`w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors ${
                        isCurrent ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0f1f38] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {u.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 leading-tight">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-gray-500 capitalize">
                            {u.role} · {u.department}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <Check size={14} className="text-blue-700 shrink-0" />}
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
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#0f1f38] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-wider">
            {currentUser.initials || "SR"}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-[#0f1f38] truncate max-w-[120px]">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-gray-500 truncate max-w-[120px]">
              {currentUser.department}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
