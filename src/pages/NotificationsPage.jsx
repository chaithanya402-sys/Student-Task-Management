import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { CheckCheck, Trash2, Filter } from "lucide-react";

export const NotificationsPage = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    stats,
    searchQuery
  } = useStudyDeck();

  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.course.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "alerts") return n.type === "alert";
    if (activeTab === "reminders") return n.type === "reminder";
    if (activeTab === "feedback") return n.type === "feedback";
    return true;
  });

  const handleNotificationClick = (item) => {
    markNotificationRead(item.id);
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP 4 CARDS matching Image 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unread (Dark Navy) */}
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-white/80">Unread</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.unreadNotifications}
            </span>
          </div>
          <span className="text-xs text-white/70">Since yesterday</span>
        </Card>

        {/* Card 2: Overdue alerts (White) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Overdue alerts</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.overdueAlerts}
            </span>
          </div>
          <span className="text-xs text-gray-500">Poetry Analysis</span>
        </Card>

        {/* Card 3: Reminders (White) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Reminders</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.reminderAlerts}
            </span>
          </div>
          <span className="text-xs text-gray-500">Deadline soon</span>
        </Card>

        {/* Card 4: Feedback (White) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Feedback</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.feedbackAlerts}
            </span>
          </div>
          <span className="text-xs text-gray-500">Revision required</span>
        </Card>
      </div>

      {/* 2. RECENT NOTIFICATIONS LIST matching Image 5 */}
      <Card className="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Recent</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Updates on assignments, submissions and course instructor announcements
            </p>
          </div>

          <div className="flex items-center gap-2">
            {stats.unreadNotifications > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification items matching Image 5 */}
        <div className="divide-y divide-gray-100 pt-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No notifications to display in this view.
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`py-4 px-2 sm:px-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors rounded-xl cursor-pointer group ${
                  !notif.isRead ? "bg-white" : "opacity-80"
                }`}
              >
                <div className="space-y-1 pr-4">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {notif.meta}
                  </p>
                </div>

                {/* Blue indicator dot on right side matching Image 5 */}
                <div className="shrink-0 flex items-center gap-3">
                  {!notif.isRead ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0f1f38] group-hover:bg-blue-600 transition-colors"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
