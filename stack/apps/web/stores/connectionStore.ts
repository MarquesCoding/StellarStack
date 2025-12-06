import { create } from "zustand";
import type {
  ContainerStatus,
  ServerInstance,
  ConsoleEntry,
  CpuInfo,
  MemoryInfo,
  DiskInfo,
  NetworkInfo,
  CoreUsage,
  Player,
  LogEntryData,
} from "../types/server";

const HISTORY_LENGTH = 20;
const CPU_CORES = 16;

// Generate initial history data
const generateHistory = (base: number, volatility: number, length: number = HISTORY_LENGTH): number[] => {
  const history: number[] = [];
  let current = base;
  for (let i = 0; i < length; i++) {
    current = Math.max(0, Math.min(100, current + (Math.random() - 0.5) * volatility));
    history.push(Math.round(current));
  }
  return history;
};

// Generate initial per-core usage data
const generateCoreUsage = (avgPercentage: number): CoreUsage[] => {
  return Array.from({ length: CPU_CORES }, (_, i) => {
    // Some cores will be more utilized than others
    const baseUsage = avgPercentage + (Math.random() - 0.5) * 40;
    const corePercentage = Math.min(100, Math.max(0, baseUsage));
    return {
      id: i,
      percentage: Math.round(corePercentage),
      frequency: +(3.0 + (corePercentage / 100) * 2.7).toFixed(1), // 3.0-5.7 GHz range
    };
  });
};

// Mock player names for game server
const MOCK_PLAYER_NAMES = [
  "Steve", "Alex", "Notch", "Herobrine", "Dream", "Technoblade",
  "TommyInnit", "Philza", "Wilbur", "Tubbo", "Ranboo", "Sapnap",
  "GeorgeNotFound", "BadBoyHalo", "Skeppy", "CaptainSparklez"
];

