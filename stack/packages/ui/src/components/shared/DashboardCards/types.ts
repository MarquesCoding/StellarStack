import type { ReactNode } from "react";

export type ContainerStatus = "running" | "stopped" | "starting" | "stopping";

export interface CardProps {
  itemId: string;
}

export interface CoreUsage {
  id: number;
  percentage: number;
  frequency: number;
}

export interface UsageMetricCardProps extends CardProps {
  title: string;
  percentage: number;
  details: string[];
  tooltipContent?: ReactNode;
  history?: number[];
  color?: string;
}

export interface CpuCardProps extends CardProps {
  percentage: number;
  details: string[];
  tooltipContent?: ReactNode;
  history?: number[];
  coreUsage?: CoreUsage[];
}

export interface NetworkUsageCardProps extends CardProps {
  download: number;
  upload: number;
  downloadHistory?: number[];
  uploadHistory?: number[];
}

export interface NetworkTooltipData {
  interface: string;
  adapter: string;
  speed: string;
  ipv4: string;
  gateway: string;
  dns: string;
}

export interface CpuCoreGridProps {
  cores: CoreUsage[];
  isDark: boolean;
  isOffline: boolean;
}

export interface CardMetadata {
  name: string;
  description: string;
}

export interface CardPreviewProps {
  cardId: string;
  isDark: boolean;
}

export interface ServerPreviewData {
  name: string;
  cpu: { usage: { percentage: number; history: number[] } };
  memory: { usage: { percentage: number; history: number[] } };
  disk: { usage: { percentage: number; history: number[] } };
  network: { download: number; upload: number; downloadHistory: number[]; uploadHistory: number[] };
  networkConfig: { ipAddress: string; port: number };
  system: { os: string; osVersion: string };
}

export interface Player {
  id: string;
  name: string;
  joinedAt: number;
}

export interface LogEntry {
  level: string;
  message: string;
  time: string;
}

export interface NodeData {
  id: string;
  name: string;
  location: string;
  region: string;
  zone: string;
  provider: string;
}

export interface NetworkInfoData {
  publicIp: string;
  privateIp: string;
  openPorts: PortInfo[];
  macAddress: string;
}

export interface PortInfo {
  port: number;
  protocol: string;
}
