"use client";

import { useState, useEffect, type JSX } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useServerStore } from "../stores/connectionStore";
import { DragDropGrid, GridItem } from "@workspace/ui/components/shared/DragDropGrid";
import { useGridStorage } from "@workspace/ui/hooks/useGridStorage";
import { InfoRow } from "@workspace/ui/components/shared/InfoTooltip";
import { Console } from "@workspace/ui/components/shared/Console";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { BsSun, BsMoon, BsGrid } from "react-icons/bs";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FadeIn, FloatingDots } from "@workspace/ui/components/shared/Animations";
import { Badge } from "@workspace/ui/components/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@workspace/ui/components/sheet";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import {
  CpuCard,
  UsageMetricCard,
  NetworkUsageCard,
  SystemInformationCard,
  NetworkInfoCard,
  InstanceNameCard,
  ContainerControlsCard,
  ContainerUptimeCard,
  PlayersOnlineCard,
  RecentLogsCard,
  CardPreview,
} from "@workspace/ui/components/shared/DashboardCards";
import { ThemeContext } from "../contexts/ThemeContext";
import { useServerSimulation, useSimulatedConsole, useContainerControls, useLabels } from "../hooks";
import { defaultGridItems, defaultHiddenCards } from "../constants";

const Page = (): JSX.Element | null => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const labels = useLabels();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const { items, visibleItems, layouts, hiddenCards, isLoaded, saveLayout, resetLayout, showCard, hideCard } = useGridStorage({
    key: "stellarstack-dashboard-layout",
    defaultItems: defaultGridItems,
    defaultHiddenCards: defaultHiddenCards,
  });

  useServerSimulation();

  const server = useServerStore((state) => state.server);
  const isOffline = useServerStore((state) => state.isOffline);
  const { lines: consoleLines, handleCommand } = useSimulatedConsole();
  const containerControls = useContainerControls();

  const getStatusLabel = (): string => {
    if (isOffline) return labels.status.offline;
    switch (server.status) {
      case "running": return labels.status.online;
      case "starting": return labels.status.starting;
      case "stopping": return labels.status.stopping;
      default: return labels.status.stopped;
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <div className={cn(
        "min-h-svh transition-colors relative",
        isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
      )}>
        <AnimatedBackground isDark={isDark} />
        <FloatingDots isDark={isDark} count={15} />

        {/* Preview Banner */}
        <div className={cn(
          "w-full py-2 px-4 text-center text-sm font-medium",
          isDark
            ? "bg-amber-500/10 text-amber-400 border-b border-amber-500/20"
            : "bg-amber-50 text-amber-700 border-b border-amber-200"
        )}>
          {labels.dashboard.previewBanner}
        </div>

        <div className="relative p-8">
          <FadeIn delay={0}>
            <div className="mx-auto mb-6 flex items-center justify-between">
              <SidebarTrigger className={cn(
                "transition-all hover:scale-110 active:scale-95",
                isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
              )} />
              <div className="flex items-center gap-2">
                {isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCardSheetOpen(true)}
                      className={cn(
                        "transition-all hover:scale-[1.02] active:scale-95",
                        isDark
                          ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                          : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                      )}
                    >
                      <BsGrid className="w-4 h-4 mr-2" />
                      {labels.dashboard.manageCards}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetLayout}
                      className={cn(
                        "transition-all hover:scale-[1.02] active:scale-95",
                        isDark
                          ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                          : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                      )}
                    >
                      {labels.dashboard.resetLayout}
                    </Button>
                  </>
                )}
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "transition-all hover:scale-[1.02] active:scale-95",
                    isEditing && (isDark ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200" : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"),
                    !isEditing && (isDark
                      ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                      : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400")
                  )}
                >
                  {isEditing ? labels.dashboard.doneEditing : labels.dashboard.editLayout}
                </Button>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium bg-transparent",
                    isOffline && "border-red-500 text-red-500",
                    !isOffline && server.status === "running" && "border-green-500 text-green-500",
                    !isOffline && server.status === "stopped" && "border-zinc-500 text-zinc-500",
                    !isOffline && server.status === "starting" && "border-amber-500 text-amber-500",
                    !isOffline && server.status === "stopping" && "border-amber-500 text-amber-500"
                  )}
                >
                  {getStatusLabel()}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={cn(
                    "transition-all hover:scale-110 active:scale-95 p-2",
                    isDark
                      ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                      : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                  )}
                >
                  {isDark ? <BsSun className="w-4 h-4" /> : <BsMoon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </FadeIn>

          <Sheet open={isCardSheetOpen} onOpenChange={setIsCardSheetOpen}>
            <SheetContent
              side="right"
              className={cn(
                "w-[400px] sm:max-w-[450px] overflow-y-auto",
                isDark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              <SheetHeader>
                <SheetTitle className={isDark ? "text-zinc-100" : "text-zinc-900"}>
                  {labels.dashboard.availableCards}
                </SheetTitle>
                <SheetDescription className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                  {labels.dashboard.availableCardsDescription}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {hiddenCards
                  .filter((cardId) => cardId !== "console")
                  .map((cardId) => (
                    <div
                      key={cardId}
                      onClick={() => showCard(cardId)}
                      className={cn(
                        "rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
                        isDark ? "hover:shadow-black/50" : "hover:shadow-zinc-300/50"
                      )}
                    >
                      <div className="h-[120px] pointer-events-none">
                        <CardPreview cardId={cardId} isDark={isDark} server={server} />
                      </div>
                    </div>
                  ))}
                {hiddenCards.filter((id) => id !== "console").length === 0 && (
                  <div className={cn(
                    "text-center py-8 text-sm",
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  )}>
                    {labels.dashboard.allCardsOnDashboard}
                    <br />
                    {labels.dashboard.removeCardsHint}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <DragDropGrid
            className="max-w-7xl mx-auto"
            items={visibleItems}
            allItems={items}
            savedLayouts={layouts}
            onLayoutChange={saveLayout}
            onDropItem={(itemId) => showCard(itemId)}
            onRemoveItem={(itemId) => hideCard(itemId)}
            rowHeight={50}
            gap={16}
            isEditing={isEditing}
            isDark={isDark}
            isDroppable={true}
            removeConfirmLabels={labels.removeCard}
          >
            {!hiddenCards.includes("instance-name") && (
              <div key="instance-name" className="h-full">
                <GridItem itemId="instance-name">
                  <InstanceNameCard itemId="instance-name" isDark={isDark} instanceName={server.name} />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("container-controls") && (
              <div key="container-controls" className="h-full">
                <GridItem itemId="container-controls">
                  <ContainerControlsCard
                    itemId="container-controls"
                    isDark={isDark}
                    isOffline={isOffline}
                    status={containerControls.status}
                    onStart={containerControls.handleStart}
                    onStop={containerControls.handleStop}
                    onKill={containerControls.handleKill}
                    onRestart={containerControls.handleRestart}
                    labels={labels.containerControls}
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("system-info") && server.node && (
              <div key="system-info" className="h-full">
                <GridItem itemId="system-info">
                  <SystemInformationCard
                    itemId="system-info"
                    isDark={isDark}
                    nodeData={server.node}
                    labels={labels.systemInfo}
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("network-info") && server.networkConfig.openPorts && (
              <div key="network-info" className="h-full">
                <GridItem itemId="network-info">
                  <NetworkInfoCard
                    itemId="network-info"
                    isDark={isDark}
                    networkInfo={{
                      publicIp: server.networkConfig.publicIp || "",
                      privateIp: server.networkConfig.privateIp || "",
                      openPorts: server.networkConfig.openPorts,
                      macAddress: server.networkConfig.macAddress || "",
                    }}
                    labels={labels.networkInfo}
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("cpu") && (
              <div key="cpu" className="h-full">
                <GridItem itemId="cpu">
                  <CpuCard
                    itemId="cpu"
                    percentage={server.cpu.usage.percentage}
                    details={[`${server.cpu.cores} ${labels.cpu.cores || "CORES"}`, `${server.cpu.frequency} GHz`]}
                    history={server.cpu.usage.history}
                    coreUsage={server.cpu.coreUsage}
                    isDark={isDark}
                    isOffline={isOffline}
                    labels={labels.cpu}
                    tooltipContent={
                      <>
                        <InfoRow label={labels.tooltip.cpu.model} value={server.cpu.model || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.cpu.architecture} value={server.cpu.architecture || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.cpu.baseClock} value={`${server.cpu.baseFrequency || 0} GHz`} isDark={isDark} />
                        <InfoRow label={labels.tooltip.cpu.boostClock} value={`${server.cpu.boostFrequency || 0} GHz`} isDark={isDark} />
                        <InfoRow label={labels.tooltip.cpu.tdp} value={`${server.cpu.tdp || 0}W`} isDark={isDark} />
                        <InfoRow label={labels.tooltip.cpu.cache} value={server.cpu.cache || ""} isDark={isDark} />
                      </>
                    }
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("ram") && (
              <div key="ram" className="h-full">
                <GridItem itemId="ram">
                  <UsageMetricCard
                    itemId="ram"
                    percentage={server.memory.usage.percentage}
                    details={[`${server.memory.used} / ${server.memory.total} GB`, server.memory.type || ""]}
                    history={server.memory.usage.history}
                    isDark={isDark}
                    isOffline={isOffline}
                    labels={labels.ram}
                    tooltipContent={
                      <>
                        <InfoRow label={labels.tooltip.ram.type} value={server.memory.type || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.ram.speed} value={`${server.memory.speed || 0} MT/s`} isDark={isDark} />
                        <InfoRow label={labels.tooltip.ram.channels} value={server.memory.channels || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.ram.slotsUsed} value={server.memory.slots || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.ram.timings} value={server.memory.timings || ""} isDark={isDark} />
                      </>
                    }
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("disk") && (
              <div key="disk" className="h-full">
                <GridItem itemId="disk">
                  <UsageMetricCard
                    itemId="disk"
                    percentage={server.disk.usage.percentage}
                    details={[`${server.disk.used} / ${server.disk.total} GB`, server.disk.type || ""]}
                    history={server.disk.usage.history}
                    isDark={isDark}
                    isOffline={isOffline}
                    labels={labels.disk}
                    tooltipContent={
                      <>
                        <InfoRow label={labels.tooltip.disk.model} value={server.disk.model || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.disk.interface} value={server.disk.interface || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.disk.readSpeed} value={server.disk.readSpeed || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.disk.writeSpeed} value={server.disk.writeSpeed || ""} isDark={isDark} />
                        <InfoRow label={labels.tooltip.disk.health} value={`${server.disk.health || 0}%`} isDark={isDark} />
                      </>
                    }
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("network-usage") && (
              <div key="network-usage" className="h-full">
                <GridItem itemId="network-usage">
                  <NetworkUsageCard
                    itemId="network-usage"
                    download={server.network.download}
                    upload={server.network.upload}
                    downloadHistory={server.network.downloadHistory}
                    uploadHistory={server.network.uploadHistory}
                    isDark={isDark}
                    isOffline={isOffline}
                    labels={labels.network}
                    tooltipData={server.networkConfig.interface ? {
                      interface: server.networkConfig.interface,
                      adapter: server.networkConfig.adapter || "",
                      speed: server.networkConfig.speed || "",
                      ipv4: server.networkConfig.ipAddress,
                      gateway: server.networkConfig.gateway || "",
                      dns: server.networkConfig.dns || "",
                    } : undefined}
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("console") && (
              <div key="console" className="h-full">
                <GridItem itemId="console" showRemoveHandle={false}>
                  <Console lines={consoleLines} onCommand={handleCommand} isDark={isDark} isOffline={isOffline} />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("players-online") && (
              <div key="players-online" className="h-full">
                <GridItem itemId="players-online">
                  <PlayersOnlineCard
                    itemId="players-online"
                    isDark={isDark}
                    isOffline={isOffline}
                    players={server.gameServer?.players || []}
                    maxPlayers={server.gameServer?.maxPlayers || 20}
                    containerStatus={server.status}
                    labels={labels.playersOnline}
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("container-uptime") && (
              <div key="container-uptime" className="h-full">
                <GridItem itemId="container-uptime">
                  <ContainerUptimeCard
                    itemId="container-uptime"
                    isDark={isDark}
                    isOffline={isOffline}
                    containerUptime={server.containerUptime || 0}
                    containerStatus={server.status}
                    labels={labels.containerUptime}
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("recent-logs") && (
              <div key="recent-logs" className="h-full">
                <GridItem itemId="recent-logs">
                  <RecentLogsCard
                    itemId="recent-logs"
                    isDark={isDark}
                    isOffline={isOffline}
                    logs={server.recentLogs || []}
                    labels={labels.recentLogs}
                  />
                </GridItem>
              </div>
            )}
          </DragDropGrid>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Page;
