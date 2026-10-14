import React, { useState } from "react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Save, Bell, Shield, Sliders, CheckCircle2, AlertCircle } from "lucide-react";

export const SettingsPage = () => {
  const { user, updateProfile, resetToDefaults } = useStudyDeck();

  const [activeTab, setActiveTab] = useState("general");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    deadlineReminders: true,
    feedbackAlerts: true,
    weeklyReport: false
  });

  // Security password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSuccessMessage("Your settings and notification preferences have been updated.");
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      setErrorMessage("Please enter your current password");
      return;
    }
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Password changed successfully.");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 animate-fadeIn">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === "general"
              ? "bg-white text-[#0f1f38] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Sliders size={14} />
          <span>General & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-white text-[#0f1f38] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Shield size={14} />
          <span>Password & Security</span>
        </button>
      </div>

      {activeTab === "general" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">
              Notification Preferences
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose how you want to be notified about deadlines and instructor updates.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5">
            <div className="space-y-3.5 divide-y divide-gray-100">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">Email Alerts</div>
                  <div className="text-[11px] text-gray-500">Receive email notices for newly published assignments.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSettings.emailAlerts}
                  onChange={(e) => setNotifSettings({ ...notifSettings, emailAlerts: e.target.checked })}
                  className="rounded border-gray-300 text-[#0f1f38] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="pt-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">Deadline Reminders</div>
                  <div className="text-[11px] text-gray-500">Alert me 48 hours before an assignment deadline is due.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSettings.deadlineReminders}
                  onChange={(e) => setNotifSettings({ ...notifSettings, deadlineReminders: e.target.checked })}
                  className="rounded border-gray-300 text-[#0f1f38] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="pt-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">Feedback & Grading Notices</div>
                  <div className="text-[11px] text-gray-500">Notify immediately when instructor feedback or marks are posted.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSettings.feedbackAlerts}
                  onChange={(e) => setNotifSettings({ ...notifSettings, feedbackAlerts: e.target.checked })}
                  className="rounded border-gray-300 text-[#0f1f38] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="pt-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">Weekly Productivity Digest</div>
                  <div className="text-[11px] text-gray-500">Summary of completed tasks sent every Sunday evening.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSettings.weeklyReport}
                  onChange={(e) => setNotifSettings({ ...notifSettings, weeklyReport: e.target.checked })}
                  className="rounded border-gray-300 text-[#0f1f38] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Reset Prototype Data to Defaults
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === "security" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">
              Change Password
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your account password to ensure security.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
