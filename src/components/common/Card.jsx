import React from "react";

export const Card = ({
  children,
  dark = false,
  className = "",
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${
        dark
          ? "bg-[#0f1f38] dark:bg-slate-900 text-white shadow-sm border border-transparent dark:border-slate-800"
          : "bg-white dark:bg-[#131b2e] text-gray-900 dark:text-slate-100 border border-gray-100/90 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
      } ${hoverable ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
