import React, { useState, useEffect } from "react";
import { X, Calendar, BookOpen, AlertCircle } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask } = useStudyDeck();

  const [formData, setFormData] = useState({
    title: "",
    course: "Biology 101",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "pending",
    isAssigned: false,
    description: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        course: taskToEdit.course || "Biology 101",
        dueDate: taskToEdit.dueDate || new Date().toISOString().split("T")[0],
        priority: taskToEdit.priority || "medium",
        status: taskToEdit.status || "pending",
        isAssigned: taskToEdit.isAssigned || false,
        description: taskToEdit.description || ""
      });
    } else {
      setFormData({
        title: "",
        course: "Biology 101",
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium",
        status: "pending",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#0f1f38] text-base">
              {taskToEdit ? "Edit Task" : "Create New Task"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setError("");
              }}
              placeholder="e.g., Read Chapter 5 and take notes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f1f38] transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Course / Subject
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f1f38] bg-white cursor-pointer"
              >
                <option value="Biology 101">Biology 101</option>
                <option value="Arithmetic 2">Arithmetic 2</option>
                <option value="History 201">History 201</option>
                <option value="English Lit">English Lit</option>
                <option value="Chemistry 101">Chemistry 101</option>
                <option value="Computer Science">Computer Science</option>
                <option value="General">General / Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f1f38] bg-white cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f1f38] bg-white cursor-pointer"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f1f38] bg-white cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional guidelines, checklist or notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f1f38] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAssignedCheck"
              checked={formData.isAssigned}
              onChange={(e) => setFormData({ ...formData, isAssigned: e.target.checked })}
              className="rounded border-gray-300 text-[#0f1f38] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isAssignedCheck" className="text-xs text-gray-600 select-none cursor-pointer">
              Mark as official faculty-assigned task
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-sm transition-all cursor-pointer"
            >
              {taskToEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
