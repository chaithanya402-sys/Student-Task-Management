import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { SemiCircleGauge } from "../components/common/SemiCircleGauge";
import { AssignmentSubmitModal } from "../components/common/AssignmentSubmitModal";

export const DashboardPage = () => {
  const {
    stats,
    assignments,
    weeklyProductivityData,
    courseGradesData,
    searchQuery,
    activeFilter,
    user
  } = useStudyDeck();

  const [timeRange, setTimeRange] = useState("1 Month");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter assignments based on search & filter modal
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "overdue") return a.status === "Overdue";
    if (activeFilter === "pending") return a.status !== "Submitted";
    if (activeFilter === "completed") return a.status === "Submitted";
    return true;
  });

  const nextUpcoming = assignments.find((a) => a.status !== "Submitted") || assignments[0];

  const handleRowClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 0. ACADEMIC HIGHLIGHT BANNER: Next Up Urgency */}
      {nextUpcoming && (
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#0f1f38] via-[#162744] to-[#1e345b] dark:from-[#0b1324] dark:via-[#111c34] dark:to-[#172748] text-white shadow-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Next Up &bull; {nextUpcoming.course}
              </span>
              <span className="text-xs text-blue-200/80 font-medium flex items-center gap-1">
                <Clock size={12} /> Due {nextUpcoming.displayDate || nextUpcoming.dueDate}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
              {nextUpcoming.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl line-clamp-1">
              {nextUpcoming.description || "Review requirements and submit your coursework before deadline."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleRowClick(nextUpcoming)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#0f1f38] hover:bg-blue-50 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span>{nextUpcoming.status === "Submitted" ? "View Submission" : "Submit Work"}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP SUMMARY CARDS (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks (Dark Navy) */}
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Total Tasks</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.totalTasks}
            </span>
          </div>
          <span className="text-xs text-white/70">
            {stats.personalTasks} personal &bull; {stats.assignedTasks} assigned
          </span>
        </Card>

        {/* Card 2: Pending (White / Dark Card) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pending</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.pendingTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">5 due within 7 days</span>
        </Card>

        {/* Card 3: Completed */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Completed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.completedTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">{stats.taskCompletionRate}% of all tasks</span>
        </Card>

        {/* Card 4: Overdue */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Overdue</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.overdueTasks}
            </span>
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Needs attention</span>
        </Card>
      </div>

      {/* 2. ANALYTICS ROW (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card A: Assignment Completion (Semi-circular gauge) */}
        <Card className="p-5 flex flex-col justify-between hover-card-lift">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f1f38] dark:text-white">
              Assignment Completion
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0f1f38] dark:bg-blue-500"></span>
                Submitted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-slate-700"></span>
                Remaining
              </span>
            </div>
          </div>

          <div className="py-2">
            <SemiCircleGauge
              percentage={stats.assignmentCompletionRate}
              label={`${stats.submittedAssignments} of ${stats.totalAssignments} assignments submitted`}
            />
          </div>
        </Card>

        {/* Card B: On-time Submission */}
        <Card className="p-5 flex flex-col justify-between hover-card-lift">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f1f38] dark:text-white">
              On-time Submission
            </h2>
            {/* Time range pills */}
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-full text-[11px] border border-gray-200/80 dark:border-slate-700">
              {["24h", "1 Week", "1 Month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    timeRange === range
                      ? "bg-[#0f1f38] dark:bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="my-auto py-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight mb-3">
              {stats.onTimeRate}%
            </div>

            {/* Progress bar: dark solid, diagonal striped pattern */}
            <div className="w-full h-8 rounded-xl overflow-hidden flex border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
              <div
                className="bg-[#0f1f38] dark:bg-blue-600 h-full transition-all duration-700"
                style={{ width: `${stats.onTimeRate}%` }}
              ></div>
              <div
                className="bg-striped-pattern dark:bg-striped-pattern-dark h-full flex-1"
                style={{ width: `${100 - stats.onTimeRate}%` }}
              ></div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] text-gray-600 dark:text-slate-400 pt-2 border-t border-gray-50 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0f1f38] dark:bg-blue-600"></span>
              On time ({stats.onTimeCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-gray-400 dark:border-slate-600 bg-striped-pattern dark:bg-striped-pattern-dark"></span>
              Late or pending ({stats.latePendingCount})
            </span>
          </div>
        </Card>

        {/* Card C: Average Grade */}
        <Card className="p-5 flex flex-col justify-between hover-card-lift">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f1f38] dark:text-white">Average Grade</h2>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Autumn 2026</span>
          </div>

          <div className="py-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight mb-2">
              {stats.averageGrade}%
            </div>

            {/* Segmented bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-200 dark:bg-slate-800 mb-2">
              <div
                className="bg-[#0f1f38] dark:bg-blue-600 h-full rounded-full"
                style={{ width: `${stats.averageGrade}%` }}
              ></div>
              <div
                className="bg-gray-300 dark:bg-slate-700 h-full flex-1"
                style={{ width: `${stats.gradeGap}%` }}
              ></div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0f1f38] dark:bg-blue-600"></span>
                {stats.averageGrade}% scored
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-700"></span>
                {stats.gradeGap}% gap
              </span>
            </div>

            {/* Subject-wise progress bars */}
            <div className="space-y-2.5">
              {courseGradesData.map((cg) => (
                <div key={cg.course} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-slate-300">
                    <span>{cg.course}</span>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">{cg.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0f1f38] dark:bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cg.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 3. BOTTOM SECTION: Weekly Productivity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Productivity (5 cols) */}
        <Card className="lg:col-span-5 p-5 flex flex-col justify-between hover-card-lift">
          <div>
            <h2 className="text-sm font-bold text-[#0f1f38] dark:text-white">
              Weekly Productivity
            </h2>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
              Share of planned tasks completed each day
            </p>
          </div>

          {/* 7 Vertical Bar charts matching screenshot */}
          <div className="flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-2 px-1 h-56">
            {weeklyProductivityData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center h-full">
                {/* Vertical bar pill with striped top and dark navy bottom */}
                <div className="w-full max-w-[38px] flex-1 rounded-2xl overflow-hidden flex flex-col justify-end bg-striped-pattern dark:bg-striped-pattern-dark border border-gray-100 dark:border-slate-800 relative group">
                  <div
                    className="w-full bg-[#0f1f38] dark:bg-blue-600 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:bg-[#1d3154] dark:group-hover:bg-blue-500"
                    style={{ height: `${d.percent}%` }}
                  >
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      {d.percent}%
                    </span>
                  </div>
                </div>
                {/* Day label */}
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-2.5">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Deadlines (7 cols) */}
        <Card className="lg:col-span-7 p-5 flex flex-col justify-between hover-card-lift">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0f1f38] dark:text-white">
                Upcoming Deadlines
              </h2>
              <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
                Assignments awaiting completion
              </p>
            </div>
            <Link
              to="/assignments"
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 underline hover:no-underline transition-colors flex items-center gap-1"
            >
              <span>View all assignments</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Table matching screenshot columns and pills */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 dark:text-slate-400 font-medium border-b border-gray-100 dark:border-slate-800">
                  <th className="pb-2.5 font-semibold">Course</th>
                  <th className="pb-2.5 font-semibold">Assignment</th>
                  <th className="pb-2.5 font-semibold">Due date</th>
                  <th className="pb-2.5 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60 font-normal">
                {filteredAssignments.slice(0, 6).map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 pr-2 font-semibold text-gray-700 dark:text-slate-300 whitespace-nowrap">
                      {item.course}
                    </td>
                    <td className="py-2.5 pr-2 font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </td>
                    <td className="py-2.5 pr-2 text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {item.displayDate}
                    </td>
                    <td className="py-2.5 text-center whitespace-nowrap">
                      <Badge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation carousel slider at bottom of table */}
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-gray-400 dark:text-slate-500">
            <button
              onClick={() => navigate("/assignments")}
              className="p-1 hover:text-gray-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex-1 mx-3 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[#0f1f38] dark:bg-blue-600 rounded-full"></div>
            </div>
            <button
              onClick={() => navigate("/assignments")}
              className="p-1 hover:text-gray-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      </div>

      {/* Submission modal triggered by clicking any deadline */}
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
