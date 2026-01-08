import type { Job as ApiJob } from "@/services/job.services";
import type { Job } from "@/types/job";

/**
 * Format a date string to a readable format
 */
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

/**
 * Transform API job to frontend Job format
 */
export const transformApiJobToJob = (apiJob: ApiJob): Job => {
  const locationString = formatLocationShort(apiJob.location);
  const salary = formatSalary(apiJob.hourlyRate, apiJob.compensationType ?? "negotiable");
  const daysRemaining = calculateDaysRemaining(apiJob.postedDate);

  // Combine requirements, mustHave, and niceToHave as skills
  const skills = [
    ...(apiJob.requirements || []),
    ...(apiJob.mustHave || []),
    ...(apiJob.niceToHave || []),
    ...(apiJob.preferredCertifications || []),
  ].slice(0, 6); // Limit to 6 skills

  // Generate a consistent logo color based on job ID
  const logoColors = ["default", "apple", "google", "meta", "facebook"];
  const logoColor = logoColors[Number.parseInt(apiJob._id.slice(-1), 16) % logoColors.length];

  return {
    id: Number.parseInt(apiJob._id.slice(-8), 16) || 0,
    title: apiJob.title,
    company: `${apiJob.location.city} Family`,
    logo: apiJob.jobImage || null,
    logoColor,
    type: formatJobType(apiJob.jobType),
    location: locationString,
    salary,
    daysRemaining,
    overview: apiJob.description,
    skills,
    employer: {
      name: "Family",
      title: "Job Poster",
      avatar: null,
    },
    jobDetails: {
      rating: "4.8",
      totalReviews: (apiJob.applicantCount || 0).toString(),
      completionRate: "95",
      totalSpent: `${apiJob.hourlyRate * 40}k`,
    },
  };
};
