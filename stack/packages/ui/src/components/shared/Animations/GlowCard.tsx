"use client";

import { useState, useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;
  isDark?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(59, 130, 246, 0.5)",
  glowSize = 200,
  glowOpacity = 0.15,
  isDark = true,
}: GlowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Glow effect */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          width: glowSize,
          height: glowSize,
          left: mousePosition.x - glowSize / 2,
          top: mousePosition.y - glowSize / 2,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: isHovered ? glowOpacity : 0,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Gradient border card with animated gradient
interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  isDark?: boolean;
  animated?: boolean;
}

export function GradientBorderCard({
  children,
  className,
  borderWidth = 1,
  isDark = true,
  animated = true,
}: GradientBorderCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative p-[1px] overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          animated && "animate-gradient-rotate",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
          backgroundSize: "300% 100%",
        }}
      />
      {/* Inner content with background */}
      <div
        className={cn(
          "relative",
          isDark ? "bg-[#0f0f0f]" : "bg-white"
        )}
        style={{ margin: borderWidth }}
      >
        {children}
      </div>
    </div>
  );
}
