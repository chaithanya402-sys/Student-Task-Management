import React, { useState } from "react";
import { X, Sparkles, Send, BookOpen, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useStudyDeck } from "../../context/StudyDeckContext";

export const StudyCoachModal = ({ isOpen, onClose }) => {
  const { stats, tasks, assignments } = useStudyDeck();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "coach",
      text: "Hello! I am your StudyFlow Academic Coach. Looking at your schedule, you have 5 tasks due this week and an upcoming assignment on 18 Oct. How can I help you plan your study sessions today?"
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setQuery("");

    setTimeout(() => {
      let reply = "Great question! I recommend dedicating a focused 45-minute Pomodoro block to this today. Remember to review your course lecture notes first before tackling the problem sets.";
      if (userText.toLowerCase().includes("database") || userText.toLowerCase().includes("sql")) {
        reply = "For CS204 Databases, practice writing the nested joins on paper first. Be sure to check the primary keys and foreign key constraints!";
      } else if (userText.toLowerCase().includes("overdue") || userText.toLowerCase().includes("stress")) {
        reply = "Don't worry! Break the overdue items into small 15-minute milestones. Completing just one task will restore your momentum immediately.";
      }
      setMessages(prev => [...prev, { sender: "coach", text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col h-[580px] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/60 to-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0f1f38] text-sm">StudyFlow AI Coach</h3>
              <p className="text-[11px] text-purple-700 font-semibold">Active Study & Pacing Advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workload Snapshot Banner */}
        <div className="p-3 bg-gray-50 border-b border-gray-100 grid grid-cols-3 text-center text-xs divide-x divide-gray-200">
          <div>
            <span className="block text-[10px] text-gray-400 font-semibold">Weekly Workload</span>
            <span className="font-extrabold text-gray-900">{stats.pendingTasks} Pending</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-semibold">Completion</span>
            <span className="font-extrabold text-blue-700">{stats.assignmentCompletionRate}%</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-semibold">Academic Pace</span>
            <span className="font-extrabold text-emerald-700">On Track</span>
          </div>
        </div>

        {/* Chat message body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  m.sender === "user"
                    ? "bg-[#0f1f38] text-white"
                    : "bg-gray-100/90 text-gray-800 border border-gray-200/60"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for study tips, deadline priorities, or pacing..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0f1f38]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#0f1f38] text-white hover:bg-[#1a2e4f] cursor-pointer shrink-0"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
