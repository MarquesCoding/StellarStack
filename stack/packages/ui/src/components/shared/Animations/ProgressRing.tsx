"use client";

import { useEffect, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
  children?: React.ReactNode;
}

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  className,
  trackColor,
  progressColor,
  showPercentage = true,
  animated = true,
  children,
}: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(animated ? 0 : percentage);

  useEffect(() => {
    if (!animated) {
      setAnimatedPercentage(percentage);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  // Determine color based on percentage
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    if (percentage > 80) return "#ef4444"; // red
    if (percentage > 60) return "#f59e0b"; // amber
    return "#22c55e"; // green
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor || "rgba(113, 113, 122, 0.2)"}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${getProgressColor()}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-2xl font-mono font-semibold tabular-nums">
            {Math.round(animatedPercentage)}%
          </span>
        ))}
      </div>
    </div>
  );
}
