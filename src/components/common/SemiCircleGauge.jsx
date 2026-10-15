import React from "react";

export const SemiCircleGauge = ({
  percentage = 85,
  label = "17 of 20 assignments submitted",
  className = ""
}) => {
  const r = 68;
  const cx = 95;
  const cy = 82;
  const strokeWidth = 14;
  // Semi-circle circumference = pi * r
  const arcLength = Math.PI * r;
  const strokeDashoffset = arcLength * (1 - Math.min(Math.max(percentage, 0), 100) / 100);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
        <svg
          viewBox="0 0 190 98"
          className="w-full h-full transform transition-all duration-700"
        >
          {/* Background track arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="currentColor"
            className="text-gray-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active navy progress arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="currentColor"
            className="text-[#0f1f38] dark:text-blue-500 transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Pill summary below */}
      {label && (
        <div className="mt-4 px-4 py-1.5 rounded-full bg-[#f3f4f6] dark:bg-slate-800/90 text-xs font-semibold text-gray-700 dark:text-slate-200 border border-transparent dark:border-slate-700 tracking-tight">
          {label}
        </div>
      )}
    </div>
  );
};
