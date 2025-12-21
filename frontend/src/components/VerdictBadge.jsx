import React from "react";

export default function VerdictBadge({ verdict }) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    zinc: "bg-zinc-800 text-zinc-500 border-zinc-700",
  };

  const activeStyle = styles[verdict.color] || styles.zinc;

  return (
    <div className="group relative flex items-center justify-center">
      <span
        className={`
          px-2.5 py-0.5 rounded-full text-xs font-medium border
          cursor-help select-none whitespace-nowrap
          ${activeStyle}
        `}
      >
        {verdict.label}
      </span>
      
      {/* Tooltip ao passar o mouse */}
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-900 text-white text-[10px] px-2 py-1 rounded border border-gray-700 shadow-xl z-50">
        {verdict.tip}
      </div>
    </div>
  );
}