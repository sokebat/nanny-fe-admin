import { ApiService } from "./api.services";
import {
    Review,
    AdminReviewFilters,
    ReviewStatistics,
    PaginatedReviewsResponse
} from "@/types/admin-reviews";
import { ApiResponse } from "@/types/subscription";

class AdminReviewsService extends ApiService {
    async getAllReviews(filters: AdminReviewFilters = {}): Promise<PaginatedReviewsResponse> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, String(value));
            }
        });

        const response = await this.get<ApiResponse<PaginatedReviewsResponse>>(
            `/admin/reviews?${params.toString()}`,
            true
        );
        return response.data;
    }

    async getReviewStatistics(): Promise<ReviewStatistics> {
        const response = await this.get<ApiResponse<ReviewStatistics>>(
            "/admin/reviews/statistics",
            true
        );
        return response.data;
    }

    async deleteReview(id: string): Promise<void> {
        await this.delete(`/admin/reviews/${id}`, true);
    }
}

export const adminReviewsService = new AdminReviewsService();
