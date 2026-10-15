import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  BookOpen,
  FileText,
  UploadCloud,
  Users,
  BarChart2,
  Bell,
  User,
  LogOut,
  X
} from "lucide-react";
import { StudyDeckLogo } from "../common/StudyDeckLogo";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const FacultySidebar = ({ isOpen, onClose }) => {
  const { facultyStats, logout } = useStudyDeck();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 select-none ${
      isActive
        ? "bg-[#282b30] text-white shadow-xs font-semibold"
        : "text-[#596579] hover:text-[#0f1f38] hover:bg-gray-100/70"
    }`;

  const navContent = (
    <div className="flex flex-col h-full justify-between py-2">
      <div className="space-y-6">
        {/* Brand & Faculty pill */}
        <div className="px-2 pt-1">
          <div className="flex items-center justify-between">
            <NavLink to="/faculty/dashboard" onClick={onClose} className="hover:opacity-90 transition-opacity">
              <StudyDeckLogo />
            </NavLink>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {/* Faculty pill badge matching screenshot */}
          <div className="mt-2.5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f1f3f6] text-[11px] font-bold text-gray-700">
              Faculty
            </span>
          </div>
        </div>

        {/* Section: MENU */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          <NavLink to="/faculty/dashboard" onClick={onClose} className={navClass}>
            <LayoutGrid size={17} className="shrink-0" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/faculty/courses" onClick={onClose} className={navClass}>
            <BookOpen size={17} className="shrink-0" />
            <span>My Courses</span>
          </NavLink>
          <NavLink to="/faculty/assignments" onClick={onClose} className={navClass}>
            <FileText size={17} className="shrink-0" />
            <span>Assignments</span>
          </NavLink>
          <NavLink to="/faculty/submissions" onClick={onClose} className={navClass}>
            <UploadCloud size={17} className="shrink-0" />
            <span className="flex-1">Submissions</span>
            {facultyStats.awaitingGrading > 0 && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#0f1f38] text-white font-bold">
                {facultyStats.awaitingGrading}
              </span>
            )}
          </NavLink>
          <NavLink to="/faculty/students" onClick={onClose} className={navClass}>
            <Users size={17} className="shrink-0" />
            <span>Students</span>
          </NavLink>
          <NavLink to="/faculty/analytics" onClick={onClose} className={navClass}>
            <BarChart2 size={17} className="shrink-0" />
            <span>Analytics & Reports</span>
          </NavLink>
          <NavLink to="/faculty/notifications" onClick={onClose} className={navClass}>
            <Bell size={17} className="shrink-0" />
            <span>Notifications</span>
          </NavLink>
          <NavLink to="/faculty/profile" onClick={onClose} className={navClass}>
            <User size={17} className="shrink-0" />
            <span>My Profile</span>
          </NavLink>
        </div>
      </div>

      {/* Bottom: Logout */}
      <div className="pt-6 border-t border-gray-100 px-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#596579] hover:text-red-700 hover:bg-red-50/60 transition-colors cursor-pointer text-left"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 shrink-0 pr-4 border-r border-gray-100/90 select-none">
        {navContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 bg-white h-full shadow-2xl p-5 z-10 flex flex-col">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
