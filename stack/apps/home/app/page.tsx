"use client";

import { useState, useEffect, useRef, type JSX } from "react";
import Link from "next/link";
import { useTheme as useNextTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@workspace/ui/components/tooltip";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import {
  CpuCard,
  UsageMetricCard,
  NetworkUsageCard,
  InstanceNameCard,
  ContainerControlsCard,
} from "@workspace/ui/components/shared/DashboardCards";
import { Console } from "@workspace/ui/components/shared/Console";
import { DragDropGrid, GridItem } from "@workspace/ui/components/shared/DragDropGrid";
import type { GridItemConfig } from "@workspace/ui/components/shared/DragDropGrid";
import {
  BsSun,
  BsMoon,
  BsServer,
  BsShieldCheck,
  BsLightningCharge,
  BsGlobe,
  BsGithub,
  BsDiscord,
  BsTwitterX,
  BsArrowRight,
  BsCheckCircle,
  BsTerminal,
  BsDatabase,
  BsHddNetwork,
  BsPeople,
  BsBuilding,
  BsPersonWorkspace,
  BsCodeSlash,
  BsImage,
  BsShieldLock,
  BsKey,
  BsLock,
  BsFileEarmarkLock,
} from "react-icons/bs";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiTailwindcss,
  SiHono,
  SiRedis,
  SiNodedotjs,
  SiTurborepo,
  SiRust,
  SiStorybook,
} from "react-icons/si";

// Technology stack
const technologies = [
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "Prisma", Icon: SiPrisma },
  { name: "Docker", Icon: SiDocker },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "Hono", Icon: SiHono },
  { name: "Redis", Icon: SiRedis },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Turborepo", Icon: SiTurborepo },
  { name: "Rust", Icon: SiRust },
  { name: "Storybook", Icon: SiStorybook },
];

const features = [
  {
    icon: BsServer,
    title: "Multi-Game Support",
    description: "Deploy and manage servers for Minecraft, Rust, Valheim, ARK, and dozens more games with pre-configured blueprints.",
  },
  {
    icon: BsShieldCheck,
    title: "Enterprise Security",
    description: "Role-based access control, API key management, 2FA support, and comprehensive audit logging.",
  },
  {
    icon: BsLightningCharge,
    title: "Instant Deployment",
    description: "Spin up new game servers in seconds with automated provisioning and configuration.",
  },
  {
    icon: BsGlobe,
    title: "Global Infrastructure",
    description: "Deploy nodes across multiple regions for low-latency gaming experiences worldwide.",
  },
  {
    icon: BsTerminal,
    title: "Real-time Console",
    description: "Full console access with WebSocket-powered real-time log streaming and command execution.",
  },
  {
    icon: BsDatabase,
    title: "Database Management",
    description: "Built-in MySQL, PostgreSQL, and MongoDB database provisioning for game servers.",
  },
];

const highlights = [
  "Open Source & Self-Hosted",
  "Docker-based Isolation",
  "Automated Backups",
  "Custom Blueprints",
  "REST API & Webhooks",
  "White-label Ready",
];

// Target users from architecture
const targetUsers = [
  {
    icon: BsBuilding,
    title: "Hosting Providers",
    description: "Run a game server hosting business with full control over infrastructure and customer management.",
  },
  {
    icon: BsPeople,
    title: "Gaming Communities",
    description: "Self-host servers for your clan or guild members with role-based permissions and access control.",
  },
  {
    icon: BsPersonWorkspace,
    title: "Individual Gamers",
    description: "Manage personal game servers across multiple machines from a single, unified dashboard.",
  },
  {
    icon: BsCodeSlash,
    title: "Developers",
    description: "Test and deploy game servers during development with instant provisioning and real-time logs.",
  },
];

// Architecture highlights
const architectureFeatures = [
  {
    title: "Control Plane",
    description: "Next.js frontend + Hono API + PostgreSQL + Redis running on your central server.",
  },
  {
    title: "Multi-Node Support",
    description: "Connect unlimited nodes (dedicated servers, VPS, home machines) via Rust daemons.",
  },
  {
    title: "Real-time Events",
    description: "Redis pub/sub for instant status updates, metrics streaming, and live console access.",
  },
  {
    title: "Zero-Trust Security",
    description: "mTLS between components, signed JWT tokens for console access, and comprehensive audit logging.",
  },
];

