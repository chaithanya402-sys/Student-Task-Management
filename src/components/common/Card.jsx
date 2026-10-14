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
          ? "bg-[#0f1f38] text-white shadow-sm"
          : "bg-white text-gray-900 border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
      } ${hoverable ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
