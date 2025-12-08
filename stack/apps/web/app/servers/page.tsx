"use client";

import { useState, useEffect, type JSX } from "react";
import { useRouter } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { BsSun, BsMoon, BsServer, BsChevronRight, BsBoxArrowRight } from "react-icons/bs";

// Mock server data - will be replaced with API call
const mockServers = [
  {
    id: "srv-1",
    name: "US-WEST-NODE-1",
    status: "running" as const,
    game: "Minecraft",
    players: { current: 12, max: 20 },
    location: "Los Angeles, US",
  },
  {
    id: "srv-2",
    name: "EU-CENTRAL-NODE-1",
    status: "running" as const,
    game: "Valheim",
    players: { current: 5, max: 10 },
    location: "Frankfurt, DE",
  },
  {
    id: "srv-3",
    name: "US-EAST-NODE-1",
    status: "stopped" as const,
    game: "Terraria",
    players: { current: 0, max: 8 },
    location: "New York, US",
  },
];

type ServerStatus = "running" | "stopped" | "starting" | "stopping";

interface Server {
  id: string;
  name: string;
  status: ServerStatus;
  game: string;
  players: { current: number; max: number };
  location: string;
}

const ServersPage = (): JSX.Element | null => {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [servers] = useState<Server[]>(mockServers);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const handleServerSelect = (serverId: string) => {
    router.push(`/servers/${serverId}/overview`);
  };

  if (!mounted) return null;

  const getStatusColor = (status: ServerStatus) => {
    switch (status) {
      case "running":
        return "text-green-500 border-green-500";
      case "stopped":
        return "text-zinc-500 border-zinc-500";
      case "starting":
      case "stopping":
        return "text-amber-500 border-amber-500";
      default:
        return "text-zinc-500 border-zinc-500";
    }
  };

  return (
    <div className={cn(
      "min-h-svh transition-colors relative",
      isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
    )}>
      <AnimatedBackground isDark={isDark} />
      <FloatingDots isDark={isDark} count={15} />

      {/* Header */}
      <div className="relative p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={cn(
                "text-2xl font-light tracking-wider",
                isDark ? "text-zinc-100" : "text-zinc-800"
              )}>
                YOUR SERVERS
              </h1>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-zinc-500" : "text-zinc-500"
              )}>
                Select a server to manage
              </p>
            </div>
            <div className="flex items-center gap-2">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className={cn(
                  "transition-all hover:scale-[1.02] active:scale-95 gap-2",
                  isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                    : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                )}
              >
                <BsBoxArrowRight className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Server List */}
          <div className="space-y-4">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => handleServerSelect(server.id)}
                className={cn(
                  "relative w-full p-6 border text-left transition-all hover:scale-[1.01] group cursor-pointer",
                  isDark
                    ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10 shadow-lg shadow-black/20 hover:border-zinc-700"
                    : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300 shadow-lg shadow-zinc-400/20 hover:border-zinc-400"
                )}
              >
                {/* Corner decorations */}
                <div className={cn(
                  "absolute top-0 left-0 w-3 h-3 border-t border-l",
                  isDark ? "border-zinc-500" : "border-zinc-400"
                )} />
                <div className={cn(
                  "absolute top-0 right-0 w-3 h-3 border-t border-r",
                  isDark ? "border-zinc-500" : "border-zinc-400"
                )} />
                <div className={cn(
                  "absolute bottom-0 left-0 w-3 h-3 border-b border-l",
                  isDark ? "border-zinc-500" : "border-zinc-400"
                )} />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 border-b border-r",
                  isDark ? "border-zinc-500" : "border-zinc-400"
                )} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 border",
                      isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-300 bg-zinc-100"
                    )}>
                      <BsServer className={cn(
                        "w-6 h-6",
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className={cn(
                          "text-sm font-medium uppercase tracking-wider",
                          isDark ? "text-zinc-100" : "text-zinc-800"
                        )}>
                          {server.name}
                        </h2>
                        <span className={cn(
                          "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                          getStatusColor(server.status)
                        )}>
                          {server.status}
                        </span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-4 mt-1 text-xs",
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      )}>
                        <span>{server.game}</span>
                        <span>•</span>
                        <span>{server.players.current}/{server.players.max} players</span>
                        <span>•</span>
                        <span>{server.location}</span>
                      </div>
                    </div>
                  </div>
                  <BsChevronRight className={cn(
                    "w-5 h-5 transition-transform group-hover:translate-x-1",
                    isDark ? "text-zinc-600 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-600"
                  )} />
                </div>
              </button>
            ))}
          </div>

          {/* Add Server Button */}
          <button
            className={cn(
              "relative w-full mt-4 p-6 border border-dashed text-center transition-all hover:scale-[1.01] cursor-pointer",
              isDark
                ? "border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300"
                : "border-zinc-300 hover:border-zinc-400 text-zinc-400 hover:text-zinc-600"
            )}
          >
            <span className="text-sm font-medium uppercase tracking-wider">+ Add New Server</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServersPage;
