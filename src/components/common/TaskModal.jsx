import React, { useState, useEffect } from "react";
import { X, Calendar, BookOpen, AlertCircle } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask } = useStudyDeck();

  const [formData, setFormData] = useState({
    title: "",
    course: "CS101 · Data Structures",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "pending",
    category: "Personal",
    attachmentCount: 0,
    isFavorite: false,
    isAssigned: false,
    description: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        course: taskToEdit.course || "CS101 · Data Structures",
        dueDate: taskToEdit.dueDate || new Date().toISOString().split("T")[0],
        priority: taskToEdit.priority || "medium",
        status: taskToEdit.status || "pending",
        category: taskToEdit.category || "Personal",
        attachmentCount: taskToEdit.attachmentCount || 0,
        isFavorite: Boolean(taskToEdit.isFavorite),
        isAssigned: taskToEdit.isAssigned || false,
        description: taskToEdit.description || ""
      });
    } else {
      setFormData({
        title: "",
        course: "CS101 · Data Structures",
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium",
        status: "pending",
        category: "Personal",
        attachmentCount: 0,
        isFavorite: false,
        isAssigned: false,
        description: ""
      });
    }
    setError("");
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter a task title");
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
    } else {
      addTask(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#0f1f38] dark:text-white text-base">
              {taskToEdit ? "Edit Task" : "Create New Task"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-900">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setError("");
              }}
              placeholder="e.g., Read Chapter 5 and implement AVL Tree"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Course / Subject
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="CS101 Data Structures">CS101 Data Structures</option>
                <option value="CS204 Databases">CS204 Databases</option>
                <option value="CS310 Web Systems">CS310 Web Systems</option>
                <option value="CS402 Machine Learning">CS402 Machine Learning</option>
                <option value="Biology 101">Biology 101</option>
                <option value="Arithmetic 2">Arithmetic 2</option>
                <option value="History 201">History 201</option>
                <option value="English Lit">English Lit</option>
                <option value="General">General / Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="pending">To Do (Pending)</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="Personal">Personal</option>
                <option value="Assignment">Assignment</option>
                <option value="Project">Project</option>
                <option value="Study">Study</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Attachments Count
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.attachmentCount}
                onChange={(e) => setFormData({ ...formData, attachmentCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional guidelines, checklist or notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAssignedCheck"
                checked={formData.isAssigned}
                onChange={(e) => setFormData({ ...formData, isAssigned: e.target.checked })}
                className="rounded border-gray-300 dark:border-slate-700 text-[#0f1f38] dark:text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="isAssignedCheck" className="text-xs text-gray-600 dark:text-slate-400 select-none cursor-pointer">
                Official faculty-assigned
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFavoriteCheck"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="rounded border-gray-300 dark:border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="isFavoriteCheck" className="text-xs text-gray-600 dark:text-slate-400 select-none cursor-pointer flex items-center gap-1">
                <span>⭐ Add to Favorites</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              {taskToEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
