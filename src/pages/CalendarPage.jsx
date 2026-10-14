import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { AssignmentSubmitModal } from "../components/common/AssignmentSubmitModal";

export const CalendarPage = () => {
  const { assignments, tasks } = useStudyDeck();

  // Reference date: October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState("2026-10-17");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate("2026-10-14");
  };

  // Days in month calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate calendar grid cells (Monday to Sunday)
  const startingOffset = (firstDayOfWeek + 6) % 7; // shift so Mon is 0

  const daysArray = [];
  // previous month padding
  for (let i = 0; i < startingOffset; i++) {
    daysArray.push({ type: "pad", key: `pad-${i}` });
  }
  // current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    const dayAssignments = assignments.filter((a) => a.dueDate === dateStr);
    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

    daysArray.push({
      type: "day",
      dayNumber: d,
      dateString: dateStr,
      assignments: dayAssignments,
      tasks: dayTasks
    });
  }

  // Selected date events
  const selectedDayAssignments = assignments.filter((a) => a.dueDate === selectedDate);
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-[#0f1f38] tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Grid & Side Event Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Main Month Grid (8 cols) */}
          <div className="lg:col-span-8">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-gray-400 uppercase tracking-wider pb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {daysArray.map((cell, idx) => {
                if (cell.type === "pad") {
                  return (
                    <div
                      key={cell.key}
                      className="min-h-[70px] sm:min-h-[85px] p-1.5 rounded-xl bg-gray-50/40 border border-transparent"
                    />
                  );
                }

                const isSelected = selectedDate === cell.dateString;
                const hasDeadlines = cell.assignments.length > 0;
                const hasTasks = cell.tasks.length > 0;

                return (
                  <div
                    key={cell.dateString}
                    onClick={() => setSelectedDate(cell.dateString)}
                    className={`min-h-[70px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0f1f38] shadow-xs"
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          cell.dateString === "2026-10-14"
                            ? "bg-[#0f1f38] text-white"
                            : isSelected
                            ? "text-[#0f1f38]"
                            : "text-gray-700"
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                      {hasDeadlines && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {cell.assignments.slice(0, 1).map((a) => (
                        <div
                          key={a.id}
                          className="text-[10px] truncate px-1.5 py-0.5 rounded bg-[#0f1f38] text-white font-medium"
                          title={`${a.course}: ${a.title}`}
                        >
                          {a.title}
                        </div>
                      ))}
                      {cell.tasks.slice(0, 1).map((t) => (
                        <div
                          key={t.id}
                          className="text-[10px] truncate px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-medium"
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      ))}
                      {(cell.assignments.length + cell.tasks.length > 2) && (
                        <span className="text-[9px] text-gray-400 block text-right font-medium">
                          +{cell.assignments.length + cell.tasks.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Drawer: Selected Day Schedule (4 cols) */}
          <div className="lg:col-span-4 bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-200/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Day Schedule
                </span>
                <span className="text-xs font-semibold text-[#0f1f38]">
                  {selectedDate}
                </span>
              </div>

              {/* Assignments for selected day */}
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold text-[#0f1f38] flex items-center gap-1.5">
                  <CalendarIcon size={14} />
                  <span>Course Deadlines ({selectedDayAssignments.length})</span>
                </h4>

                {selectedDayAssignments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No course submissions due this day.</p>
                ) : (
                  selectedDayAssignments.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setSelectedAssignment(a);
                        setIsSubmitModalOpen(true);
                      }}
                      className="p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-xs cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-sky-700 uppercase">
                          {a.course}
                        </span>
                        <Badge status={a.status} size="sm" />
                      </div>
                      <div className="text-xs font-bold text-gray-900">{a.title}</div>
                      <div className="text-[11px] text-gray-500">Faculty: {a.faculty}</div>
                    </div>
                  ))
                )}

                {/* Tasks for selected day */}
                <h4 className="text-xs font-bold text-[#0f1f38] flex items-center gap-1.5 pt-2">
                  <Clock size={14} />
                  <span>Tasks & Study Items ({selectedDayTasks.length})</span>
                </h4>

                {selectedDayTasks.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No tasks scheduled for this day.</p>
                ) : (
                  selectedDayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-white border border-gray-200 shadow-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-800">{t.title}</span>
                        <Badge status={t.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-gray-400 block">{t.course}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 text-center">
              <span className="text-[11px] text-gray-500">
                Click any assignment to view or submit work
              </span>
            </div>
          </div>
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
