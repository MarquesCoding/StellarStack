"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useServerStore } from "../stores/connectionStore";

export const useServerSimulation = (): void => {
  const { isOffline, setOffline, tickResources } = useServerStore();

  useEffect(() => {
    const offlineInterval = setInterval(() => {
      if (!isOffline && Math.random() < 0.02) {
        setOffline(true);
        const toastId = toast.loading("Connection Lost - Reconnecting...", {
          duration: Infinity,
        });
        const reconnectTime = 3000 + Math.random() * 5000;
        setTimeout(() => {
          setOffline(false);
          toast.dismiss(toastId);
          toast.success("Connection Restored", { duration: 2000 });
        }, reconnectTime);
      }
    }, 1000);

    return () => clearInterval(offlineInterval);
  }, [isOffline, setOffline]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickResources();
    }, 1000);

    return () => clearInterval(interval);
  }, [tickResources]);
};
