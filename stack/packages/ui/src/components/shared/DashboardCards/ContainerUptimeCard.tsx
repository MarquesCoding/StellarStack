"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { AnimatedNumber } from "../Animations";
import { useDragDropGrid } from "../DragDropGrid";
import { formatUptime } from "./utils";
import type { CardProps, ContainerStatus } from "./types";

interface ContainerUptimeCardProps extends CardProps {
  isDark: boolean;
  isOffline: boolean;
  containerUptime: number;
  containerStatus: ContainerStatus;
}

export const ContainerUptimeCard = ({
  itemId,
  isDark,
  isOffline,
  containerUptime,
  containerStatus,
}: ContainerUptimeCardProps): JSX.Element => {
  const { getItemSize } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXxs = size === "xxs" || size === "xxs-wide";
  const isXs = size === "xs";
  const isCompact = isXxs || isXs;

  const uptime = formatUptime(containerUptime);
  const isRunning = containerStatus === "running";

  if (isXxs) {
    return (
      <UsageCard isDark={isDark} className={cn("h-full flex items-center justify-between px-6", isOffline && "opacity-60")}>
        <span className={cn("text-xs font-medium uppercase", isDark ? "text-zinc-400" : "text-zinc-600")}>Uptime</span>
        <span className={cn("text-xl font-mono", isDark ? "text-zinc-100" : "text-zinc-800")}>
          {isOffline || !isRunning ? "--" : uptime.full}
        </span>
      </UsageCard>
    );
  }

  return (
    <UsageCard isDark={isDark} className={cn("h-full", isXs && "p-4", isOffline && "opacity-60")}>
      <UsageCardTitle isDark={isDark} className={cn("opacity-80", isCompact ? "text-xs mb-2" : "text-md")}>
        Container Uptime
      </UsageCardTitle>
      <UsageCardContent className={isXs ? "space-y-1" : undefined}>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            isDark ? "text-zinc-100" : "text-zinc-800",
            isXs ? "text-2xl" : "text-4xl"
          )}>
            {isOffline || !isRunning ? "--" : <AnimatedNumber value={parseInt(uptime.value)} />}
          </span>
          <span className={cn(
            "uppercase",
            isDark ? "text-zinc-500" : "text-zinc-600",
            isXs ? "text-xs" : "text-sm"
          )}>
            {isRunning ? uptime.unit : ""}
          </span>
        </div>
        {!isXs && (
          <div className={cn(
            "text-xs mt-2",
            isDark ? "text-zinc-500" : "text-zinc-600"
          )}>
            {isRunning ? uptime.full : "Container stopped"}
          </div>
        )}
      </UsageCardContent>
    </UsageCard>
  );
};
