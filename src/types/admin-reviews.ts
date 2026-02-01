import { UserRole } from "./subscription";

export interface ReviewUser {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface Review {
    _id: string;
    reviewerId: ReviewUser;
    revieweeId: ReviewUser;
    reviewerRole: string;
    revieweeRole: string;
    rating: number;
    comment: string;
    isVerified: boolean;
    isVisible: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    response?: string;
    __v?: number;
}

export interface AdminReviewFilters {
    page?: number;
    limit?: number;
    revieweeId?: string;
    reviewerId?: string;
    revieweeRole?: string;
    minRating?: number;
    jobId?: string;
}

export interface ReviewStatistics {
    totalReviews: number;
    averageRating: number;
    reviewsByRole: {
        nanny: number;
        parent: number;
        vendor: number;
    };
    recentReviews: Review[];
    ratingDistribution: {
        [key: string]: number;
    };
}

export interface PaginatedReviewsResponse {
    reviews: Review[];
    pagination: {
        page: string | number;
        limit: string | number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
