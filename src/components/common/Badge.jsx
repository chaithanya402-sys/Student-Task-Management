import React from "react";

export const Badge = ({ status, size = "md", className = "" }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "Overdue":
      case "overdue":
        return "bg-[#0f1f38] dark:bg-red-950/80 text-white dark:text-red-300 border-transparent dark:border-red-900/60 font-medium";
      case "Revision Required":
        return "bg-[#0f1f38] dark:bg-amber-950/80 text-white dark:text-amber-300 border-transparent dark:border-amber-900/60 font-medium";
      case "Submitted":
      case "completed":
        return "bg-[#0f1f38] dark:bg-blue-600 text-white border-transparent font-medium";
      case "Not Started":
      case "Draft":
      case "pending":
        return "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 font-medium";
      case "In Progress":
      case "in_progress":
        return "bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800 font-medium";
      case "high":
        return "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 font-semibold";
      case "medium":
        return "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 font-semibold";
      case "low":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-semibold";
      default:
        return "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700";
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
