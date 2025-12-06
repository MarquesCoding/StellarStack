"use client";

import { cn } from "@workspace/ui/lib/utils";

interface PulsingDotProps {
  status?: "online" | "offline" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

export function PulsingDot({
  status = "online",
  size = "md",
  className,
  pulse = true,
}: PulsingDotProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const colorClasses = {
    online: "bg-green-500",
    offline: "bg-zinc-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  const glowColors = {
    online: "bg-green-500/50",
    offline: "bg-zinc-500/50",
    warning: "bg-amber-500/50",
    error: "bg-red-500/50",
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      {pulse && status !== "offline" && (
        <span
          className={cn(
            "absolute inset-0 rounded-full animate-ping",
            glowColors[status],
            sizeClasses[size]
          )}
          style={{ animationDuration: "2s" }}
        />
      )}
      <span
        className={cn(
          "relative rounded-full",
          colorClasses[status],
          sizeClasses[size]
        )}
      />
    </span>
  );
}
