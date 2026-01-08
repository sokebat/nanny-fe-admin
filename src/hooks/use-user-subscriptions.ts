import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services/plans.services";
import { UserRole, SubscriptionStatus } from "@/types/subscription";

export const SUBSCRIPTIONS_QUERY_KEY = "user-subscriptions";

export const useUserSubscriptionsManagement = (params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: SubscriptionStatus;
    planId?: string;
}) => {
    const getSubscriptionsQuery = useQuery({
        queryKey: [SUBSCRIPTIONS_QUERY_KEY, params],
        queryFn: () => plansService.getAllUserSubscriptions(params),
    });

    return {
        getSubscriptionsQuery,
    };
};

