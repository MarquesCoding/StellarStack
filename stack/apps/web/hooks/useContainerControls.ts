"use client";

import { toast } from "sonner";
import { useServerStore } from "../stores/connectionStore";
import type { ContainerStatus } from "../types/server";

interface UseContainerControlsReturn {
  status: ContainerStatus;
  isOffline: boolean;
  handleStart: () => void;
  handleStop: () => void;
  handleKill: () => void;
  handleRestart: () => void;
}

export const useContainerControls = (): UseContainerControlsReturn => {
  const isOffline = useServerStore((state) => state.isOffline);
  const status = useServerStore((state) => state.server.status);
  const setContainerStatus = useServerStore((state) => state.setContainerStatus);

  const handleStart = (): void => {
    if (isOffline) {
      toast.error("Cannot start server while offline");
      return;
    }
    setContainerStatus("starting");
    const toastId = toast.loading("Starting server...");
    setTimeout(() => {
      setContainerStatus("running");
      toast.dismiss(toastId);
      toast.success("Server started successfully");
    }, 1500);
  };

  const handleStop = (): void => {
    if (isOffline) {
      toast.error("Cannot stop server while offline");
      return;
    }
    setContainerStatus("stopping");
    const toastId = toast.loading("Stopping server...");
    setTimeout(() => {
      setContainerStatus("stopped");
      toast.dismiss(toastId);
      toast.info("Server stopped");
    }, 1500);
  };

  const handleKill = (): void => {
    if (isOffline) {
      toast.error("Cannot kill server while offline");
      return;
    }
    setContainerStatus("stopped");
    toast.warning("Server force killed");
  };

  const handleRestart = (): void => {
    if (isOffline) {
      toast.error("Cannot restart server while offline");
      return;
    }
    setContainerStatus("stopping");
    const toastId = toast.loading("Restarting server...");
    setTimeout(() => {
      setContainerStatus("starting");
      setTimeout(() => {
        setContainerStatus("running");
        toast.dismiss(toastId);
        toast.success("Server restarted successfully");
      }, 1000);
    }, 1000);
  };

  return {
    status,
    isOffline,
    handleStart,
    handleStop,
    handleKill,
    handleRestart,
  };
};
