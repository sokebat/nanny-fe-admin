import { formatDistanceToNow, format } from "date-fns";

/**
 * Format a date to relative time (e.g., "2 hours ago", "3 days ago")
 * Falls back to formatted date if date is invalid
 */
export default function formatTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (Number.isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    // If date is less than 24 hours ago, show relative time
    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatDistanceToNow(dateObj, { addSuffix: true });
    }

    // If date is less than 7 days ago, show day and time
    if (diffInHours < 168) {
      return format(dateObj, "EEE, MMM d, h:mm a");
    }

    // Otherwise show full date
    return format(dateObj, "MMM d, yyyy");
  } catch (_error) {
    return "Invalid date";
  }
}
