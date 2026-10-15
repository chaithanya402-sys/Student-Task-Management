import React from "react";
import { X, Check, UserCheck, Shield } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { useNavigate } from "react-router-dom";

export const AuthDemoAccountsModal = ({ isOpen, onClose }) => {
  const { allUsers, currentUserId, switchUser } = useStudyDeck();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-[#0f1f38] dark:text-blue-400" />
            <h3 className="font-bold text-[#0f1f38] dark:text-white text-base">Select Demo Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* User list */}
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {allUsers.map((u) => {
            const isCurrent = u.id === currentUserId;
            return (
              <div
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  onClose();
                  if (u.role === "faculty") {
                    navigate("/faculty/dashboard");
                  } else {
                    navigate("/dashboard");
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? "bg-[#0f1f38] dark:bg-blue-600 text-white border-[#0f1f38] dark:border-blue-600 shadow-xs"
                    : "bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50/70 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCurrent
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-slate-700 text-[#0f1f38] dark:text-slate-100"
                    }`}
                  >
                    {u.initials}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isCurrent ? "text-white" : "text-gray-900 dark:text-slate-100"}`}>
                      {u.name}
                    </h4>
                    <p className={`text-[11px] ${isCurrent ? "text-white/80" : "text-gray-500 dark:text-slate-400"}`}>
                      {u.role.toUpperCase()} &bull; {u.department}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-500 dark:text-slate-400 text-center">
          Switching accounts immediately synchronizes permissions and enrollment data.
        </div>
      </div>
    </div>
  );
};
