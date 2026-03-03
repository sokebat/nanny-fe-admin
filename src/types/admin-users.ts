import { UserRole } from "./subscription";

export type ManageUserRole = "admin" | "parent" | "vendor" | "nanny";
export type AdminUsersRoleFilter = "guest" | "nanny" | "parent" | "vendor" | "admin" | "moderator";
export type AccountStatus = "active" | "restricted" | "banned";
export type RestrictionAppealStatus = "pending" | "approved" | "rejected";
export type BannedIdentifierType = "email" | "phone";

export interface AdminUser {
    _id: string; // API uses _id
    id?: string; // For frontend convenience if needed
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole | "guest";
    emailVerified: boolean;
    phoneVerified: boolean;
    isActive: boolean;
    accountStatus?: AccountStatus;
    isInternal?: boolean;
    twoFactorRequired?: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    lastLogin?: string;
    googleId?: string;
    password?: string;
    phone?: string;
    avatar?: string;
    profileImageUrl?: string;
    teachableUserId?: string;
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
    role?: AdminUsersRoleFilter | "";
    accountStatus?: AccountStatus | "";
    search?: string;
    fromDate?: string;
    toDate?: string;
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
    role?: ManageUserRole;
    isActive?: boolean;
    phoneVerified?: boolean;
    emailVerified?: boolean;
}

export interface RestrictUserDto {
    reason: string;
}

export interface BanUserDto {
    reason: string;
    banEmail?: boolean;
    banPhone?: boolean;
}

export interface ResolveRestrictionAppealDto {
    status: "approved" | "rejected";
    adminNote?: string;
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

export interface RestrictionAppeal {
    _id: string;
    userId: string | {
        _id: string;
        email?: string;
        role?: AdminUsersRoleFilter;
        firstName?: string;
        lastName?: string;
    };
    status: RestrictionAppealStatus;
    reason?: string;
    appealReason?: string;
    adminNote?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RestrictionAppealsFilters {
    page?: number;
    limit?: number;
    status?: RestrictionAppealStatus | "";
    role?: AdminUsersRoleFilter | "";
    fromDate?: string;
    toDate?: string;
}

export interface PaginatedRestrictionAppealsResponse {
    appeals: RestrictionAppeal[];
    pagination: UserPagination;
}

export interface AdminUsersListResponse {
    status: number;
    message: string;
    data: PaginatedUsersResponse;
}