// Security features
const securityFeatures = [
  {
    icon: BsKey,
    title: "Bcrypt Password Hashing",
    description: "Industry-standard bcrypt algorithm with adaptive cost factor for secure password storage.",
  },
  {
    icon: BsLock,
    title: "AES-256-CBC Encryption",
    description: "Military-grade encryption for sensitive data at rest, including API tokens and secrets.",
  },
  {
    icon: BsShieldLock,
    title: "HTTPS Everywhere",
    description: "TLS 1.3 support out of the box with automatic certificate management via Caddy.",
  },
  {
    icon: BsFileEarmarkLock,
    title: "mTLS Communication",
    description: "Mutual TLS authentication between control plane and daemon nodes for zero-trust security.",
  },
];

// Security layers
const securityLayers = [
  { layer: "Edge", items: ["DDoS Protection", "WAF Rules", "Rate Limiting", "Bot Protection"] },
  { layer: "Application", items: ["Authentication", "RBAC", "Input Validation", "CSRF Protection"] },
  { layer: "Infrastructure", items: ["Network Segmentation", "Firewall Rules", "Encrypted Storage", "Audit Logging"] },
  { layer: "Container", items: ["Resource Limits", "Network Isolation", "No Privileged Mode", "Seccomp Profiles"] },
];

// Initial sample server data
const initialServerData = {
  name: "US-WEST-MC-01",
  cpu: {
    usage: { percentage: 74, history: [45, 52, 48, 55, 62, 58, 65, 72, 68, 75, 70, 73, 78, 82, 76, 79, 85, 80, 77, 74] },
    cores: 8,
    frequency: 3.6,
  },
  memory: {
    usage: { percentage: 88, history: [60, 62, 65, 63, 68, 70, 72, 75, 73, 78, 76, 79, 82, 80, 85, 83, 87, 84, 86, 88] },
    used: 14.1,
    total: 16,
    type: "DDR4",
  },
  disk: {
    usage: { percentage: 51, history: [42, 42, 43, 43, 44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 49, 49, 50, 50, 51, 51] },
    used: 51,
    total: 100,
    type: "NVMe SSD",
  },
  network: {
    download: 340,
    upload: 165,
    downloadHistory: [120, 145, 130, 180, 165, 200, 175, 220, 190, 240, 210, 260, 230, 280, 250, 300, 270, 320, 290, 340],
    uploadHistory: [45, 52, 48, 65, 58, 72, 62, 85, 70, 95, 78, 105, 85, 120, 92, 135, 100, 150, 110, 165],
  },
  networkConfig: {
    publicIp: "45.33.128.72",
    privateIp: "192.168.1.100",
    openPorts: [{ port: 25565, protocol: "TCP" }, { port: 25575, protocol: "TCP" }],
    macAddress: "00:1A:2B:3C:4D:5E",
  },
  node: {
    id: "node-us-west-1",
    name: "US West 1",
    location: "Los Angeles, CA",
    region: "us-west",
    zone: "us-west-1a",
    provider: "Hetzner",
  },
};

// Grid items config for the landing page preview
const previewGridItems: GridItemConfig[] = [
  { i: "instance-name", size: "xxs-wide", minSize: "xxs-wide", maxSize: "xxs-wide" },
  { i: "container-controls", size: "xxs-wide", minSize: "xxs-wide", maxSize: "xxs-wide" },
  { i: "cpu", size: "xxs", minSize: "xxs", maxSize: "lg" },
  { i: "ram", size: "xxs", minSize: "xxs", maxSize: "sm" },
  { i: "disk", size: "xxs", minSize: "xxs", maxSize: "sm" },
  { i: "network-usage", size: "xxs", minSize: "xxs", maxSize: "sm" },
  { i: "console", size: "xl", minSize: "md", maxSize: "xxl" },
];

// Sample console messages
const sampleConsoleMessages = [
  "Server tick took 48ms",
  "Saving world chunks...",
  "World saved successfully",
  "Player Steve moved to chunk [12, -5]",
  "Entity count: 847",
  "Memory usage: 2.4GB / 4GB",
  "TPS: 19.8",
  "Autosave completed in 234ms",
  "Player Alex joined the game",
  "Player Steve: Hello everyone!",
  "Loaded 24 chunks for player Alex",
  "Garbage collection freed 128MB",
  "Processing 12 pending block updates",
  "Weather changed to rain",
  "Player Steve earned achievement [Getting Wood]",
];

