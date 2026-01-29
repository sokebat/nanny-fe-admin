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
    planName: string;
    status: string;
    amount: number;
    interval: "month" | "year";
    createdAt: string;
}

export interface AdminUserInvoice {
    _id: string;
    amount: number;
    status: "paid" | "pending" | "failed" | "cancelled";
    date: string;
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
