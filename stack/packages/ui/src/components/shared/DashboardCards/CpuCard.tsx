"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { InfoTooltip } from "../InfoTooltip";
import { Sparkline } from "../Sparkline";
import { AnimatedNumber } from "../Animations";
import { useDragDropGrid } from "../DragDropGrid";
import { CpuCoreGrid } from "./CpuCoreGrid";
import { getUsageColor } from "./utils";
import type { CpuCardProps } from "./types";

interface CpuCardComponentProps extends CpuCardProps {
  isDark: boolean;
  isOffline: boolean;
}

export const CpuCard = ({
  itemId,
  percentage,
  details,
  tooltipContent,
  history,
  coreUsage,
  isDark,
  isOffline,
}: CpuCardComponentProps): JSX.Element => {
  const { getItemSize, isEditing } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXxs = size === "xxs" || size === "xxs-wide";
  const isXs = size === "xs";
  const isCompact = size === "xs" || size === "sm" || size === "xxs" || size === "xxs-wide";
  const isLarge = size === "lg" || size === "xl" || size === "xxl";
  const showCoreGrid = isLarge && coreUsage && coreUsage.length > 0;

  const sparklineColor = isOffline ? (isDark ? "#71717a" : "#a1a1aa") : getUsageColor(percentage, isDark);

  if (isXxs) {
    return (
      <UsageCard isDark={isDark} className={cn("h-full flex items-center justify-between px-6", isOffline && "opacity-60")}>
        <span className={cn("text-xs font-medium uppercase", isDark ? "text-zinc-400" : "text-zinc-600")}>CPU</span>
        <span className={cn("text-xl font-mono", isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : (isDark ? "text-zinc-100" : "text-zinc-800"))}>
          {isOffline ? "--" : <AnimatedNumber value={percentage} suffix="%" />}
        </span>
      </UsageCard>
    );
  }

  return (
    <UsageCard isDark={isDark} className={cn("h-full flex flex-col", isXs && "p-4", isOffline && "opacity-60")}>
      {tooltipContent && (
        <InfoTooltip content={tooltipContent} visible={!isEditing} isDark={isDark} />
      )}
      <UsageCardTitle isDark={isDark} className={cn(
        "opacity-80",
        isXs ? "text-xs mb-2" : isCompact ? "text-xs mb-4" : "text-md"
      )}>
        CPU
      </UsageCardTitle>
      <UsageCardContent className={cn("flex-1 flex flex-col", isXs ? "space-y-1" : undefined)}>
        <div className="flex items-start justify-between">
          <div>
            <span className={cn(
              isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : (isDark ? "text-zinc-100" : "text-zinc-800"),
              isXs ? "text-xl" : isCompact ? "text-2xl" : showCoreGrid ? "text-2xl" : isLarge ? "text-5xl" : "text-4xl"
            )}>
              {isOffline ? "--" : <AnimatedNumber value={percentage} suffix="%" />}
            </span>
            {!isXs && !showCoreGrid && (
              <div className={cn(
                "tracking-wide",
                isDark ? "text-zinc-400" : "text-zinc-600",
                isCompact ? "text-xs mt-2" : "text-sm mt-1"
              )}>
                {details.map((detail, i) => (
                  <div key={i}>{isOffline ? "--" : detail}</div>
                ))}
              </div>
            )}
            {showCoreGrid && (
              <div className={cn(
                "tracking-wide text-[10px] mt-0.5",
                isDark ? "text-zinc-500" : "text-zinc-600"
              )}>
                {details[0]}
              </div>
            )}
          </div>
        </div>

        {showCoreGrid && coreUsage && (
          <div className="mt-2">
            <div className={cn(
              "text-[9px] uppercase font-medium mb-1",
              isDark ? "text-zinc-500" : "text-zinc-600"
            )}>
              Core Usage
            </div>
            <CpuCoreGrid cores={coreUsage} isDark={isDark} isOffline={isOffline} />
          </div>
        )}

        {history && !showCoreGrid && (
          <div className={cn("mt-auto", isCompact ? "pt-2" : "pt-4")}>
            <Sparkline data={history} color={sparklineColor} height={isXs ? 40 : isCompact ? 50 : 60} isDark={isDark} />
          </div>
        )}
      </UsageCardContent>
    </UsageCard>
  );
};
