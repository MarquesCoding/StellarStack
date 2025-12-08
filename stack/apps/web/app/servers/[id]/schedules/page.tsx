"use client";

import { useState, useEffect, type JSX } from "react";
import { useParams } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmationModal } from "@workspace/ui/components/shared/ConfirmationModal";
import { FormModal } from "@workspace/ui/components/shared/FormModal";
import { BsSun, BsMoon, BsPlus, BsTrash, BsPencil, BsPlayFill, BsStopFill, BsArrowRepeat, BsTerminal, BsCloudUpload, BsChatDots, BsX, BsGripVertical, BsClock } from "react-icons/bs";

type ActionType = "start" | "stop" | "restart" | "backup" | "command" | "message" | "delay";

interface ScheduleTask {
  id: string;
  action: ActionType;
  payload?: string; // command text, message text, or delay in seconds
}

interface Schedule {
  id: string;
  name: string;
  tasks: ScheduleTask[];
  cron: string;
  nextRun: string;
  enabled: boolean;
  lastRun?: string;
}

const mockSchedules: Schedule[] = [
  {
    id: "sch-1",
    name: "Daily Maintenance",
    tasks: [
      { id: "t1", action: "message", payload: "Server restarting in 5 minutes..." },
      { id: "t1a", action: "delay", payload: "300" },
      { id: "t2", action: "backup" },
      { id: "t2a", action: "delay", payload: "30" },
      { id: "t3", action: "restart" },
    ],
    cron: "0 4 * * *",
    nextRun: "Tomorrow 04:00",
    enabled: true,
    lastRun: "Today 04:00"
  },
  {
    id: "sch-2",
    name: "Hourly Backup",
    tasks: [
      { id: "t4", action: "backup" },
    ],
    cron: "0 * * * *",
    nextRun: "In 45 minutes",
    enabled: true,
    lastRun: "15 minutes ago"
  },
  {
    id: "sch-3",
    name: "Weekend Startup",
    tasks: [
      { id: "t5", action: "start" },
      { id: "t5a", action: "delay", payload: "10" },
      { id: "t6", action: "message", payload: "Server is now online! Welcome back." },
    ],
    cron: "0 8 * * 6,0",
    nextRun: "Saturday 08:00",
    enabled: true
  },
  {
    id: "sch-4",
    name: "Weekday Shutdown",
    tasks: [
      { id: "t7", action: "message", payload: "Server shutting down for the night." },
      { id: "t7a", action: "delay", payload: "60" },
      { id: "t8", action: "stop" },
    ],
    cron: "0 2 * * 1-5",
    nextRun: "Monday 02:00",
    enabled: false
  },
];

const actionOptions: { value: ActionType; label: string; icon: JSX.Element }[] = [
  { value: "start", label: "Start Server", icon: <BsPlayFill className="w-4 h-4 text-green-500" /> },
  { value: "stop", label: "Stop Server", icon: <BsStopFill className="w-4 h-4 text-red-500" /> },
  { value: "restart", label: "Restart Server", icon: <BsArrowRepeat className="w-4 h-4 text-amber-500" /> },
  { value: "backup", label: "Create Backup", icon: <BsCloudUpload className="w-4 h-4 text-blue-500" /> },
  { value: "command", label: "Run Command", icon: <BsTerminal className="w-4 h-4 text-purple-500" /> },
  { value: "message", label: "Send Message", icon: <BsChatDots className="w-4 h-4 text-cyan-500" /> },
  { value: "delay", label: "Wait/Delay", icon: <BsClock className="w-4 h-4 text-zinc-400" /> },
];

