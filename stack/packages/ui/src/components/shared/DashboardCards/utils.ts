export const getUsageColor = (percentage: number, isDark: boolean = true): string => {
  if (percentage === 0) return isDark ? "#71717a" : "#a1a1aa";
  if (percentage > 75) return "#ef4444";
  if (percentage > 50) return "#f59e0b";
  return "#22c55e";
};

export const formatUptime = (seconds: number): { value: string; unit: string; full: string } => {
  if (seconds < 60) return { value: `${seconds}`, unit: "sec", full: `${seconds} seconds` };
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return { value: `${mins}`, unit: "min", full: `${mins} minutes` };
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return { value: `${hours}`, unit: "hr", full: `${hours}h ${mins}m` };
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return { value: `${days}`, unit: "days", full: `${days}d ${hours}h` };
};

export const cardMetadata: Record<string, { name: string; description: string }> = {
  "instance-name": { name: "Instance Name", description: "Display the server instance name" },
  "container-controls": { name: "Container Controls", description: "Start, stop, restart, and kill controls" },
  "system-info": { name: "System Information", description: "Node details including location and ID" },
  "network-info": { name: "Network Info", description: "IP addresses and open ports" },
  "cpu": { name: "CPU Usage", description: "Real-time CPU utilization with history" },
  "ram": { name: "RAM Usage", description: "Memory usage with history graph" },
  "disk": { name: "Disk Usage", description: "Storage utilization with history" },
  "network-usage": { name: "Network Usage", description: "Download and upload speeds" },
  "console": { name: "Console", description: "Server console with command input" },
  "players-online": { name: "Players Online", description: "Connected players count and list" },
  "container-uptime": { name: "Container Uptime", description: "How long the container has been running" },
  "recent-logs": { name: "Recent Logs", description: "Compact view of recent log entries" },
};
