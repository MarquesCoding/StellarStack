"use client";

import { useState, useEffect, type JSX } from "react";
import { useParams } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { BsSun, BsMoon, BsPlayFill, BsStopFill, BsArrowRepeat, BsPersonFill, BsGear, BsFileEarmark, BsDatabase, BsChevronDown, BsArrowReturnRight } from "react-icons/bs";

type ActivityType = "server_start" | "server_stop" | "server_restart" | "user_login" | "file_change" | "setting_change" | "backup_created" | "database_query";

interface ActivityMetadata {
  [key: string]: string | number | undefined;
}

interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  user?: string;
  timestamp: string;
  details?: string;
  metadata?: ActivityMetadata;
}

const mockActivity: ActivityLog[] = [
  {
    id: "act-1",
    type: "server_restart",
    message: "Server restarted",
    user: "john_doe",
    timestamp: "5 minutes ago",
    details: "Manual restart via dashboard",
    metadata: {
      "Trigger": "Manual",
      "Previous Uptime": "2d 14h 32m",
      "Restart Duration": "12.4s",
      "IP Address": "192.168.1.105",
    }
  },
  {
    id: "act-2",
    type: "file_change",
    message: "server.properties modified",
    user: "jane_smith",
    timestamp: "15 minutes ago",
    metadata: {
      "File Path": "/server.properties",
      "Changes": "3 lines modified",
      "Previous Size": "2.3 KB",
      "New Size": "2.4 KB",
    }
  },
  {
    id: "act-3",
    type: "user_login",
    message: "User logged in",
    user: "bob_wilson",
    timestamp: "1 hour ago",
  },
  {
    id: "act-4",
    type: "backup_created",
    message: "Backup created",
    timestamp: "3 hours ago",
    details: "Automatic daily backup",
    metadata: {
      "Backup Size": "2.4 GB",
      "Duration": "45s",
      "Files Included": "1,247",
      "Compression": "gzip",
      "Storage Location": "s3://backups/daily/",
    }
  },
  {
    id: "act-5",
    type: "setting_change",
    message: "Max memory changed to 4GB",
    user: "john_doe",
    timestamp: "5 hours ago",
  },
  { id: "act-6", type: "server_start", message: "Server started", user: "john_doe", timestamp: "6 hours ago" },
  {
    id: "act-7",
    type: "database_query",
    message: "Database export completed",
    user: "jane_smith",
    timestamp: "1 day ago",
    metadata: {
      "Export Type": "Full backup",
      "Tables": "12",
      "Rows Exported": "45,892",
      "File Size": "128 MB",
      "Format": "SQL",
    }
  },
  {
    id: "act-8",
    type: "server_stop",
    message: "Server stopped",
    timestamp: "1 day ago",
    details: "Scheduled maintenance",
  },
];

const ActivityPage = (): JSX.Element | null => {
  const params = useParams();
  const serverId = params.id as string;
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!mounted) return null;

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "server_start":
        return <BsPlayFill className="w-4 h-4 text-green-500" />;
      case "server_stop":
        return <BsStopFill className="w-4 h-4 text-red-500" />;
      case "server_restart":
        return <BsArrowRepeat className="w-4 h-4 text-amber-500" />;
      case "user_login":
        return <BsPersonFill className="w-4 h-4 text-blue-500" />;
      case "file_change":
        return <BsFileEarmark className="w-4 h-4 text-purple-500" />;
      case "setting_change":
        return <BsGear className="w-4 h-4 text-zinc-500" />;
      case "backup_created":
        return <BsArrowRepeat className="w-4 h-4 text-cyan-500" />;
      case "database_query":
        return <BsDatabase className="w-4 h-4 text-orange-500" />;
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
                <h1 className={cn(
                  "text-2xl font-light tracking-wider",
                  isDark ? "text-zinc-100" : "text-zinc-800"
                )}>
                  ACTIVITY LOG
                </h1>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Server {serverId} • Recent activity
                </p>
              </div>
            </div>
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

          {/* Activity Timeline */}
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

            {mockActivity.map((activity, index) => {
              const isExpandable = !!activity.metadata;
              const isExpanded = expandedIds.has(activity.id);

              return (
                <div
                  key={activity.id}
                  className={cn(
                    index !== mockActivity.length - 1 && (isDark ? "border-b border-zinc-800/50" : "border-b border-zinc-200")
                  )}
                >
                  <div
                    onClick={() => isExpandable && toggleExpanded(activity.id)}
                    className={cn(
                      "flex items-start gap-4 px-6 py-4 transition-colors",
                      isDark ? "hover:bg-zinc-800/20" : "hover:bg-zinc-50",
                      isExpandable && "cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center border shrink-0 mt-0.5",
                      isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-300 bg-zinc-100"
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-sm font-medium",
                          isDark ? "text-zinc-200" : "text-zinc-700"
                        )}>
                          {activity.message}
                        </span>
                        {activity.user && (
                          <span className={cn(
                            "text-xs px-2 py-0.5 border",
                            isDark ? "border-zinc-700 text-zinc-500" : "border-zinc-300 text-zinc-500"
                          )}>
                            {activity.user}
                          </span>
                        )}
                      </div>
                      {activity.details && (
                        <p className={cn(
                          "text-xs mt-1",
                          isDark ? "text-zinc-500" : "text-zinc-400"
                        )}>
                          {activity.details}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={cn(
                        "text-xs",
                        isDark ? "text-zinc-600" : "text-zinc-400"
                      )}>
                        {activity.timestamp}
                      </span>
                      {isExpandable && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <BsChevronDown className={cn(
                            "w-4 h-4",
                            isDark ? "text-zinc-600" : "text-zinc-400"
                          )} />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Expandable metadata section */}
                  <AnimatePresence>
                    {isExpanded && activity.metadata && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-1 relative">
                          {/* Arrow connector - positioned below the icon */}
                          <div className="absolute left-[2.2rem] top-0 flex items-start gap-1">
                            <BsArrowReturnRight className={cn(
                              "w-4 h-4 mt-1",
                              isDark ? "text-zinc-600" : "text-zinc-400"
                            )} />
                          </div>
                          <div className={cn(
                            "ml-8",
                            "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border",
                            isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white"
                          )}>
                            {Object.entries(activity.metadata).map(([key, value]) => (
                              <div key={key}>
                                <span className={cn(
                                  "text-[10px] font-medium uppercase tracking-wider block",
                                  isDark ? "text-zinc-500" : "text-zinc-400"
                                )}>
                                  {key}
                                </span>
                                <span className={cn(
                                  "text-xs mt-0.5 block",
                                  isDark ? "text-zinc-300" : "text-zinc-700"
                                )}>
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
