"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar";
import {
  ServerIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  FolderIcon,
  DatabaseIcon,
  ActivityIcon,
  NetworkIcon,
  ArchiveIcon,
  CalendarIcon,
  PlayIcon,
  ChevronDownIcon,
  CheckIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// Mock server list
const servers = [
  { id: "1", name: "A Minecraft Server", status: "online" },
  { id: "2", name: "Survival World", status: "online" },
  { id: "3", name: "Creative Mode", status: "offline" },
  { id: "4", name: "Modded Server", status: "online" },
];

// Navigation items
const navItems = [
  { title: "Overview", icon: LayoutDashboardIcon, href: "/" },
  { title: "Files", icon: FolderIcon, href: "/files" },
  { title: "Backups", icon: ArchiveIcon, href: "/backups" },
  { title: "Schedules", icon: CalendarIcon, href: "/schedules" },
  { title: "Users", icon: UsersIcon, href: "/users" },
  { title: "Databases", icon: DatabaseIcon, href: "/databases" },
  { title: "Network", icon: NetworkIcon, href: "/network" },
  { title: "Activity", icon: ActivityIcon, href: "/activity" },
  { title: "Startup", icon: PlayIcon, href: "/startup" },
  { title: "Settings", icon: SettingsIcon, href: "/settings" },
];

interface AppSidebarProps {
  isDark?: boolean;
}

export function AppSidebar({ isDark = true }: AppSidebarProps) {
  const pathname = usePathname();
  const [selectedServer, setSelectedServer] = useState("A Minecraft Server");
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);

  return (
    <Sidebar
      className={cn(
        "border-r shadow-lg",
        isDark
          ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10 shadow-black/20"
          : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300 shadow-zinc-400/20"
      )}
    >
      <SidebarHeader className={cn("p-4 border-b", isDark ? "border-zinc-200/10" : "border-zinc-300")}>
        {/* Server Selector */}
        <div className="relative">
          <button
            onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
            className={cn(
              "w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors border",
              isDark
                ? "bg-zinc-900/50 border-zinc-700/50 hover:border-zinc-600 text-zinc-200"
                : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <ServerIcon className={cn("w-4 h-4 shrink-0", isDark ? "text-zinc-500" : "text-zinc-400")} />
              <span className="text-xs font-medium truncate">{selectedServer}</span>
            </div>
            <ChevronDownIcon className={cn(
              "w-3 h-3 shrink-0 transition-transform",
              isDark ? "text-zinc-500" : "text-zinc-400",
              isServerDropdownOpen && "rotate-180"
            )} />
          </button>
          {/* Corner accents on selector */}
          <div className={cn("absolute top-0 left-0 w-1.5 h-1.5 border-t border-l pointer-events-none", isDark ? "border-zinc-600" : "border-zinc-300")} />
          <div className={cn("absolute top-0 right-0 w-1.5 h-1.5 border-t border-r pointer-events-none", isDark ? "border-zinc-600" : "border-zinc-300")} />
          <div className={cn("absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l pointer-events-none", isDark ? "border-zinc-600" : "border-zinc-300")} />
          <div className={cn("absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r pointer-events-none", isDark ? "border-zinc-600" : "border-zinc-300")} />

          {/* Dropdown */}
          {isServerDropdownOpen && (
            <div className={cn(
              "absolute top-full left-0 right-0 mt-1 z-50 border shadow-lg",
              isDark
                ? "bg-[#0f0f0f] border-zinc-700/50 shadow-black/40"
                : "bg-white border-zinc-200 shadow-zinc-200/40"
            )}>
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    setSelectedServer(server.name);
                    setIsServerDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors",
                    isDark
                      ? "hover:bg-zinc-800 text-zinc-300"
                      : "hover:bg-zinc-100 text-zinc-700",
                    selectedServer === server.name && (isDark ? "bg-zinc-800" : "bg-zinc-100")
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      server.status === "online" ? "bg-green-500" : "bg-zinc-500"
                    )} />
                    <span className="truncate">{server.name}</span>
                  </div>
                  {selectedServer === server.name && (
                    <CheckIcon className={cn("w-3 h-3 shrink-0", isDark ? "text-zinc-400" : "text-zinc-500")} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-[10px] uppercase tracking-wider font-medium px-2",
            isDark ? "text-zinc-600" : "text-zinc-400"
          )}>
            Server
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-colors text-xs rounded-none",
                        isDark
                          ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 data-[active=true]:bg-zinc-800/80 data-[active=true]:text-zinc-100"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 data-[active=true]:bg-zinc-200/80 data-[active=true]:text-zinc-900"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("p-4 border-t", isDark ? "border-zinc-200/10" : "border-zinc-300")}>
        <div className={cn("text-[10px] uppercase tracking-wider", isDark ? "text-zinc-600" : "text-zinc-400")}>
          StellarStack v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
