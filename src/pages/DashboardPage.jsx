import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
    activeFilter
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

  const handleRowClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks (Dark Navy) */}
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-white/80">Total Tasks</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.totalTasks}
            </span>
          </div>
          <span className="text-xs text-white/70">
            {stats.personalTasks} personal, {stats.assignedTasks} assigned
          </span>
        </Card>

        {/* Card 2: Pending (White Card) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Pending</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.pendingTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500">5 due within 7 days</span>
        </Card>

        {/* Card 3: Completed (White Card) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Completed</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.completedTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500">{stats.taskCompletionRate}% of all tasks</span>
        </Card>

        {/* Card 4: Overdue (White Card) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Overdue</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.overdueTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500">Needs attention</span>
        </Card>
      </div>

      {/* 2. ANALYTICS ROW (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card A: Assignment Completion (Semi-circular gauge) */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f1f38]">
              Assignment Completion
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0f1f38]"></span>
                Submitted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
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
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f1f38]">
              On-time Submission
            </h2>
            {/* Time range pills */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-full text-[11px]">
              {["24h", "1 Week", "1 Month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    timeRange === range
                      ? "bg-[#0f1f38] text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="my-auto py-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f1f38] tracking-tight mb-3">
              {stats.onTimeRate}%
            </div>

            {/* Progress bar: 78% dark solid, 22% diagonal striped pattern */}
            <div className="w-full h-8 rounded-xl overflow-hidden flex border border-gray-100 bg-gray-100">
              <div
                className="bg-[#0f1f38] h-full transition-all duration-700"
                style={{ width: `${stats.onTimeRate}%` }}
              ></div>
              <div
                className="bg-striped-pattern h-full flex-1"
                style={{ width: `${100 - stats.onTimeRate}%` }}
              ></div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] text-gray-600 pt-2 border-t border-gray-50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0f1f38]"></span>
              On time ({stats.onTimeCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-gray-400 bg-striped-pattern"></span>
              Late or pending ({stats.latePendingCount})
            </span>
          </div>
        </Card>

        {/* Card C: Average Grade */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f1f38]">Average Grade</h2>
          </div>

          <div className="py-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f1f38] tracking-tight mb-2">
              {stats.averageGrade}%
            </div>

            {/* Segmented bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-200 mb-2">
              <div
                className="bg-[#0f1f38] h-full rounded-full"
                style={{ width: `${stats.averageGrade}%` }}
              ></div>
              <div
                className="bg-gray-300 h-full flex-1"
                style={{ width: `${stats.gradeGap}%` }}
              ></div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0f1f38]"></span>
                {stats.averageGrade}% scored
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                {stats.gradeGap}% gap
              </span>
            </div>

            {/* Subject-wise progress bars */}
            <div className="space-y-2.5">
              {courseGradesData.map((cg) => (
                <div key={cg.course} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>{cg.course}</span>
                    <span className="font-semibold text-gray-900">{cg.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0f1f38] h-full rounded-full transition-all duration-500"
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
        <Card className="lg:col-span-5 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0f1f38]">
              Weekly Productivity
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Share of planned tasks completed each day
            </p>
          </div>

          {/* 7 Vertical Bar charts matching screenshot */}
          <div className="flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-2 px-1 h-56">
            {weeklyProductivityData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center h-full">
                {/* Vertical bar pill with striped top and dark navy bottom */}
                <div className="w-full max-w-[38px] flex-1 rounded-2xl overflow-hidden flex flex-col justify-end bg-striped-pattern border border-gray-100 relative group">
                  <div
                    className="w-full bg-[#0f1f38] rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:bg-[#1d3154]"
                    style={{ height: `${d.percent}%` }}
                  >
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      {d.percent}%
                    </span>
                  </div>
                </div>
                {/* Day label */}
                <span className="text-xs font-medium text-gray-600 mt-2.5">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Deadlines (7 cols) */}
        <Card className="lg:col-span-7 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-sm font-bold text-[#0f1f38]">
              Upcoming Deadlines
            </h2>
            <Link
              to="/assignments"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline hover:no-underline transition-colors"
            >
              View all assignments
            </Link>
          </div>

          {/* Table matching screenshot columns and pills */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 font-medium border-b border-gray-100">
                  <th className="pb-2.5 font-medium">Course</th>
                  <th className="pb-2.5 font-medium">Assignment</th>
                  <th className="pb-2.5 font-medium">Due date</th>
                  <th className="pb-2.5 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-normal">
                {filteredAssignments.slice(0, 6).map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 pr-2 font-medium text-gray-700 whitespace-nowrap">
                      {item.course}
                    </td>
                    <td className="py-2.5 pr-2 font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </td>
                    <td className="py-2.5 pr-2 text-gray-500 whitespace-nowrap">
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

          {/* Navigation carousel slider at bottom of table matching reference */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-gray-400">
            <button
              onClick={() => navigate("/assignments")}
              className="p-1 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex-1 mx-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-gray-400 rounded-full"></div>
            </div>
            <button
              onClick={() => navigate("/assignments")}
              className="p-1 hover:text-gray-700 transition-colors cursor-pointer"
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
