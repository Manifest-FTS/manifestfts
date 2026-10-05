import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Client-safe className merge (lib/utils imports node:crypto and is server-only). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
