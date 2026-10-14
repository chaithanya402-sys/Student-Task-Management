import React from "react";
import { X, Check } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const FilterModal = () => {
  const { isFilterModalOpen, setIsFilterModalOpen, activeFilter, setActiveFilter } = useStudyDeck();

  if (!isFilterModalOpen) return null;

  const filters = [
    { id: "all", label: "All Items", desc: "Show everything without status filtering" },
    { id: "overdue", label: "Overdue Only", desc: "Items past due date needing urgent attention" },
    { id: "pending", label: "Pending Only", desc: "Active tasks and incomplete assignments" },
    { id: "completed", label: "Completed / Submitted", desc: "Finished tasks and turned-in assignments" },
    { id: "assigned", label: "Faculty Assigned", desc: "Items assigned directly by instructors" },
    { id: "personal", label: "Personal Tasks", desc: "Self-created study goals and prep work" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-[#0f1f38] text-base">Filter Workload</h3>
            <p className="text-xs text-gray-500 mt-0.5">Filter tasks and deadlines across StudyDeck</p>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter options */}
        <div className="p-4 space-y-1.5 max-h-80 overflow-y-auto">
          {filters.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFilter(f.id);
                  setIsFilterModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0f1f38] text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {f.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                    {f.desc}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveFilter("all");
              setIsFilterModalOpen(false);
            }}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            Reset to Default
          </button>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
