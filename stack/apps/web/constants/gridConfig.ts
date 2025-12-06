import type { GridItemConfig } from "@workspace/ui/components/shared/DragDropGrid";

export const defaultGridItems: GridItemConfig[] = [
  { i: "instance-name", size: "xxs-wide", minSize: "xxs-wide", maxSize: "xxs-wide" },
  { i: "container-controls", size: "xxs-wide", minSize: "xxs-wide", maxSize: "xxs-wide" },
  { i: "system-info", size: "md", minSize: "xs", maxSize: "md" },
  { i: "network-info", size: "md", minSize: "xs", maxSize: "md" },
  { i: "cpu", size: "xs", minSize: "xxs-wide", maxSize: "lg", allowedSizes: ["xxs-wide", "xs", "sm", "lg"] },
  { i: "ram", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "disk", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "network-usage", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "console", size: "xxl", minSize: "md", maxSize: "xxl" },
  { i: "players-online", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "container-uptime", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "recent-logs", size: "xs", minSize: "xs", maxSize: "sm" },
];

export const defaultHiddenCards = ["players-online", "container-uptime", "recent-logs"];
