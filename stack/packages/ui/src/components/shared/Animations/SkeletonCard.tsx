"use client";

import { cn } from "@workspace/ui/lib/utils";

interface SkeletonProps {
  className?: string;
  isDark?: boolean;
}

export function Skeleton({ className, isDark = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded",
        isDark ? "bg-zinc-800" : "bg-zinc-200",
        className
      )}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  isDark?: boolean;
  variant?: "default" | "stat" | "chart" | "table-row";
}

export function SkeletonCard({
  className,
  isDark = true,
  variant = "default",
}: SkeletonCardProps) {
  const baseCard = cn(
    "border p-6",
    isDark
      ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
      : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300",
    className
  );

  if (variant === "stat") {
    return (
      <div className={baseCard}>
        <Skeleton className="h-3 w-16 mb-4" isDark={isDark} />
        <Skeleton className="h-10 w-24 mb-2" isDark={isDark} />
        <Skeleton className="h-3 w-32" isDark={isDark} />
        <Skeleton className="h-12 w-full mt-4" isDark={isDark} />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={baseCard}>
        <Skeleton className="h-3 w-20 mb-4" isDark={isDark} />
        <Skeleton className="h-40 w-full" isDark={isDark} />
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={cn("flex items-center gap-4 p-4", className)}>
        <Skeleton className="h-4 w-4" isDark={isDark} />
        <Skeleton className="h-4 w-32" isDark={isDark} />
        <Skeleton className="h-4 w-16 ml-auto" isDark={isDark} />
        <Skeleton className="h-4 w-20" isDark={isDark} />
      </div>
    );
  }

  return (
    <div className={baseCard}>
      <Skeleton className="h-4 w-24 mb-4" isDark={isDark} />
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" isDark={isDark} />
        <Skeleton className="h-3 w-4/5" isDark={isDark} />
        <Skeleton className="h-3 w-3/5" isDark={isDark} />
      </div>
    </div>
  );
}

// Loading overlay with skeleton
interface SkeletonOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SkeletonOverlay({
  isLoading,
  children,
  className,
}: SkeletonOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div className="opacity-0">{children}</div>
      <div className="absolute inset-0">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
