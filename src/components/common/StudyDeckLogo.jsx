import React from "react";

export const StudyDeckLogo = ({ className = "", iconOnly = false, light = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact 3-bar StudyDeck stacked icon */}
      <svg
        width="34"
        height="28"
        viewBox="0 0 34 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Top bar */}
        <rect
          x="1"
          y="2"
          width="28"
          height="5.5"
          rx="2.75"
          fill={light ? "#ffffff" : "#0f1f38"}
        />
        {/* Middle bar (slightly inset) */}
        <rect
          x="5"
          y="11"
          width="24"
          height="5.5"
          rx="2.75"
          fill={light ? "#ffffff" : "#0f1f38"}
        />
        {/* Bottom bar */}
        <rect
          x="1"
          y="20"
          width="18"
          height="5.5"
          rx="2.75"
          fill={light ? "#ffffff" : "#0f1f38"}
        />
      </svg>
      {!iconOnly && (
        <span
          className={`text-xl font-bold tracking-tight ${
            light ? "text-white" : "text-[#0f1f38]"
          }`}
          style={{ fontFamily: "inherit" }}
        >
          StudyDeck
        </span>
      )}
    </div>
  );
};
