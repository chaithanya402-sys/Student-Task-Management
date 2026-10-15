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
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { StudyDeckLogo } from "../common/StudyDeckLogo";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const Sidebar = ({ isOpen, onClose }) => {
  const { stats, logout, user, isSidebarCollapsed, toggleSidebarCollapse } = useStudyDeck();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center ${
      isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3.5"
    } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 select-none ${
      isActive
        ? "bg-[#282b30] dark:bg-blue-600 text-white shadow-xs font-semibold"
        : "text-[#596579] dark:text-slate-400 hover:text-[#0f1f38] dark:hover:text-slate-100 hover:bg-gray-100/70 dark:hover:bg-slate-800/60"
    }`;

  const navContent = (
    <div className="flex flex-col h-full justify-between py-2">
      <div className="space-y-4">
        {/* Brand header + Collapse Toggle Button */}
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center flex-col gap-2" : "justify-between px-2"} pt-1`}>
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="hover:opacity-90 transition-opacity"
            title="StudyFlow Dashboard"
          >
            <StudyDeckLogo iconOnly={isSidebarCollapsed} brandName="StudyFlow" />
          </NavLink>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex p-1.5 rounded-xl text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar (Hide top preview bar)" : "Collapse Sidebar (Show top preview bar)"}
            aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>

          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Section: MENU */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              Menu
            </div>
          )}
          <NavLink to="/dashboard" onClick={onClose} className={navClass} title="Dashboard">
            <LayoutGrid size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/tasks" onClick={onClose} className={navClass} title="My Tasks">
            <ListTodo size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>My Tasks</span>}
          </NavLink>

          <NavLink to="/assignments" onClick={onClose} className={navClass} title="Assignments">
            <FileText size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>Assignments</span>}
          </NavLink>

          <NavLink to="/calendar" onClick={onClose} className={navClass} title="Calendar / Planner">
            <CalendarIcon size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>Calendar</span>}
          </NavLink>

          <NavLink to="/notifications" onClick={onClose} className={navClass} title="Notifications">
            <div className="relative shrink-0">
              <Bell size={17} />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <>
                <span className="flex-1">Notifications</span>
                {stats.unreadNotifications > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                    {stats.unreadNotifications}
                  </span>
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/progress" onClick={onClose} className={navClass} title="My Progress">
            <BarChart2 size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>My Progress</span>}
          </NavLink>
        </div>

        {/* Section: ACCOUNT */}
        <div className="space-y-1 pt-1">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              Account
            </div>
          )}
          <NavLink to="/profile" onClick={onClose} className={navClass} title="My Profile">
            <User size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>My Profile</span>}
          </NavLink>

          <NavLink to="/settings" onClick={onClose} className={navClass} title="Settings">
            <Sliders size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </NavLink>
        </div>

        {/* Semester Progress Card (Visible only when Expanded) */}
        {!isSidebarCollapsed && (
          <div className="p-3.5 bg-gray-50/90 dark:bg-slate-900/90 rounded-2xl border border-gray-100/90 dark:border-slate-800 my-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-slate-200">
              <span>Autumn 2026</span>
              <span className="text-[#0f1f38] dark:text-blue-400 font-extrabold">65%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="w-[65%] h-full bg-[#0f1f38] dark:bg-blue-600 rounded-full transition-all duration-500"></div>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-slate-400 mt-1.5 block font-medium">Semester Week 8 of 12</span>
          </div>
        )}
      </div>

      {/* Bottom Area: User profile & Logout */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 px-1 space-y-2">
        {/* User preview snippet */}
        <div
          className={`flex items-center ${
            isSidebarCollapsed ? "justify-center p-1" : "gap-2.5 p-2"
          } rounded-xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800`}
          title={`${user.fullName} (${user.programme}, Year ${user.year})`}
        >
          <div className="w-7 h-7 rounded-full bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            {user.initials || "AK"}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate">{user.fullName}</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{user.programme}, Year {user.year}</p>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isSidebarCollapsed ? "justify-center" : "gap-3 px-3"
          } py-2 rounded-xl text-xs font-semibold text-[#596579] dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left`}
          title="Log out"
        >
          <LogOut size={16} />
          {!isSidebarCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar: smooth transition between w-60 (expanded) and w-20 (collapsed) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-gray-100/90 dark:border-slate-800 select-none transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? "w-20 pr-2" : "w-60 pr-4"
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 bg-white dark:bg-[#0e1626] h-full shadow-2xl p-5 z-10 flex flex-col">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
