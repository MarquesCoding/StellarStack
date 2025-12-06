"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
  children,
  delay = 0,
  duration = 400,
  className,
  direction = "up",
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directionStyles = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
    none: "",
  };

  return (
    <div
      className={cn(
        "transition-all",
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${directionStyles[direction]}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function StaggerContainer({
  children,
  staggerDelay = 50,
  initialDelay = 0,
  className,
  direction = "up",
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={initialDelay + index * staggerDelay}
          direction={direction}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
