import React, { useState } from "react";
import { X, UploadCloud, FileCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const AssignmentSubmitModal = ({ isOpen, onClose, assignment }) => {
  const { submitAssignment } = useStudyDeck();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !assignment) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !assignment.submittedFile) {
      setError("Please attach your submission document or PDF");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(assignment.id, file ? file.name : "submitted_work.pdf");
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setFile(null);
        setNotes("");
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              {assignment.course}
            </span>
            <h3 className="font-bold text-[#0f1f38] dark:text-white text-base leading-snug">
              Submit: {assignment.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={54} className="text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-[#0f1f38] dark:text-white">Submission Recorded!</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Your assignment has been marked as submitted and logged in your academic record.
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

            <div className="bg-gray-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 text-xs space-y-1">
              <div className="flex justify-between text-gray-600 dark:text-slate-300">
                <span>Instructor:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{assignment.faculty}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-slate-300">
                <span>Due Date:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{assignment.displayDate || assignment.dueDate}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-slate-300">
                <span>Total Points:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{assignment.totalPoints || 100} pts</span>
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Upload Submission File (PDF, DOCX, ZIP)
              </label>
              <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-[#0f1f38] dark:hover:border-blue-500 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-800">
                <UploadCloud size={32} className="text-gray-400 dark:text-slate-500 mb-2" />
                <span className="text-xs font-bold text-gray-700 dark:text-slate-200">
                  {file ? file.name : "Click to select or drag and drop file"}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                  Supports up to 25MB (PDF preferred)
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.doc,.zip,.png,.jpg"
                />
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Student Notes / Submission Comments
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special remarks or link to repository/preview..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-sm transition-all cursor-pointer disabled:opacity-60 active:scale-95"
              >
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
