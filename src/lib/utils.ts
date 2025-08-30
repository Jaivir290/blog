import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractFirstImageUrl(markdown?: string | null): string | null {
  if (!markdown) return null;
  const match = markdown.match(/!\[[^\]]*\]\((https?:[^\s)]+)(?:\s+\"[^\"]*\")?\)/i);
  return match ? match[1] : null;
}
