"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { AnimatedNumber } from "../Animations";
import type { CpuCoreGridProps } from "./types";

export const CpuCoreGrid = ({ cores, isDark, isOffline }: CpuCoreGridProps): JSX.Element => {
  const getUsageColor = (percentage: number): string => {
    if (percentage === 0) return isDark ? "#71717a" : "#a1a1aa";
    if (percentage > 75) return "#ef4444";
    if (percentage > 50) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {cores.map((core) => {
        const color = isOffline ? (isDark ? "#71717a" : "#a1a1aa") : getUsageColor(core.percentage);
        return (
          <div
            key={core.id}
            className={cn(
              "relative p-1 transition-all border",
              isDark
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-zinc-100/50 border-zinc-300"
            )}
          >
            <div
              className="absolute inset-0 opacity-20 transition-all duration-300"
              style={{
                background: `linear-gradient(to top, ${color} ${core.percentage}%, transparent ${core.percentage}%)`,
              }}
            />
            <div className="relative text-center">
              <div className={cn(
                "text-[8px] font-medium uppercase leading-none",
                isDark ? "text-zinc-500" : "text-zinc-600"
              )}>
                C{core.id}
              </div>
              <div className={cn(
                "text-[10px] font-mono tabular-nums leading-tight",
                isOffline
                  ? (isDark ? "text-zinc-600" : "text-zinc-400")
                  : (isDark ? "text-zinc-200" : "text-zinc-800")
              )}>
                {isOffline ? "--" : <AnimatedNumber value={core.percentage} suffix="%" willChange />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
