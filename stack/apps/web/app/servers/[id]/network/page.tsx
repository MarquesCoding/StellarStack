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
import { BsSun, BsMoon, BsPlus, BsTrash, BsGlobe, BsHddNetwork } from "react-icons/bs";

interface PortAllocation {
  id: string;
  port: number;
  protocol: "tcp" | "udp" | "both";
  description: string;
  primary: boolean;
}

interface Subdomain {
  id: string;
  subdomain: string;
  domain: string;
  targetPort: number;
  ssl: boolean;
}

const mockPorts: PortAllocation[] = [
  { id: "port-1", port: 25565, protocol: "tcp", description: "Minecraft Server", primary: true },
  { id: "port-2", port: 25566, protocol: "udp", description: "Voice Chat", primary: false },
  { id: "port-3", port: 8123, protocol: "tcp", description: "Dynmap Web", primary: false },
];

const mockSubdomains: Subdomain[] = [
  { id: "sub-1", subdomain: "mc", domain: "stellarstack.app", targetPort: 25565, ssl: true },
  { id: "sub-2", subdomain: "map", domain: "stellarstack.app", targetPort: 8123, ssl: true },
];

type Protocol = "tcp" | "udp" | "both";

const protocolOptions: { value: Protocol; label: string }[] = [
  { value: "tcp", label: "TCP" },
  { value: "udp", label: "UDP" },
  { value: "both", label: "Both" },
];

