"use client";

import { useState, useEffect, type JSX } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { BsSun, BsMoon, BsBell, BsCheck, BsCheckAll, BsExclamationTriangle, BsInfoCircle, BsServer, BsShieldExclamation } from "react-icons/bs";

type NotificationType = "info" | "warning" | "error" | "success" | "server" | "security";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  serverId?: string;
  serverName?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "server",
    title: "Server Restarted",
    message: "US-WEST-NODE-1 has been successfully restarted and is now online.",
    timestamp: "5 minutes ago",
    read: false,
    serverId: "srv-1",
    serverName: "US-WEST-NODE-1"
  },
  {
    id: "notif-2",
    type: "warning",
    title: "High CPU Usage",
    message: "EU-CENTRAL-NODE-1 is experiencing high CPU usage (95%). Consider upgrading resources.",
    timestamp: "1 hour ago",
    read: false,
    serverId: "srv-2",
    serverName: "EU-CENTRAL-NODE-1"
  },
  {
    id: "notif-3",
    type: "security",
    title: "New Login Detected",
    message: "A new login was detected from Chrome on Windows. Location: New York, US.",
    timestamp: "3 hours ago",
    read: true
  },
  {
    id: "notif-4",
    type: "success",
    title: "Backup Completed",
    message: "Daily backup for US-WEST-NODE-1 completed successfully (2.4 GB).",
    timestamp: "6 hours ago",
    read: true,
    serverId: "srv-1",
    serverName: "US-WEST-NODE-1"
  },
  {
    id: "notif-5",
    type: "info",
    title: "Scheduled Maintenance",
    message: "Scheduled maintenance window tomorrow from 2:00 AM - 4:00 AM UTC.",
    timestamp: "1 day ago",
    read: true
  },
  {
    id: "notif-6",
    type: "error",
    title: "Backup Failed",
    message: "Automatic backup for US-EAST-NODE-1 failed due to insufficient disk space.",
    timestamp: "1 day ago",
    read: true,
    serverId: "srv-3",
    serverName: "US-EAST-NODE-1"
  },
];

const NotificationsPage = (): JSX.Element | null => {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <BsInfoCircle className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <BsExclamationTriangle className="w-4 h-4 text-amber-500" />;
      case "error":
        return <BsExclamationTriangle className="w-4 h-4 text-red-500" />;
      case "success":
        return <BsCheck className="w-4 h-4 text-green-500" />;
      case "server":
        return <BsServer className="w-4 h-4 text-purple-500" />;
      case "security":
        return <BsShieldExclamation className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className={cn(
      "min-h-svh transition-colors relative",
      isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
    )}>
      <AnimatedBackground isDark={isDark} />
      <FloatingDots isDark={isDark} count={15} />

      <div className="relative p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className={cn(
                "transition-all hover:scale-110 active:scale-95",
                isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
              )} />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className={cn(
                    "text-2xl font-light tracking-wider",
                    isDark ? "text-zinc-100" : "text-zinc-800"
                  )}>
                    NOTIFICATIONS
                  </h1>
                  {unreadCount > 0 && (
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                      isDark ? "border-blue-500/50 text-blue-400" : "border-blue-400 text-blue-600"
                    )}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Stay updated on your servers and account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className={cn(
                    "transition-all gap-2",
                    isDark
                      ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                      : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                  )}
                >
                  <BsCheckAll className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Mark All Read</span>
                </Button>
              )}
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

          {/* Notifications List */}
          <div className={cn(
            "relative border",
            isDark
              ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
              : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300"
          )}>
            {/* Corner decorations */}
            <div className={cn("absolute top-0 left-0 w-3 h-3 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute top-0 right-0 w-3 h-3 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <BsBell className={cn("w-12 h-12 mb-4", isDark ? "text-zinc-700" : "text-zinc-300")} />
                <p className={cn(
                  "text-sm",
                  isDark ? "text-zinc-500" : "text-zinc-400"
                )}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "w-full flex items-start gap-4 px-6 py-4 transition-colors text-left",
                    index !== notifications.length - 1 && (isDark ? "border-b border-zinc-800/50" : "border-b border-zinc-200"),
                    !notification.read && (isDark ? "bg-zinc-800/20" : "bg-blue-50/50"),
                    isDark ? "hover:bg-zinc-800/30" : "hover:bg-zinc-50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center border shrink-0 mt-0.5",
                    isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-300 bg-zinc-100"
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-sm font-medium",
                        isDark ? "text-zinc-200" : "text-zinc-700"
                      )}>
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-1",
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    )}>
                      {notification.message}
                    </p>
                    {notification.serverName && (
                      <span className={cn(
                        "inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 mt-2 border",
                        isDark ? "border-zinc-700 text-zinc-500" : "border-zinc-300 text-zinc-500"
                      )}>
                        {notification.serverName}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs shrink-0",
                    isDark ? "text-zinc-600" : "text-zinc-400"
                  )}>
                    {notification.timestamp}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