const SchedulesPage = (): JSX.Element | null => {
  const params = useParams();
  const serverId = params.id as string;
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formTasks, setFormTasks] = useState<ScheduleTask[]>([]);
  const [formCron, setFormCron] = useState("0 4 * * *");
  const [formEnabled, setFormEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  const resetForm = () => {
    setFormName("");
    setFormTasks([]);
    setFormCron("0 4 * * *");
    setFormEnabled(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormName(schedule.name);
    setFormTasks([...schedule.tasks]);
    setFormCron(schedule.cron);
    setFormEnabled(schedule.enabled);
    setEditModalOpen(true);
  };

  const openDeleteModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDeleteModalOpen(true);
  };

  const MAX_TASKS = 12;

  const addTask = (action: ActionType) => {
    if (formTasks.length >= MAX_TASKS) return;
    const newTask: ScheduleTask = {
      id: `task-${Date.now()}`,
      action,
      payload: action === "delay" ? "30" : (action === "command" || action === "message") ? "" : undefined,
    };
    setFormTasks(prev => [...prev, newTask]);
  };

  const removeTask = (taskId: string) => {
    setFormTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTaskPayload = (taskId: string, payload: string) => {
    setFormTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, payload } : t
    ));
  };

  const handleCreate = () => {
    const newSchedule: Schedule = {
      id: `sch-${Date.now()}`,
      name: formName,
      tasks: formTasks,
      cron: formCron,
      nextRun: "Calculating...",
      enabled: formEnabled,
    };
    setSchedules(prev => [...prev, newSchedule]);
    setCreateModalOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedSchedule) return;
    setSchedules(prev => prev.map(s =>
      s.id === selectedSchedule.id
        ? {
            ...s,
            name: formName,
            tasks: formTasks,
            cron: formCron,
            enabled: formEnabled,
          }
        : s
    ));
    setEditModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDelete = () => {
    if (!selectedSchedule) return;
    setSchedules(prev => prev.filter(s => s.id !== selectedSchedule.id));
    setDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const getActionIcon = (action: ActionType) => {
    const option = actionOptions.find(o => o.value === action);
    return option?.icon || null;
  };

  const getActionLabel = (action: ActionType) => {
    const option = actionOptions.find(o => o.value === action);
    return option?.label || action;
  };

  const formatDelay = (seconds: string | number): string => {
    const secs = typeof seconds === "string" ? parseInt(seconds) : seconds;
    if (isNaN(secs) || secs <= 0) return "0s";
    if (secs < 60) return `${secs}s`;
    if (secs < 3600) {
      const mins = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
    }
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const isFormValid = formName.trim() !== "" && formCron.trim() !== "" && formTasks.length > 0 &&
    formTasks.every(t => {
      if (t.action === "command" || t.action === "message") {
        return t.payload && t.payload.trim() !== "";
      }
      if (t.action === "delay") {
        return t.payload && !isNaN(parseInt(t.payload)) && parseInt(t.payload) > 0;
      }
      return true;
    });

  return (
    <div className={cn(
      "min-h-full transition-colors relative",
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
                  SCHEDULES
                </h1>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Server {serverId} • {schedules.filter(s => s.enabled).length} active schedules
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
                <span className="text-xs uppercase tracking-wider">New Schedule</span>
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

          {/* Schedule List */}
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={cn(
                  "relative p-6 border transition-all",
                  isDark
                    ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
                    : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300",
                  !schedule.enabled && "opacity-50"
                )}
              >
                {/* Corner decorations */}
                <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={cn(
                        "text-sm font-medium uppercase tracking-wider",
                        isDark ? "text-zinc-100" : "text-zinc-800"
                      )}>
                        {schedule.name}
                      </h3>
                      <span className={cn(
                        "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                        isDark ? "border-zinc-600 text-zinc-400" : "border-zinc-400 text-zinc-600"
                      )}>
                        {schedule.tasks.length} task{schedule.tasks.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Task list preview */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {schedule.tasks.map((task, index) => (
                        <div
                          key={task.id}
                          className={cn(
                            "flex items-center gap-1.5 px-2 py-1 border text-xs",
                            task.action === "delay"
                              ? isDark ? "border-zinc-700/50 bg-zinc-800/30" : "border-zinc-200/50 bg-zinc-50/50"
                              : isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50"
                          )}
                        >
                          <span className={cn(
                            "text-[10px]",
                            isDark ? "text-zinc-500" : "text-zinc-400"
                          )}>
                            {index + 1}.
                          </span>
                          {getActionIcon(task.action)}
                          <span className={cn(
                            task.action === "delay"
                              ? isDark ? "text-zinc-500" : "text-zinc-500"
                              : isDark ? "text-zinc-300" : "text-zinc-700"
                          )}>
                            {task.action === "delay" ? `Wait ${formatDelay(task.payload || "0")}` : getActionLabel(task.action)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={cn(
                      "flex items-center gap-4 text-xs",
                      isDark ? "text-zinc-500" : "text-zinc-500"
                    )}>
                      <span className="font-mono">{schedule.cron}</span>
                      <span>•</span>
                      <span>Next: {schedule.nextRun}</span>
                      {schedule.lastRun && (
                        <>
                          <span>•</span>
                          <span>Last: {schedule.lastRun}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                      isDark={isDark}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(schedule)}
                      className={cn(
                        "transition-all p-2",
                        isDark
                          ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                          : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                      )}
                    >
                      <BsPencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(schedule)}
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Schedule Modal */}
      <FormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create Schedule"
        description="Set up a new scheduled task sequence for your server."
        onSubmit={handleCreate}
        submitLabel="Create"
        isDark={isDark}
        isValid={isFormValid}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Schedule Name
            </label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Daily Maintenance"
              className={cn(
                "transition-all",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={cn(
                "text-xs uppercase tracking-wider",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}>
                Tasks ({formTasks.length}/{MAX_TASKS})
              </label>
              {formTasks.length >= MAX_TASKS && (
                <span className={cn(
                  "text-xs",
                  isDark ? "text-amber-400" : "text-amber-600"
                )}>
                  Maximum reached
                </span>
              )}
            </div>

            {/* Task list */}
            {formTasks.length > 0 && (
              <div className={cn(
                "mb-3 border divide-y max-h-64 overflow-y-auto",
                isDark ? "border-zinc-700 divide-zinc-700" : "border-zinc-200 divide-zinc-200"
              )}>
                {formTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3",
                      task.action === "delay"
                        ? isDark ? "bg-zinc-800/30" : "bg-zinc-50/50"
                        : isDark ? "bg-zinc-800/50" : "bg-zinc-50"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-mono w-5 shrink-0",
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    )}>
                      {index + 1}.
                    </span>
                    <div className="shrink-0">
                      {getActionIcon(task.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "text-sm",
                        task.action === "delay"
                          ? isDark ? "text-zinc-400" : "text-zinc-500"
                          : isDark ? "text-zinc-200" : "text-zinc-700"
                      )}>
                        {task.action === "delay" ? "Wait/Delay" : getActionLabel(task.action)}
                      </span>
                      {(task.action === "command" || task.action === "message") && (
                        <Input
                          value={task.payload || ""}
                          onChange={(e) => updateTaskPayload(task.id, e.target.value)}
                          placeholder={task.action === "command" ? "Enter command..." : "Enter message..."}
                          className={cn(
                            "mt-2 text-sm",
                            isDark
                              ? "bg-zinc-900 border-zinc-600 text-zinc-100 placeholder:text-zinc-600"
                              : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                          )}
                        />
                      )}
                      {task.action === "delay" && (
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            value={task.payload || ""}
                            onChange={(e) => updateTaskPayload(task.id, e.target.value)}
                            placeholder="30"
                            min={1}
                            className={cn(
                              "text-sm w-24",
                              isDark
                                ? "bg-zinc-900 border-zinc-600 text-zinc-100 placeholder:text-zinc-600"
                                : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                            )}
                          />
                          <span className={cn(
                            "text-xs",
                            isDark ? "text-zinc-500" : "text-zinc-400"
                          )}>
                            seconds {task.payload && parseInt(task.payload) > 0 && `(${formatDelay(task.payload)})`}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className={cn(
                        "p-1.5 shrink-0 transition-colors",
                        isDark
                          ? "text-zinc-500 hover:text-red-400"
                          : "text-zinc-400 hover:text-red-500"
                      )}
                    >
                      <BsX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add task buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {actionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => addTask(opt.value)}
                  disabled={formTasks.length >= MAX_TASKS}
                  className={cn(
                    "flex items-center gap-2 p-2 border transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed",
                    isDark
                      ? "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800 disabled:hover:border-zinc-300 disabled:hover:text-zinc-600"
                  )}
                >
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Cron Expression
            </label>
            <Input
              value={formCron}
              onChange={(e) => setFormCron(e.target.value)}
              placeholder="0 4 * * *"
              className={cn(
                "transition-all font-mono",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Format: minute hour day month weekday
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label className={cn(
              "text-xs uppercase tracking-wider",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Enabled
            </label>
            <Switch
              checked={formEnabled}
              onCheckedChange={setFormEnabled}
              isDark={isDark}
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Schedule Modal */}
      <FormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Edit Schedule"
        description={`Modify "${selectedSchedule?.name}" schedule.`}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
        isDark={isDark}
        isValid={isFormValid}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Schedule Name
            </label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Daily Maintenance"
              className={cn(
                "transition-all",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={cn(
                "text-xs uppercase tracking-wider",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}>
                Tasks ({formTasks.length}/{MAX_TASKS})
              </label>
              {formTasks.length >= MAX_TASKS && (
                <span className={cn(
                  "text-xs",
                  isDark ? "text-amber-400" : "text-amber-600"
                )}>
                  Maximum reached
                </span>
              )}
            </div>

            {/* Task list */}
            {formTasks.length > 0 && (
              <div className={cn(
                "mb-3 border divide-y max-h-64 overflow-y-auto",
                isDark ? "border-zinc-700 divide-zinc-700" : "border-zinc-200 divide-zinc-200"
              )}>
                {formTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3",
                      task.action === "delay"
                        ? isDark ? "bg-zinc-800/30" : "bg-zinc-50/50"
                        : isDark ? "bg-zinc-800/50" : "bg-zinc-50"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-mono w-5 shrink-0",
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    )}>
                      {index + 1}.
                    </span>
                    <div className="shrink-0">
                      {getActionIcon(task.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "text-sm",
                        task.action === "delay"
                          ? isDark ? "text-zinc-400" : "text-zinc-500"
                          : isDark ? "text-zinc-200" : "text-zinc-700"
                      )}>
                        {task.action === "delay" ? "Wait/Delay" : getActionLabel(task.action)}
                      </span>
                      {(task.action === "command" || task.action === "message") && (
                        <Input
                          value={task.payload || ""}
                          onChange={(e) => updateTaskPayload(task.id, e.target.value)}
                          placeholder={task.action === "command" ? "Enter command..." : "Enter message..."}
                          className={cn(
                            "mt-2 text-sm",
                            isDark
                              ? "bg-zinc-900 border-zinc-600 text-zinc-100 placeholder:text-zinc-600"
                              : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                          )}
                        />
                      )}
                      {task.action === "delay" && (
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            value={task.payload || ""}
                            onChange={(e) => updateTaskPayload(task.id, e.target.value)}
                            placeholder="30"
                            min={1}
                            className={cn(
                              "text-sm w-24",
                              isDark
                                ? "bg-zinc-900 border-zinc-600 text-zinc-100 placeholder:text-zinc-600"
                                : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                            )}
                          />
                          <span className={cn(
                            "text-xs",
                            isDark ? "text-zinc-500" : "text-zinc-400"
                          )}>
                            seconds {task.payload && parseInt(task.payload) > 0 && `(${formatDelay(task.payload)})`}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className={cn(
                        "p-1.5 shrink-0 transition-colors",
                        isDark
                          ? "text-zinc-500 hover:text-red-400"
                          : "text-zinc-400 hover:text-red-500"
                      )}
                    >
                      <BsX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add task buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {actionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => addTask(opt.value)}
                  disabled={formTasks.length >= MAX_TASKS}
                  className={cn(
                    "flex items-center gap-2 p-2 border transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed",
                    isDark
                      ? "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800 disabled:hover:border-zinc-300 disabled:hover:text-zinc-600"
                  )}
                >
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Cron Expression
            </label>
            <Input
              value={formCron}
              onChange={(e) => setFormCron(e.target.value)}
              placeholder="0 4 * * *"
              className={cn(
                "transition-all font-mono",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Format: minute hour day month weekday
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label className={cn(
              "text-xs uppercase tracking-wider",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Enabled
            </label>
            <Switch
              checked={formEnabled}
              onCheckedChange={setFormEnabled}
              isDark={isDark}
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Schedule Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Schedule"
        description={`Are you sure you want to delete "${selectedSchedule?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
        isDark={isDark}
      />
    </div>
  );
};

export default SchedulesPage;
