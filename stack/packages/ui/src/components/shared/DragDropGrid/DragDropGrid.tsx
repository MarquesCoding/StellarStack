"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { Responsive, WidthProvider, type Layout, type Layouts } from "react-grid-layout";
import { cn } from "@workspace/ui/lib/utils";
import { BsGripVertical, BsArrowsFullscreen, BsX } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../dialog";

// Import react-grid-layout styles
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Types
export type GridSize = "xxs" | "xxs-wide" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface GridItemConfig {
  i: string; // unique id
  size: GridSize;
  minSize?: GridSize; // minimum size this item can be resized to
  maxSize?: GridSize; // maximum size this item can be resized to
  allowedSizes?: GridSize[]; // specific sizes this item can be (overrides min/max range)
}

// Size configurations - width (w) and height (h) in grid units
// With rowHeight=50 and gap=16: height = rowHeight * h + gap * (h - 1)
// h=2 → 116px, h=3 → 182px, h=4 → 248px, h=5 → 314px
export const gridSizeConfig: Record<GridSize, { w: number; h: number }> = {
  xxs: { w: 3, h: 2 }, // ~116px height, 3 columns wide, compact for metric cards
  "xxs-wide": { w: 6, h: 2 }, // ~116px height, 6 columns wide, for header cards
  xs: { w: 3, h: 3 }, // ~182px height
  sm: { w: 3, h: 4 }, // ~248px height (close to 250px)
  md: { w: 6, h: 5 }, // ~314px height
  lg: { w: 6, h: 6 }, // ~380px height (2x xs height)
  xl: { w: 12, h: 6 }, // ~380px height
  xxl: { w: 12, h: 10 }, // ~644px height, full width, for console
};

const SIZE_ORDER: GridSize[] = ["xxs", "xxs-wide", "xs", "sm", "md", "lg", "xl", "xxl"];

// Breakpoints configuration
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };

// Labels for remove confirmation dialog
export interface RemoveConfirmLabels {
  title: string;
  description: string;
  cancel: string;
  confirm: string;
}

// Context for grid item interactions
interface DragDropGridContextValue {
  cycleItemSize: (itemId: string) => void;
  getItemSize: (itemId: string) => GridSize;
  getItemMinSize: (itemId: string) => GridSize | undefined;
  getItemMaxSize: (itemId: string) => GridSize | undefined;
  canResize: (itemId: string) => boolean;
  removeItem: (itemId: string) => void;
  isEditing: boolean;
  isDark: boolean;
  removeConfirmLabels?: RemoveConfirmLabels;
}

const DragDropGridContext = createContext<DragDropGridContextValue | null>(null);

export function useDragDropGrid() {
  const context = useContext(DragDropGridContext);
  if (!context) {
    throw new Error("useDragDropGrid must be used within a DragDropGrid");
  }
  return context;
}

// Generate layout from items config
function generateLayout(items: GridItemConfig[], cols: number = 12): Layout[] {
  let x = 0;
  let y = 0;
  let rowHeight = 0;

  return items.map((item) => {
    const size = gridSizeConfig[item.size];
    let w = Math.min(size.w, cols); // Cap width to available cols

    // On smaller breakpoints (6 cols or less), expand small items to full width
    if (cols <= 6 && size.w <= 3) {
      w = cols;
    }

    // Check if item fits in current row
    if (x + w > cols) {
      x = 0;
      y += rowHeight;
      rowHeight = 0;
    }

    const layout: Layout = {
      i: item.i,
      x,
      y,
      w,
      h: size.h,
      minW: 2,
      minH: 2,
    };

    x += w;
    rowHeight = Math.max(rowHeight, size.h);

    return layout;
  });
}

// Generate responsive layouts
function generateResponsiveLayouts(items: GridItemConfig[]): Layouts {
  return {
    lg: generateLayout(items, COLS.lg),
    md: generateLayout(items, COLS.md),
    sm: generateLayout(items, COLS.sm),
    xs: generateLayout(items, COLS.xs),
    xxs: generateLayout(items, COLS.xxs),
  };
}

