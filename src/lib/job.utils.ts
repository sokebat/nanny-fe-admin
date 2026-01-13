 
export const formatDate = (dateString: string, format: "short" | "long" = "long"): string => {
  const date = new Date(dateString);

  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format a date string with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format time string (already in HH:MM format)
 */
export const formatTime = (time: string): string => {
  return time;
};

/**
 * Format job type to display format
 */
export const formatJobType = (jobType: string): string => {
  const typeMap: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    occasional: "Occasional",
    fulltime: "Full Time",
    parttime: "Part Time",
  };

  return (
    typeMap[jobType.toLowerCase()] ||
    jobType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

/**
 * Format duration to display format
 */
export const formatDuration = (duration: string): string => {
  if (!duration) return "";

  return duration
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Calculate days remaining from posted date (assumes 30-day active period)
 */
export const calculateDaysRemaining = (postedDate: string): number => {
  const posted = new Date(postedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - posted.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - diffDays);
};

/**
 * Format salary/hourly rate
 */
export const formatSalary = (hourlyRate: number, compensationType: string): string => {
  if (compensationType === "hourly") {
    return `$${hourlyRate}/hr`;
  }
  if (compensationType === "salary") {
    return `$${hourlyRate.toLocaleString()}`;
  }
  return "Negotiable";
};

/**
 * Format location to display string
 */
export const formatLocation = (location: {
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  country?: string;
}): string => {
  const parts = [];
  if (location.street) parts.push(location.street);
  parts.push(`${location.city}, ${location.state}`);
  if (location.zipCode) parts.push(location.zipCode);
  return parts.join(" ");
};

/**
 * Format short location (city, state)
 */
export const formatLocationShort = (location: {
  city: string;
  state: string;
}): string => {
  return `${location.city}, ${location.state}`;
};

 
