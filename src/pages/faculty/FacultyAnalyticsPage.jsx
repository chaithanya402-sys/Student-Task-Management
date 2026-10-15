import React from "react";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { SemiCircleGauge } from "../../components/common/SemiCircleGauge";
import { Download, FileText, CheckCircle2 } from "lucide-react";

export const FacultyAnalyticsPage = () => {
  const { facultyStats } = useStudyDeck();

  const handleDownload = (reportName) => {
    // Generate text/csv download simulation
    const content = `StudyDeck Academic Report: ${reportName}\nFaculty: Dr. S. Rao\nGenerated: ${new Date().toLocaleDateString()}\nStatus: Verified Official Academic Record\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ROW: Submission Progress by Course & Grading Progress matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Submission Progress by Course (7 cols) */}
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
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex border border-gray-100">
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

        {/* Grading Progress (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0f1f38]">Grading Progress</h2>
          </div>

          <div className="py-2">
            <SemiCircleGauge
              percentage={facultyStats.gradedPercentage || 85}
              label={`${facultyStats.gradedCount} of ${facultyStats.totalSubmissions} submissions graded`}
            />
          </div>
        </Card>
      </div>

      {/* 2. BOTTOM ROW: Score Distribution & Reports matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Score Distribution (7 cols) */}
        <Card className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Score Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">Problem Set 7, CS204 · 113 graded</p>
          </div>

          <div className="flex items-end justify-between gap-3 pt-6 pb-2 px-2 h-56">
            {[
              { band: "0–39", count: 4, height: 18 },
              { band: "40–59", count: 18, height: 35 },
              { band: "60–79", count: 52, height: 95 },
              { band: "80–100", count: 39, height: 75 }
            ].map((col) => (
              <div key={col.band} className="flex-1 flex flex-col items-center h-full">
                <div className="w-full max-w-[56px] flex-1 rounded-2xl overflow-hidden flex flex-col justify-end bg-striped-pattern border border-gray-100">
                  <div
                    className="w-full bg-[#0f1f38] rounded-2xl flex items-center justify-center transition-all duration-700"
                    style={{ height: `${col.height}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-800 mt-2.5">
                  {col.band}
                </span>
                <span className="text-[11px] text-gray-400">
                  {col.count} students
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Reports Download Card (5 cols) matching Image 2 */}
        <Card className="lg:col-span-5 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Reports</h2>
            <p className="text-xs text-gray-400 mt-0.5">Export student performance records and audit files</p>
          </div>

          <div className="space-y-4 divide-y divide-gray-100">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Course summary</h4>
                <p className="text-[11px] text-gray-400">CS101 to CS402</p>
              </div>
              <button
                onClick={() => handleDownload("Course Summary")}
                className="text-xs font-bold text-gray-900 underline hover:text-blue-700 cursor-pointer"
              >
                Download
              </button>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Grading report</h4>
                <p className="text-[11px] text-gray-400">Autumn 2026</p>
              </div>
              <button
                onClick={() => handleDownload("Grading Report Autumn 2026")}
                className="text-xs font-bold text-gray-900 underline hover:text-blue-700 cursor-pointer"
              >
                Download
              </button>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Late submissions</h4>
                <p className="text-[11px] text-gray-400">Last 30 days</p>
              </div>
              <button
                onClick={() => handleDownload("Late Submissions Log")}
                className="text-xs font-bold text-gray-900 underline hover:text-blue-700 cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 text-center">
            Signed and verified with cryptographic department timestamp
          </div>
        </Card>
      </div>
    </div>
  );
};
