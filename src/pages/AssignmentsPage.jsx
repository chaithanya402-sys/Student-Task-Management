import React, { useState } from "react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { AssignmentSubmitModal } from "../components/common/AssignmentSubmitModal";
import { FileText, UploadCloud, CheckCircle2, AlertTriangle, Clock, Search, ExternalLink } from "lucide-react";

export const AssignmentsPage = () => {
  const { assignments, stats, searchQuery, activeFilter } = useStudyDeck();

  const [activeTab, setActiveTab] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.faculty.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "action_needed" && a.status === "Submitted") return false;
    if (activeTab === "submitted" && a.status !== "Submitted") return false;
    if (activeTab === "overdue" && a.status !== "Overdue") return false;

    if (courseFilter !== "all" && a.course !== courseFilter) return false;

    if (activeFilter === "overdue" && a.status !== "Overdue") return false;
    if (activeFilter === "pending" && a.status === "Submitted") return false;
    if (activeFilter === "completed" && a.status !== "Submitted") return false;

    return true;
  });

  const handleSubmitClick = (item, e) => {
    e.stopPropagation();
    setSelectedAssignment(item);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-white/80">Assignments Total</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.totalAssignments}
            </span>
          </div>
          <span className="text-xs text-white/70">Across 5 academic courses</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Submitted</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.submittedAssignments}
            </span>
          </div>
          <span className="text-xs text-gray-500">{stats.assignmentCompletionRate}% completion rate</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Action Required</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.totalAssignments - stats.submittedAssignments}
            </span>
          </div>
          <span className="text-xs text-gray-500">Drafts, pending & revisions</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">On-time Submissions</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.onTimeRate}%
            </span>
          </div>
          <span className="text-xs text-gray-500">{stats.onTimeCount} on time, {stats.latePendingCount} pending</span>
        </Card>
      </div>

      {/* 2. CONTROLS & TABS */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100/80 p-1 rounded-xl text-xs">
            {[
              { id: "all", label: `All (${assignments.length})` },
              { id: "action_needed", label: `Action Needed (${stats.totalAssignments - stats.submittedAssignments})` },
              { id: "submitted", label: `Submitted (${stats.submittedAssignments})` },
              { id: "overdue", label: `Overdue (${assignments.filter(a => a.status === "Overdue").length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-[#0f1f38] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-white text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              <option value="English Lit">English Lit</option>
              <option value="Biology 101">Biology 101</option>
              <option value="Arithmetic 2">Arithmetic 2</option>
              <option value="History 201">History 201</option>
              <option value="Chemistry 101">Chemistry 101</option>
            </select>
          </div>
        </div>

        {/* 3. ASSIGNMENT CARDS / TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {filteredAssignments.map((asg) => {
            const isSubmitted = asg.status === "Submitted";
            const isOverdue = asg.status === "Overdue";
            const needsRevision = asg.status === "Revision Required";

            return (
              <div
                key={asg.id}
                onClick={() => {
                  setSelectedAssignment(asg);
                  setIsSubmitModalOpen(true);
                }}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isOverdue
                    ? "border-red-200 bg-red-50/20 hover:border-red-300"
                    : needsRevision
                    ? "border-amber-200 bg-amber-50/20 hover:border-amber-300"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-sky-700 tracking-wider uppercase">
                        {asg.course}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                        {asg.title}
                      </h3>
                    </div>
                    <Badge status={asg.status} size="sm" />
                  </div>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  {/* Revision Feedback alert if present */}
                  {asg.instructorFeedback && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-0.5">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle size={13} className="text-amber-600" />
                        Instructor Feedback:
                      </span>
                      <p className="text-[11px] text-amber-800 italic">
                        "{asg.instructorFeedback}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="text-gray-500">
                    <span className="block text-[11px] text-gray-400">Due Date</span>
                    <span className={`font-semibold ${isOverdue ? "text-red-600" : "text-gray-800"}`}>
                      {asg.displayDate}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[11px] text-gray-400">Faculty</span>
                    <span className="font-semibold text-gray-800">{asg.faculty}</span>
                  </div>

                  <button
                    onClick={(e) => handleSubmitClick(asg, e)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      isSubmitted
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#0f1f38] text-white hover:bg-[#1a2e4f]"
                    }`}
                  >
                    {isSubmitted ? "Re-upload" : "Submit"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Submission Modal */}
      {selectedAssignment && (
        <AssignmentSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => {
            setIsSubmitModalOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
        />
      )}
    </div>
  );
};
