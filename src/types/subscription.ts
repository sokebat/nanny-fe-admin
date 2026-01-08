export type UserRole = "caregiver" | "parent" | "vendor";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due";
export type BillingCycle = "monthly" | "yearly";

export interface Quotas {
    messages?: number;
    jobApplications?: number;
    jobPostings?: number;
    services?: number;
    products?: number;
}

export interface Plan {
    id: string;
    _id?: string; // API uses _id
    name: string;
    role: UserRole;
    description: string;
    features: string[];
    pricingMonthly: number;
    pricingYearly: number;
    stripePriceIdMonthly?: string;
    stripePriceIdYearly?: string;
    quotas: Quotas;
    isActive: boolean;
    isPopular: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserSubscription {
    id: string;
    _id?: string;
    userId: string;
    user: {
        name: string;
        email: string;
    };
    planId: string;
    plan: Plan;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    startDate: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlanDto {
    name: string;
    role: UserRole;
    description?: string;
    features: string[];
    pricingMonthly: number;
    pricingYearly: number;
    quotas?: Quotas;
    isActive?: boolean;
    isPopular?: boolean;
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> { }

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface PaginatedData<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

