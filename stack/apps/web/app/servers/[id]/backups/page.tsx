"use client";

import { useState, useEffect, type JSX } from "react";
import { useParams } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { ConfirmationModal } from "@workspace/ui/components/shared/ConfirmationModal";
import { FormModal } from "@workspace/ui/components/shared/FormModal";
import { Spinner } from "@workspace/ui/components/spinner";
import { BsSun, BsMoon, BsCloudDownload, BsTrash, BsPlus, BsCheckCircle, BsExclamationCircle } from "react-icons/bs";

interface Backup {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  status: "completed" | "in_progress" | "failed";
  type: "manual" | "automatic";
}

const mockBackups: Backup[] = [
  { id: "bkp-1", name: "Pre-Update Backup", size: "2.4 GB", createdAt: "2025-01-15 14:30", status: "completed", type: "manual" },
  { id: "bkp-2", name: "Daily Backup", size: "2.3 GB", createdAt: "2025-01-15 03:00", status: "completed", type: "automatic" },
  { id: "bkp-3", name: "Daily Backup", size: "2.3 GB", createdAt: "2025-01-14 03:00", status: "completed", type: "automatic" },
  { id: "bkp-4", name: "World Reset Backup", size: "2.1 GB", createdAt: "2025-01-13 18:45", status: "completed", type: "manual" },
  { id: "bkp-5", name: "Daily Backup", size: "0 GB", createdAt: "2025-01-13 03:00", status: "failed", type: "automatic" },
];

const BackupsPage = (): JSX.Element | null => {
  const params = useParams();
  const serverId = params.id as string;
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [backups, setBackups] = useState<Backup[]>(mockBackups);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  // Form states
  const [backupName, setBackupName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  const openCreateModal = () => {
    setBackupName("");
    setCreateModalOpen(true);
  };

  const openDeleteModal = (backup: Backup) => {
    setSelectedBackup(backup);
    setDeleteModalOpen(true);
  };

  const openRestoreModal = (backup: Backup) => {
    setSelectedBackup(backup);
    setRestoreModalOpen(true);
  };

  const handleCreate = () => {
    const newBackup: Backup = {
      id: `bkp-${Date.now()}`,
      name: backupName || "Manual Backup",
      size: "Calculating...",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "in_progress",
      type: "manual",
    };
    setBackups(prev => [newBackup, ...prev]);
    setCreateModalOpen(false);
    setBackupName("");

    // Simulate backup completion
    setTimeout(() => {
      setBackups(prev => prev.map(b =>
        b.id === newBackup.id
          ? { ...b, status: "completed", size: "2.4 GB" }
          : b
      ));
    }, 3000);
  };

  const handleDelete = () => {
    if (!selectedBackup) return;
    setBackups(prev => prev.filter(b => b.id !== selectedBackup.id));
    setDeleteModalOpen(false);
    setSelectedBackup(null);
  };

  const handleRestore = () => {
    // Simulate restore action
    setRestoreModalOpen(false);
    setSelectedBackup(null);
  };

  const getStatusIcon = (status: Backup["status"]) => {
    switch (status) {
      case "completed":
        return <BsCheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Spinner className="w-4 h-4 text-amber-500" />;
      case "failed":
        return <BsExclamationCircle className="w-4 h-4 text-red-500" />;
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
                  BACKUPS
                </h1>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Server {serverId} • {backups.length} backups
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openCreateModal}
                className={cn(
                  "transition-all gap-2",
                  isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                    : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                )}
              >
                <BsPlus className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Create Backup</span>
              </Button>
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

          {/* Backup List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {backups.map((backup) => (
                <motion.div
                  key={backup.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "relative p-6 border",
                    isDark
                      ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10 hover:border-zinc-700"
                      : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300 hover:border-zinc-400"
                  )}
                >
                  {/* Corner decorations */}
                  <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                  <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
                  <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                  <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(backup.status)}
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className={cn(
                            "text-sm font-medium uppercase tracking-wider",
                            isDark ? "text-zinc-100" : "text-zinc-800"
                          )}>
                            {backup.name}
                          </h3>
                          <span className={cn(
                            "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                            backup.type === "automatic"
                              ? isDark ? "border-blue-500/50 text-blue-400" : "border-blue-400 text-blue-600"
                              : isDark ? "border-zinc-600 text-zinc-400" : "border-zinc-400 text-zinc-600"
                          )}>
                            {backup.type}
                          </span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-4 mt-1 text-xs",
                          isDark ? "text-zinc-500" : "text-zinc-500"
                        )}>
                          <span>{backup.size}</span>
                          <span>•</span>
                          <span>{backup.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={backup.status !== "completed"}
                        onClick={() => openRestoreModal(backup)}
                        className={cn(
                          "transition-all gap-2",
                          isDark
                            ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-30"
                            : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 disabled:opacity-30"
                        )}
                      >
                        <BsCloudDownload className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Restore</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(backup)}
                        className={cn(
                          "transition-all p-2",
                          isDark
                            ? "border-red-900/60 text-red-400/80 hover:text-red-300 hover:border-red-700"
                            : "border-red-300 text-red-600 hover:text-red-700 hover:border-red-400"
                        )}
                      >
                        <BsTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Backup Modal */}
      <FormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create Backup"
        description="Create a new manual backup of your server."
        onSubmit={handleCreate}
        submitLabel="Create Backup"
        isDark={isDark}
        isValid={true}
      >
        <div className="space-y-4">
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Backup Name (Optional)
            </label>
            <Input
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="e.g., Pre-Update Backup"
              className={cn(
                "transition-all",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Leave empty for default name "Manual Backup"
            </p>
          </div>
        </div>
      </FormModal>

      {/* Restore Backup Modal */}
      <ConfirmationModal
        open={restoreModalOpen}
        onOpenChange={setRestoreModalOpen}
        title="Restore Backup"
        description={`Are you sure you want to restore "${selectedBackup?.name}"? This will replace your current server data with the backup contents.`}
        onConfirm={handleRestore}
        confirmLabel="Restore"
        variant="danger"
        isDark={isDark}
      />

      {/* Delete Backup Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Backup"
        description={`Are you sure you want to delete "${selectedBackup?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
        isDark={isDark}
      />
    </div>
  );
};

export default BackupsPage;
