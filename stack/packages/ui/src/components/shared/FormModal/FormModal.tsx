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

export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  isDark?: boolean;
  isLoading?: boolean;
  isValid?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  isDark = true,
  isLoading = false,
  isValid = true,
  size = "md",
}: FormModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (isValid) {
      onSubmit();
    }
  };

  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent isDark={isDark} className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle isDark={isDark}>{title}</DialogTitle>
          {description && (
            <DialogDescription isDark={isDark}>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2">{children}</div>
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
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            className={cn(
              "transition-all text-xs uppercase tracking-wider",
              isDark
                ? "border-zinc-600 text-zinc-200 hover:text-zinc-100 hover:border-zinc-400 hover:bg-zinc-800 disabled:opacity-50"
                : "border-zinc-400 text-zinc-800 hover:text-zinc-900 hover:border-zinc-500 hover:bg-zinc-100 disabled:opacity-50"
            )}
          >
            {isLoading ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
