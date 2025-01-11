import React, { useState } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute z-10 -top-2 left-1/2 -translate-x-1/2 translate-y-full bg-gray-800 text-white px-2 py-1 rounded-md text-sm whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};
