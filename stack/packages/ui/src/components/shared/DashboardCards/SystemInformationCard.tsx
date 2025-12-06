"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { useDragDropGrid } from "../DragDropGrid";
import type { CardProps, NodeData } from "./types";

interface SystemInformationCardProps extends CardProps {
  isDark: boolean;
  nodeData: NodeData;
}

export const SystemInformationCard = ({ itemId, isDark, nodeData }: SystemInformationCardProps): JSX.Element => {
  const { getItemSize } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXs = size === "xs";
  const isCompact = size === "xs" || size === "sm";
  const isLarge = size === "lg" || size === "xl";

  const labelColor = isDark ? "text-zinc-500" : "text-zinc-500";
  const valueColor = isDark ? "text-zinc-200" : "text-zinc-800";

  return (
    <UsageCard isDark={isDark} className={cn("h-full", isXs && "p-4")}>
      <UsageCardTitle isDark={isDark} className={cn(
        "opacity-80",
        isXs ? "text-xs mb-2" : isCompact ? "text-xs mb-4" : "text-md"
      )}>
        {isXs ? "NODE" : "SYSTEM INFORMATION"}
      </UsageCardTitle>
      <UsageCardContent className={isXs ? "space-y-1" : undefined}>
        <div className={cn(
          isXs ? "space-y-1 text-[10px]" : isCompact ? "space-y-2 text-xs" : "space-y-3 text-sm"
        )}>
          <div>
            <div className={cn(labelColor, "mb-0.5", isXs ? "text-[9px]" : "text-xs")}>NAME</div>
            <div className={cn(valueColor, isXs && "text-[10px]")}>{isXs ? "Prod Node 1" : nodeData.name}</div>
          </div>
          <div>
            <div className={cn(labelColor, "mb-0.5", isXs ? "text-[9px]" : "text-xs")}>{isXs ? "ID" : "NODE ID"}</div>
            <div className={cn(valueColor, "font-mono", isXs && "text-[10px]")}>{isXs ? "7f3b" : nodeData.id}</div>
          </div>
          <div>
            <div className={cn(labelColor, "mb-0.5", isXs ? "text-[9px]" : "text-xs")}>LOCATION</div>
            <div className={cn(valueColor, isXs && "text-[10px]")}>{isXs ? "US East" : nodeData.location}</div>
          </div>
          {!isXs && !isCompact && (
            <div>
              <div className={cn(labelColor, "text-xs mb-0.5")}>REGION / ZONE</div>
              <div className={cn(valueColor, "font-mono")}>{nodeData.region} / {nodeData.zone}</div>
            </div>
          )}
          {isLarge && (
            <div>
              <div className={cn(labelColor, "text-xs mb-0.5")}>PROVIDER</div>
              <div className={valueColor}>{nodeData.provider}</div>
            </div>
          )}
        </div>
      </UsageCardContent>
    </UsageCard>
  );
};
