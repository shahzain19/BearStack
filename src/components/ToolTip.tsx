// src/components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute z-50 hidden group-hover:flex px-3 py-1.5 text-xs text-white bg-black rounded-md shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100 
        ${
          position === "top"
            ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
            : position === "bottom"
            ? "top-full mt-2 left-1/2 -translate-x-1/2"
            : position === "left"
            ? "right-full mr-2 top-1/2 -translate-y-1/2"
            : "left-full ml-2 top-1/2 -translate-y-1/2"
        }`}
      >
        {content}
      </div>
    </div>
  );
};
