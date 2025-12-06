"use client";

import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { UsageCard } from "../UsageCard/UsageCard";
import type { CardProps } from "./types";

interface InstanceNameCardProps extends CardProps {
  isDark: boolean;
  instanceName: string;
}

export const InstanceNameCard = ({ isDark, instanceName }: InstanceNameCardProps): JSX.Element => {
  return (
    <UsageCard isDark={isDark} className="h-full flex items-center justify-center">
      <div className={cn("text-2xl font-mono uppercase", isDark ? "text-zinc-400" : "text-zinc-600")}>
        {instanceName}
      </div>
    </UsageCard>
  );
};
