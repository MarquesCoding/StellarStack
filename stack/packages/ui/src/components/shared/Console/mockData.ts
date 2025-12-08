import type { ConsoleLine, LogLevel } from "./types";

// Startup sequence messages - played in order during container start
const STARTUP_SEQUENCE: { message: string; level: LogLevel }[] = [
  { message: "Container starting...", level: "default" },
  { message: "Pulling container image stellar/minecraft:latest", level: "default" },
  { message: "Image up to date", level: "info" },
  { message: "Creating container instance", level: "default" },
  { message: "Mounting volumes: /data, /config, /plugins", level: "default" },
  { message: "Setting environment variables", level: "default" },
  { message: "Allocating 8192MB of memory", level: "default" },
  { message: "Container created successfully", level: "info" },
  { message: "Starting container...", level: "default" },
  { message: "Java process spawned with PID 1", level: "default" },
  { message: "JVM arguments: -Xms8G -Xmx8G -XX:+UseG1GC", level: "default" },
  { message: "Loading server properties...", level: "default" },
  { message: "EULA accepted", level: "info" },
  { message: "Starting Minecraft server version 1.21.1", level: "default" },
  { message: "Loading world: world", level: "default" },
  { message: "Preparing spawn area: 0%", level: "default" },
  { message: "Preparing spawn area: 25%", level: "default" },
  { message: "Preparing spawn area: 50%", level: "default" },
  { message: "Preparing spawn area: 75%", level: "default" },
  { message: "Preparing spawn area: 100%", level: "default" },
  { message: "World loaded successfully", level: "info" },
  { message: "Loading plugins...", level: "default" },
  { message: "Plugin loaded: EssentialsX v2.20.1", level: "info" },
  { message: "Plugin loaded: WorldEdit v7.3.0", level: "info" },
  { message: "Plugin loaded: Vault v1.7.3", level: "info" },
  { message: "Plugin loaded: LuckPerms v5.4.98", level: "info" },
  { message: "Plugin loaded: CoreProtect v22.2", level: "info" },
  { message: "All plugins loaded (5 total)", level: "info" },
  { message: "Binding to port 25565", level: "default" },
  { message: "Query protocol enabled on port 25566", level: "default" },
  { message: "RCON enabled on port 25575", level: "default" },
  { message: "Server started on 0.0.0.0:25565", level: "info" },
  { message: "Done! Server is ready to accept connections", level: "info" },
  { message: "Watchdog initialized", level: "default" },
  { message: "Server marked as online", level: "info" },
];

// Runtime messages - random during normal operation
const RUNTIME_MESSAGES: { message: string; level: LogLevel }[] = [
  { message: "Player connected: Steve", level: "info" },
  { message: "Player connected: Alex", level: "info" },
  { message: "Player connected: Dream", level: "info" },
  { message: "Player disconnected: Steve", level: "default" },
  { message: "Player disconnected: Alex", level: "default" },
  { message: "World auto-save initiated", level: "default" },
  { message: "World auto-save completed", level: "info" },
  { message: "Backup started", level: "default" },
  { message: "Backup completed: backup_2025-01-15_12-00.tar.gz", level: "info" },
  { message: "Watchdog: Server responding normally", level: "default" },
  { message: "TPS: 20.0 (stable)", level: "default" },
  { message: "TPS: 19.8 (stable)", level: "default" },
  { message: "TPS: 18.5 (minor lag)", level: "default" },
  { message: "Memory usage: 4.2GB / 8GB (52%)", level: "default" },
  { message: "Memory usage: 5.1GB / 8GB (64%)", level: "default" },
  { message: "Garbage collection completed: freed 512MB", level: "default" },
  { message: "Chunk loaded: world [128, 64]", level: "default" },
  { message: "Chunk unloaded: world [-32, 128]", level: "default" },
  { message: "Entity count: 1247", level: "default" },
  { message: "Player Steve issued command: /spawn", level: "default" },
  { message: "Player Alex issued command: /home", level: "default" },
  { message: "CoreProtect: Logging 152 changes", level: "default" },
  { message: "Connection throttled: 192.168.1.100", level: "default" },
  { message: "Query response sent to 10.0.0.5", level: "default" },
];

let lineIdCounter = 0;

const getRandomRuntimeMessage = () => {
  const index = Math.floor(Math.random() * RUNTIME_MESSAGES.length);
  return RUNTIME_MESSAGES[index] ?? RUNTIME_MESSAGES[0]!;
};

export const generateRandomLine = (): ConsoleLine => {
  const randomMessage = getRandomRuntimeMessage();
  return {
    id: `line-${++lineIdCounter}`,
    timestamp: Date.now(),
    level: randomMessage.level,
    message: randomMessage.message,
  };
};

export const generateStartupSequence = (): ConsoleLine[] => {
  const lines: ConsoleLine[] = [];
  const now = Date.now();

  STARTUP_SEQUENCE.forEach((msg, i) => {
    lines.push({
      id: `startup-${++lineIdCounter}`,
      timestamp: now + i * 50, // Stagger timestamps slightly
      level: msg.level,
      message: msg.message,
    });
  });

  return lines;
};

export const generateInitialLines = (count: number = 20): ConsoleLine[] => {
  const lines: ConsoleLine[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const randomMessage = getRandomRuntimeMessage();
    const timestamp = now - (count - i) * (Math.random() * 5000 + 1000);
    lines.push({
      id: `line-${++lineIdCounter}`,
      timestamp,
      level: randomMessage.level,
      message: randomMessage.message,
    });
  }

  return lines;
};
