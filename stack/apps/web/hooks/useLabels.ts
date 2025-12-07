"use client";

import { t } from "../lib/i18n";
import type {
  CpuCardLabels,
  UsageMetricCardLabels,
  NetworkUsageCardLabels,
  NetworkInfoCardLabels,
  SystemInfoCardLabels,
  ContainerControlsCardLabels,
  ContainerUptimeCardLabels,
  PlayersOnlineCardLabels,
  RecentLogsCardLabels,
} from "@workspace/ui/components/shared/DashboardCards";
import type { RemoveConfirmLabels } from "@workspace/ui/components/shared/DragDropGrid";

interface DashboardLabels {
  editLayout: string;
  doneEditing: string;
  resetLayout: string;
  manageCards: string;
  availableCards: string;
  availableCardsDescription: string;
  allCardsOnDashboard: string;
  removeCardsHint: string;
  copyright: string;
  previewBanner: string;
}

interface StatusLabels {
  offline: string;
  online: string;
  starting: string;
  stopping: string;
  stopped: string;
}

interface TooltipLabels {
  cpu: {
    model: string;
    architecture: string;
    baseClock: string;
    boostClock: string;
    tdp: string;
    cache: string;
  };
  ram: {
    type: string;
    speed: string;
    channels: string;
    slotsUsed: string;
    timings: string;
  };
  disk: {
    model: string;
    interface: string;
    readSpeed: string;
    writeSpeed: string;
    health: string;
  };
}

interface UseLabelsReturn {
  dashboard: DashboardLabels;
  status: StatusLabels;
  tooltip: TooltipLabels;
  cpu: CpuCardLabels;
  ram: UsageMetricCardLabels;
  disk: UsageMetricCardLabels;
  network: NetworkUsageCardLabels;
  networkInfo: NetworkInfoCardLabels;
  systemInfo: SystemInfoCardLabels;
  containerControls: ContainerControlsCardLabels;
  containerUptime: ContainerUptimeCardLabels;
  playersOnline: PlayersOnlineCardLabels;
  recentLogs: RecentLogsCardLabels;
  removeCard: RemoveConfirmLabels;
}

export const useLabels = (): UseLabelsReturn => {
  return {
    dashboard: {
      editLayout: t("dashboard.editLayout"),
      doneEditing: t("dashboard.doneEditing"),
      resetLayout: t("dashboard.resetLayout"),
      manageCards: t("dashboard.manageCards"),
      availableCards: t("dashboard.availableCards"),
      availableCardsDescription: t("dashboard.availableCardsDescription"),
      allCardsOnDashboard: t("dashboard.allCardsOnDashboard"),
      removeCardsHint: t("dashboard.removeCardsHint"),
      copyright: t("dashboard.copyright"),
      previewBanner: t("dashboard.previewBanner"),
    },
    status: {
      offline: t("status.offline"),
      online: t("status.online"),
      starting: t("status.starting"),
      stopping: t("status.stopping"),
      stopped: t("status.stopped"),
    },
    tooltip: {
      cpu: {
        model: t("cards.cpu.model"),
        architecture: t("cards.cpu.architecture"),
        baseClock: t("cards.cpu.baseClock"),
        boostClock: t("cards.cpu.boostClock"),
        tdp: t("cards.cpu.tdp"),
        cache: t("cards.cpu.cache"),
      },
      ram: {
        type: t("cards.ram.type"),
        speed: t("cards.ram.speed"),
        channels: t("cards.ram.channels"),
        slotsUsed: t("cards.ram.slotsUsed"),
        timings: t("cards.ram.timings"),
      },
      disk: {
        model: t("cards.disk.model"),
        interface: t("cards.disk.interface"),
        readSpeed: t("cards.disk.readSpeed"),
        writeSpeed: t("cards.disk.writeSpeed"),
        health: t("cards.disk.health"),
      },
    },
    cpu: {
      title: t("cards.cpu.title"),
      coreUsage: t("cards.cpu.coreUsage"),
      cores: t("cards.cpu.cores"),
    },
    ram: {
      title: t("cards.ram.title"),
    },
    disk: {
      title: t("cards.disk.title"),
    },
    network: {
      title: t("cards.network.title"),
      download: t("cards.network.download"),
      upload: t("cards.network.upload"),
      interface: t("cards.network.interface"),
      adapter: t("cards.network.adapter"),
      speed: t("cards.network.speed"),
      ipv4: t("cards.network.ipv4"),
      gateway: t("cards.network.gateway"),
      dns: t("cards.network.dns"),
    },
    networkInfo: {
      title: t("cards.networkInfo.title"),
      titleShort: t("cards.networkInfo.titleShort"),
      publicIp: t("cards.networkInfo.publicIp"),
      publicIpShort: t("cards.networkInfo.publicIpShort"),
      privateIp: t("cards.networkInfo.privateIp"),
      openPorts: t("cards.networkInfo.openPorts"),
      portsShort: t("cards.networkInfo.portsShort"),
      macAddress: t("cards.networkInfo.macAddress"),
    },
    systemInfo: {
      title: t("cards.systemInfo.title"),
      titleShort: t("cards.systemInfo.titleShort"),
      name: t("cards.systemInfo.name"),
      nodeId: t("cards.systemInfo.nodeId"),
      nodeIdShort: t("cards.systemInfo.nodeIdShort"),
      location: t("cards.systemInfo.location"),
      regionZone: t("cards.systemInfo.regionZone"),
      provider: t("cards.systemInfo.provider"),
    },
    containerControls: {
      start: t("cards.containerControls.start"),
      stop: t("cards.containerControls.stop"),
      kill: t("cards.containerControls.kill"),
      restart: t("cards.containerControls.restart"),
    },
    containerUptime: {
      title: t("cards.containerUptime.title"),
      titleShort: t("cards.containerUptime.titleShort"),
      containerStopped: t("cards.containerUptime.containerStopped"),
    },
    playersOnline: {
      title: t("cards.playersOnline.title"),
      titleShort: t("cards.playersOnline.titleShort"),
      online: t("cards.playersOnline.online"),
    },
    recentLogs: {
      title: t("cards.recentLogs.title"),
    },
    removeCard: {
      title: t("dashboard.removeCard.title"),
      description: t("dashboard.removeCard.description"),
      cancel: t("dashboard.removeCard.cancel"),
      confirm: t("dashboard.removeCard.confirm"),
    },
  };
};
