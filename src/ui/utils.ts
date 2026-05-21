import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// tailwind generated component
export function cn(...inputs: ClassValue[]): string
{
    return twMerge(clsx(inputs));
}
