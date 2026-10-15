import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RotateCcw, Sparkles, Key, Check, ChevronDown } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const StudyFlowTopPreviewBar = ({ onOpenCoach, onOpenAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allUsers, currentUserId, switchUser } = useStudyDeck();
  const [resetting, setResetting] = useState(false);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path) => {
    const active = isActive(path);
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-semibold whitespace-nowrap cursor-pointer shrink-0 ${
      active
        ? "bg-[#0f1f38] text-white shadow-xs font-bold"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
    }`;
  };

  const handleReset = () => {
    setResetting(true);
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  return (
    <div className="w-full bg-white rounded-full py-1.5 px-3 border border-gray-200/90 shadow-xs flex items-center justify-between gap-3 overflow-x-auto select-none mb-4 animate-fadeIn no-scrollbar">
      {/* Brand prefix matching screenshot */}
      <div className="flex items-center gap-2 shrink-0 pr-1 border-r border-gray-100">
        <div className="w-6 h-6 rounded-full bg-[#0f1f38] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-tight shadow-2xs">
          S
        </div>
        <span className="text-xs font-extrabold text-[#0f1f38] tracking-tight whitespace-nowrap">
          StudyFlow System Preview
        </span>
      </div>

      {/* Navigation items matching screenshot */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1">
        <Link to="/" className={navItemClass("/")}>
          <span>🎓</span>
          <span>Student Landing</span>
        </Link>

        <Link to="/faculty/landing" className={navItemClass("/faculty/landing")}>
          <span>👩‍🏫</span>
          <span>Faculty Landing</span>
        </Link>

        <Link to="/dashboard" className={navItemClass("/dashboard")}>
          <span>🎓</span>
          <span>Student Dashboard</span>
        </Link>

        <Link to="/tasks" className={navItemClass("/tasks")}>
          <span>📝</span>
          <span>My Tasks</span>
        </Link>

        <Link to="/calendar" className={navItemClass("/calendar")}>
          <span>🎯</span>
          <span>Study Planner</span>
        </Link>

        <Link to="/faculty/dashboard" className={navItemClass("/faculty/dashboard")}>
          <span>👩‍🏫</span>
          <span>Faculty Dashboard</span>
        </Link>

        <Link to="/faculty/submissions" className={navItemClass("/faculty/submissions")}>
          <span>📋</span>
          <span>Submissions & Grading</span>
        </Link>

        {/* Study Coach (Overlay) button */}
        <button
          onClick={onOpenCoach}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>✨</span>
          <span>Study Coach (Overlay)</span>
        </button>

        {/* Auth / Demo Accounts button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>🔐</span>
          <span>Auth / Demo Accounts</span>
        </button>
      </div>

      {/* Right controls: Demo Mode pill & Reset */}
      <div className="flex items-center gap-2 shrink-0 pl-1 border-l border-gray-100">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Demo Mode</span>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
          title="Reset prototype state to defaults"
        >
          <RotateCcw size={13} className={resetting ? "animate-spin" : ""} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
