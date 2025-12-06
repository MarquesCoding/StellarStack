"use client";

import { useState, useMemo } from "react";
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

export default function FilesPage() {
  const isDark = true; // TODO: Get from theme context
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath] = useState("/");
  const diskHistory = useMemo(() => generateDiskHistory(), []);

  // Disk stats
  const diskUsed = 45.2; // GB
  const diskTotal = 100; // GB
  const diskPercentage = Math.round((diskUsed / diskTotal) * 100);

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
          <span className="text-zinc-400">{formatSize(row.original.size)}</span>
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
                <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
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

  return (
    <div className={cn(
      "min-h-svh transition-colors",
      isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
    )}>
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

      <div className="relative p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className={cn(
              "transition-colors",
              isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
            )} />
            <div>
              <h1 className={cn(
                "text-2xl font-semibold",
                isDark ? "text-zinc-100" : "text-zinc-900"
              )}>
                File Manager
              </h1>
              <p className={cn(
                "text-sm",
                isDark ? "text-zinc-500" : "text-zinc-600"
              )}>
                {currentPath}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - File Table */}
          <div className="lg:col-span-3 space-y-4">
            {/* Action Bar */}
            <UsageCard isDark={isDark} className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2 text-sm rounded border outline-none transition-colors",
                      isDark
                        ? "bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-500"
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2",
                      isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""
                    )}
                  >
                    <BsUpload className="w-4 h-4" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2",
                      isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""
                    )}
                  >
                    <BsFolderPlus className="w-4 h-4" />
                    New Folder
                  </Button>
                  {selectedCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-2 text-red-400 border-red-800 hover:bg-red-900/20",
                      )}
                    >
                      <BsTrash className="w-4 h-4" />
                      Delete ({selectedCount})
                    </Button>
                  )}
                </div>
              </div>
            </UsageCard>

            {/* File Table */}
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
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "border-b cursor-pointer transition-colors",
                          isDark
                            ? "border-zinc-800/50 hover:bg-zinc-800/50 data-[state=selected]:bg-zinc-800"
                            : "border-zinc-200 hover:bg-zinc-100 data-[state=selected]:bg-zinc-200"
                        )}
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
                  "text-sm",
                  isDark ? "text-zinc-500" : "text-zinc-600"
                )}>
                  {selectedCount > 0
                    ? `${selectedCount} of ${table.getFilteredRowModel().rows.length} selected`
                    : `${table.getFilteredRowModel().rows.length} items`}
                </div>
                <div className="flex items-center gap-2">
                  <Button
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
                  </Button>
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>
                  <Button
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
                  </Button>
                </div>
              </div>
            </UsageCard>
          </div>

          {/* Right Column - Disk Stats */}
          <div className="space-y-4">
            {/* Disk Usage */}
            <UsageCard isDark={isDark} className="p-6">
              <UsageCardTitle isDark={isDark} className="text-xs mb-4 opacity-80">
                DISK USAGE
              </UsageCardTitle>
              <UsageCardContent>
                <div className={cn(
                  "text-4xl font-mono",
                  isDark ? "text-zinc-100" : "text-zinc-800"
                )}>
                  {diskPercentage}%
                </div>
                <div className={cn(
                  "text-sm mt-2",
                  isDark ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {diskUsed} GB / {diskTotal} GB
                </div>

                {/* Progress bar */}
                <div className={cn(
                  "mt-4 h-2 rounded-full overflow-hidden",
                  isDark ? "bg-zinc-800" : "bg-zinc-200"
                )}>
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      diskPercentage > 80 ? "bg-red-500" :
                      diskPercentage > 60 ? "bg-amber-500" : "bg-green-500"
                    )}
                    style={{ width: `${diskPercentage}%` }}
                  />
                </div>

                {/* History graph */}
                <div className="mt-4">
                  <Sparkline
                    data={diskHistory}
                    color={diskPercentage > 80 ? "#ef4444" : diskPercentage > 60 ? "#f59e0b" : "#22c55e"}
                    height={60}
                    isDark={isDark}
                  />
                </div>
              </UsageCardContent>
            </UsageCard>

            {/* Storage Breakdown */}
            <UsageCard isDark={isDark} className="p-6">
              <UsageCardTitle isDark={isDark} className="text-xs mb-4 opacity-80">
                STORAGE BREAKDOWN
              </UsageCardTitle>
              <UsageCardContent className="space-y-3">
                <StorageItem label="World Data" size="28.4 GB" percentage={63} isDark={isDark} color="bg-blue-500" />
                <StorageItem label="Backups" size="12.1 GB" percentage={27} isDark={isDark} color="bg-purple-500" />
                <StorageItem label="Plugins" size="3.2 GB" percentage={7} isDark={isDark} color="bg-amber-500" />
                <StorageItem label="Logs" size="1.5 GB" percentage={3} isDark={isDark} color="bg-zinc-500" />
              </UsageCardContent>
            </UsageCard>

            {/* Quick Stats */}
            <UsageCard isDark={isDark} className="p-6">
              <UsageCardTitle isDark={isDark} className="text-xs mb-4 opacity-80">
                QUICK STATS
              </UsageCardTitle>
              <UsageCardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Total Files</span>
                  <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Total Folders</span>
                  <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>89</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Largest File</span>
                  <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>backup.zip (156 MB)</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-zinc-500" : "text-zinc-600"}>Last Modified</span>
                  <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>2 min ago</span>
                </div>
              </UsageCardContent>
            </UsageCard>
          </div>
        </div>

        {/* Footer */}
        <footer className={cn(
          "mt-12 pb-4 text-center text-sm uppercase transition-colors",
          isDark ? "text-zinc-500" : "text-zinc-600"
        )}>
          &copy; {new Date().getFullYear()} StellarStack
        </footer>
      </div>
    </div>
  );
}

// Storage breakdown item component
function StorageItem({
  label,
  size,
  percentage,
  isDark,
  color,
}: {
  label: string;
  size: string;
  percentage: number;
  isDark: boolean;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>{label}</span>
        <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{size}</span>
      </div>
      <div className={cn(
        "h-1.5 rounded-full overflow-hidden",
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      )}>
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
