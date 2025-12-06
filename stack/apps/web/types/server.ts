// Container/Server status
export type ContainerStatus = "running" | "stopped" | "starting" | "stopping";

// Player info for game servers
export interface Player {
  id: string;
  name: string;
  joinedAt: number; // timestamp
}

// Game server specific info
export interface GameServerInfo {
  type: "minecraft" | "other";
  version: string;
  motd: string;
  players: Player[];
  maxPlayers: number;
  tps?: number; // ticks per second (Minecraft)
}

// Resource usage with limits
export interface ResourceUsage {
  current: number;      // Current usage (percentage or absolute value)
  limit: number;        // Maximum limit
  percentage: number;   // Usage as percentage of limit
  history: number[];    // Historical data points for graphs
}

// Per-core CPU usage
export interface CoreUsage {
  id: number;
  percentage: number;
  frequency: number;
}

// CPU specific information
export interface CpuInfo {
  usage: ResourceUsage;
  cores: number;
  frequency: number;    // Current frequency in GHz
  coreUsage?: CoreUsage[]; // Per-core usage data
  model?: string;
  architecture?: string;
  baseFrequency?: number;
  boostFrequency?: number;
  tdp?: number;
  cache?: string;
}

// Memory/RAM specific information
export interface MemoryInfo {
  usage: ResourceUsage;
  used: number;         // Used memory in GB
  total: number;        // Total memory in GB
  type?: string;        // e.g., "DDR5"
  speed?: number;       // e.g., 6000 MT/s
  channels?: string;
  slots?: string;
  timings?: string;
}

// Disk/Storage specific information
export interface DiskInfo {
  usage: ResourceUsage;
  used: number;         // Used space in GB
  total: number;        // Total space in GB
  type?: string;        // e.g., "NVMe SSD"
  model?: string;
  interface?: string;
  readSpeed?: string;
  writeSpeed?: string;
  health?: number;      // Percentage
}

// Network specific information
export interface NetworkInfo {
  download: number;         // Current download speed in Mbps
  upload: number;           // Current upload speed in Mbps
  downloadHistory: number[];
  uploadHistory: number[];
  totalDownloaded?: number; // Total bytes downloaded
  totalUploaded?: number;   // Total bytes uploaded
  ip?: string;
  port?: number;
  protocol?: string;
}

// Network configuration
export interface NetworkConfig {
  hostname: string;
  ipAddress: string;
  port: number;
  protocol: string;
  publicIp?: string;
  privateIp?: string;
  macAddress?: string;
  openPorts?: PortInfo[];
  interface?: string;
  adapter?: string;
  speed?: string;
  gateway?: string;
  dns?: string;
}

export interface PortInfo {
  port: number;
  protocol: string;
}

// System information
export interface SystemInfo {
  os: string;
  osVersion: string;
  kernel: string;
  uptime: number;       // Uptime in seconds
  dockerVersion?: string;
}

// Node information for system info card
export interface NodeData {
  id: string;
  name: string;
  location: string;
  region: string;
  zone: string;
  provider: string;
}

// Log entry for recent logs card
export interface LogEntryData {
  level: string;
  message: string;
  time: string;
}

// Server/Container instance
export interface ServerInstance {
  id: string;
  name: string;
  status: ContainerStatus;

  // Resource usage
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo;
  network: NetworkInfo;

  // Configuration
  networkConfig: NetworkConfig;
  system: SystemInfo;

  // Node information
  node?: NodeData;

  // Recent logs
  recentLogs?: LogEntryData[];

  // Game server info (optional, for Minecraft etc.)
  gameServer?: GameServerInfo;

  // Container info
  containerId?: string;
  containerUptime?: number; // seconds since container started

  // Metadata
  createdAt?: Date;
  startedAt?: Date;
  stoppedAt?: Date;
}

// Console log entry
export interface ConsoleEntry {
  id: string;
  timestamp: number;
  level: "info" | "error" | "warning" | "default";
  message: string;
  source?: string;
}

// Server state for the store
export interface ServerState {
  // Connection status
  isOffline: boolean;

  // Current server data
  server: ServerInstance | null;

  // Console
  consoleLines: ConsoleEntry[];

  // Actions
  setOffline: (offline: boolean) => void;
  setServer: (server: ServerInstance) => void;
  updateServerStatus: (status: ContainerStatus) => void;
  updateResourceUsage: (updates: Partial<Pick<ServerInstance, 'cpu' | 'memory' | 'disk' | 'network'>>) => void;
  addConsoleLine: (line: ConsoleEntry) => void;
  clearConsole: () => void;
}

// Mock data generator helpers
export interface MockDataConfig {
  cpuBaseUsage: number;
  ramBaseUsage: number;
  diskBaseUsage: number;
  networkBaseDownload: number;
  networkBaseUpload: number;
  volatility: number;
}

// API response types (for future use)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ServerListResponse {
  servers: Pick<ServerInstance, 'id' | 'name' | 'status'>[];
}

export interface ServerDetailsResponse {
  server: ServerInstance;
}

export interface ServerStatsResponse {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo;
  network: NetworkInfo;
}
