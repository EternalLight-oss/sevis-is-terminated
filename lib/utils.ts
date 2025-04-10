import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function getMonthYearFromDate(date: Date | null | undefined): string {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date)
}
