import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { SemiCircleGauge } from "../../components/common/SemiCircleGauge";
import { GradeSubmissionModal } from "../../components/faculty/GradeSubmissionModal";
import { MessageSquare, ArrowRight, ExternalLink } from "lucide-react";

export const FacultyDashboardPage = () => {
  const { facultyStats, facultySubmissions, sendStudentCheckIn } = useStudyDeck();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [checkInSent, setCheckInSent] = useState({});
  const navigate = useNavigate();

  const handleReview = (sub) => {
    setSelectedSubmission(sub);
    setIsGradeModalOpen(true);
  };

  const handleSendCheckIn = async (studentId, studentName) => {
    await sendStudentCheckIn(studentId, `Hi ${studentName}, Dr. Rao here. Noticing a few overdue items in your coursework. Please reach out if you need guidance or extra office hour support!`);
    setCheckInSent(prev => ({ ...prev, [studentId]: true }));
    setTimeout(() => {
      setCheckInSent(prev => ({ ...prev, [studentId]: false }));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP 6 SUMMARY CARDS matching Image 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Assigned Courses */}
        <Card className="p-4 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Assigned Courses</span>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-[#0f1f38]">
              {facultyStats.assignedCourses}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Autumn 2026</span>
        </Card>

        {/* Card 2: Enrolled Students */}
        <Card className="p-4 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Enrolled Students</span>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-[#0f1f38]">
              {facultyStats.enrolledStudents}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Across 4 courses</span>
        </Card>

        {/* Card 3: Active Assignments */}
        <Card className="p-4 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Active Assignments</span>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-[#0f1f38]">
              {facultyStats.activeAssignments}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">2 due this week</span>
        </Card>

        {/* Card 4: Submissions */}
        <Card className="p-4 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Submissions</span>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-[#0f1f38]">
              {facultyStats.totalSubmissions}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">On active work</span>
        </Card>

        {/* Card 5: Awaiting Grading (Dark Navy Card in screenshot) */}
        <Card dark className="p-4 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-white/80">Awaiting Grading</span>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-white">
              {facultyStats.awaitingGrading}
            </span>
          </div>
          <span className="text-[11px] text-white/70">Oldest waiting 6 days</span>
        </Card>

        {/* Card 6: Overdue */}
        <Card className="p-4 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Overdue</span>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-[#0f1f38]">
              {facultyStats.overdueCount}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Across 3 assignments</span>
        </Card>
      </div>

      {/* 2. ROW 2: Submission Progress by Course & Grading Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Submission Progress by Course (7 cols) */}
        <Card className="lg:col-span-7 p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">
              Submission Progress by Course
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Students who have submitted the current assignment
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {facultyStats.courseProgress && facultyStats.courseProgress.map((cp) => {
              const pct = Math.round((cp.submitted / (cp.enrolled || 1)) * 100);
              return (
                <div key={cp.code} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-800">
                    <span>{cp.code} {cp.name}</span>
                    <span className="text-gray-500">{cp.submitted} of {cp.enrolled} submitted</span>
                  </div>
                  {/* Progress bar: dark navy solid + diagonal hatched striped remaining */}
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 border border-gray-100">
                    <div
                      className="bg-[#0f1f38] h-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    ></div>
                    <div
                      className="bg-striped-pattern h-full flex-1"
                      style={{ width: `${100 - pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right: Grading Progress (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0f1f38]">Grading Progress</h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0f1f38]"></span>
                Graded
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                Awaiting
              </span>
            </div>
          </div>

          <div className="py-2">
            <SemiCircleGauge
              percentage={facultyStats.gradedPercentage || 85}
              label={`${facultyStats.gradedCount} of ${facultyStats.totalSubmissions} submissions graded`}
            />
          </div>
        </Card>
      </div>

      {/* 3. ROW 3: Recent Submissions & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Submissions (8 cols) */}
        <Card className="lg:col-span-8 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-base font-bold text-[#0f1f38]">Recent Submissions</h2>
            <Link
              to="/faculty/submissions"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
            >
              View all submissions
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-semibold border-b border-gray-100">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Assignment</th>
                  <th className="pb-2">Submitted</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {facultySubmissions.slice(0, 6).map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 font-semibold text-gray-900 whitespace-nowrap">
                      {sub.student_name}
                    </td>
                    <td className="py-2.5 text-gray-700">
                      {sub.assignment_title} <span className="text-gray-400">· {sub.course_code}</span>
                    </td>
                    <td className="py-2.5 text-gray-500 whitespace-nowrap">
                      {sub.submitted_at}
                    </td>
                    <td className="py-2.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold ${
                          sub.status === "late"
                            ? "bg-[#0f1f38] text-white"
                            : sub.status === "resubmitted"
                            ? "bg-[#0f1f38] text-white"
                            : sub.status === "graded"
                            ? "bg-emerald-100 text-emerald-800"
                            : "border border-gray-300 text-gray-700 bg-white"
                        }`}
                      >
                        {sub.status === "graded" ? `Graded (${sub.marks}%)` : sub.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleReview(sub)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                      >
                        {sub.status === "graded" ? "Re-grade" : "Review"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Score Distribution (4 cols) */}
        <Card className="lg:col-span-4 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Score Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">Problem Set 7, CS204 · 113 graded</p>
          </div>

          {/* Bar Chart matching Image 4 */}
          <div className="flex items-end justify-between gap-2.5 pt-6 pb-2 px-1 h-48">
            {[
              { band: "0–39", count: 4, height: 18 },
              { band: "40–59", count: 18, height: 35 },
              { band: "60–79", count: 52, height: 95 },
              { band: "80–100", count: 39, height: 75 }
            ].map((col) => (
              <div key={col.band} className="flex-1 flex flex-col items-center h-full">
                <div className="w-full flex-1 rounded-xl overflow-hidden flex flex-col justify-end bg-striped-pattern border border-gray-100">
                  <div
                    className="w-full bg-[#0f1f38] rounded-xl flex items-center justify-center transition-all duration-700"
                    style={{ height: `${col.height}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-bold text-gray-700 mt-2">
                  {col.band}
                </span>
                <span className="text-[10px] text-gray-400">
                  {col.count} students
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. ROW 4: Suggested Check-ins & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Suggested Check-ins (7 cols) */}
        <Card className="lg:col-span-7 p-5 space-y-3">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Suggested Check-ins</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Students with 3 or more overdue items in the last 14 days. Meant to offer support, not to warn students.
            </p>
          </div>

          <div className="divide-y divide-gray-100 pt-1">
            {facultyStats.suggestedCheckIns && facultyStats.suggestedCheckIns.map((st) => (
              <div key={st.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center">
                    {st.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{st.name}</h4>
                    <p className="text-[11px] text-gray-400">{st.reason}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSendCheckIn(st.id, st.name)}
                  className={`text-xs font-semibold px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                    checkInSent[st.id]
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-blue-700 hover:text-blue-900 hover:underline"
                  }`}
                >
                  {checkInSent[st.id] ? "Message Sent!" : "Send message"}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Deadlines (5 cols) */}
        <Card className="lg:col-span-5 p-5 space-y-3">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Upcoming Deadlines</h2>
            <p className="text-xs text-gray-400 mt-0.5">Assignments you have published</p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-[11px] font-bold leading-none">18</span>
                <span className="text-[9px] uppercase">Oct</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">Problem Set 8</h4>
                <p className="text-[11px] text-gray-500">CS204 · 12 of 36 submitted</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-[11px] font-bold leading-none">20</span>
                <span className="text-[9px] uppercase">Oct</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">Midterm Project</h4>
                <p className="text-[11px] text-gray-500">CS101 · 9 of 40 submitted</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1f38] text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-[11px] font-bold leading-none">22</span>
                <span className="text-[9px] uppercase">Oct</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">Sprint Report</h4>
                <p className="text-[11px] text-gray-500">CS310 · Active work</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grade modal */}
      {selectedSubmission && (
        <GradeSubmissionModal
          isOpen={isGradeModalOpen}
          onClose={() => {
            setIsGradeModalOpen(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
        />
      )}
    </div>
  );
};
