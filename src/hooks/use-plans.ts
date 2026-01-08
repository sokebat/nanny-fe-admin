import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansService } from "@/services/plans.services";
import { CreatePlanDto, UpdatePlanDto, UserRole } from "@/types/subscription";
import { toast } from "react-hot-toast";

export const PLANS_QUERY_KEY = "plans";

export const useSubscriptionPlans = (role?: UserRole, isActive?: boolean) => {
    const queryClient = useQueryClient();

    const getPlansQuery = useQuery({
        queryKey: [PLANS_QUERY_KEY, { role, isActive }],
        queryFn: () => plansService.getAllPlans(role, isActive),
    });

    const createPlanMutation = useMutation({
        mutationFn: async (data: CreatePlanDto) => {
            try {
                const response = await plansService.createPlan(data);
                toast.success("Plan created successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to create plan");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PLANS_QUERY_KEY] });
        },
    });

    const updatePlanMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdatePlanDto }) => {
            try {
                const response = await plansService.updatePlan(id, data);
                toast.success("Plan updated successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update plan");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PLANS_QUERY_KEY] });
        },
    });

    const deletePlanMutation = useMutation({
        mutationFn: async (id: string) => {
            try {
                const response = await plansService.deletePlan(id);
                toast.success("Plan deleted successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to delete plan");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PLANS_QUERY_KEY] });
        },
    });

    const createStripePriceMutation = useMutation({
        mutationFn: async ({ id, billingCycle }: { id: string; billingCycle: "monthly" | "yearly" }) => {
            try {
                const response = await plansService.createStripePrice(id, billingCycle);
                toast.success("Stripe price created successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to create Stripe price");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PLANS_QUERY_KEY] });
        },
    });

    return {
        getPlansQuery,
        createPlan: createPlanMutation,
        updatePlan: updatePlanMutation,
        deletePlan: deletePlanMutation,
        createStripePrice: createStripePriceMutation,
    };
};

