import * as React from "react";
import { FolderKanban } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-subtle border border-border text-secondary mb-4">
        {icon || <FolderKanban className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-[#111111]">{title}</h3>
      <p className="mt-1 text-xs text-secondary max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
