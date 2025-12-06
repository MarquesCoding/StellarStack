"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { InfoTooltip, InfoRow } from "../InfoTooltip";
import { DualSparkline } from "../Sparkline";
import { AnimatedNumber } from "../Animations";
import { useDragDropGrid } from "../DragDropGrid";
import type { NetworkUsageCardProps, NetworkTooltipData } from "./types";

interface NetworkUsageCardComponentProps extends NetworkUsageCardProps {
  isDark: boolean;
  isOffline: boolean;
  tooltipData?: NetworkTooltipData;
}

export const NetworkUsageCard = ({
  itemId,
  download,
  upload,
  downloadHistory,
  uploadHistory,
  isDark,
  isOffline,
  tooltipData,
}: NetworkUsageCardComponentProps): JSX.Element => {
  const { getItemSize, isEditing } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXxs = size === "xxs" || size === "xxs-wide";
  const isXs = size === "xs";
  const isCompact = size === "xs" || size === "sm" || size === "xxs" || size === "xxs-wide";

  const valueColor = isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : (isDark ? "text-zinc-200" : "text-zinc-800");
  const offlineGray = isDark ? "#71717a" : "#a1a1aa";

  if (isXxs) {
    return (
      <UsageCard isDark={isDark} className={cn("h-full flex items-center justify-between px-6", isOffline && "opacity-60")}>
        <span className={cn("font-mono text-sm", isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : "text-blue-400")}>
          ↓ {isOffline ? "-- " : <AnimatedNumber value={download} decimals={1} />} MB/s
        </span>
        <span className={cn("font-mono text-sm", isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : "text-purple-400")}>
          ↑ {isOffline ? "-- " : <AnimatedNumber value={upload} decimals={1} />} MB/s
        </span>
      </UsageCard>
    );
  }

  return (
    <UsageCard isDark={isDark} className={cn("h-full", isXs && "p-4", isOffline && "opacity-60")}>
      {tooltipData && (
        <InfoTooltip
          visible={!isEditing}
          isDark={isDark}
          content={
            <>
              <InfoRow label="Interface" value={tooltipData.interface} isDark={isDark} />
              <InfoRow label="Adapter" value={tooltipData.adapter} isDark={isDark} />
              <InfoRow label="Speed" value={tooltipData.speed} isDark={isDark} />
              <InfoRow label="IPv4" value={tooltipData.ipv4} isDark={isDark} />
              <InfoRow label="Gateway" value={tooltipData.gateway} isDark={isDark} />
              <InfoRow label="DNS" value={tooltipData.dns} isDark={isDark} />
            </>
          }
        />
      )}
      <UsageCardTitle isDark={isDark} className={cn(
        "opacity-80",
        isXs ? "text-xs mb-2" : isCompact ? "text-xs mb-4" : "text-md"
      )}>
        NETWORK
      </UsageCardTitle>
      <UsageCardContent className={isXs ? "space-y-1" : undefined}>
        <div className={cn(
          "tracking-wide",
          isDark ? "text-zinc-400" : "text-zinc-600",
          isXs ? "text-[10px]" : isCompact ? "text-xs" : "text-sm"
        )}>
          <div className="flex justify-between items-center">
            <span className={isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : "text-blue-400"}>{isXs ? "↓" : "↓ Download"}</span>
            <span className={cn(valueColor, "font-mono")}>{isOffline ? "--" : <AnimatedNumber value={download} decimals={1} />} MB/s</span>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <span className={isOffline ? (isDark ? "text-zinc-500" : "text-zinc-400") : "text-purple-400"}>{isXs ? "↑" : "↑ Upload"}</span>
            <span className={cn(valueColor, "font-mono")}>{isOffline ? "--" : <AnimatedNumber value={upload} decimals={1} />} MB/s</span>
          </div>
        </div>
        {downloadHistory && uploadHistory && (
          <div className={cn("mt-auto", isCompact ? "pt-2" : "pt-4")}>
            <DualSparkline
              data1={downloadHistory}
              data2={uploadHistory}
              color1={isOffline ? offlineGray : "#3b82f6"}
              color2={isOffline ? offlineGray : "#a855f7"}
              height={isXs ? 40 : isCompact ? 50 : 60}
              isDark={isDark}
            />
          </div>
        )}
      </UsageCardContent>
    </UsageCard>
  );
};
