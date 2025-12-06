"use client";

import { useState, useEffect, useCallback } from "react";
import { useServerStore } from "../stores/connectionStore";
import { generateInitialLines, generateRandomLine, type ConsoleLine } from "@workspace/ui/components/shared/Console";

interface UseSimulatedConsoleReturn {
  lines: ConsoleLine[];
  handleCommand: (command: string) => void;
}

export const useSimulatedConsole = (): UseSimulatedConsoleReturn => {
  const [lines, setLines] = useState<ConsoleLine[]>(() => generateInitialLines(25));
  const isOffline = useServerStore((state) => state.isOffline);
  const containerStatus = useServerStore((state) => state.server.status);

  const shouldGenerateLines = !isOffline && containerStatus === "running";

  useEffect(() => {
    if (containerStatus === "stopped") {
      setLines([]);
    }
  }, [containerStatus]);

  useEffect(() => {
    if (!shouldGenerateLines) return;

    const addLine = () => {
      setLines((prev) => [...prev.slice(-99), generateRandomLine()]);
    };

    const scheduleNext = (): ReturnType<typeof setTimeout> => {
      const delay = 2000 + Math.random() * 3000;
      return setTimeout(() => {
        addLine();
        timeoutId = scheduleNext();
      }, delay);
    };

    let timeoutId: ReturnType<typeof setTimeout> = scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [shouldGenerateLines]);

  const handleCommand = useCallback((command: string): void => {
    setLines((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        timestamp: Date.now(),
        level: "default" as const,
        message: `> ${command}`,
      },
    ]);

    setTimeout(() => {
      setLines((prev) => [
        ...prev,
        {
          id: `resp-${Date.now()}`,
          timestamp: Date.now(),
          level: "info" as const,
          message: `Daemon: Command "${command}" executed`,
        },
      ]);
    }, 500);
  }, []);

  return { lines, handleCommand };
};
