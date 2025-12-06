"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { UsageCard, UsageCardContent, UsageCardTitle } from "@workspace/ui/components/shared/UsageCard/UsageCard";
import { Sparkline } from "@workspace/ui/components/shared/Sparkline";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import {
  FadeIn,
  AnimatedNumber,
  PulsingDot,
  ProgressRing,
  GlowCard,
  NoiseOverlay,
  FloatingDots,
  GradientText,
  SkeletonCard,
  Skeleton,
  DropZone,
} from "@workspace/ui/components/shared/Animations";
import {
  BsFolder,
  BsFileEarmark,
  BsFileEarmarkImage,
  BsFileEarmarkCode,
  BsFileEarmarkText,
  BsFileEarmarkZip,
  BsThreeDotsVertical,
  BsSearch,
  BsUpload,
  BsTrash,
  BsFolderPlus,
  BsDownload,
  BsArrowUp,
  BsArrowDown,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";

// File type
interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size: number; // bytes
  modified: Date;
  extension?: string;
}

// Mock file data
const mockFiles: FileItem[] = [
  { id: "1", name: "plugins", type: "folder", size: 0, modified: new Date("2024-12-01") },
  { id: "2", name: "world", type: "folder", size: 0, modified: new Date("2024-12-05") },
  { id: "3", name: "logs", type: "folder", size: 0, modified: new Date("2024-12-06") },
  { id: "4", name: "config", type: "folder", size: 0, modified: new Date("2024-11-28") },
  { id: "5", name: "server.properties", type: "file", size: 1245, modified: new Date("2024-12-04"), extension: "properties" },
  { id: "6", name: "server.jar", type: "file", size: 48576000, modified: new Date("2024-11-15"), extension: "jar" },
  { id: "7", name: "eula.txt", type: "file", size: 158, modified: new Date("2024-11-15"), extension: "txt" },
  { id: "8", name: "banned-players.json", type: "file", size: 2, modified: new Date("2024-12-01"), extension: "json" },
  { id: "9", name: "banned-ips.json", type: "file", size: 2, modified: new Date("2024-12-01"), extension: "json" },
  { id: "10", name: "ops.json", type: "file", size: 245, modified: new Date("2024-12-03"), extension: "json" },
  { id: "11", name: "whitelist.json", type: "file", size: 1024, modified: new Date("2024-12-02"), extension: "json" },
  { id: "12", name: "usercache.json", type: "file", size: 8456, modified: new Date("2024-12-06"), extension: "json" },
  { id: "13", name: "backup.zip", type: "file", size: 156000000, modified: new Date("2024-12-05"), extension: "zip" },
  { id: "14", name: "icon.png", type: "file", size: 4096, modified: new Date("2024-11-20"), extension: "png" },
  { id: "15", name: "start.sh", type: "file", size: 256, modified: new Date("2024-11-15"), extension: "sh" },
];

// Mock disk usage history
const generateDiskHistory = () => {
  const history: number[] = [];
  let value = 35;
  for (let i = 0; i < 20; i++) {
    value = Math.max(10, Math.min(90, value + (Math.random() - 0.4) * 5));
    history.push(Math.round(value));
  }
  return history;
};

