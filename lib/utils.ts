import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const baseServerURL = `http://127.0.0.1:8000`; //localhost
export const baseServerURL = `https://sentinela-eqan.onrender.com`; //live

// export const baseClientURL = `http://127.0.0.1:3000`; //localhost
// export const baseClientURL = `https://sentinelamvp.netlify.app`; //live