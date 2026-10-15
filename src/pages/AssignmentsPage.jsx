import React, { useState } from "react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { AssignmentSubmitModal } from "../components/common/AssignmentSubmitModal";
import { FileText, UploadCloud, CheckCircle2, AlertTriangle, Clock, Search, ExternalLink, ArrowRight } from "lucide-react";

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
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Assignments Total</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.totalAssignments}
            </span>
          </div>
          <span className="text-xs text-white/70">Across active registered courses</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Submitted</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.submittedAssignments}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">{stats.assignmentCompletionRate}% completion rate</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Action Required</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.totalAssignments - stats.submittedAssignments}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">Drafts, pending & revisions</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">On-time Submissions</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.onTimeRate}%
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">{stats.onTimeCount} on time, {stats.latePendingCount} pending</span>
        </Card>
      </div>

      {/* 2. CONTROLS & TABS */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
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
                    ? "bg-white dark:bg-slate-900 text-[#0f1f38] dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
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
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              <option value="CS101 Data Structures">CS101 Data Structures</option>
              <option value="CS204 Databases">CS204 Databases</option>
              <option value="CS310 Web Systems">CS310 Web Systems</option>
              <option value="CS402 Machine Learning">CS402 Machine Learning</option>
              <option value="English Lit">English Lit</option>
              <option value="Biology 101">Biology 101</option>
              <option value="Arithmetic 2">Arithmetic 2</option>
              <option value="History 201">History 201</option>
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
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover-card-lift ${
                  isOverdue
                    ? "border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20 hover:border-red-300"
                    : needsRevision
                    ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 hover:border-amber-300"
                    : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 tracking-wider uppercase">
                        {asg.course}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mt-0.5">
                        {asg.title}
                      </h3>
                    </div>
                    <Badge status={asg.status} size="sm" />
                  </div>

                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  {/* Revision Feedback alert if present */}
                  {asg.instructorFeedback && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-0.5">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
                        Instructor Feedback:
                      </span>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 italic">
                        "{asg.instructorFeedback}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-gray-500 dark:text-slate-400">
                    <span className="block text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Due Date</span>
                    <span className={`font-semibold ${isOverdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-gray-800 dark:text-slate-200"}`}>
                      {asg.displayDate || asg.dueDate}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Faculty</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{asg.faculty}</span>
                  </div>

                  <button
                    onClick={(e) => handleSubmitClick(asg, e)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                      isSubmitted
                        ? "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                        : "bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500"
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
