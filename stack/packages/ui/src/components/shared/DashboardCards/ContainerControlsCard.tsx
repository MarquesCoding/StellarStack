"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard } from "../UsageCard/UsageCard";
import type { CardProps, ContainerStatus } from "./types";

interface ContainerControlsCardProps extends CardProps {
  isDark: boolean;
  isOffline: boolean;
  status: ContainerStatus;
  onStart: () => void;
  onStop: () => void;
  onKill: () => void;
  onRestart: () => void;
}

export const ContainerControlsCard = ({
  isDark,
  isOffline,
  status,
  onStart,
  onStop,
  onKill,
  onRestart,
}: ContainerControlsCardProps): JSX.Element => {
  const isRunning = status === "running";
  const isStopped = status === "stopped";
  const isTransitioning = status === "starting" || status === "stopping";

  const buttonBase = "px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors";
  const buttonColors = isDark
    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
    : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300";
  const disabledColors = isDark
    ? "bg-zinc-800/50 text-zinc-600"
    : "bg-zinc-200/50 text-zinc-400";

  return (
    <UsageCard isDark={isDark} className={cn("h-full flex items-center justify-center px-8", isOffline && "opacity-60")}>
      <div className="flex gap-4 w-full justify-between max-w-md">
        <button
          onClick={onStart}
          disabled={isRunning || isTransitioning || isOffline}
          className={cn(
            buttonBase,
            (isRunning || isTransitioning || isOffline) ? disabledColors : buttonColors,
            (isRunning || isTransitioning || isOffline) && "cursor-not-allowed"
          )}
        >
          Start
        </button>
        <button
          onClick={onStop}
          disabled={isStopped || isTransitioning || isOffline}
          className={cn(
            buttonBase,
            (isStopped || isTransitioning || isOffline) ? disabledColors : buttonColors,
            (isStopped || isTransitioning || isOffline) && "cursor-not-allowed"
          )}
        >
          Stop
        </button>
        <button
          onClick={onKill}
          disabled={isStopped || isOffline}
          className={cn(
            buttonBase,
            (isStopped || isOffline) ? disabledColors : buttonColors,
            (isStopped || isOffline) && "cursor-not-allowed"
          )}
        >
          Kill
        </button>
        <button
          onClick={onRestart}
          disabled={isStopped || isTransitioning || isOffline}
          className={cn(
            buttonBase,
            (isStopped || isTransitioning || isOffline) ? disabledColors : buttonColors,
            (isStopped || isTransitioning || isOffline) && "cursor-not-allowed"
          )}
        >
          Restart
        </button>
      </div>
    </UsageCard>
  );
};
