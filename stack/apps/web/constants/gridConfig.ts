import type { GridItemConfig } from "@workspace/ui/components/shared/DragDropGrid";

export const defaultGridItems: GridItemConfig[] = [
  { i: "instance-name", size: "xxs-wide", minSize: "xxs-wide", maxSize: "xxs-wide" },
  { i: "container-controls", size: "xxs-wide", minSize: "xxs-wide", maxSize: "xxs-wide" },
  { i: "system-info", size: "md", minSize: "xs", maxSize: "md", allowedSizes: ['xs', 'xxs-wide', 'sm', 'md'] },
  { i: "network-info", size: "md", minSize: "xs", maxSize: "md", allowedSizes: ['xs', 'xxs-wide', 'sm', 'md'] },
  { i: "cpu", size: "xxs", minSize: "xxs", maxSize: "lg", allowedSizes: ["xxs", "xxs-wide", "xs", "sm", "lg"] },
  { i: "ram", size: "xxs", minSize: "xxs", maxSize: "sm" },
  { i: "disk", size: "xxs", minSize: "xxs", maxSize: "sm" },
  { i: "network-usage", size: "xxs", minSize: "xxs", maxSize: "sm" },
  { i: "console", size: "xxl", minSize: "md", maxSize: "xxl", allowedSizes: ['xs', 'md', 'lg', 'xxl'] },
  { i: "players-online", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "container-uptime", size: "xs", minSize: "xxs", maxSize: "sm" },
  { i: "recent-logs", size: "xs", minSize: "xs", maxSize: "sm" },
];

export const defaultHiddenCards = ["players-online", "container-uptime", "recent-logs"];
