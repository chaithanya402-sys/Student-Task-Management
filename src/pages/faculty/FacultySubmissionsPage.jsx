import React, { useState } from "react";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { GradeSubmissionModal } from "../../components/faculty/GradeSubmissionModal";
import { UploadCloud, CheckCircle2, Clock, Filter, Search, FileText } from "lucide-react";

export const FacultySubmissionsPage = () => {
  const { facultySubmissions, facultyStats, facultySearchQuery } = useStudyDeck();

  const [activeTab, setActiveTab] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const filteredSubmissions = facultySubmissions.filter((sub) => {
    const matchesSearch =
      sub.student_name.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
      sub.assignment_title.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
      sub.course_code.toLowerCase().includes(facultySearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "awaiting" && sub.status === "graded") return false;
    if (activeTab === "graded" && sub.status !== "graded") return false;
    if (activeTab === "late" && sub.status !== "late") return false;

    if (courseFilter !== "all" && sub.course_code !== courseFilter) return false;

    return true;
  });

  const handleReview = (sub) => {
    setSelectedSubmission(sub);
    setIsGradeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card dark className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-white/80">Awaiting Review</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {facultyStats.awaitingGrading}
            </span>
          </div>
          <span className="text-xs text-white/70">Needs evaluation</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Graded</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.gradedCount}
            </span>
          </div>
          <span className="text-xs text-gray-500">{facultyStats.gradedPercentage}% evaluated</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Total Received</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultyStats.totalSubmissions}
            </span>
          </div>
          <span className="text-xs text-gray-500">Unique student submissions</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-medium text-gray-500">Late Submissions</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {facultySubmissions.filter(s => s.status === "late").length || 3}
            </span>
          </div>
          <span className="text-xs text-gray-500">Turned in past deadline</span>
        </Card>
      </div>

      {/* Main Submissions Table Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100/80 p-1 rounded-xl text-xs">
            {[
              { id: "all", label: `All (${facultySubmissions.length})` },
              { id: "awaiting", label: `Awaiting Review (${facultySubmissions.filter(s => s.status !== "graded").length})` },
              { id: "graded", label: `Graded (${facultySubmissions.filter(s => s.status === "graded").length})` },
              { id: "late", label: `Late (${facultySubmissions.filter(s => s.status === "late").length})` }
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
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              <option value="CS101">CS101 Data Structures</option>
              <option value="CS204">CS204 Databases</option>
              <option value="CS310">CS310 Web Systems</option>
              <option value="CS402">CS402 Machine Learning</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-gray-100">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Course</th>
                <th className="pb-3 font-semibold">Assignment</th>
                <th className="pb-3 font-semibold">Submitted File</th>
                <th className="pb-3 font-semibold">Submitted Time</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.map((sub) => {
                const isGraded = sub.status === "graded";
                return (
                  <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 pr-2 font-bold text-gray-900 whitespace-nowrap">
                      {sub.student_name}
                    </td>
                    <td className="py-3.5 pr-2 font-semibold text-gray-700 whitespace-nowrap">
                      {sub.course_code}
                    </td>
                    <td className="py-3.5 pr-2 text-gray-800">
                      {sub.assignment_title}
                    </td>
                    <td className="py-3.5 pr-2 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        {sub.submitted_file || "document.pdf"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-gray-500 whitespace-nowrap">
                      {sub.submitted_at}
                    </td>
                    <td className="py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                          isGraded
                            ? "bg-emerald-100 text-emerald-800 font-bold"
                            : sub.status === "late"
                            ? "bg-[#0f1f38] text-white"
                            : sub.status === "resubmitted"
                            ? "bg-[#0f1f38] text-white"
                            : "border border-gray-300 text-gray-700 bg-white"
                        }`}
                      >
                        {isGraded ? `Graded: ${sub.marks}/${sub.max_points || 100}` : sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleReview(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isGraded
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-[#0f1f38] text-white hover:bg-[#1a2e4f]"
                        }`}
                      >
                        {isGraded ? "Re-grade" : "Review & Grade"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

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
