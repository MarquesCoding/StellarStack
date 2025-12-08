"use client";

import { useEffect, useRef, useCallback } from "react";

interface AnimatedBackgroundProps {
  isDark?: boolean;
  dotSize?: number;
  dotSpacing?: number;
  glowRadius?: number;
  glowIntensity?: number;
  trailLength?: number;
  trailDecay?: number;
  pulseSpeed?: number;
  pulseIntensity?: number;
  idlePulseInterval?: number;
  idlePulseRadius?: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface IdlePulse {
  x: number;
  y: number;
  startTime: number;
  duration: number;
}

export const AnimatedBackground = ({
  isDark = true,
  dotSize = 1,
  dotSpacing = 24,
  glowRadius = 120,
  glowIntensity = 0.3,
  trailLength = 50,
  trailDecay = 0.98,
  pulseSpeed = 2,
  pulseIntensity = 0.3,
  idlePulseInterval = 3000,
  idlePulseRadius = 200,
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const trailRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTrailTimeRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const lastInteractionRef = useRef(0); // Start at 0 so idle pulses begin immediately
  const idlePulsesRef = useRef<IdlePulse[]>([]);
  const lastIdlePulseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const mouse = mouseRef.current;
    const trail = trailRef.current;
    const idlePulses = idlePulsesRef.current;

    const now = Date.now();
    const timeSinceInteraction = now - lastInteractionRef.current;

    // Generate idle pulses when no interaction for 2 seconds
    if (timeSinceInteraction > 2000 && now - lastIdlePulseRef.current > idlePulseInterval) {
      // Randomly choose between center pulse or random location
      const useCenter = Math.random() > 0.5;
      const pulseX = useCenter ? width / 2 : Math.random() * width;
      const pulseY = useCenter ? height / 2 : Math.random() * height;

      idlePulses.push({
        x: pulseX,
        y: pulseY,
        startTime: now,
        duration: 2500,
      });
      lastIdlePulseRef.current = now;
    }

    // Clean up expired idle pulses
    for (let i = idlePulses.length - 1; i >= 0; i--) {
      const pulse = idlePulses[i];
      if (pulse && now - pulse.startTime > pulse.duration) {
        idlePulses.splice(i, 1);
      }
    }

    if (now - lastTrailTimeRef.current > 16 && mouse.x > -500) {
      const lastPoint = trail[0];
      if (!lastPoint ||
          Math.abs(mouse.x - lastPoint.x) > 3 ||
          Math.abs(mouse.y - lastPoint.y) > 3) {
        trail.unshift({ x: mouse.x, y: mouse.y, age: 1 });
        if (trail.length > trailLength) {
          trail.pop();
        }
      }
      lastTrailTimeRef.current = now;
    }

    for (let i = 0; i < trail.length; i++) {
      const point = trail[i];
      if (point) {
        point.age *= trailDecay;
      }
    }

    while (trail.length > 0) {
      const lastPoint = trail[trail.length - 1];
      if (lastPoint && lastPoint.age < 0.01) {
        trail.pop();
      } else {
        break;
      }
    }

    ctx.clearRect(0, 0, width, height);

    const baseDotColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.12)";
    const glowColor = isDark ? [255, 255, 255] : [0, 0, 0];

    for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
      for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        let maxIntensity = 0;

        // Trail effect
        for (let i = 0; i < trail.length; i++) {
          const point = trail[i];
          if (!point) continue;
          const dx = x - point.x;
          const dy = y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const taperFactor = point.age * point.age;
          const trailRadius = glowRadius * taperFactor;
          const glow = Math.max(0, 1 - distance / trailRadius);
          const intensity = glow * glowIntensity * taperFactor;
          maxIntensity = Math.max(maxIntensity, intensity);
        }

        // Mouse glow effect
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const glow = Math.max(0, 1 - distance / glowRadius);

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const pulsePhase = elapsed * pulseSpeed - distance * 0.02;
        const pulse = 1 + Math.sin(pulsePhase * Math.PI) * pulseIntensity;

        const currentIntensity = glow * glowIntensity * pulse;
        maxIntensity = Math.max(maxIntensity, currentIntensity);

        // Idle pulse effects - ripple outward from pulse origin
        for (let i = 0; i < idlePulses.length; i++) {
          const idlePulse = idlePulses[i];
          if (!idlePulse) continue;

          const pdx = x - idlePulse.x;
          const pdy = y - idlePulse.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          const progress = (now - idlePulse.startTime) / idlePulse.duration;
          const rippleRadius = progress * idlePulseRadius * 4;
          const rippleWidth = idlePulseRadius * 0.6;

          // Create a ring effect that expands outward
          const distFromRipple = Math.abs(pDistance - rippleRadius);
          if (distFromRipple < rippleWidth) {
            const rippleIntensity = (1 - distFromRipple / rippleWidth) * (1 - progress * 0.7) * 0.6;
            maxIntensity = Math.max(maxIntensity, rippleIntensity);
          }
        }

        if (maxIntensity > 0.005) {
          const alpha = isDark
            ? 0.08 + maxIntensity * 0.35
            : 0.12 + maxIntensity * 0.5;
          ctx.fillStyle = `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${alpha})`;

          const currentDotSize = dotSize + maxIntensity * (isDark ? 1.2 : 1.8);
          ctx.beginPath();
          ctx.arc(x, y, currentDotSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = baseDotColor;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [isDark, dotSize, dotSpacing, glowRadius, glowIntensity, trailLength, trailDecay, pulseSpeed, pulseIntensity, idlePulseInterval, idlePulseRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Use window dimensions directly since canvas is fixed to viewport
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    // Also update on orientation change for mobile devices
    window.addEventListener("orientationchange", updateSize);

    const updatePosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      lastInteractionRef.current = Date.now();
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          updatePosition(touch.clientX, touch.clientY);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          updatePosition(touch.clientX, touch.clientY);
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
