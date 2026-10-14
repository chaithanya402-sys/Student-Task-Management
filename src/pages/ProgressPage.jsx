import React from "react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";

export const ProgressPage = () => {
  const { stats, weeklyProductivityData, courseGradesData } = useStudyDeck();

  return (
    <div className="space-y-6">
      {/* 1. TOP 4 CARDS matching Image 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Grade (Dark Navy) */}
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-white/80">Average Grade</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.averageGrade}%
            </span>
          </div>
          <span className="text-xs text-white/70">{stats.gradeGap}% gap</span>
        </Card>

        {/* Card 2: Completion (White) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Completion</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.assignmentCompletionRate}%
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {stats.submittedAssignments} of {stats.totalAssignments} submitted
          </span>
        </Card>

        {/* Card 3: On-time (White) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">On-time</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.onTimeRate}%
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {stats.onTimeCount} on time, {stats.latePendingCount} late or pending
          </span>
        </Card>

        {/* Card 4: Tasks Done (White) */}
        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Tasks Done</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.taskCompletionRate}%
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {stats.completedTasks} of {stats.totalTasks}
          </span>
        </Card>
      </div>

      {/* 2. BOTTOM 2 CARDS matching Image 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Course Grades */}
        <Card className="p-6 space-y-6">
          <h2 className="text-base font-bold text-[#0f1f38]">Course Grades</h2>
          <div className="space-y-5">
            {courseGradesData.map((cg) => (
              <div key={cg.course} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-800">
                  <span>{cg.course}</span>
                  <span className="text-gray-900">{cg.score}%</span>
                </div>
                {/* Clean horizontal dark navy bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f1f38] h-full rounded-full transition-all duration-700"
                    style={{ width: `${cg.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Weekly Productivity (Mon - Fri horizontal bars) */}
        <Card className="p-6 space-y-6">
          <h2 className="text-base font-bold text-[#0f1f38]">
            Weekly Productivity
          </h2>
          <div className="space-y-4">
            {weeklyProductivityData.slice(0, 5).map((d) => (
              <div key={d.day} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-800">
                  <span>{d.day}</span>
                  <span className="text-gray-900">{d.percent}%</span>
                </div>
                {/* Clean horizontal dark navy bar matching Image 4 */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f1f38] h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
