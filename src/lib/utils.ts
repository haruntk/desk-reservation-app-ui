import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Date object or date string to ISO string with local timezone offset
 * This preserves the local time instead of converting to UTC
 * 
 * @param date - Date object or date string
 * @returns ISO string with timezone offset (e.g., "2025-08-20T10:00:00+03:00")
 */
export function toLocalISOString(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Get timezone offset in minutes and convert to hours and minutes
  const timezoneOffset = dateObj.getTimezoneOffset()
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
  const offsetMinutes = Math.abs(timezoneOffset) % 60
  
  // Create offset string (e.g., "+03:00" or "-05:00")
  const offsetSign = timezoneOffset <= 0 ? '+' : '-'
  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`
  
  // Get local date components
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')
  
  // Return ISO string with local timezone offset
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`
}
