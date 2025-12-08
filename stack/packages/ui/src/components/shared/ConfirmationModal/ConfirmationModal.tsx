"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
  isDark?: boolean;
  isLoading?: boolean;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isDark = true,
  isLoading = false,
}: ConfirmationModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent isDark={isDark}>
        <DialogHeader>
          <DialogTitle isDark={isDark}>{title}</DialogTitle>
          {description && (
            <DialogDescription isDark={isDark}>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className={cn(
              "transition-all text-xs uppercase tracking-wider",
              isDark
                ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
            )}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="outline"
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "transition-all text-xs uppercase tracking-wider",
              variant === "danger"
                ? isDark
                  ? "border-red-900/60 text-red-400/80 hover:text-red-300 hover:border-red-700 hover:bg-red-950/30"
                  : "border-red-300 text-red-600 hover:text-red-700 hover:border-red-400 hover:bg-red-50"
                : isDark
                  ? "border-zinc-600 text-zinc-200 hover:text-zinc-100 hover:border-zinc-400 hover:bg-zinc-800"
                  : "border-zinc-400 text-zinc-800 hover:text-zinc-900 hover:border-zinc-500 hover:bg-zinc-100"
            )}
          >
            {isLoading ? "Loading..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