// Main Grid Component
export interface DragDropGridProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children: ReactNode;
  items: GridItemConfig[];
  onLayoutChange?: (items: GridItemConfig[], layouts: Layouts) => void;
  onDropItem?: (itemId: string, layout: Layout) => void;
  onRemoveItem?: (itemId: string) => void;
  rowHeight?: number;
  gap?: number;
  isEditing?: boolean;
  savedLayouts?: Layouts;
  isDark?: boolean;
  isDroppable?: boolean;
  allItems?: GridItemConfig[]; // All available items for determining sizes on drop
  removeConfirmLabels?: RemoveConfirmLabels;
}

export function DragDropGrid({
  children,
  className,
  items: externalItems,
  onLayoutChange,
  onDropItem,
  onRemoveItem,
  rowHeight = 60,
  gap = 16,
  isEditing = false,
  savedLayouts,
  removeConfirmLabels,
  isDark = true,
  isDroppable = false,
  allItems,
  ...props
}: DragDropGridProps) {
  const [items, setItems] = useState<GridItemConfig[]>(externalItems);
  const [layouts, setLayouts] = useState<Layouts>(() => savedLayouts || generateResponsiveLayouts(externalItems));

  // Use ref to always have latest callback without causing re-renders
  const onLayoutChangeRef = useRef(onLayoutChange);
  onLayoutChangeRef.current = onLayoutChange;

  // Sync with external items/layouts when they change (e.g., reset button)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Sync items and regenerate layouts when external props change
    setItems(externalItems);
    setLayouts(savedLayouts || generateResponsiveLayouts(externalItems));
  }, [externalItems, savedLayouts]);

  const getItemSize = useCallback(
    (itemId: string): GridSize => {
      return items.find((item) => item.i === itemId)?.size ?? "md";
    },
    [items]
  );

  const getItemMinSize = useCallback(
    (itemId: string): GridSize | undefined => {
      return items.find((item) => item.i === itemId)?.minSize;
    },
    [items]
  );

  const getItemMaxSize = useCallback(
    (itemId: string): GridSize | undefined => {
      return items.find((item) => item.i === itemId)?.maxSize;
    },
    [items]
  );

  const canResize = useCallback(
    (itemId: string): boolean => {
      const item = items.find((i) => i.i === itemId);
      if (!item) return true;

      const minIndex = item.minSize ? SIZE_ORDER.indexOf(item.minSize) : 0;
      const maxIndex = item.maxSize ? SIZE_ORDER.indexOf(item.maxSize) : SIZE_ORDER.length - 1;

      // Can resize if there's more than one size option
      return maxIndex > minIndex;
    },
    [items]
  );

  const cycleItemSize = useCallback(
    (itemId: string) => {
      // Get current items from state
      setItems((prevItems) => {
        const item = prevItems.find((i) => i.i === itemId);
        if (!item) return prevItems;

        let nextSize: GridSize;

        // If allowedSizes is specified, cycle through those only
        if (item.allowedSizes && item.allowedSizes.length > 0) {
          const currentAllowedIndex = item.allowedSizes.indexOf(item.size);
          const nextAllowedIndex = (currentAllowedIndex + 1) % item.allowedSizes.length;
          nextSize = item.allowedSizes[nextAllowedIndex] as GridSize;
        } else {
          // Use min/max range
          const currentIndex = SIZE_ORDER.indexOf(item.size);
          const minIndex = item.minSize ? SIZE_ORDER.indexOf(item.minSize) : 0;
          const maxIndex = item.maxSize ? SIZE_ORDER.indexOf(item.maxSize) : SIZE_ORDER.length - 1;

          // Calculate next index within the allowed range
          let nextIndex = currentIndex + 1;

          // If we exceed maxSize, wrap back to minSize
          if (nextIndex > maxIndex) {
            nextIndex = minIndex;
          }

          nextSize = SIZE_ORDER[nextIndex] as GridSize;
        }

        const newItems = prevItems.map((i) =>
          i.i === itemId ? { ...i, size: nextSize } : i
        );

        // Update layouts
        const newLayouts = generateResponsiveLayouts(newItems);
        setLayouts(newLayouts);

        // Schedule callback outside of setState
        setTimeout(() => {
          console.log("[DragDropGrid] cycleItemSize calling onLayoutChange with:", newItems);
          onLayoutChangeRef.current?.(newItems, newLayouts);
        }, 0);

        return newItems;
      });
    },
    []
  );

  const handleLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: Layouts) => {
      setLayouts(allLayouts);
      // Save layouts when dragging completes
      console.log("[DragDropGrid] handleLayoutChange - saving layouts");
      setItems((currentItems) => {
        setTimeout(() => {
          onLayoutChangeRef.current?.(currentItems, allLayouts);
        }, 0);
        return currentItems;
      });
    },
    []
  );

  // Handle external drop
  const onDropRef = useRef(onDropItem);
  onDropRef.current = onDropItem;

  const handleDrop = useCallback(
    (layout: Layout[], layoutItem: Layout, event: Event) => {
      const droppedItemId = (event as DragEvent).dataTransfer?.getData("text/plain");
      if (droppedItemId && onDropRef.current) {
        onDropRef.current(droppedItemId, layoutItem);
      }
    },
    []
  );

  // Remove item function
  const onRemoveRef = useRef(onRemoveItem);
  onRemoveRef.current = onRemoveItem;

  const removeItem = useCallback((itemId: string) => {
    if (onRemoveRef.current) {
      onRemoveRef.current(itemId);
    }
  }, []);

  // Get dropping item size based on allItems config
  const droppingItem = useCallback(() => {
    // Default dropping item size
    return { i: "__dropping-elem__", w: 3, h: 3 };
  }, []);

  return (
    <DragDropGridContext.Provider value={{ cycleItemSize, getItemSize, getItemMinSize, getItemMaxSize, canResize, removeItem, isEditing, isDark, removeConfirmLabels }}>
      <div className={cn("drag-drop-grid", className)} {...props}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={rowHeight}
          margin={[gap, gap]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          isResizable={false}
          useCSSTransforms={true}
          isDroppable={isDroppable && isEditing}
          onDrop={handleDrop}
          droppingItem={droppingItem()}
        >
          {children}
        </ResponsiveGridLayout>
      </div>

      <style jsx global>{`
        .drag-drop-grid .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top, width, height;
        }
        .drag-drop-grid .react-grid-item.cssTransforms {
          transition-property: transform, width, height;
        }
        .drag-drop-grid .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 100;
          opacity: 0.9;
        }
        .drag-drop-grid .react-grid-item.dropping {
          visibility: hidden;
        }
        .drag-drop-grid .react-grid-placeholder {
          background: rgba(113, 113, 122, 0.15);
          border: 1px solid rgba(161, 161, 170, 0.3);
          border-radius: 0;
          transition-duration: 100ms;
          z-index: 2;
        }
        .drag-drop-grid .react-grid-item.react-grid-placeholder {
          background: rgba(113, 113, 122, 0.15);
          border: 1px solid rgba(161, 161, 170, 0.3);
        }
        /* Touch support styles */
        .drag-drop-grid .drag-handle {
          touch-action: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        .drag-drop-grid .react-grid-item {
          touch-action: auto;
        }
        .drag-drop-grid .react-grid-item.react-draggable-dragging {
          touch-action: none;
        }
        /* Prevent text selection during drag on touch */
        @media (pointer: coarse) {
          .drag-drop-grid .react-grid-item {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
        }
      `}</style>
    </DragDropGridContext.Provider>
  );
}

