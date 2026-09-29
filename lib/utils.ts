import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: string | Date | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeTime(date: string | Date | undefined): string {
  if (!date) return "—";
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function getStatusBadgeVariant(status: string): "default" | "success" | "warning" | "danger" | "secondary" {
  switch (status?.toLowerCase()) {
    case "active":
    case "completed":
    case "approved":
    case "building":
    case "live":
    case "done":
      return "success";
    case "pending":
    case "in progress":
    case "review":
    case "needs attention":
    case "ideation":
    case "upcoming":
      return "warning";
    case "inactive":
    case "rejected":
    case "overdue":
    case "blocked":
      return "danger";
    default:
      return "secondary";
  }
}