const NetworkPage = (): JSX.Element | null => {
  const params = useParams();
  const serverId = params.id as string;
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [ports, setPorts] = useState<PortAllocation[]>(mockPorts);
  const [subdomains, setSubdomains] = useState<Subdomain[]>(mockSubdomains);

  // Modal states
  const [addPortModalOpen, setAddPortModalOpen] = useState(false);
  const [deletePortModalOpen, setDeletePortModalOpen] = useState(false);
  const [addSubdomainModalOpen, setAddSubdomainModalOpen] = useState(false);
  const [deleteSubdomainModalOpen, setDeleteSubdomainModalOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<PortAllocation | null>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<Subdomain | null>(null);

  // Port form states
  const [portProtocol, setPortProtocol] = useState<Protocol>("tcp");
  const [portDescription, setPortDescription] = useState("");

  // Subdomain form states
  const [subdomainName, setSubdomainName] = useState("");
  const [subdomainTargetPort, setSubdomainTargetPort] = useState<string>("");
  const [subdomainSsl, setSubdomainSsl] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  // Generate a random port between 30000 and 40000 for demo purposes
  const generateRandomPort = () => {
    const existingPorts = ports.map(p => p.port);
    let newPort: number;
    do {
      newPort = Math.floor(Math.random() * 10000) + 30000;
    } while (existingPorts.includes(newPort));
    return newPort;
  };

  const resetPortForm = () => {
    setPortProtocol("tcp");
    setPortDescription("");
  };

  const resetSubdomainForm = () => {
    setSubdomainName("");
    setSubdomainTargetPort("");
    setSubdomainSsl(true);
  };

  const openAddPortModal = () => {
    resetPortForm();
    setAddPortModalOpen(true);
  };

  const openDeletePortModal = (port: PortAllocation) => {
    setSelectedPort(port);
    setDeletePortModalOpen(true);
  };

  const openAddSubdomainModal = () => {
    resetSubdomainForm();
    // Default to primary port or first port
    const defaultPort = ports.find(p => p.primary) || ports[0];
    if (defaultPort) {
      setSubdomainTargetPort(defaultPort.port.toString());
    }
    setAddSubdomainModalOpen(true);
  };

  const openDeleteSubdomainModal = (sub: Subdomain) => {
    setSelectedSubdomain(sub);
    setDeleteSubdomainModalOpen(true);
  };

  const handleAddPort = () => {
    const newPort: PortAllocation = {
      id: `port-${Date.now()}`,
      port: generateRandomPort(),
      protocol: portProtocol,
      description: portDescription || "Custom Port",
      primary: false,
    };
    setPorts(prev => [...prev, newPort]);
    setAddPortModalOpen(false);
    resetPortForm();
  };

  const handleDeletePort = () => {
    if (!selectedPort) return;
    setPorts(prev => prev.filter(p => p.id !== selectedPort.id));
    setDeletePortModalOpen(false);
    setSelectedPort(null);
  };

  const handleAddSubdomain = () => {
    const selectedPortNumber = subdomainTargetPort ? parseInt(subdomainTargetPort) : ports[0]?.port || 0;
    const newSubdomain: Subdomain = {
      id: `sub-${Date.now()}`,
      subdomain: subdomainName.toLowerCase(),
      domain: "stellarstack.app",
      targetPort: selectedPortNumber,
      ssl: subdomainSsl,
    };
    setSubdomains(prev => [...prev, newSubdomain]);
    setAddSubdomainModalOpen(false);
    resetSubdomainForm();
  };

  const handleDeleteSubdomain = () => {
    if (!selectedSubdomain) return;
    setSubdomains(prev => prev.filter(s => s.id !== selectedSubdomain.id));
    setDeleteSubdomainModalOpen(false);
    setSelectedSubdomain(null);
  };

  const isPortValid = true; // Port is auto-assigned, so always valid
  const isSubdomainValid = subdomainName.trim() !== "" && ports.length > 0;

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
                  NETWORK
                </h1>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Server {serverId} • Port allocation & subdomains
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

          {/* Port Allocations Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BsHddNetwork className={cn("w-5 h-5", isDark ? "text-zinc-400" : "text-zinc-600")} />
                <h2 className={cn(
                  "text-sm font-medium uppercase tracking-wider",
                  isDark ? "text-zinc-300" : "text-zinc-700"
                )}>
                  Port Allocations
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openAddPortModal}
                className={cn(
                  "transition-all gap-2",
                  isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                    : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                )}
              >
                <BsPlus className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Add Port</span>
              </Button>
            </div>

            <div className="space-y-3">
              {ports.map((port) => (
                <div
                  key={port.id}
                  className={cn(
                    "relative p-4 border transition-all",
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "text-lg font-mono font-medium",
                        isDark ? "text-zinc-100" : "text-zinc-800"
                      )}>
                        {port.port}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                          isDark ? "border-zinc-600 text-zinc-400" : "border-zinc-400 text-zinc-600"
                        )}>
                          {port.protocol}
                        </span>
                        {port.primary && (
                          <span className={cn(
                            "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                            isDark ? "border-green-500/50 text-green-400" : "border-green-400 text-green-600"
                          )}>
                            Primary
                          </span>
                        )}
                      </div>
                      <span className={cn(
                        "text-sm",
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      )}>
                        {port.description}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={port.primary}
                      onClick={() => openDeletePortModal(port)}
                      className={cn(
                        "transition-all p-2",
                        isDark
                          ? "border-red-900/60 text-red-400/80 hover:text-red-300 hover:border-red-700 disabled:opacity-30"
                          : "border-red-300 text-red-600 hover:text-red-700 hover:border-red-400 disabled:opacity-30"
                      )}
                    >
                      <BsTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subdomains Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BsGlobe className={cn("w-5 h-5", isDark ? "text-zinc-400" : "text-zinc-600")} />
                <h2 className={cn(
                  "text-sm font-medium uppercase tracking-wider",
                  isDark ? "text-zinc-300" : "text-zinc-700"
                )}>
                  Subdomains
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openAddSubdomainModal}
                className={cn(
                  "transition-all gap-2",
                  isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                    : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                )}
              >
                <BsPlus className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Add Subdomain</span>
              </Button>
            </div>

            <div className="space-y-3">
              {subdomains.map((sub) => (
                <div
                  key={sub.id}
                  className={cn(
                    "relative p-4 border transition-all",
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "text-sm font-mono",
                        isDark ? "text-zinc-100" : "text-zinc-800"
                      )}>
                        {sub.subdomain}.{sub.domain}
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.ssl && (
                          <span className={cn(
                            "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                            isDark ? "border-green-500/50 text-green-400" : "border-green-400 text-green-600"
                          )}>
                            SSL
                          </span>
                        )}
                      </div>
                      <span className={cn(
                        "text-sm",
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      )}>
                        → Port {sub.targetPort}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteSubdomainModal(sub)}
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Port Modal */}
      <FormModal
        open={addPortModalOpen}
        onOpenChange={setAddPortModalOpen}
        title="Allocate Port"
        description="A port will be automatically assigned to your server."
        onSubmit={handleAddPort}
        submitLabel="Allocate Port"
        isDark={isDark}
        isValid={isPortValid}
      >
        <div className="space-y-4">
          <div className={cn(
            "p-4 border text-center",
            isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-100 border-zinc-300"
          )}>
            <p className={cn(
              "text-xs uppercase tracking-wider mb-1",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Port Assignment
            </p>
            <p className={cn(
              "text-sm",
              isDark ? "text-zinc-300" : "text-zinc-600"
            )}>
              A random available port will be assigned automatically
            </p>
          </div>
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Protocol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {protocolOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPortProtocol(opt.value)}
                  className={cn(
                    "p-3 text-center border transition-all text-sm",
                    portProtocol === opt.value
                      ? isDark
                        ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                        : "border-zinc-400 bg-zinc-100 text-zinc-900"
                      : isDark
                        ? "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                        : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Description
            </label>
            <Input
              value={portDescription}
              onChange={(e) => setPortDescription(e.target.value)}
              placeholder="e.g., Voice Chat, Query Port, RCON"
              className={cn(
                "transition-all",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Port Modal */}
      <ConfirmationModal
        open={deletePortModalOpen}
        onOpenChange={setDeletePortModalOpen}
        title="Delete Port"
        description={`Are you sure you want to remove port ${selectedPort?.port}? Services using this port will no longer be accessible.`}
        onConfirm={handleDeletePort}
        confirmLabel="Delete"
        variant="danger"
        isDark={isDark}
      />

      {/* Add Subdomain Modal */}
      <FormModal
        open={addSubdomainModalOpen}
        onOpenChange={setAddSubdomainModalOpen}
        title="Add Subdomain"
        description="Create a subdomain pointing to your server."
        onSubmit={handleAddSubdomain}
        submitLabel="Add Subdomain"
        isDark={isDark}
        isValid={isSubdomainValid}
      >
        <div className="space-y-4">
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Subdomain Name
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={subdomainName}
                onChange={(e) => setSubdomainName(e.target.value)}
                placeholder="e.g., play"
                className={cn(
                  "transition-all",
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                    : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                )}
              />
              <span className={cn(
                "text-sm shrink-0",
                isDark ? "text-zinc-500" : "text-zinc-500"
              )}>
                .stellarstack.app
              </span>
            </div>
          </div>
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Target Port
            </label>
            {ports.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {ports.map((port) => (
                  <button
                    key={port.id}
                    type="button"
                    onClick={() => setSubdomainTargetPort(port.port.toString())}
                    className={cn(
                      "p-3 text-left border transition-all",
                      (subdomainTargetPort === port.port.toString() || (!subdomainTargetPort && port.primary))
                        ? isDark
                          ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                          : "border-zinc-400 bg-zinc-100 text-zinc-900"
                        : isDark
                          ? "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                          : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{port.port}</span>
                        <span className={cn(
                          "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                          isDark ? "border-zinc-600 text-zinc-500" : "border-zinc-400 text-zinc-500"
                        )}>
                          {port.protocol}
                        </span>
                        {port.primary && (
                          <span className={cn(
                            "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                            isDark ? "border-green-500/50 text-green-400" : "border-green-400 text-green-600"
                          )}>
                            Primary
                          </span>
                        )}
                      </div>
                      <span className={cn(
                        "text-xs",
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      )}>
                        {port.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={cn(
                "p-4 border text-center",
                isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-100 border-zinc-300"
              )}>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-zinc-400" : "text-zinc-500"
                )}>
                  No ports allocated. Allocate a port first.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className={cn(
              "text-xs uppercase tracking-wider",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Enable SSL
            </label>
            <Switch
              checked={subdomainSsl}
              onCheckedChange={setSubdomainSsl}
              isDark={isDark}
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Subdomain Modal */}
      <ConfirmationModal
        open={deleteSubdomainModalOpen}
        onOpenChange={setDeleteSubdomainModalOpen}
        title="Delete Subdomain"
        description={`Are you sure you want to delete ${selectedSubdomain?.subdomain}.${selectedSubdomain?.domain}? The subdomain will no longer resolve.`}
        onConfirm={handleDeleteSubdomain}
        confirmLabel="Delete"
        variant="danger"
        isDark={isDark}
      />
    </div>
  );
};

export default NetworkPage;