// Grid Item Component
export interface GridItemProps extends ComponentPropsWithoutRef<"div"> {
  itemId: string;
  children: ReactNode;
  showResizeHandle?: boolean;
  showDragHandle?: boolean;
  showRemoveHandle?: boolean;
}

export function GridItem({
  itemId,
  children,
  className,
  showResizeHandle = true,
  showDragHandle = true,
  showRemoveHandle = true,
  ...props
}: GridItemProps) {
  const { cycleItemSize, getItemSize, canResize, removeItem, isEditing, isDark, removeConfirmLabels } = useDragDropGrid();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const size = getItemSize(itemId);
  const isResizable = canResize(itemId);

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cycleItemSize(itemId);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = () => {
    setShowRemoveConfirm(false);
    removeItem(itemId);
  };

  const buttonBase = "px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors border bg-transparent";
  const buttonColors = isDark
    ? "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
    : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800";
  const buttonDestructive = isDark
    ? "border-red-900/60 text-red-400/90 hover:border-red-700/80 hover:text-red-300"
    : "border-red-300 text-red-600 hover:border-red-400 hover:text-red-700";

  return (
    <div
      key={itemId}
      data-item-id={itemId}
      className={cn("relative h-full w-full group", isEditing && "select-none", className)}
      {...props}
    >
      {/* Drag handle */}
      {showDragHandle && isEditing && (
        <div
          className={cn(
            "drag-handle absolute top-2 left-2 z-10 p-1.5 cursor-grab active:cursor-grabbing border",
            isDark ? "bg-zinc-800/80 border-zinc-700" : "bg-zinc-200/80 border-zinc-300"
          )}
          style={{ touchAction: "none" }}
          title="Drag to reorder"
        >
          <BsGripVertical className={cn("w-3.5 h-3.5 pointer-events-none", isDark ? "text-zinc-400" : "text-zinc-600")} />
        </div>
      )}

      {/* Remove handle */}
      {showRemoveHandle && isEditing && (
        <button
          onClick={handleRemoveClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleRemoveClick(e as unknown as React.MouseEvent);
          }}
          className={cn(
            "absolute top-2 left-10 z-20 p-1.5 cursor-pointer border",
            isDark ? "bg-zinc-800/80 border-red-900/60 hover:border-red-700/80 hover:bg-zinc-700" : "bg-zinc-200/80 border-red-300 hover:border-red-400 hover:bg-zinc-300"
          )}
          title="Remove card"
          type="button"
        >
          <BsX className={cn("w-3.5 h-3.5 pointer-events-none", isDark ? "text-red-400/80" : "text-red-500")} />
        </button>
      )}

      {/* Remove confirmation dialog */}
      <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <DialogContent isDark={isDark} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle isDark={isDark}>
              {removeConfirmLabels?.title ?? "Remove Card"}
            </DialogTitle>
            <DialogDescription isDark={isDark}>
              {removeConfirmLabels?.description ?? "Are you sure you want to remove this card from the dashboard?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowRemoveConfirm(false)}
              className={cn(buttonBase, buttonColors)}
              type="button"
            >
              {removeConfirmLabels?.cancel ?? "Cancel"}
            </button>
            <button
              onClick={handleConfirmRemove}
              className={cn(buttonBase, buttonDestructive)}
              type="button"
            >
              {removeConfirmLabels?.confirm ?? "Remove"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resize handle */}
      {showResizeHandle && isResizable && isEditing && (
        <button
          onClick={handleResize}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleResize(e as unknown as React.MouseEvent);
          }}
          className={cn(
            "absolute top-2 right-2 z-20 p-1.5 cursor-pointer border",
            isDark ? "bg-zinc-800/80 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700" : "bg-zinc-200/80 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-300"
          )}
          title={`Size: ${size.toUpperCase()} (click to cycle)`}
          type="button"
        >
          <BsArrowsFullscreen className={cn("w-3.5 h-3.5 pointer-events-none", isDark ? "text-zinc-400" : "text-zinc-600")} />
        </button>
      )}

      {/* Size indicator badge */}
      {isEditing && (
        <div className={cn(
          "absolute bottom-2 right-2 z-10 px-2 py-0.5 text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border",
          isDark ? "bg-zinc-800/80 border-zinc-700 text-zinc-400" : "bg-zinc-200/80 border-zinc-300 text-zinc-600"
        )}>
          {size}
        </div>
      )}

      {/* Content wrapper */}
      <div className="h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

export type { Layout, Layouts };
