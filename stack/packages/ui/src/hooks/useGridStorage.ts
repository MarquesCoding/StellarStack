import { useState, useEffect, useCallback, useRef } from "react";
import type { GridItemConfig, Layouts } from "../components/shared/DragDropGrid";

export interface GridStorageData {
  items: GridItemConfig[];
  layouts: Layouts;
  hiddenCards: string[];
  version: number;
}

export interface UseGridStorageOptions {
  key: string;
  defaultItems: GridItemConfig[];
  defaultHiddenCards?: string[];
  // Future: userId for syncing with backend
  // userId?: string;
}

const STORAGE_VERSION = 4;

/**
 * Hook for persisting grid layout to localStorage.
 * Designed to be extended for backend sync with user accounts.
 */
export function useGridStorage({ key, defaultItems, defaultHiddenCards = [] }: UseGridStorageOptions) {
  // Use ref to avoid re-running effect when defaultItems reference changes
  const defaultItemsRef = useRef(defaultItems);
  defaultItemsRef.current = defaultItems;

  const defaultHiddenCardsRef = useRef(defaultHiddenCards);
  defaultHiddenCardsRef.current = defaultHiddenCards;

  // Start with defaults to avoid hydration mismatch
  const [items, setItems] = useState<GridItemConfig[]>(defaultItems);

  // Keep a ref to current items for use in callbacks
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [layouts, setLayouts] = useState<Layouts | undefined>(undefined);
  const [hiddenCards, setHiddenCards] = useState<string[]>(defaultHiddenCards);

  // Keep a ref to current hiddenCards for use in callbacks
  const hiddenCardsRef = useRef(hiddenCards);
  hiddenCardsRef.current = hiddenCards;
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const data: GridStorageData = JSON.parse(stored);
        if (data.version === STORAGE_VERSION) {
          // Load items
          if (data.items) {
            const mergedItems = defaultItemsRef.current.map((defaultItem) => {
              const storedItem = data.items.find((i) => i.i === defaultItem.i);
              if (storedItem) {
                return { ...defaultItem, size: storedItem.size };
              }
              return defaultItem;
            });
            setItems(mergedItems);
          }
          // Load layouts
          if (data.layouts && Object.keys(data.layouts).length > 0) {
            setLayouts(data.layouts);
          }
          // Load hidden cards
          if (data.hiddenCards) {
            setHiddenCards(data.hiddenCards);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load grid layout from storage:", error);
    }
    setIsLoaded(true);
  }, [key]);

  // Helper to save to localStorage
  const saveToStorage = useCallback(
    (newItems: GridItemConfig[], newLayouts: Layouts | undefined, newHiddenCards: string[]) => {
      try {
        const data: GridStorageData = {
          items: newItems,
          layouts: newLayouts || ({} as Layouts),
          hiddenCards: newHiddenCards,
          version: STORAGE_VERSION,
        };
        localStorage.setItem(key, JSON.stringify(data));
        console.log("[useGridStorage] Saved to localStorage:", key, data);
      } catch (error) {
        console.warn("Failed to save grid layout to storage:", error);
      }
    },
    [key]
  );

  // Save layout to localStorage
  const saveLayout = useCallback(
    (newVisibleItems: GridItemConfig[], newLayouts?: Layouts) => {
      console.log("[useGridStorage] saveLayout called with:", newVisibleItems, newLayouts);

      // Merge visible items with hidden items to preserve all items
      const hiddenItemIds = hiddenCardsRef.current;
      const hiddenItems = itemsRef.current.filter((item) => hiddenItemIds.includes(item.i));

      // Update visible items with new data, keep hidden items unchanged
      const allItems = defaultItemsRef.current.map((defaultItem) => {
        // Check if it's in the new visible items (may have updated size)
        const visibleItem = newVisibleItems.find((i) => i.i === defaultItem.i);
        if (visibleItem) {
          return visibleItem;
        }
        // Check if it's a hidden item (preserve its size)
        const hiddenItem = hiddenItems.find((i) => i.i === defaultItem.i);
        if (hiddenItem) {
          return hiddenItem;
        }
        // Fallback to default
        return defaultItem;
      });

      setItems(allItems);
      if (newLayouts) {
        setLayouts(newLayouts);
      }
      // Use ref to get current hiddenCards to avoid race conditions
      saveToStorage(allItems, newLayouts, hiddenCardsRef.current);
    },
    [saveToStorage]
  );

  // Toggle card visibility
  const toggleCardVisibility = useCallback(
    (cardId: string) => {
      setHiddenCards((prev) => {
        const newHidden = prev.includes(cardId)
          ? prev.filter((id) => id !== cardId)
          : [...prev, cardId];

        setItems((currentItems) => {
          setLayouts((currentLayouts) => {
            saveToStorage(currentItems, currentLayouts, newHidden);
            return currentLayouts;
          });
          return currentItems;
        });

        return newHidden;
      });
    },
    [saveToStorage]
  );

  // Show a card - clears layouts so they regenerate with the new card
  const showCard = useCallback(
    (cardId: string) => {
      setHiddenCards((prev) => {
        if (!prev.includes(cardId)) return prev;
        const newHidden = prev.filter((id) => id !== cardId);
        // Update ref immediately so saveLayout uses correct value
        hiddenCardsRef.current = newHidden;
        return newHidden;
      });
      // Clear layouts so DragDropGrid regenerates them with the newly visible card
      setLayouts(undefined);
    },
    []
  );

  // Hide a card
  const hideCard = useCallback(
    (cardId: string) => {
      setHiddenCards((prev) => {
        if (prev.includes(cardId)) return prev;
        const newHidden = [...prev, cardId];
        // Update ref immediately so saveLayout uses correct value
        hiddenCardsRef.current = newHidden;
        return newHidden;
      });
      // Clear layouts so DragDropGrid regenerates them without the hidden card
      setLayouts(undefined);
    },
    []
  );

  // Reset to defaults
  const resetLayout = useCallback(() => {
    setItems(defaultItemsRef.current);
    setLayouts(undefined);
    setHiddenCards([]);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to reset grid layout:", error);
    }
  }, [key]);

  // Get visible items (items not in hiddenCards)
  const visibleItems = items.filter((item) => !hiddenCards.includes(item.i));

  return {
    items,
    visibleItems,
    layouts,
    hiddenCards,
    isLoaded,
    saveLayout,
    resetLayout,
    toggleCardVisibility,
    showCard,
    hideCard,
  };
}
