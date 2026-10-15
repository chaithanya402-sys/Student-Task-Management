import React from "react";
import { Link } from "react-router-dom";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { BookOpen, Users, FileText, ArrowRight } from "lucide-react";

export const FacultyCoursesPage = () => {
  const { facultyStats, facultyCourses } = useStudyDeck();

  return (
    <div className="space-y-6">
      {/* 4 Summary cards matching Image 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Assigned Courses (Dark Navy) */}
        <Card dark className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-white/80">Assigned Courses</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {facultyStats.assignedCourses}
            </span>
          </div>
          <span className="text-xs text-white/70">Autumn 2026</span>
        </Card>

        {/* Enrolled Students */}
        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Enrolled Students</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.enrolledStudents}
            </span>
          </div>
          <span className="text-xs text-gray-500">Across 4 courses</span>
        </Card>

        {/* Active Assignments */}
        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Active Assignments</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.activeAssignments}
            </span>
          </div>
          <span className="text-xs text-gray-500">2 due this week</span>
        </Card>

        {/* Submissions */}
        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Submissions</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.totalSubmissions}
            </span>
          </div>
          <span className="text-xs text-gray-500">On active work</span>
        </Card>
      </div>

      {/* 4 Course Cards Grid matching Image 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facultyCourses.map((c) => {
          const submittedCount = c.submitted_count || (c.code === "CS101" ? 34 : c.code === "CS204" ? 28 : c.code === "CS310" ? 22 : 18);
          const enrolledCount = c.enrolled_count || (c.code === "CS101" ? 40 : c.code === "CS204" ? 36 : c.code === "CS310" ? 32 : 20);
          const pct = Math.round((submittedCount / (enrolledCount || 1)) * 100);

          return (
            <Card key={c.id} className="p-6 space-y-4 hover:border-gray-300 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-xs font-bold text-gray-700">
                    {c.code}
                  </span>
                  <h3 className="text-lg font-bold text-[#0f1f38] mt-2">
                    {c.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {enrolledCount} students enrolled
                  </p>
                </div>

                <Link
                  to="/faculty/assignments"
                  className="text-xs font-bold text-gray-900 underline hover:text-blue-700 transition-colors"
                >
                  Open course
                </Link>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>Submitted</span>
                  <span>{submittedCount} of {enrolledCount}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f1f38] h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
