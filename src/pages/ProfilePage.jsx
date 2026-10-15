import React, { useState } from "react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { User, Mail, GraduationCap, Calendar, CheckCircle2, Save, RotateCcw } from "lucide-react";

export const ProfilePage = () => {
  const { user, updateProfile } = useStudyDeck();

  const [formData, setFormData] = useState({
    fullName: user.fullName || "Alex Kumar",
    programme: user.programme || "B.Tech",
    year: user.year || "2",
    email: user.email || "alex.kumar@college.edu",
    studentId: user.studentId || "SD-2024-8842",
    department: user.department || "Computer Science & Engineering"
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: user.fullName,
      programme: user.programme,
      year: user.year,
      email: user.email,
      studentId: user.studentId,
      department: user.department
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 w-full">
      {savedSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card matching Image 3 */}
      <Card className="p-6 sm:p-9 space-y-8">
        {/* Profile Header & Avatar */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f1f38] tracking-tight">
                {formData.fullName}
              </h2>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] transition-all cursor-pointer shadow-xs"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-5 pt-6">
            {/* Big Dark Navy Avatar Circle */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0f1f38] text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl tracking-widest shrink-0 shadow-md">
              {user.initials || "AK"}
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-gray-500">
                {formData.programme}, Year {formData.year}
              </span>
              <p className="text-xs text-gray-400">
                Student ID: <span className="font-mono text-gray-700">{formData.studentId}</span>
              </p>
              <p className="text-xs text-gray-400">
                {formData.department}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Fields matching Image 3 Layout */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  isEditing
                    ? "bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0f1f38]"
                    : "bg-[#f1f3f6] border border-transparent text-gray-800"
                }`}
              />
            </div>

            {/* Programme */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Programme
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.programme}
                onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  isEditing
                    ? "bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0f1f38]"
                    : "bg-[#f1f3f6] border border-transparent text-gray-800"
                }`}
              />
            </div>

            {/* Year */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Year
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  isEditing
                    ? "bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0f1f38]"
                    : "bg-[#f1f3f6] border border-transparent text-gray-800 text-center"
                }`}
              />
            </div>
          </div>

          {/* Email matching Image 3 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="[YOUR EMAIL]"
              className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                isEditing
                  ? "bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0f1f38]"
                  : "bg-[#f1f3f6] border border-transparent text-gray-800"
              }`}
            />
          </div>

          {/* Action buttons when editing */}
          {isEditing && (
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 animate-fadeIn">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
