"use client";

import { FiInfo } from "react-icons/fi";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  visible?: boolean;
  isDark?: boolean;
}

export function InfoTooltip({ content, className, visible = true, isDark = true }: InfoTooltipProps) {
  if (!visible) return null;

  return (
    <div className={cn("absolute top-4 right-4 z-10", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "p-1.5 rounded-full transition-colors",
              isDark ? "bg-zinc-800/60 hover:bg-zinc-700/80" : "bg-zinc-200/60 hover:bg-zinc-300/80"
            )}
          >
            <FiInfo className={cn("w-3.5 h-3.5", isDark ? "text-zinc-400" : "text-zinc-600")} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          sideOffset={8}
          className={cn(
            "relative p-4 border min-w-[220px] max-w-[300px] rounded-none backdrop-blur-md",
            isDark ? "bg-[#0f0f0f]/80 border-zinc-200/10" : "bg-white/80 border-zinc-300"
          )}
        >
          {/* Corner accents matching UsageCard */}
          <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
          <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
          <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
          <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

          <div className={cn("text-xs space-y-2", isDark ? "text-zinc-300" : "text-zinc-700")}>
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  isDark?: boolean;
}

export function InfoRow({ label, value, isDark = true }: InfoRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className={cn("font-mono text-right", isDark ? "text-zinc-200" : "text-zinc-800")}>{value}</span>
    </div>
  );
}