interface ConsoleLine {
  id: string;
  timestamp: number;
  message: string;
  level: "info" | "error" | "default";
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

// Animated section wrapper
const AnimatedSection = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = (): JSX.Element | null => {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [serverData, setServerData] = useState(initialServerData);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([
    { id: "1", timestamp: Date.now() - 5000, message: "Server started on port 25565", level: "info" },
    { id: "2", timestamp: Date.now() - 4000, message: "Loading world \"survival\"...", level: "default" },
    { id: "3", timestamp: Date.now() - 3000, message: "Done! Server ready for connections", level: "info" },
    { id: "4", timestamp: Date.now() - 2000, message: "Player \"Steve\" joined the game", level: "default" },
  ]);
  const lineIdRef = useRef(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Randomly update server data and add console lines
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setServerData((prev) => {
        const newCpu = Math.max(20, Math.min(95, prev.cpu.usage.percentage + (Math.random() - 0.5) * 10));
        const newRam = Math.max(40, Math.min(95, prev.memory.usage.percentage + (Math.random() - 0.5) * 8));
        const newDisk = Math.max(30, Math.min(80, prev.disk.usage.percentage + (Math.random() - 0.3) * 2));
        const newDownload = Math.max(50, Math.min(500, prev.network.download + (Math.random() - 0.5) * 100));
        const newUpload = Math.max(20, Math.min(250, prev.network.upload + (Math.random() - 0.5) * 50));

        return {
          ...prev,
          cpu: {
            ...prev.cpu,
            usage: {
              percentage: Math.round(newCpu),
              history: [...prev.cpu.usage.history.slice(1), Math.round(newCpu)],
            },
          },
          memory: {
            ...prev.memory,
            usage: {
              percentage: Math.round(newRam),
              history: [...prev.memory.usage.history.slice(1), Math.round(newRam)],
            },
          },
          disk: {
            ...prev.disk,
            usage: {
              percentage: Math.round(newDisk),
              history: [...prev.disk.usage.history.slice(1), Math.round(newDisk)],
            },
          },
          network: {
            ...prev.network,
            download: Math.round(newDownload),
            upload: Math.round(newUpload),
            downloadHistory: [...prev.network.downloadHistory.slice(1), Math.round(newDownload)],
            uploadHistory: [...prev.network.uploadHistory.slice(1), Math.round(newUpload)],
          },
        };
      });

      // Add a new console line randomly
      if (Math.random() > 0.3) {
        const randomMessage = sampleConsoleMessages[Math.floor(Math.random() * sampleConsoleMessages.length)] ?? "Server tick completed";
        const newLine: ConsoleLine = {
          id: String(lineIdRef.current++),
          timestamp: Date.now(),
          message: randomMessage,
          level: Math.random() > 0.9 ? "info" : "default",
        };
        setConsoleLines((prev) => [...prev.slice(-50), newLine]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [mounted]);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  return (
    <div className={cn(
      "min-h-svh transition-colors relative scroll-smooth",
      isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
    )}>
      <AnimatedBackground isDark={isDark} />
      <FloatingDots isDark={isDark} count={20} />

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md",
        isDark
          ? "bg-[#0b0b0a]/80 border-zinc-800"
          : "bg-[#f5f5f4]/80 border-zinc-200"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className={cn(
            "text-lg font-light tracking-[0.2em]",
            isDark ? "text-zinc-100" : "text-zinc-800"
          )}>
            STELLARSTACK
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className={cn(
                "text-xs uppercase tracking-wider transition-colors",
                isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
              )}>
                Features
              </a>
              <a href="#security" className={cn(
                "text-xs uppercase tracking-wider transition-colors",
                isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
              )}>
                Security
              </a>
              <a href="#tech" className={cn(
                "text-xs uppercase tracking-wider transition-colors",
                isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
              )}>
                Tech Stack
              </a>
              <a
                href="https://github.com/stellarstack/stellarstack"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-xs uppercase tracking-wider transition-colors flex items-center gap-2",
                  isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                <BsGithub className="w-4 h-4" />
                GitHub
              </a>
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge - Git Commit Hash */}
            <motion.a
              href="https://github.com/stellarstack/stellarstack/commit/6170dde"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 border mb-8 transition-colors",
                isDark
                  ? "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                  : "border-zinc-300 bg-white/50 text-zinc-600 hover:border-zinc-400 hover:text-zinc-700"
              )}
            >
              <BsGithub className="w-4 h-4" />
              <span className="text-xs font-mono tracking-wider">6170dde</span>
            </motion.a>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extralight tracking-tight leading-[1.1] mb-6"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, #ffffff 0%, #a1a1aa 50%, #71717a 100%)"
                    : "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #52525b 100%)",
                }}
              >
                Deploy Game Servers
              </span>
              <br />
              <span
                className="font-light bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, #a1a1aa 0%, #71717a 50%, #52525b 100%)"
                    : "linear-gradient(135deg, #52525b 0%, #71717a 50%, #a1a1aa 100%)",
                }}
              >
                in Seconds
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={cn(
                "text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}
            >
              The modern, open-source game server hosting panel. Deploy, manage, and scale
              game servers with an intuitive interface built for developers and hosting providers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <a href="https://docs.stellarstack.app" target="_blank" rel="noopener noreferrer">
                <Button
                  className={cn(
                    "text-sm uppercase tracking-wider px-8 py-6 gap-2 transition-all hover:scale-[1.02]",
                    isDark
                      ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                      : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                  )}
                >
                  Read the Docs
                  <BsArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a
                href="https://github.com/stellarstack/stellarstack"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className={cn(
                    "text-sm uppercase tracking-wider px-8 py-6 gap-2 transition-all hover:scale-[1.02]",
                    isDark
                      ? "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/50"
                      : "border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-white"
                  )}
                >
                  <BsGithub className="w-4 h-4" />
                  View on GitHub
                </Button>
              </a>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            >
              {highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    isDark ? "text-zinc-500" : "text-zinc-500"
                  )}
                >
                  <BsCheckCircle className={cn(
                    "w-4 h-4",
                    isDark ? "text-green-500" : "text-green-600"
                  )} />
                  {highlight}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mt-20 mx-auto max-w-7xl"
          >
            {/* Floating Interactive Hint */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <div className={cn(
                "relative px-4 py-2 border backdrop-blur-sm",
                isDark
                  ? "border-zinc-700 bg-zinc-900/90 text-zinc-300"
                  : "border-zinc-300 bg-white/90 text-zinc-700"
              )}>
                {/* Corner accents */}
                <div className={cn("absolute -top-px -left-px w-2 h-2 border-t border-l", isDark ? "border-green-500" : "border-green-600")} />
                <div className={cn("absolute -top-px -right-px w-2 h-2 border-t border-r", isDark ? "border-green-500" : "border-green-600")} />
                <div className={cn("absolute -bottom-px -left-px w-2 h-2 border-b border-l", isDark ? "border-green-500" : "border-green-600")} />
                <div className={cn("absolute -bottom-px -right-px w-2 h-2 border-b border-r", isDark ? "border-green-500" : "border-green-600")} />

                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className={cn(
                      "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                      isDark ? "bg-green-400" : "bg-green-500"
                    )} />
                    <span className={cn(
                      "relative inline-flex rounded-full h-2 w-2",
                      isDark ? "bg-green-500" : "bg-green-600"
                    )} />
                  </span>
                  <span className="text-xs uppercase tracking-wider font-medium">
                    Interactive Demo
                  </span>
                  <span className={cn("text-xs", isDark ? "text-zinc-500" : "text-zinc-400")}>
                    —
                  </span>
                  <span className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-500")}>
                    Drag cards & resize
                  </span>
                </div>

                {/* Animated arrow pointing down */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    className={isDark ? "text-green-500" : "text-green-600"}
                    fill="currentColor"
                  >
                    <path d="M6 8L0 0h12L6 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Preview Container */}
            <div className={cn(
              "relative border overflow-hidden",
              isDark
                ? "border-zinc-800 bg-zinc-900/50 shadow-2xl shadow-black/50"
                : "border-zinc-200 bg-white shadow-2xl shadow-zinc-400/20"
            )}>
            {/* Window Controls */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-3 border-b",
              isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50"
            )}>
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className={cn(
                "ml-4 text-xs",
                isDark ? "text-zinc-500" : "text-zinc-400"
              )}>
                app.stellarstack.app/servers
              </span>
            </div>
            {/* Dashboard Preview with Actual Components - matches default overview layout */}
            <div className="p-6">
              <DragDropGrid
                className="w-full"
                items={previewGridItems}
                allItems={previewGridItems}
                rowHeight={50}
                gap={16}
                isEditing={true}
                isDark={isDark}
                isDroppable={false}
              >
                <div key="instance-name" className="h-full">
                  <GridItem itemId="instance-name" showRemoveHandle={false}>
                    <InstanceNameCard itemId="instance-name" isDark={isDark} instanceName={serverData.name} />
                  </GridItem>
                </div>

                <div key="container-controls" className="h-full">
                  <GridItem itemId="container-controls" showRemoveHandle={false}>
                    <ContainerControlsCard
                      itemId="container-controls"
                      isDark={isDark}
                      isOffline={false}
                      status="running"
                      onStart={() => {}}
                      onStop={() => {}}
                      onKill={() => {}}
                      onRestart={() => {}}
                      labels={{ start: "Start", stop: "Stop", kill: "Kill", restart: "Restart" }}
                    />
                  </GridItem>
                </div>

                <div key="cpu" className="h-full">
                  <GridItem itemId="cpu" showRemoveHandle={false}>
                    <CpuCard
                      itemId="cpu"
                      percentage={serverData.cpu.usage.percentage}
                      details={[`${serverData.cpu.cores} CORES`, `${serverData.cpu.frequency} GHz`]}
                      history={serverData.cpu.usage.history}
                      isDark={isDark}
                      isOffline={false}
                      labels={{ title: "CPU", coreUsage: "Core Usage", cores: "Cores" }}
                    />
                  </GridItem>
                </div>

                <div key="ram" className="h-full">
                  <GridItem itemId="ram" showRemoveHandle={false}>
                    <UsageMetricCard
                      itemId="ram"
                      percentage={serverData.memory.usage.percentage}
                      details={[`${serverData.memory.used} / ${serverData.memory.total} GB`, serverData.memory.type]}
                      history={serverData.memory.usage.history}
                      isDark={isDark}
                      isOffline={false}
                      labels={{ title: "RAM" }}
                    />
                  </GridItem>
                </div>

                <div key="disk" className="h-full">
                  <GridItem itemId="disk" showRemoveHandle={false}>
                    <UsageMetricCard
                      itemId="disk"
                      percentage={serverData.disk.usage.percentage}
                      details={[`${serverData.disk.used} / ${serverData.disk.total} GB`, serverData.disk.type]}
                      history={serverData.disk.usage.history}
                      isDark={isDark}
                      isOffline={false}
                      labels={{ title: "DISK" }}
                    />
                  </GridItem>
                </div>

                <div key="network-usage" className="h-full">
                  <GridItem itemId="network-usage" showRemoveHandle={false}>
                    <NetworkUsageCard
                      itemId="network-usage"
                      download={serverData.network.download}
                      upload={serverData.network.upload}
                      downloadHistory={serverData.network.downloadHistory}
                      uploadHistory={serverData.network.uploadHistory}
                      isDark={isDark}
                      isOffline={false}
                      labels={{ title: "NETWORK", download: "Download", upload: "Upload" }}
                    />
                  </GridItem>
                </div>

                <div key="console" className="h-full">
                  <GridItem itemId="console" showRemoveHandle={false}>
                    <Console lines={consoleLines} isDark={isDark} isOffline={false} />
                  </GridItem>
                </div>
              </DragDropGrid>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className={cn(
              "text-3xl md:text-5xl font-extralight tracking-tight mb-4",
              isDark ? "text-zinc-100" : "text-zinc-900"
            )}>
              Everything You Need
            </h2>
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              A complete solution for game server hosting with powerful features out of the box.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="h-full">
              <div className={cn(
                "relative p-8 border transition-all hover:scale-[1.02] group h-full flex flex-col",
                isDark
                  ? "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg"
              )}>
                {/* Corner decorations */}
                <div className={cn(
                  "absolute top-0 left-0 w-3 h-3 border-t border-l transition-colors",
                  isDark
                    ? "border-zinc-700 group-hover:border-zinc-500"
                    : "border-zinc-300 group-hover:border-zinc-400"
                )} />
                <div className={cn(
                  "absolute top-0 right-0 w-3 h-3 border-t border-r transition-colors",
                  isDark
                    ? "border-zinc-700 group-hover:border-zinc-500"
                    : "border-zinc-300 group-hover:border-zinc-400"
                )} />
                <div className={cn(
                  "absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-colors",
                  isDark
                    ? "border-zinc-700 group-hover:border-zinc-500"
                    : "border-zinc-300 group-hover:border-zinc-400"
                )} />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-colors",
                  isDark
                    ? "border-zinc-700 group-hover:border-zinc-500"
                    : "border-zinc-300 group-hover:border-zinc-400"
                )} />

                <feature.icon className={cn(
                  "w-8 h-8 mb-6 flex-shrink-0",
                  isDark ? "text-zinc-400" : "text-zinc-600"
                )} />
                <h3 className={cn(
                  "text-lg font-medium mb-3 flex-shrink-0",
                  isDark ? "text-zinc-100" : "text-zinc-900"
                )}>
                  {feature.title}
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed flex-grow",
                  isDark ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {feature.description}
                </p>
              </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className={cn(
          "relative py-32 px-6 border-y",
          isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50"
      )}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className={cn(
              "text-3xl md:text-5xl font-extralight tracking-tight mb-4",
              isDark ? "text-zinc-100" : "text-zinc-900"
            )}>
              Built For Everyone
            </h2>
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Whether you&apos;re running a hosting business or managing servers for your gaming community.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetUsers.map((user, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="h-full">
                <div className={cn(
                  "relative p-6 border transition-all hover:scale-[1.02] group h-full flex flex-col text-center",
                  isDark
                    ? "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg"
                )}>
                  <div className={cn(
                    "w-14 h-14 mx-auto mb-4 flex items-center justify-center border",
                    isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50"
                  )}>
                    <user.icon className={cn(
                      "w-7 h-7",
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    )} />
                  </div>
                  <h3 className={cn(
                    "text-base font-medium mb-2 flex-shrink-0",
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  )}>
                    {user.title}
                  </h3>
                  <p className={cn(
                    "text-sm leading-relaxed flex-grow",
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    {user.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <AnimatedSection>
              <h2 className={cn(
                "text-3xl md:text-4xl font-extralight tracking-tight mb-6",
                isDark ? "text-zinc-100" : "text-zinc-900"
              )}>
                Modern Architecture
              </h2>
              <p className={cn(
                "text-lg mb-8 leading-relaxed",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}>
                StellarStack separates your control plane from your game server nodes. Deploy the panel on your central server, then connect unlimited nodes running our lightweight Rust daemon.
              </p>
              <div className="space-y-4">
                {architectureFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={cn(
                      "w-6 h-6 flex-shrink-0 flex items-center justify-center border mt-0.5",
                      isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-white"
                    )}>
                      <BsCheckCircle className={cn(
                        "w-3.5 h-3.5",
                        isDark ? "text-green-500" : "text-green-600"
                      )} />
                    </div>
                    <div>
                      <h4 className={cn(
                        "text-sm font-medium mb-1",
                        isDark ? "text-zinc-200" : "text-zinc-800"
                      )}>
                        {feature.title}
                      </h4>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      )}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Right: Architecture Diagram */}
            <AnimatedSection delay={0.2}>
              <div className={cn(
                "relative p-8 border font-mono text-xs",
                isDark
                  ? "border-zinc-700 bg-zinc-900/50"
                  : "border-zinc-300 bg-white"
              )}>
                {/* Corner decorations */}
                <div className={cn("absolute top-0 left-0 w-3 h-3 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute top-0 right-0 w-3 h-3 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
                <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

                {/* Control Plane Box */}
                <div className={cn(
                  "border p-4 mb-6",
                  isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50"
                )}>
                  <div className={cn(
                    "text-center mb-3 text-[10px] uppercase tracking-widest",
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  )}>
                    Control Plane
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Next.js", port: ":3000" },
                      { name: "Hono", port: ":4000" },
                      { name: "PostgreSQL", port: ":5432" },
                      { name: "Redis", port: ":6379" },
                    ].map((item, i) => (
                      <div key={i} className={cn(
                        "text-center p-2 border",
                        isDark ? "border-zinc-600 bg-zinc-900" : "border-zinc-300 bg-white"
                      )}>
                        <div className={isDark ? "text-zinc-300" : "text-zinc-700"}>{item.name}</div>
                        <div className={isDark ? "text-zinc-600" : "text-zinc-400"}>{item.port}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connection Line */}
                <div className="flex justify-center mb-6">
                  <div className={cn(
                    "flex flex-col items-center gap-1",
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  )}>
                    <div className="text-[10px] uppercase tracking-wider">mTLS / WebSocket</div>
                    <div className="h-6 border-l-2 border-dashed" style={{ borderColor: "currentColor" }} />
                  </div>
                </div>

                {/* Nodes */}
                <div className="grid grid-cols-3 gap-3">
                  {["Node 1", "Node 2", "Node 3"].map((node, i) => (
                    <div key={i} className={cn(
                      "border p-3 text-center",
                      isDark ? "border-zinc-700 bg-zinc-800/30" : "border-zinc-200 bg-zinc-50"
                    )}>
                      <BsServer className={cn(
                        "w-4 h-4 mx-auto mb-2",
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      )} />
                      <div className={isDark ? "text-zinc-300" : "text-zinc-700"}>{node}</div>
                      <div className={cn(
                        "text-[10px] mt-1",
                        isDark ? "text-zinc-600" : "text-zinc-400"
                      )}>
                        Rust Daemon
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Gallery Section Placeholder */}
      <section id="gallery" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className={cn(
              "text-3xl md:text-5xl font-extralight tracking-tight mb-4",
              isDark ? "text-zinc-100" : "text-zinc-900"
            )}>
              See It In Action
            </h2>
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Screenshots and demos showcasing the StellarStack experience.
            </p>
          </AnimatedSection>

          {/* Gallery Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <AnimatedSection key={item} delay={item * 0.05} className="h-full">
                <div className={cn(
                  "relative aspect-video border transition-all hover:scale-[1.02] group overflow-hidden",
                  isDark
                    ? "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                    : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                )}>
                  {/* Placeholder content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <BsImage className={cn(
                      "w-12 h-12 mb-3",
                      isDark ? "text-zinc-700" : "text-zinc-300"
                    )} />
                    <span className={cn(
                      "text-xs uppercase tracking-wider",
                      isDark ? "text-zinc-600" : "text-zinc-400"
                    )}>
                      Coming Soon
                    </span>
                  </div>
                  {/* Corner decorations */}
                  <div className={cn(
                    "absolute top-0 left-0 w-3 h-3 border-t border-l transition-colors",
                    isDark ? "border-zinc-700 group-hover:border-zinc-500" : "border-zinc-300 group-hover:border-zinc-400"
                  )} />
                  <div className={cn(
                    "absolute top-0 right-0 w-3 h-3 border-t border-r transition-colors",
                    isDark ? "border-zinc-700 group-hover:border-zinc-500" : "border-zinc-300 group-hover:border-zinc-400"
                  )} />
                  <div className={cn(
                    "absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-colors",
                    isDark ? "border-zinc-700 group-hover:border-zinc-500" : "border-zinc-300 group-hover:border-zinc-400"
                  )} />
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-colors",
                    isDark ? "border-zinc-700 group-hover:border-zinc-500" : "border-zinc-300 group-hover:border-zinc-400"
                  )} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Carousel */}
      <section id="tech" className={cn(
        "relative py-24 border-y",
        isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50"
      )}>
        <AnimatedSection className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <h2 className={cn(
              "text-2xl md:text-3xl font-extralight tracking-tight mb-4",
              isDark ? "text-zinc-100" : "text-zinc-900"
            )}>
              Built with Modern Technology
            </h2>
            <p className={cn(
              "text-sm max-w-xl mx-auto",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Powered by the best tools in the ecosystem for performance, reliability, and developer experience.
            </p>
          </div>
        </AnimatedSection>

        {/* Swiper Carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none",
            isDark
              ? "bg-gradient-to-r from-[#0b0b0a] to-transparent"
              : "bg-gradient-to-r from-zinc-50 to-transparent"
          )} />
          <div className={cn(
            "absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none",
            isDark
              ? "bg-gradient-to-l from-[#0b0b0a] to-transparent"
              : "bg-gradient-to-l from-zinc-50 to-transparent"
          )} />

          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={48}
            loop={true}
            speed={8000}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => {
              swiper.autoplay.start();
            }}
            allowTouchMove={false}
            className="[&_.swiper-wrapper]:!ease-linear"
          >
            {[...technologies, ...technologies, ...technologies].map((tech, i) => (
              <SwiperSlide key={i} className="!w-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center justify-center cursor-pointer transition-all hover:scale-110",
                        isDark ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-700"
                      )}
                    >
                      <tech.Icon className="w-10 h-10" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {tech.name}
                  </TooltipContent>
                </Tooltip>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <h2 className={cn(
            "text-3xl md:text-5xl font-extralight tracking-tight mb-6",
            isDark ? "text-zinc-100" : "text-zinc-900"
          )}>
            Ready to Self-Host?
          </h2>
          <p className={cn(
            "text-lg mb-10 max-w-xl mx-auto",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}>
            Deploy your own game server panel in minutes. Free and open source forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://docs.stellarstack.app" target="_blank" rel="noopener noreferrer">
              <Button
                className={cn(
                  "text-sm uppercase tracking-wider px-8 py-6 gap-2 transition-all hover:scale-[1.02]",
                  isDark
                    ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                    : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                )}
              >
                Read the Docs
                <BsArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a
              href="https://github.com/stellarstack/stellarstack"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className={cn(
                  "text-sm uppercase tracking-wider px-8 py-6 gap-2",
                  isDark
                    ? "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400"
                )}
              >
                <BsGithub className="w-4 h-4" />
                View on GitHub
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* Large Footer */}
      <footer className={cn(
        "relative border-t overflow-hidden",
        isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white"
      )}>
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className={cn(
                "text-lg font-light tracking-[0.2em] block mb-4",
                isDark ? "text-zinc-100" : "text-zinc-800"
              )}>
                STELLARSTACK
              </Link>
              <p className={cn(
                "text-sm mb-6",
                isDark ? "text-zinc-500" : "text-zinc-500"
              )}>
                Open-source game server management for the modern era.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/stellarstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-colors",
                    isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <BsGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://discord.gg/stellarstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-colors",
                    isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <BsDiscord className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/stellarstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-colors",
                    isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <BsTwitterX className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className={cn(
                "text-xs font-medium uppercase tracking-wider mb-4",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}>
                Product
              </h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Changelog", "Roadmap"].map((item) => (
                  <li key={item}>
                    <a href="#" className={cn(
                      "text-sm transition-colors",
                      isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"
                    )}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className={cn(
                "text-xs font-medium uppercase tracking-wider mb-4",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}>
                Resources
              </h4>
              <ul className="space-y-3">
                {["Documentation", "API Reference", "Guides", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className={cn(
                      "text-sm transition-colors",
                      isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"
                    )}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={cn(
                "text-xs font-medium uppercase tracking-wider mb-4",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}>
                Company
              </h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className={cn(
                      "text-sm transition-colors",
                      isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"
                    )}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={cn(
            "mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4",
            isDark ? "border-zinc-800" : "border-zinc-200"
          )}>
            <p className={cn(
              "text-xs",
              isDark ? "text-zinc-600" : "text-zinc-400"
            )}>
              &copy; {new Date().getFullYear()} StellarStack. Open source under MIT License.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "License"].map((item) => (
                <a key={item} href="#" className={cn(
                  "text-xs transition-colors",
                  isDark ? "text-zinc-600 hover:text-zinc-400" : "text-zinc-400 hover:text-zinc-600"
                )}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Large Cut-off Text */}
        <div className="relative overflow-hidden" style={{ height: "clamp(40px, 8vw, 120px)" }}>
          <div className="max-w-7xl mx-auto px-6 h-full relative">
            <div
              className={cn(
                "absolute text-7xl lg:text-[7.25rem] bottom-10 left-6 right-6 translate-y-[50%] font-bold select-none pointer-events-none text-center whitespace-nowrap",
                isDark ? "text-zinc-800/50" : "text-zinc-200"
              )}
              style={{
                letterSpacing: "0.2em",
                lineHeight: "0.8",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
                maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
              }}
            >
              STELLARSTACK
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
