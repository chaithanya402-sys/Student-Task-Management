import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Bell, Menu, X, Check, ArrowRight, UserCheck, ChevronDown } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const TopNav = ({ title, subtitle, onToggleMobileMenu }) => {
  const {
    user,
    stats,
    searchQuery,
    setSearchQuery,
    setIsFilterModalOpen,
    activeFilter,
    notifications,
    markNotificationRead,
    currentUserId,
    allUsers,
    switchUser
  } = useStudyDeck();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 select-none">
      {/* Title & Mobile trigger */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Action controls matching screenshot */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-56 md:w-60">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or assignments"
            className="w-full bg-[#f1f3f6] hover:bg-[#ebeeef] focus:bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-3.5 py-2 rounded-xl border border-transparent focus:border-gray-200 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter !== "all"
              ? "bg-[#0f1f38] text-white"
              : "bg-[#f1f3f6] text-gray-700 hover:bg-[#e5e8ed]"
          }`}
        >
          <Filter size={14} />
          <span>Filter</span>
          {activeFilter !== "all" && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-0.5"></span>
          )}
        </button>

        {/* Account Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
            title="Switch between Students and Dr. Rao (Faculty)"
          >
            <UserCheck size={14} />
            <span className="hidden sm:inline">Switch Role</span>
            <ChevronDown size={13} />
          </button>

          {isSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#0f1f38]">Interactive Account Switcher</span>
                <p className="text-[10px] text-gray-400">Switch role to test connected data</p>
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

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="w-9 h-9 rounded-full bg-[#f1f3f6] hover:bg-[#e5e8ed] flex items-center justify-center text-gray-700 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {stats.unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#0f1f38]">Notifications</span>
                <span className="text-[11px] font-semibold text-blue-700">
                  {stats.unreadNotifications} unread
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setIsNotifDropdownOpen(false);
                      navigate(n.link || "/notifications");
                    }}
                    className={`p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex items-start gap-2.5 ${
                      !n.isRead ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {n.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsNotifDropdownOpen(false)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1 py-1"
                >
                  View all notifications <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Avatar & Name */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#0f1f38] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-wider">
            {user.initials || "AK"}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-[#0f1f38] truncate max-w-[110px]">
              {user.fullName || "Alex Kumar"}
            </div>
            <div className="text-[11px] text-gray-500 truncate max-w-[110px]">
              {user.programme || "B.Tech"}, Year {user.year || "2"}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
