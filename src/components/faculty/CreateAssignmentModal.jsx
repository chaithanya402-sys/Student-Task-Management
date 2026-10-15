import React, { useState } from "react";
import { X, BookOpen, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const CreateAssignmentModal = ({ isOpen, onClose }) => {
  const { facultyCourses, publishAssignment } = useStudyDeck();

  const [formData, setFormData] = useState({
    course_id: "course-cs204",
    title: "",
    description: "",
    due_date: "2026-10-25",
    display_date: "25 Oct 2026",
    max_points: 100
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter an assignment title");
      return;
    }
    if (!formData.due_date) {
      setError("Please select a due date");
      return;
    }

    setIsSubmitting(true);
    try {
      await publishAssignment(formData);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          course_id: "course-cs204",
          title: "",
          description: "",
          due_date: "2026-10-25",
          display_date: "25 Oct 2026",
          max_points: 100
        });
        onClose();
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || "Failed to publish assignment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-[#0f1f38] dark:text-white text-base">Create & Publish Assignment</h3>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
              Assignment will appear immediately on enrolled students' dashboards
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={54} className="text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-[#0f1f38] dark:text-white">Assignment Published!</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm">
              Enrolled students have been notified and tasks added to their dashboards and calendar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-900">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Select Course *
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                {facultyCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Assignment Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setError("");
                }}
                placeholder="e.g., Problem Set 9: SQL Query Optimization"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => {
                    const d = e.target.value;
                    const dateObj = new Date(d);
                    const formatted = !isNaN(dateObj)
                      ? `${dateObj.getDate()} ${dateObj.toLocaleString("en-US", { month: "short" })} ${dateObj.getFullYear()}`
                      : d;
                    setFormData({ ...formData, due_date: d, display_date: formatted });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Maximum Points
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.max_points}
                  onChange={(e) => setFormData({ ...formData, max_points: parseInt(e.target.value) || 100 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Instructions & Requirements
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide problem prompts, submission guidelines, or rubrics..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-xs cursor-pointer disabled:opacity-60 active:scale-95"
              >
                {isSubmitting ? "Publishing..." : "Publish to Students"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