// Generate random players
const generatePlayers = (count: number): Player[] => {
  const shuffled = [...MOCK_PLAYER_NAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((name, i) => ({
    id: `player-${i}`,
    name,
    joinedAt: Date.now() - Math.floor(Math.random() * 3600000), // joined within last hour
  }));
};

// Generate initial logs
const generateInitialLogs = (): LogEntryData[] => [
  { level: "info", message: "Server started on port 25565", time: "12:34:56" },
  { level: "info", message: "Player Steve joined the game", time: "12:35:12" },
  { level: "warning", message: "Can't keep up! Did the system time change?", time: "12:36:01" },
  { level: "info", message: "Player Alex joined the game", time: "12:36:45" },
  { level: "info", message: "Steve has made the advancement [Stone Age]", time: "12:37:22" },
  { level: "error", message: "Failed to load chunk at -12, 8", time: "12:38:01" },
  { level: "info", message: "Saving chunks", time: "12:39:00" },
  { level: "info", message: "Player Dream joined the game", time: "12:40:15" },
];

// Default server instance
const createDefaultServer = (): ServerInstance => ({
  id: "1",
  name: "A Minecraft Server",
  status: "running",
  cpu: {
    usage: {
      current: 45,
      limit: 100,
      percentage: 45,
      history: generateHistory(45, 20),
    },
    cores: CPU_CORES,
    frequency: 4.2,
    coreUsage: generateCoreUsage(45),
    model: "AMD Ryzen 9 9950X3D",
    architecture: "Zen 5",
    baseFrequency: 4.3,
    boostFrequency: 5.7,
    tdp: 170,
    cache: "144MB",
  },
  memory: {
    usage: {
      current: 12,
      limit: 32,
      percentage: 37.5,
      history: generateHistory(37.5, 15),
    },
    used: 12,
    total: 32,
    type: "DDR5",
    speed: 6000,
    channels: "Dual Channel",
    slots: "2 / 4",
    timings: "CL30-38-38",
  },
  disk: {
    usage: {
      current: 450,
      limit: 1000,
      percentage: 45,
      history: generateHistory(45, 1),
    },
    used: 450,
    total: 1000,
    type: "NVMe SSD",
    model: "Samsung 990 Pro",
    interface: "PCIe 4.0 x4",
    readSpeed: "7,450 MB/s",
    writeSpeed: "6,900 MB/s",
    health: 98,
  },
  network: {
    download: 45,
    upload: 12,
    downloadHistory: generateHistory(45, 25),
    uploadHistory: generateHistory(12, 15),
    ip: "192.168.1.100",
    port: 25565,
    protocol: "TCP/UDP",
  },
  networkConfig: {
    hostname: "mc.example.com",
    ipAddress: "192.168.1.100",
    port: 25565,
    protocol: "TCP/UDP",
    publicIp: "203.45.167.89",
    privateIp: "192.168.1.100",
    macAddress: "00:1A:2B:3C:4D:5E",
    openPorts: [
      { port: 22, protocol: "SSH" },
      { port: 80, protocol: "HTTP" },
      { port: 443, protocol: "HTTPS" },
      { port: 3306, protocol: "MySQL" },
      { port: 5432, protocol: "PostgreSQL" },
    ],
    interface: "Ethernet",
    adapter: "Intel I226-V",
    speed: "2.5 Gbps",
    gateway: "192.168.1.1",
    dns: "1.1.1.1",
  },
  system: {
    os: "Debian",
    osVersion: "12 (Bookworm)",
    kernel: "6.1.0-18-amd64",
    uptime: 1234567,
    dockerVersion: "24.0.7",
  },
  node: {
    id: "node-us-east-1a-7f3b",
    name: "Production Node 1",
    location: "US East (N. Virginia)",
    region: "us-east-1",
    zone: "us-east-1a",
    provider: "AWS",
  },
  recentLogs: generateInitialLogs(),
  gameServer: {
    type: "minecraft",
    version: "1.21.4",
    motd: "A Minecraft Server",
    players: generatePlayers(7),
    maxPlayers: 20,
    tps: 19.8,
  },
  containerId: "a1b2c3d4e5f6",
  containerUptime: 86400,
});

interface ServerStore {
  // Connection status
  isOffline: boolean;
  setOffline: (offline: boolean) => void;

  // Server data
  server: ServerInstance;
  setServer: (server: ServerInstance) => void;

  // Container status
  setContainerStatus: (status: ContainerStatus) => void;

  // Resource updates
  updateCpu: (updates: Partial<CpuInfo>) => void;
  updateMemory: (updates: Partial<MemoryInfo>) => void;
  updateDisk: (updates: Partial<DiskInfo>) => void;
  updateNetwork: (updates: Partial<NetworkInfo>) => void;

  // Bulk resource update (for simulation tick)
  tickResources: () => void;

  // Console
  consoleLines: ConsoleEntry[];
  addConsoleLine: (line: ConsoleEntry) => void;
  clearConsole: () => void;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),

  server: createDefaultServer(),
  setServer: (server) => set({ server }),

  setContainerStatus: (status) =>
    set((state) => ({
      server: { ...state.server, status },
    })),

  updateCpu: (updates) =>
    set((state) => ({
      server: {
        ...state.server,
        cpu: { ...state.server.cpu, ...updates },
      },
    })),

  updateMemory: (updates) =>
    set((state) => ({
      server: {
        ...state.server,
        memory: { ...state.server.memory, ...updates },
      },
    })),

  updateDisk: (updates) =>
    set((state) => ({
      server: {
        ...state.server,
        disk: { ...state.server.disk, ...updates },
      },
    })),

  updateNetwork: (updates) =>
    set((state) => ({
      server: {
        ...state.server,
        network: { ...state.server.network, ...updates },
      },
    })),

  tickResources: () => {
    const { server, isOffline } = get();
    if (isOffline) return;

    const isRunning = server.status === "running";
    const isStopped = server.status === "stopped";

    const isStopping = server.status === "stopping";
    const isStarting = server.status === "starting";

    // Helper to vary values based on container state
    const vary = (current: number, min: number, max: number, volatility: number) => {
      if (isStopped) {
        // When fully stopped, values should be 0
        return 0;
      }
      if (isStopping) {
        // When stopping, rapidly decay towards 0
        return Math.max(0, current * 0.5); // Halve each tick for fast decay
      }
      if (isStarting) {
        // When starting, values should gradually increase from 0
        const target = min + (max - min) * 0.4; // Target ~40% while starting
        return current + (target - current) * 0.3;
      }
      // Normal running variation
      const spike = Math.random() < 0.12;
      const drop = Math.random() < 0.08;
      let change: number;
      if (spike) {
        change = Math.random() * volatility * 4;
      } else if (drop) {
        change = -Math.random() * volatility * 3;
      } else {
        change = (Math.random() - 0.5) * volatility * 1.5;
      }
      return Math.min(max, Math.max(min, current + change));
    };

    const newCpuPercentage = vary(server.cpu.usage.percentage, 2, 95, 12);
    const newMemoryPercentage = vary(server.memory.usage.percentage, 5, 95, 8);
    const newDiskPercentage = server.disk.usage.percentage + (Math.random() - 0.5) * 0.3;
    const newDownload = vary(server.network.download, 0, 100, 15);
    const newUpload = vary(server.network.upload, 0, 60, 10);

    // Update per-core usage first
    const newCoreUsage = server.cpu.coreUsage?.map((core) => {
      let coreVariation: number;
      if (isStopped) {
        coreVariation = 0;
      } else if (isStopping) {
        coreVariation = core.percentage * 0.5;
      } else if (isStarting) {
        const target = 40 * (0.7 + Math.random() * 0.6);
        coreVariation = core.percentage + (target - core.percentage) * 0.3;
      } else {
        // Running - vary each core independently
        const spike = Math.random() < 0.08;
        const drop = Math.random() < 0.06;
        if (spike) {
          coreVariation = Math.min(100, core.percentage + Math.random() * 30);
        } else if (drop) {
          coreVariation = Math.max(0, core.percentage - Math.random() * 25);
        } else {
          coreVariation = core.percentage + (Math.random() - 0.5) * 15;
        }
      }
      const newPercentage = Math.min(100, Math.max(0, Math.round(coreVariation)));
      return {
        ...core,
        percentage: newPercentage,
        frequency: +(3.0 + (newPercentage / 100) * 2.7).toFixed(1),
      };
    });

    // Calculate overall CPU percentage from core averages
    const calculatedCpuPercentage = newCoreUsage && newCoreUsage.length > 0
      ? Math.round(newCoreUsage.reduce((sum, core) => sum + core.percentage, 0) / newCoreUsage.length)
      : Math.round(newCpuPercentage);

    set({
      server: {
        ...server,
        cpu: {
          ...server.cpu,
          usage: {
            ...server.cpu.usage,
            percentage: calculatedCpuPercentage,
            history: [...server.cpu.usage.history.slice(1), calculatedCpuPercentage],
          },
          frequency: +(3.0 + (calculatedCpuPercentage / 100) * 1.2).toFixed(1),
          coreUsage: newCoreUsage,
        },
        memory: {
          ...server.memory,
          usage: {
            ...server.memory.usage,
            percentage: Math.round(newMemoryPercentage),
            history: [...server.memory.usage.history.slice(1), Math.round(newMemoryPercentage)],
          },
          used: +((newMemoryPercentage / 100) * server.memory.total).toFixed(1),
        },
        disk: {
          ...server.disk,
          usage: {
            ...server.disk.usage,
            percentage: Math.round(Math.max(0, Math.min(100, newDiskPercentage))),
            history: [...server.disk.usage.history.slice(1), Math.round(newDiskPercentage)],
          },
        },
        network: {
          ...server.network,
          download: Math.round(newDownload),
          upload: Math.round(newUpload),
          downloadHistory: [...server.network.downloadHistory.slice(1), Math.round(newDownload)],
          uploadHistory: [...server.network.uploadHistory.slice(1), Math.round(newUpload)],
        },
        // Update container uptime
        containerUptime: isRunning ? (server.containerUptime || 0) + 1 : isStopped ? 0 : server.containerUptime,
        // Update game server
        gameServer: server.gameServer ? {
          ...server.gameServer,
          // Occasionally add/remove players
          players: (() => {
            if (!isRunning) return [];
            const currentPlayers = server.gameServer?.players || [];
            const maxPlayers = server.gameServer?.maxPlayers || 20;

            // 5% chance to add a player, 3% chance to remove
            if (Math.random() < 0.05 && currentPlayers.length < maxPlayers) {
              const availableNames = MOCK_PLAYER_NAMES.filter(
                name => !currentPlayers.some(p => p.name === name)
              );
              if (availableNames.length > 0) {
                const newName = availableNames[Math.floor(Math.random() * availableNames.length)];
                return [...currentPlayers, {
                  id: `player-${Date.now()}`,
                  name: newName || "Player",
                  joinedAt: Date.now(),
                }];
              }
            } else if (Math.random() < 0.03 && currentPlayers.length > 0) {
              const removeIndex = Math.floor(Math.random() * currentPlayers.length);
              return currentPlayers.filter((_, i) => i !== removeIndex);
            }
            return currentPlayers;
          })(),
          // Vary TPS slightly
          tps: isRunning ? Math.min(20, Math.max(15, (server.gameServer?.tps || 20) + (Math.random() - 0.5) * 0.5)) : 0,
        } : undefined,
      },
    });
  },

  consoleLines: [],
  addConsoleLine: (line) =>
    set((state) => ({
      consoleLines: [...state.consoleLines.slice(-99), line],
    })),
  clearConsole: () => set({ consoleLines: [] }),
}));

// Alias for backwards compatibility
export const useConnectionStore = useServerStore;
