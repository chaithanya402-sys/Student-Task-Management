import React, { useState } from "react";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { GradeSubmissionModal } from "../../components/faculty/GradeSubmissionModal";
import { UploadCloud, CheckCircle2, Clock, Filter, Search, FileText, Check, Award, ArrowUpRight } from "lucide-react";

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

  const getScorePill = (marks, maxPoints) => {
    const percentage = Math.round((marks / (maxPoints || 100)) * 100);
    if (percentage >= 85) return "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    if (percentage >= 70) return "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    if (percentage >= 50) return "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    return "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card dark className="p-5 flex flex-col justify-between min-h-[110px] hover-card-lift">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Awaiting Review</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {facultyStats.awaitingGrading}
            </span>
          </div>
          <span className="text-xs text-white/70">Needs evaluation</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[110px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Graded</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {facultyStats.gradedCount}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">{facultyStats.gradedPercentage}% evaluated</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[110px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Received</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {facultyStats.totalSubmissions}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">All student submissions</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[110px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Late Submissions</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {facultySubmissions.filter(s => s.status === "late").length || 3}
            </span>
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Turned in past deadline</span>
        </Card>
      </div>

      {/* Main Submissions Table Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
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
              <tr className="text-gray-400 dark:text-slate-500 font-semibold border-b border-gray-100 dark:border-slate-800">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Course</th>
                <th className="pb-3 font-semibold">Assignment</th>
                <th className="pb-3 font-semibold">Submitted File</th>
                <th className="pb-3 font-semibold">Submitted Time</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
              {filteredSubmissions.map((sub) => {
                const isGraded = sub.status === "graded";
                const initials = sub.student_name.split(" ").map(n => n[0]).join("");

                return (
                  <tr key={sub.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 pr-2 font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0f1f38] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <span>{sub.student_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-2 font-semibold text-gray-700 dark:text-slate-300 whitespace-nowrap">
                      {sub.course_code}
                    </td>
                    <td className="py-3.5 pr-2 text-gray-800 dark:text-slate-200">
                      {sub.assignment_title}
                    </td>
                    <td className="py-3.5 pr-2 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700 inline-flex items-center gap-1">
                        <FileText size={11} /> {sub.submitted_file || "document.pdf"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {sub.submitted_at}
                    </td>
                    <td className="py-3.5 text-center whitespace-nowrap">
                      {isGraded ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${getScorePill(
                            sub.marks,
                            sub.max_points
                          )}`}
                        >
                          {sub.marks}/{sub.max_points || 100} pts
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                            sub.status === "late"
                              ? "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900"
                              : sub.status === "resubmitted"
                              ? "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900"
                              : "border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {sub.status === "late" ? "Late" : "Needs Review"}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleReview(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                          isGraded
                            ? "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                            : "bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500"
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
