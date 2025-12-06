"use client";

import { useState, useEffect } from "react";
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
import { FadeIn, FloatingDots, SkeletonCard } from "@workspace/ui/components/shared/Animations";
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
import { useServerSimulation, useSimulatedConsole, useContainerControls } from "../hooks";
import { defaultGridItems, defaultHiddenCards } from "../constants";

const DashboardLoading = () => (
  <div className="min-h-svh bg-[#0b0b0a] relative">
    <FloatingDots isDark={true} count={15} />
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <SkeletonCard isDark={true} className="h-10 w-10" />
          <div className="flex gap-2">
            <SkeletonCard isDark={true} className="h-9 w-24" />
            <SkeletonCard isDark={true} className="h-9 w-9" />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6"><SkeletonCard isDark={true} className="h-16" /></div>
          <div className="col-span-6"><SkeletonCard isDark={true} className="h-16" /></div>
          <div className="col-span-6"><SkeletonCard isDark={true} variant="stat" /></div>
          <div className="col-span-6"><SkeletonCard isDark={true} variant="stat" /></div>
          <div className="col-span-3"><SkeletonCard isDark={true} variant="stat" /></div>
          <div className="col-span-3"><SkeletonCard isDark={true} variant="stat" /></div>
          <div className="col-span-3"><SkeletonCard isDark={true} variant="stat" /></div>
          <div className="col-span-3"><SkeletonCard isDark={true} variant="stat" /></div>
          <div className="col-span-12"><SkeletonCard isDark={true} variant="chart" className="h-[300px]" /></div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

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

  if (!isLoaded) {
    return <DashboardLoading />;
  }

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <div className={cn(
        "min-h-svh transition-colors relative",
        isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
      )}>
        <AnimatedBackground isDark={isDark} />
        <FloatingDots isDark={isDark} count={15} />

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
                      Manage Cards
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
                      Reset Layout
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
                  {isEditing ? "Done Editing" : "Edit Layout"}
                </Button>
                <Badge
                  variant={isOffline ? "destructive" : server.status === "running" ? "default" : "secondary"}
                  className={cn(
                    "text-xs font-medium",
                    !isOffline && server.status === "running" && "bg-green-600 hover:bg-green-600",
                    server.status === "starting" && "bg-amber-500 hover:bg-amber-500",
                    server.status === "stopping" && "bg-amber-500 hover:bg-amber-500"
                  )}
                >
                  {isOffline ? "Offline" : server.status === "running" ? "Online" : server.status === "starting" ? "Starting" : server.status === "stopping" ? "Stopping" : "Stopped"}
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
                  Available Cards
                </SheetTitle>
                <SheetDescription className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                  Click a card to add it to your dashboard.
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
                    All cards are on your dashboard.
                    <br />
                    Remove cards using the X button to add them here.
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
                  />
                </GridItem>
              </div>
            )}

            {!hiddenCards.includes("system-info") && server.node && (
              <div key="system-info" className="h-full">
                <GridItem itemId="system-info">
                  <SystemInformationCard itemId="system-info" isDark={isDark} nodeData={server.node} />
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
                    details={[`${server.cpu.cores} CORES`, `${server.cpu.frequency} GHz`]}
                    history={server.cpu.usage.history}
                    coreUsage={server.cpu.coreUsage}
                    isDark={isDark}
                    isOffline={isOffline}
                    tooltipContent={
                      <>
                        <InfoRow label="Model" value={server.cpu.model || "AMD Ryzen 9 9950X3D"} isDark={isDark} />
                        <InfoRow label="Architecture" value={server.cpu.architecture || "Zen 5"} isDark={isDark} />
                        <InfoRow label="Base Clock" value={`${server.cpu.baseFrequency || 4.3} GHz`} isDark={isDark} />
                        <InfoRow label="Boost Clock" value={`${server.cpu.boostFrequency || 5.7} GHz`} isDark={isDark} />
                        <InfoRow label="TDP" value={`${server.cpu.tdp || 170}W`} isDark={isDark} />
                        <InfoRow label="Cache" value={server.cpu.cache || "144MB"} isDark={isDark} />
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
                    title="RAM"
                    percentage={server.memory.usage.percentage}
                    details={[`${server.memory.used} / ${server.memory.total} GB`, "DDR5"]}
                    history={server.memory.usage.history}
                    isDark={isDark}
                    isOffline={isOffline}
                    tooltipContent={
                      <>
                        <InfoRow label="Type" value={server.memory.type || "DDR5"} isDark={isDark} />
                        <InfoRow label="Speed" value={`${server.memory.speed || 6000} MT/s`} isDark={isDark} />
                        <InfoRow label="Channels" value={server.memory.channels || "Dual Channel"} isDark={isDark} />
                        <InfoRow label="Slots Used" value={server.memory.slots || "2 / 4"} isDark={isDark} />
                        <InfoRow label="Timings" value={server.memory.timings || "CL30-38-38"} isDark={isDark} />
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
                    title="DISK"
                    percentage={server.disk.usage.percentage}
                    details={[`${server.disk.used} / ${server.disk.total} GB`, server.disk.type || "NVMe SSD"]}
                    history={server.disk.usage.history}
                    isDark={isDark}
                    isOffline={isOffline}
                    tooltipContent={
                      <>
                        <InfoRow label="Model" value={server.disk.model || "Samsung 990 Pro"} isDark={isDark} />
                        <InfoRow label="Interface" value={server.disk.interface || "PCIe 4.0 x4"} isDark={isDark} />
                        <InfoRow label="Read Speed" value={server.disk.readSpeed || "7,450 MB/s"} isDark={isDark} />
                        <InfoRow label="Write Speed" value={server.disk.writeSpeed || "6,900 MB/s"} isDark={isDark} />
                        <InfoRow label="Health" value={`${server.disk.health || 98}%`} isDark={isDark} />
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
                  />
                </GridItem>
              </div>
            )}
          </DragDropGrid>

          <FadeIn delay={400}>
            <footer className={cn(
              "mt-12 pb-4 text-center text-sm uppercase transition-colors",
              isDark ? "text-zinc-500" : "text-zinc-600"
            )}>
              &copy; {new Date().getFullYear()} StellarStack
            </footer>
          </FadeIn>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Page;
