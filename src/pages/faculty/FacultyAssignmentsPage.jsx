import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { CreateAssignmentModal } from "../../components/faculty/CreateAssignmentModal";
import { Plus, Edit2, Calendar, FileText, CheckCircle2 } from "lucide-react";

export const FacultyAssignmentsPage = () => {
  const { facultyAssignments, facultyStats, updateFacultyAssignment } = useStudyDeck();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenEdit = (asg) => {
    setEditingAssignment(asg);
    setNewDueDate(asg.due_date || "2026-10-25");
    setIsEditModalOpen(true);
  };

  const handleSaveDueDate = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;

    const dateObj = new Date(newDueDate);
    const formatted = !isNaN(dateObj)
      ? `${dateObj.getDate()} ${dateObj.toLocaleString("en-US", { month: "short" })} ${dateObj.getFullYear()}`
      : newDueDate;

    await updateFacultyAssignment(editingAssignment.id, {
      due_date: newDueDate,
      display_date: formatted
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
      setEditingAssignment(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards matching Image 3 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Active (Dark Navy in Image 3) */}
        <Card dark className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-white/80">Active</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {facultyStats.activeAssignments}
            </span>
          </div>
          <span className="text-xs text-white/70">2 due this week</span>
        </Card>

        {/* Awaiting Grading */}
        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Awaiting Grading</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.awaitingGrading}
            </span>
          </div>
          <span className="text-xs text-gray-500">Oldest waiting 6 days</span>
        </Card>

        {/* Overdue */}
        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Overdue</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.overdueCount}
            </span>
          </div>
          <span className="text-xs text-gray-500">Across 3 assignments</span>
        </Card>

        {/* Graded */}
        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Graded</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.gradedPercentage || 85}%
            </span>
          </div>
          <span className="text-xs text-gray-500">{facultyStats.gradedCount} of {facultyStats.totalSubmissions}</span>
        </Card>
      </div>

      {/* Main Table Card: All assignments matching Image 3 */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">All assignments</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Coursework published to student portals
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Create assignment</span>
          </button>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-gray-100">
                <th className="pb-3 font-semibold">Assignment</th>
                <th className="pb-3 font-semibold">Course</th>
                <th className="pb-3 font-semibold">Due</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facultyAssignments.map((asg) => (
                <tr key={asg.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 pr-2 font-bold text-gray-900 whitespace-nowrap">
                    {asg.title}
                  </td>
                  <td className="py-3.5 pr-2 font-semibold text-gray-700 whitespace-nowrap">
                    {asg.course_code}
                  </td>
                  <td className="py-3.5 pr-2 text-gray-500 whitespace-nowrap">
                    {asg.status === "closed" ? "Closed" : asg.display_date || asg.due_date}
                  </td>
                  <td className="py-3.5 text-center whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#0f1f38] text-white">
                      {asg.status === "closed" ? "Grading" : "Active"}
                    </span>
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(asg)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Assignment & Deadline Modal */}
      {isEditModalOpen && editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase">
                  {editingAssignment.course_code}
                </span>
                <h3 className="text-base font-bold text-[#0f1f38] mt-0.5">
                  {editingAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-6 text-center">
                <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-sm font-bold text-[#0f1f38]">Deadline Updated!</h4>
                <p className="text-xs text-gray-500 mt-1">All enrolled students will see the new deadline immediately.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveDueDate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Update Due Date / Deadline
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0f1f38]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Changing the deadline updates enrolled students' calendar, task list, and reminders.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Enrolled students:</span>
                    <span className="font-semibold text-gray-900">{editingAssignment.enrolled_count || 36} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submissions received:</span>
                    <span className="font-semibold text-gray-900">{editingAssignment.submission_count || 12} submitted</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] cursor-pointer"
                  >
                    Save & Sync with Students
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
