import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ListTodo,
  FileText,
  Calendar as CalendarIcon,
  Bell,
  BarChart2,
  User,
  Sliders,
  LogOut,
  X
} from "lucide-react";
import { StudyDeckLogo } from "../common/StudyDeckLogo";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const Sidebar = ({ isOpen, onClose }) => {
  const { stats, logout } = useStudyDeck();
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
      {/* Brand & Menu */}
      <div className="space-y-6">
        {/* Logo and close button on mobile */}
        <div className="flex items-center justify-between px-2 pt-1">
          <NavLink to="/dashboard" onClick={onClose} className="hover:opacity-90 transition-opacity">
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

        {/* Section: MENU */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          <NavLink to="/dashboard" onClick={onClose} className={navClass}>
            <LayoutGrid size={17} className="shrink-0" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/tasks" onClick={onClose} className={navClass}>
            <ListTodo size={17} className="shrink-0" />
            <span>My Tasks</span>
          </NavLink>
          <NavLink to="/assignments" onClick={onClose} className={navClass}>
            <FileText size={17} className="shrink-0" />
            <span>Assignments</span>
          </NavLink>
          <NavLink to="/calendar" onClick={onClose} className={navClass}>
            <CalendarIcon size={17} className="shrink-0" />
            <span>Calendar</span>
          </NavLink>
          <NavLink to="/notifications" onClick={onClose} className={navClass}>
            <div className="relative shrink-0">
              <Bell size={17} />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
              )}
            </div>
            <span className="flex-1">Notifications</span>
            {stats.unreadNotifications > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-100 text-blue-800 font-bold">
                {stats.unreadNotifications}
              </span>
            )}
          </NavLink>
          <NavLink to="/progress" onClick={onClose} className={navClass}>
            <BarChart2 size={17} className="shrink-0" />
            <span>My Progress</span>
          </NavLink>
        </div>

        {/* Section: ACCOUNT */}
        <div className="space-y-1 pt-2">
          <div className="px-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Account
          </div>
          <NavLink to="/profile" onClick={onClose} className={navClass}>
            <User size={17} className="shrink-0" />
            <span>My Profile</span>
          </NavLink>
          <NavLink to="/settings" onClick={onClose} className={navClass}>
            <Sliders size={17} className="shrink-0" />
            <span>Settings</span>
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
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 pr-4 border-r border-gray-100/90 select-none">
        {navContent}
      </aside>

      {/* Mobile drawer */}
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
