import React from "react";

export const Badge = ({ status, size = "md", className = "" }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "Overdue":
        return "bg-[#0f1f38] text-white border-transparent font-medium";
      case "Revision Required":
        return "bg-[#0f1f38] text-white border-transparent font-medium";
      case "Submitted":
        return "bg-[#0f1f38] text-white border-transparent font-medium";
      case "Not Started":
        return "bg-white text-gray-700 border-gray-300 font-medium";
      case "Draft":
        return "bg-white text-gray-700 border-gray-300 font-medium";
      case "In Progress":
      case "in_progress":
        return "bg-sky-50 text-sky-800 border-sky-200 font-medium";
      case "completed":
        return "bg-[#0f1f38] text-white border-transparent font-medium";
      case "pending":
        return "bg-white text-gray-700 border-gray-300 font-medium";
      case "overdue":
        return "bg-[#0f1f38] text-white border-transparent font-medium";
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
      case "low":
        return "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-xs"
  }[size] || "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border whitespace-nowrap transition-colors ${sizeClasses} ${getBadgeStyle()} ${className}`}
    >
      {status}
    </span>
  );
};
