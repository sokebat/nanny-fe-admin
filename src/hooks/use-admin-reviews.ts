import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminReviewsService } from "@/services/admin-reviews.service";
import { AdminReviewFilters } from "@/types/admin-reviews";
import { toast } from "react-hot-toast";

export const ADMIN_REVIEWS_KEYS = {
    all: ["admin-reviews"] as const,
    lists: () => [...ADMIN_REVIEWS_KEYS.all, "list"] as const,
    list: (filters: AdminReviewFilters) => [...ADMIN_REVIEWS_KEYS.lists(), filters] as const,
    stats: () => [...ADMIN_REVIEWS_KEYS.all, "stats"] as const,
};

export const useAdminReviews = (filters: AdminReviewFilters) => {
    return useQuery({
        queryKey: ADMIN_REVIEWS_KEYS.list(filters),
        queryFn: () => adminReviewsService.getAllReviews(filters),
    });
};

export const useAdminReviewStats = () => {
    return useQuery({
        queryKey: ADMIN_REVIEWS_KEYS.stats(),
        queryFn: () => adminReviewsService.getReviewStatistics(),
    });
};

export const useDeleteAdminReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminReviewsService.deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEYS.stats() });
            toast.success("Review deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete review");
        },
    });
};
