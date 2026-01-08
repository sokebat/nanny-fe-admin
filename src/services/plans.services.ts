import { ApiService } from "./api.services";
import {
    Plan,
    CreatePlanDto,
    UpdatePlanDto,
    UserSubscription,
    PaginatedData,
    UserRole,
    SubscriptionStatus,
    ApiResponse
} from "@/types/subscription";

class PlansService extends ApiService {
    // Admin Plan APIs
    async getAllPlans(role?: UserRole, isActive?: boolean): Promise<Plan[]> {
        const params = new URLSearchParams();
        if (role) params.append("role", role);
        if (isActive !== undefined) params.append("isActive", String(isActive));

        const response = await this.get<ApiResponse<{ plans: Plan[] }>>(`/admin/subscriptions/plans?${params.toString()}`, true);
        return response.data.plans;
    }

    async createPlan(data: CreatePlanDto, autoCreateStripePrices = true): Promise<Plan> {
        const response = await this.post<ApiResponse<{ plan: Plan }>>(
            `/admin/subscriptions/plans?autoCreateStripePrices=${autoCreateStripePrices}`,
            data,
            true
        );
        return response.data.plan;
    }

    async updatePlan(id: string, data: UpdatePlanDto): Promise<Plan> {
        const response = await this.patch<ApiResponse<Plan>>(`/admin/subscriptions/plans/${id}`, data, true);
        return response.data;
    }

    async deletePlan(id: string): Promise<void> {
        await this.delete<ApiResponse<void>>(`/admin/subscriptions/plans/${id}`, true);
    }

    async createStripePrice(id: string, billingCycle: "monthly" | "yearly"): Promise<{ priceId: string }> {
        const response = await this.post<ApiResponse<{ priceId: string }>>(
            `/admin/subscriptions/plans/${id}/create-stripe-price?billingCycle=${billingCycle}`,
            {},
            true
        );
        return response.data;
    }

    // Admin User Subscription APIs
    async getAllUserSubscriptions(params: {
        page?: number;
        limit?: number;
        role?: UserRole;
        status?: SubscriptionStatus;
        planId?: string;
    }): Promise<PaginatedData<UserSubscription>> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", String(params.page));
        if (params.limit) queryParams.append("limit", String(params.limit));
        if (params.role) queryParams.append("role", params.role);
        if (params.status) queryParams.append("status", params.status);
        if (params.planId) queryParams.append("planId", params.planId);

        const response = await this.get<ApiResponse<PaginatedData<UserSubscription>>>(
            `/admin/subscriptions/users?${queryParams.toString()}`,
            true
        );
        return response.data;
    }
}

export const plansService = new PlansService();