// Format file size
function formatSize(bytes: number): string {
  if (bytes === 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

// Format date
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Get file icon
function FileIcon({ file, className }: { file: FileItem; className?: string }) {
  if (file.type === "folder") {
    return <BsFolder className={cn("text-amber-400", className)} />;
  }

  switch (file.extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return <BsFileEarmarkImage className={cn("text-purple-400", className)} />;
    case "json":
    case "js":
    case "ts":
    case "java":
    case "sh":
    case "properties":
      return <BsFileEarmarkCode className={cn("text-blue-400", className)} />;
    case "txt":
    case "md":
    case "log":
      return <BsFileEarmarkText className={cn("text-zinc-400", className)} />;
    case "zip":
    case "tar":
    case "gz":
    case "jar":
      return <BsFileEarmarkZip className={cn("text-green-400", className)} />;
    default:
      return <BsFileEarmark className={cn("text-zinc-400", className)} />;
  }
}

// Animated button component with micro-interactions
function AnimatedButton({
  children,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Button> & { variant?: "default" | "outline" | "destructive" }) {
  return (
    <Button
      variant={variant === "destructive" ? "outline" : variant}
      className={cn(
        "transition-all duration-200 active:scale-95 hover:scale-[1.02]",
        variant === "destructive" && "text-red-400 border-red-800 hover:bg-red-900/20",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export default function FilesPage() {
  const isDark = true;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath] = useState("/");
  const [isLoading, setIsLoading] = useState(true);
  const diskHistory = useMemo(() => generateDiskHistory(), []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Disk stats
  const diskUsed = 45.2;
  const diskTotal = 100;
  const diskPercentage = Math.round((diskUsed / diskTotal) * 100);

  // Handle file drop
  const handleFileDrop = (files: FileList) => {
    console.log("Files dropped:", Array.from(files).map((f) => f.name));
    // TODO: Implement upload
  };

  // Table columns
  const columns: ColumnDef<FileItem>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-zinc-100 transition-colors"
              onClick={() => column.toggleSorting(isSorted === "asc")}
            >
              Name
              {isSorted === "asc" && <BsArrowUp className="w-3 h-3" />}
              {isSorted === "desc" && <BsArrowDown className="w-3 h-3" />}
            </button>
          );
        },
        cell: ({ row }) => {
          const file = row.original;
          return (
            <div className="flex items-center gap-3">
              <FileIcon file={file} className="w-4 h-4" />
              <span className={cn(
                "font-medium",
                file.type === "folder" ? "text-zinc-100" : "text-zinc-300"
              )}>
                {file.name}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "size",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-zinc-100 transition-colors"
              onClick={() => column.toggleSorting(isSorted === "asc")}
            >
              Size
              {isSorted === "asc" && <BsArrowUp className="w-3 h-3" />}
              {isSorted === "desc" && <BsArrowDown className="w-3 h-3" />}
            </button>
          );
        },
        cell: ({ row }) => (
          <span className="text-zinc-400 tabular-nums">{formatSize(row.original.size)}</span>
        ),
      },
      {
        accessorKey: "modified",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-zinc-100 transition-colors"
              onClick={() => column.toggleSorting(isSorted === "asc")}
            >
              Modified
              {isSorted === "asc" && <BsArrowUp className="w-3 h-3" />}
              {isSorted === "desc" && <BsArrowDown className="w-3 h-3" />}
            </button>
          );
        },
        cell: ({ row }) => (
          <span className="text-zinc-400">{formatDate(row.original.modified)}</span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const file = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-zinc-800 rounded transition-all hover:scale-110 active:scale-95">
                  <BsThreeDotsVertical className="w-4 h-4 text-zinc-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={cn(
                  "min-w-[160px]",
                  isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"
                )}
              >
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <BsDownload className="w-4 h-4" />
                  Download
                </DropdownMenuItem>
                {file.type === "file" && (
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <BsFileEarmarkText className="w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-red-400 focus:text-red-400">
                  <BsTrash className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isDark]
  );

  // Filter files based on search
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return mockFiles;
    return mockFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Sort folders first, then files
  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return 0;
    });
  }, [filteredFiles]);

  const table = useReactTable({
    data: sortedFiles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  const selectedCount = Object.keys(rowSelection).length;

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("min-h-svh", isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]")}>
        <FloatingDots isDark={isDark} count={15} />
        <NoiseOverlay opacity={0.02} />
        <div className="relative p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 mt-16">
            <div className="lg:col-span-3 space-y-4">
              <SkeletonCard isDark={isDark} className="h-16" />
              <SkeletonCard isDark={isDark} variant="chart" className="h-[500px]" />
            </div>
            <div className="space-y-4">
              <SkeletonCard isDark={isDark} variant="stat" />
              <SkeletonCard isDark={isDark} variant="stat" />
              <SkeletonCard isDark={isDark} variant="stat" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropZone onDrop={handleFileDrop} isDark={isDark}>
      <div className={cn(
        "min-h-svh transition-colors",
        isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
      )}>
        {/* Ambient effects */}
        <FloatingDots isDark={isDark} count={15} />
        <NoiseOverlay opacity={0.02} />

        <div className="relative p-8">
          {/* Header */}
          <FadeIn delay={0} className="max-w-7xl mx-auto mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className={cn(
                  "transition-all hover:scale-110 active:scale-95",
                  isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
                )} />
                <div>
                  <h1 className={cn(
                    "text-2xl font-semibold",
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  )}>
                    <GradientText animated>File Manager</GradientText>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <PulsingDot status="online" size="sm" />
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-zinc-500" : "text-zinc-600"
                    )}>
                      {currentPath}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Main Grid Layout */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - File Table */}
            <div className="lg:col-span-3 space-y-4">
              {/* Action Bar */}
              <FadeIn delay={100}>
                <GlowCard isDark={isDark} glowColor="rgba(59, 130, 246, 0.3)">
                  <UsageCard isDark={isDark} className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search */}
                      <div className="relative flex-1 min-w-[200px] group">
                        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
                        <input
                          type="text"
                          placeholder="Search files..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn(
                            "w-full pl-10 pr-4 py-2 text-sm rounded border outline-none transition-all",
                            isDark
                              ? "bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                              : "bg-white border-zinc-300 text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500"
                          )}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          className={cn(
                            "gap-2",
                            isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""
                          )}
                        >
                          <BsUpload className="w-4 h-4" />
                          Upload
                        </AnimatedButton>
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          className={cn(
                            "gap-2",
                            isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""
                          )}
                        >
                          <BsFolderPlus className="w-4 h-4" />
                          New Folder
                        </AnimatedButton>
                        {selectedCount > 0 && (
                          <FadeIn direction="right">
                            <AnimatedButton
                              variant="destructive"
                              size="sm"
                              className="gap-2"
                            >
                              <BsTrash className="w-4 h-4" />
                              Delete ({selectedCount})
                            </AnimatedButton>
                          </FadeIn>
                        )}
                      </div>
                    </div>
                  </UsageCard>
                </GlowCard>
              </FadeIn>

              {/* File Table */}
              <FadeIn delay={200}>
                <GlowCard isDark={isDark} glowColor="rgba(139, 92, 246, 0.2)">
                  <UsageCard isDark={isDark} className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            key={headerGroup.id}
                            className={cn(
                              "border-b",
                              isDark ? "border-zinc-800 hover:bg-transparent" : "border-zinc-200"
                            )}
                          >
                            {headerGroup.headers.map((header) => (
                              <TableHead
                                key={header.id}
                                className={cn(
                                  "text-xs uppercase tracking-wider font-medium",
                                  isDark ? "text-zinc-500" : "text-zinc-600"
                                )}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row, index) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className={cn(
                                "border-b cursor-pointer transition-all",
                                isDark
                                  ? "border-zinc-800/50 hover:bg-zinc-800/50 data-[state=selected]:bg-zinc-800"
                                  : "border-zinc-200 hover:bg-zinc-100 data-[state=selected]:bg-zinc-200",
                                "animate-fade-in-up"
                              )}
                              style={{
                                animationDelay: `${index * 30}ms`,
                                animationFillMode: "backwards",
                              }}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center text-zinc-500"
                            >
                              No files found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className={cn(
                      "flex items-center justify-between px-4 py-3 border-t",
                      isDark ? "border-zinc-800" : "border-zinc-200"
                    )}>
                      <div className={cn(
                        "text-sm tabular-nums",
                        isDark ? "text-zinc-500" : "text-zinc-600"
                      )}>
                        {selectedCount > 0
                          ? `${selectedCount} of ${table.getFilteredRowModel().rows.length} selected`
                          : `${table.getFilteredRowModel().rows.length} items`}
                      </div>
                      <div className="flex items-center gap-2">
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                          className={cn(
                            "p-2",
                            isDark ? "border-zinc-700 disabled:opacity-30" : ""
                          )}
                        >
                          <BsChevronLeft className="w-4 h-4" />
                        </AnimatedButton>
                        <span className={cn(
                          "text-sm tabular-nums",
                          isDark ? "text-zinc-400" : "text-zinc-600"
                        )}>
                          Page {table.getState().pagination.pageIndex + 1} of{" "}
                          {table.getPageCount()}
                        </span>
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                          className={cn(
                            "p-2",
                            isDark ? "border-zinc-700 disabled:opacity-30" : ""
                          )}
                        >
                          <BsChevronRight className="w-4 h-4" />
                        </AnimatedButton>
                      </div>
                    </div>
                  </UsageCard>
                </GlowCard>
              </FadeIn>
            </div>

            {/* Right Column - Disk Stats */}
            <div className="space-y-4">
              {/* Disk Usage with Progress Ring */}
              <FadeIn delay={300}>
                <GlowCard isDark={isDark} glowColor="rgba(34, 197, 94, 0.2)">
                  <UsageCard isDark={isDark} className="p-6">
                    <UsageCardTitle isDark={isDark} className="text-xs mb-4 opacity-80">
                      DISK USAGE
                    </UsageCardTitle>
                    <UsageCardContent className="flex flex-col items-center">
                      <ProgressRing
                        percentage={diskPercentage}
                        size={140}
                        strokeWidth={10}
                        animated
                      >
                        <div className="text-center">
                          <AnimatedNumber
                            value={diskPercentage}
                            suffix="%"
                            className={cn(
                              "text-3xl font-semibold",
                              isDark ? "text-zinc-100" : "text-zinc-800"
                            )}
                          />
                        </div>
                      </ProgressRing>

                      <div className={cn(
                        "text-sm mt-4 text-center tabular-nums",
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      )}>
                        <AnimatedNumber value={diskUsed} decimals={1} /> GB / {diskTotal} GB
                      </div>

                      {/* History graph */}
                      <div className="w-full mt-4">
                        <Sparkline
                          data={diskHistory}
                          color={diskPercentage > 80 ? "#ef4444" : diskPercentage > 60 ? "#f59e0b" : "#22c55e"}
                          height={50}
                          isDark={isDark}
                        />
                      </div>
                    </UsageCardContent>
                  </UsageCard>
                </GlowCard>
              </FadeIn>

              {/* Storage Breakdown */}
              <FadeIn delay={400}>
                <GlowCard isDark={isDark} glowColor="rgba(168, 85, 247, 0.2)">
                  <UsageCard isDark={isDark} className="p-6">
                    <UsageCardTitle isDark={isDark} className="text-xs mb-4 opacity-80">
                      STORAGE BREAKDOWN
                    </UsageCardTitle>
                    <UsageCardContent className="space-y-3">
                      <StorageItem label="World Data" size={28.4} percentage={63} isDark={isDark} color="bg-blue-500" delay={450} />
                      <StorageItem label="Backups" size={12.1} percentage={27} isDark={isDark} color="bg-purple-500" delay={500} />
                      <StorageItem label="Plugins" size={3.2} percentage={7} isDark={isDark} color="bg-amber-500" delay={550} />
                      <StorageItem label="Logs" size={1.5} percentage={3} isDark={isDark} color="bg-zinc-500" delay={600} />
                    </UsageCardContent>
                  </UsageCard>
                </GlowCard>
              </FadeIn>

              {/* Quick Stats */}
              <FadeIn delay={500}>
                <GlowCard isDark={isDark} glowColor="rgba(59, 130, 246, 0.2)">
                  <UsageCard isDark={isDark} className="p-6">
                    <UsageCardTitle isDark={isDark} className="text-xs mb-4 opacity-80">
                      QUICK STATS
                    </UsageCardTitle>
                    <UsageCardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Total Files</span>
                        <AnimatedNumber
                          value={1247}
                          className={isDark ? "text-zinc-200" : "text-zinc-800"}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Total Folders</span>
                        <AnimatedNumber
                          value={89}
                          className={isDark ? "text-zinc-200" : "text-zinc-800"}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Largest File</span>
                        <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>backup.zip</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Status</span>
                        <div className="flex items-center gap-2">
                          <PulsingDot status="online" size="sm" />
                          <span className="text-green-400 text-sm">Synced</span>
                        </div>
                      </div>
                    </UsageCardContent>
                  </UsageCard>
                </GlowCard>
              </FadeIn>
            </div>
          </div>

          {/* Footer */}
          <FadeIn delay={600}>
            <footer className={cn(
              "mt-12 pb-4 text-center text-sm uppercase transition-colors",
              isDark ? "text-zinc-500" : "text-zinc-600"
            )}>
              &copy; {new Date().getFullYear()} StellarStack
            </footer>
          </FadeIn>
        </div>

        {/* CSS for staggered row animation */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out;
          }
        `}</style>
      </div>
    </DropZone>
  );
}

// Storage breakdown item component with animations
function StorageItem({
  label,
  size,
  percentage,
  isDark,
  color,
  delay = 0,
}: {
  label: string;
  size: number;
  percentage: number;
  isDark: boolean;
  color: string;
  delay?: number;
}) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>{label}</span>
        <span className={cn("tabular-nums", isDark ? "text-zinc-300" : "text-zinc-700")}>
          <AnimatedNumber value={size} decimals={1} suffix=" GB" duration={800} />
        </span>
      </div>
      <div className={cn(
        "h-1.5 rounded-full overflow-hidden",
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      )}>
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
}
