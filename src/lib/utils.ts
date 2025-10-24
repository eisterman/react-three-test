import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge style classes taking into account proper Tailwind rules and cleaning booleans/nulls.
// For more info check `clsx` and `twMerge`
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
