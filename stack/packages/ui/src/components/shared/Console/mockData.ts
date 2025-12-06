import type { ConsoleLine, LogLevel } from "./types";

const DAEMON_MESSAGES: { message: string; level: LogLevel }[] = [
  { message: "Server marked as online...", level: "info" },
  { message: "Server marked as offline...", level: "error" },
  { message: "Starting server container...", level: "default" },
  { message: "Stopping server container...", level: "default" },
  { message: "Container is now running", level: "info" },
  { message: "Container has stopped", level: "default" },
  { message: "Backup started for server", level: "info" },
  { message: "Backup completed successfully", level: "info" },
  { message: "Backup failed: insufficient disk space", level: "error" },
  { message: "Server resources updated", level: "default" },
  { message: "Memory limit reached, restarting...", level: "error" },
  { message: "CPU usage spike detected", level: "error" },
  { message: "Network connection established", level: "info" },
  { message: "Network connection lost", level: "error" },
  { message: "File synchronization complete", level: "info" },
  { message: "Configuration reloaded", level: "default" },
  { message: "Plugin loaded: EssentialsX", level: "info" },
  { message: "Plugin failed to load: WorldEdit", level: "error" },
  { message: "Player connected: Steve", level: "info" },
  { message: "Player disconnected: Alex", level: "default" },
  { message: "World save initiated...", level: "default" },
  { message: "World save completed", level: "info" },
  { message: "Scheduled restart in 5 minutes", level: "info" },
  { message: "Server restarted successfully", level: "info" },
  { message: "EULA accepted, proceeding with startup", level: "default" },
  { message: "Java process spawned with PID 12847", level: "default" },
  { message: "Allocating 4096MB of memory", level: "default" },
  { message: "Failed to bind to port 25565", level: "error" },
  { message: "Port 25565 is now available", level: "info" },
  { message: "RCON connection established", level: "info" },
  { message: "Query protocol enabled on port 25566", level: "default" },
  { message: "Watchdog: Server responding normally", level: "default" },
  { message: "Watchdog: Server unresponsive, initiating restart", level: "error" },
  { message: "Disk usage at 85%, cleanup recommended", level: "error" },
  { message: "SSL certificate renewed", level: "info" },
];

let lineIdCounter = 0;

const getRandomMessage = () => {
  const index = Math.floor(Math.random() * DAEMON_MESSAGES.length);
  return DAEMON_MESSAGES[index] ?? DAEMON_MESSAGES[0]!;
};

export const generateRandomLine = (): ConsoleLine => {
  const randomMessage = getRandomMessage();
  return {
    id: `line-${++lineIdCounter}`,
    timestamp: Date.now(),
    level: randomMessage.level,
    message: `Stellar: ${randomMessage.message}`,
  };
};

export const generateInitialLines = (count: number = 20): ConsoleLine[] => {
  const lines: ConsoleLine[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const randomMessage = getRandomMessage();
    const timestamp = now - (count - i) * (Math.random() * 5000 + 1000);
    lines.push({
      id: `line-${++lineIdCounter}`,
      timestamp,
      level: randomMessage.level,
      message: `Stellar: ${randomMessage.message}`,
    });
  }

  return lines;
};
