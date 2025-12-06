"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { useDragDropGrid } from "../DragDropGrid";
import type { CardProps, LogEntry } from "./types";

interface RecentLogsCardProps extends CardProps {
  isDark: boolean;
  isOffline: boolean;
  logs: LogEntry[];
}

export const RecentLogsCard = ({
  itemId,
  isDark,
  isOffline,
  logs,
}: RecentLogsCardProps): JSX.Element => {
  const { getItemSize } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXs = size === "xs";

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-400";
      case "warning": return "text-amber-400";
      default: return isDark ? "text-zinc-400" : "text-zinc-600";
    }
  };

  return (
    <UsageCard isDark={isDark} className={cn("h-full flex flex-col", isXs && "p-4", isOffline && "opacity-60")}>
      <UsageCardTitle isDark={isDark} className={cn("opacity-80", isXs ? "text-xs mb-2" : "text-md")}>
        Recent Logs
      </UsageCardTitle>
      <UsageCardContent className="flex-1 overflow-hidden">
        <div className="space-y-0.5 overflow-y-auto h-full font-mono text-[10px]">
          {logs.slice(0, isXs ? 5 : 8).map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className={cn("shrink-0", isDark ? "text-zinc-600" : "text-zinc-400")}>
                {log.time}
              </span>
              <span className={cn("truncate", getLevelColor(log.level))}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </UsageCardContent>
    </UsageCard>
  );
};
