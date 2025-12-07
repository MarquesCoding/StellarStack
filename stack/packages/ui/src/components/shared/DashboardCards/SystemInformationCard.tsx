"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { useDragDropGrid } from "../DragDropGrid";
import type { CardProps, NodeData, SystemInfoCardLabels } from "./types";

interface SystemInformationCardProps extends CardProps {
  isDark: boolean;
  nodeData: NodeData;
  labels: SystemInfoCardLabels;
}

export const SystemInformationCard = ({ itemId, isDark, nodeData, labels }: SystemInformationCardProps): JSX.Element => {
  const { getItemSize } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXxs = size === "xxs" || size === "xxs-wide";
  const isXs = size === "xs";
  const isCompact = size === "xs" || size === "sm";
  const isLarge = size === "lg" || size === "xl";

  const labelColor = isDark ? "text-zinc-500" : "text-zinc-500";
  const valueColor = isDark ? "text-zinc-200" : "text-zinc-800";

  const shortId = nodeData.id.slice(-4);
  const shortLocation = nodeData.location.split(" ")[0] + " " + (nodeData.location.split(" ")[1] || "");

  if (isXxs) {
    return (
      <UsageCard isDark={isDark} className="h-full flex items-center justify-between px-6">
        <span className={cn("text-xs font-medium uppercase", isDark ? "text-zinc-400" : "text-zinc-600")}>{labels.titleShort}</span>
        <span className={cn("text-sm font-mono truncate ml-4", isDark ? "text-zinc-100" : "text-zinc-800")}>{nodeData.name}</span>
      </UsageCard>
    );
  }

  return (
    <UsageCard isDark={isDark} className={cn("h-full", isXs && "p-4")}>
      <UsageCardTitle isDark={isDark} className={cn(
        "opacity-80",
        isXs ? "text-xs mb-2" : isCompact ? "text-xs mb-4" : "text-md"
      )}>
        {isXs ? labels.titleShort : labels.title}
      </UsageCardTitle>
      <UsageCardContent className={isXs ? "space-y-1" : undefined}>
        <div className={cn(
          isXs ? "space-y-1 text-[10px]" : isCompact ? "space-y-2 text-xs" : "space-y-3 text-sm"
        )}>
          <div>
            <div className={cn(labelColor, "mb-0.5", isXs ? "text-[9px]" : "text-xs")}>{labels.name}</div>
            <div className={cn(valueColor, isXs && "text-[10px]")}>{nodeData.name}</div>
          </div>
          <div>
            <div className={cn(labelColor, "mb-0.5", isXs ? "text-[9px]" : "text-xs")}>{isXs ? labels.nodeIdShort : labels.nodeId}</div>
            <div className={cn(valueColor, "font-mono", isXs && "text-[10px]")}>{isXs ? shortId : nodeData.id}</div>
          </div>
          <div>
            <div className={cn(labelColor, "mb-0.5", isXs ? "text-[9px]" : "text-xs")}>{labels.location}</div>
            <div className={cn(valueColor, isXs && "text-[10px]")}>{isXs ? shortLocation : nodeData.location}</div>
          </div>
          {!isXs && !isCompact && (
            <div>
              <div className={cn(labelColor, "text-xs mb-0.5")}>{labels.regionZone}</div>
              <div className={cn(valueColor, "font-mono")}>{nodeData.region} / {nodeData.zone}</div>
            </div>
          )}
          {isLarge && (
            <div>
              <div className={cn(labelColor, "text-xs mb-0.5")}>{labels.provider}</div>
              <div className={valueColor}>{nodeData.provider}</div>
            </div>
          )}
        </div>
      </UsageCardContent>
    </UsageCard>
  );
};
