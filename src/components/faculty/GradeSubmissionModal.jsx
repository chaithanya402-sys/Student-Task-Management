import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, FileText, Download, User, Sparkles } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const GradeSubmissionModal = ({ isOpen, onClose, submission }) => {
  const { gradeStudentSubmission } = useStudyDeck();

  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      setMarks(submission.marks !== null && submission.marks !== undefined ? String(submission.marks) : "");
      setFeedback(submission.feedback || "");
      setError("");
    }
  }, [submission, isOpen]);

  if (!isOpen || !submission) return null;

  const maxPoints = submission.max_points || 100;

  const quickRubricChips = [
    "Comprehensive analysis and solid methodology.",
    "Code meets all technical specifications.",
    "Well-structured report with clear citations.",
    "Needs more testing and edge case coverage.",
    "Late submission penalty deducted (10%)."
  ];

  const addRubricChip = (chip) => {
    if (!feedback) {
      setFeedback(chip);
    } else if (!feedback.includes(chip)) {
      setFeedback(prev => `${prev}\n${chip}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedMarks = parseFloat(marks);

    if (isNaN(parsedMarks)) {
      setError("Please enter a numeric score");
      return;
    }

    if (parsedMarks < 0 || parsedMarks > maxPoints) {
      setError(`Marks must be between 0 and ${maxPoints}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await gradeStudentSubmission(submission.id, parsedMarks, feedback);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || "Failed to save grade");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              {submission.course_code} &bull; {submission.assignment_title}
            </span>
            <h3 className="font-bold text-[#0f1f38] dark:text-white text-base leading-tight">
              Grade Submission: {submission.student_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={54} className="text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-[#0f1f38] dark:text-white">Grade Saved & Released!</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
              {submission.student_name} has received the evaluation and feedback notification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-900">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Submission metadata card */}
            <div className="p-3.5 bg-gray-50 dark:bg-slate-800/80 rounded-2xl border border-gray-200/80 dark:border-slate-700/70 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-600 dark:text-slate-300">
                <span>Student:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{submission.student_name} ({submission.student_email || "Enrolled"})</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-slate-300">
                <span>Submitted At:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{submission.submitted_at}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-slate-300">
                <span>Submission File:</span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 dark:text-blue-400 font-semibold bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-gray-200 dark:border-slate-700">
                  <FileText size={12} />
                  <span>{submission.submitted_file || "submission_document.pdf"}</span>
                </div>
              </div>
              {submission.submitted_text && (
                <div className="pt-2 border-t border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 italic">
                  "{submission.submitted_text}"
                </div>
              )}
            </div>

            {/* Score input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Awarded Score *
                </label>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">
                  Max points: {maxPoints}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={maxPoints}
                  value={marks}
                  onChange={(e) => {
                    setMarks(e.target.value);
                    setError("");
                  }}
                  placeholder={`Enter 0 to ${maxPoints}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-[#0f1f38] dark:text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 dark:text-slate-500">
                  / {maxPoints}
                </span>
              </div>
            </div>

            {/* Quick Rubric Chips */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-slate-400 mb-1.5">
                Quick Rubric Feedback (Click to append):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickRubricChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addRubricChip(chip)}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 border border-gray-200/80 dark:border-slate-700 transition-colors cursor-pointer text-left"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback textarea */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Instructor Feedback & Comments
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Give constructive academic feedback visible to the student..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-xs cursor-pointer disabled:opacity-60 active:scale-95 transition-all"
              >
                {isSubmitting ? "Saving..." : "Save & Release Grade"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
