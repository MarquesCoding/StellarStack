"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard, UsageCardContent, UsageCardTitle } from "../UsageCard/UsageCard";
import { AnimatedNumber } from "../Animations";
import { useDragDropGrid } from "../DragDropGrid";
import type { CardProps, Player, ContainerStatus } from "./types";

interface PlayersOnlineCardProps extends CardProps {
  isDark: boolean;
  isOffline: boolean;
  players: Player[];
  maxPlayers: number;
  containerStatus: ContainerStatus;
}

export const PlayersOnlineCard = ({
  itemId,
  isDark,
  isOffline,
  players,
  maxPlayers,
  containerStatus,
}: PlayersOnlineCardProps): JSX.Element => {
  const { getItemSize } = useDragDropGrid();
  const size = getItemSize(itemId);

  const isXxs = size === "xxs" || size === "xxs-wide";
  const isXs = size === "xs";
  const isSm = size === "sm";
  const isCompact = isXxs || isXs;

  const isRunning = containerStatus === "running";

  if (isXxs) {
    return (
      <UsageCard isDark={isDark} className={cn("h-full flex items-center justify-between px-6", isOffline && "opacity-60")}>
        <span className={cn("text-xs font-medium uppercase", isDark ? "text-zinc-400" : "text-zinc-600")}>Players</span>
        <span className={cn("text-xl font-mono", isDark ? "text-zinc-100" : "text-zinc-800")}>
          {isOffline || !isRunning ? "--" : <><AnimatedNumber value={players.length} />/{maxPlayers}</>}
        </span>
      </UsageCard>
    );
  }

  return (
    <UsageCard isDark={isDark} className={cn("h-full flex flex-col", isXs && "p-4", isOffline && "opacity-60")}>
      <UsageCardTitle isDark={isDark} className={cn("opacity-80", isCompact ? "text-xs mb-2" : "text-md")}>
        Players Online
      </UsageCardTitle>
      <UsageCardContent className={cn("flex-1 flex flex-col", isXs ? "space-y-1" : undefined)}>
        <div className="flex items-baseline gap-1">
          <span className={cn(
            isDark ? "text-zinc-100" : "text-zinc-800",
            isXs ? "text-2xl" : "text-4xl"
          )}>
            {isOffline || !isRunning ? "--" : <AnimatedNumber value={players.length} />}
          </span>
          <span className={cn(
            isDark ? "text-zinc-500" : "text-zinc-600",
            isXs ? "text-sm" : "text-lg"
          )}>
            /{maxPlayers}
          </span>
        </div>

        {(isXs || isSm) && isRunning && players.length > 0 && (
          <div className={cn(
            "mt-2 flex-1 overflow-hidden",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}>
            <div className={cn(
              "text-[10px] uppercase font-medium mb-1",
              isDark ? "text-zinc-500" : "text-zinc-600"
            )}>
              Online
            </div>
            <div className="space-y-0.5 overflow-y-auto max-h-full">
              {players.slice(0, isSm ? 8 : 4).map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "text-xs font-mono truncate",
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  )}
                >
                  {player.name}
                </div>
              ))}
              {players.length > (isSm ? 8 : 4) && (
                <div className={cn(
                  "text-[10px]",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  +{players.length - (isSm ? 8 : 4)} more
                </div>
              )}
            </div>
          </div>
        )}
      </UsageCardContent>
    </UsageCard>
  );
};
