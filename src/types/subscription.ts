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
    _id: string;
    userId: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        phone?: string;
    };
    planId: {
        _id: string;
        name: string;
        pricingMonthly: number;
        pricingYearly: number;
    };
    billingCycle: BillingCycle;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
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

export interface PaginatedSubscriptions {
    subscriptions: UserSubscription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

