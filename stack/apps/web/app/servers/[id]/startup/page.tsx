"use client";

import { useState, useEffect, type JSX } from "react";
import { useParams } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { ConfirmationModal } from "@workspace/ui/components/shared/ConfirmationModal";
import { BsSun, BsMoon, BsInfoCircle, BsCheckCircle } from "react-icons/bs";

interface StartupVariable {
  id: string;
  name: string;
  description: string;
  envVariable: string;
  defaultValue: string;
  value: string;
  rules: string;
}

const mockVariables: StartupVariable[] = [
  {
    id: "var-1",
    name: "Server JAR File",
    description: "The name of the server jar file to run",
    envVariable: "SERVER_JAR",
    defaultValue: "server.jar",
    value: "paper-1.20.4.jar",
    rules: "required|regex:/^[\\w.-]+\\.jar$/"
  },
  {
    id: "var-2",
    name: "Max Memory",
    description: "Maximum memory allocation for the JVM",
    envVariable: "MAX_MEMORY",
    defaultValue: "2G",
    value: "4G",
    rules: "required|regex:/^\\d+[MG]$/"
  },
  {
    id: "var-3",
    name: "Min Memory",
    description: "Minimum memory allocation for the JVM",
    envVariable: "MIN_MEMORY",
    defaultValue: "1G",
    value: "1G",
    rules: "required|regex:/^\\d+[MG]$/"
  },
  {
    id: "var-4",
    name: "Java Flags",
    description: "Additional JVM flags for optimization",
    envVariable: "JAVA_FLAGS",
    defaultValue: "-XX:+UseG1GC",
    value: "-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200",
    rules: "nullable|string"
  },
  {
    id: "var-5",
    name: "Server Port",
    description: "The port the server will listen on",
    envVariable: "SERVER_PORT",
    defaultValue: "25565",
    value: "25565",
    rules: "required|numeric|between:1024,65535"
  },
];

const StartupPage = (): JSX.Element | null => {
  const params = useParams();
  const serverId = params.id as string;
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [variables, setVariables] = useState<StartupVariable[]>(mockVariables);
  const [originalVariables, setOriginalVariables] = useState<StartupVariable[]>(mockVariables);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  const handleVariableChange = (id: string, value: string) => {
    setVariables(prev => prev.map(v =>
      v.id === id ? { ...v, value } : v
    ));
    setSaved(false);
  };

  const hasChanges = JSON.stringify(variables) !== JSON.stringify(originalVariables);

  const handleSave = () => {
    setOriginalVariables([...variables]);
    setSaveModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setVariables([...originalVariables]);
  };

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
                  STARTUP PARAMETERS
                </h1>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Server {serverId} • Configure startup variables
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className={cn(
                    "transition-all gap-2",
                    isDark
                      ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                      : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                  )}
                >
                  <span className="text-xs uppercase tracking-wider">Reset</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaveModalOpen(true)}
                disabled={!hasChanges}
                className={cn(
                  "transition-all gap-2",
                  saved
                    ? isDark
                      ? "border-green-500/50 text-green-400"
                      : "border-green-400 text-green-600"
                    : isDark
                      ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40"
                      : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 disabled:opacity-40"
                )}
              >
                {saved ? (
                  <>
                    <BsCheckCircle className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Saved</span>
                  </>
                ) : (
                  <span className="text-xs uppercase tracking-wider">Save Changes</span>
                )}
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

          {/* Startup Command Preview */}
          <div className={cn(
            "relative p-4 border mb-6",
            isDark
              ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
              : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300"
          )}>
            <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

            <label className={cn(
              "text-[10px] font-medium uppercase tracking-wider",
              isDark ? "text-zinc-500" : "text-zinc-400"
            )}>
              Startup Command
            </label>
            <div className={cn(
              "mt-2 p-3 font-mono text-xs border overflow-x-auto",
              isDark ? "bg-zinc-900/50 border-zinc-700/50 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700"
            )}>
              java -Xms{variables.find(v => v.envVariable === "MIN_MEMORY")?.value || "1G"} -Xmx{variables.find(v => v.envVariable === "MAX_MEMORY")?.value || "2G"} {variables.find(v => v.envVariable === "JAVA_FLAGS")?.value} -jar {variables.find(v => v.envVariable === "SERVER_JAR")?.value || "server.jar"} --port {variables.find(v => v.envVariable === "SERVER_PORT")?.value || "25565"}
            </div>
          </div>

          {/* Variables */}
          <div className="space-y-4">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className={cn(
                  "relative p-6 border transition-all",
                  isDark
                    ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
                    : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300"
                )}
              >
                {/* Corner decorations */}
                <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={cn(
                        "text-sm font-medium uppercase tracking-wider",
                        isDark ? "text-zinc-100" : "text-zinc-800"
                      )}>
                        {variable.name}
                      </h3>
                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 border",
                        isDark ? "border-zinc-700 text-zinc-500" : "border-zinc-300 text-zinc-500"
                      )}>
                        {variable.envVariable}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs mb-4",
                      isDark ? "text-zinc-500" : "text-zinc-500"
                    )}>
                      {variable.description}
                    </p>
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 text-sm font-mono border outline-none transition-colors",
                        isDark
                          ? "bg-zinc-900/50 border-zinc-700/50 text-zinc-200 focus:border-zinc-500 placeholder:text-zinc-600"
                          : "bg-white border-zinc-300 text-zinc-800 focus:border-zinc-400 placeholder:text-zinc-400"
                      )}
                      placeholder={variable.defaultValue}
                    />
                    <div className={cn(
                      "flex items-center gap-1 mt-2 text-[10px]",
                      isDark ? "text-zinc-600" : "text-zinc-400"
                    )}>
                      <BsInfoCircle className="w-3 h-3" />
                      <span>Default: {variable.defaultValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        title="Save Changes"
        description="Are you sure you want to save these startup parameter changes? The server will need to be restarted for changes to take effect."
        onConfirm={handleSave}
        confirmLabel="Save"
        isDark={isDark}
      />
    </div>
  );
};

export default StartupPage;
