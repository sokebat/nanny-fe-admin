import { UserRole } from "./subscription";

export interface AdminUser {
    _id: string; // API uses _id
    id?: string; // For frontend convenience if needed
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    phone?: string;
    avatar?: string;
    lastLogin?: string;
    googleId?: string;
}

export interface UserAddress {
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface NannyProfile {
    _id: string;
    address?: UserAddress;
    bio?: string;
    experience?: number;
    hourlyRate?: number;
    availability?: Record<string, { start: string; end: string; available: boolean }>;
    languages?: string[];
    certifications?: string[];
    skills?: string[];
    backgroundCheckStatus?: string;
    isProfileComplete: boolean;
}

export interface ParentProfile {
    _id: string;
    address?: UserAddress;
    numberOfChildren?: number;
    childrenAges?: number[];
    preferredSchedule?: string;
    profileImageUrl?: string;
    bio?: string;
    isProfileComplete: boolean;
}

export interface VendorProfile {
    _id: string;
    businessName?: string;
    businessType?: string;
    address?: UserAddress;
    bio?: string;
    isProfileComplete: boolean;
}

export interface AdminUserStats {
    jobsCount: number;
    applicationsCount: number;
    invoicesCount: number;
    coursesCount: number;
    subscriptionsCount: number;
}

export interface AdminUserDetails {
    user: AdminUser;
    profile: NannyProfile | ParentProfile | VendorProfile | null;
    stats: AdminUserStats;
}

export interface AdminUserFilters {
    page?: number;
    limit?: number;
    role?: UserRole | "";
    search?: string;
    isActive?: boolean | "";
    phoneVerified?: boolean | "";
    emailVerified?: boolean | "";
    sortBy?: "createdAt" | "email" | "firstName" | "lastName";
    sortOrder?: "asc" | "desc";
}

export interface UpdateAdminUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
    phoneVerified?: boolean;
    emailVerified?: boolean;
}

export interface UserJob {
    _id: string;
    title: string;
    description: string;
    status: "open" | "closed" | "in_progress";
    createdAt: string;
    // Add other job fields as necessary
}

export interface UserApplication {
    _id: string;
    jobId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
}

// Re-export or define simpler versions if specific to admin view
export interface AdminUserSubscription {
    _id: string;
    planId: {
        _id: string;
        name: string;
        pricingMonthly: number;
        pricingYearly: number;
        description?: string;
        features?: string[];
    };
    billingCycle: "monthly" | "yearly";
    status: string;
    createdAt: string;
}

export interface AdminUserInvoice {
    _id: string;
    invoiceNumber: string;
    amount: number;
    total: number;
    currency: string;
    status: "paid" | "pending" | "failed" | "cancelled";
    issuedAt: string;
    description?: string;
    invoiceUrl?: string;
}

export interface AdminUserCourse {
    _id: string;
    title: string;
    progress: number;
    status: "active" | "completed" | "cancelled";
    enrolledAt: string;
}

export interface PaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export interface UserPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedUsersResponse {
    users: AdminUser[];
    pagination: UserPagination;
}
