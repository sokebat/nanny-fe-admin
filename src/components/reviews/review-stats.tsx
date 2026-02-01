"use client";

import { useAdminReviewStats } from "@/hooks/use-admin-reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare, Users, TrendingUp } from "lucide-react";

export function ReviewStats() {
    const { data: stats, isLoading } = useAdminReviewStats();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card border rounded-lg p-5 flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Total Reviews",
            value: stats?.totalReviews || 0,
            icon: MessageSquare,
            bgColor: "bg-[#daeceb]",
            iconColor: "text-[#a8cbd1]",
        },
        {
            title: "Average Rating",
            value: stats?.averageRating?.toFixed(1) || "0.0",
            icon: Star,
            bgColor: "bg-[#f4faf9]",
            iconColor: "text-orange-400",
        },
        {
            title: "Recent Reviews",
            value: stats?.recentReviews?.length || 0,
            icon: TrendingUp,
            bgColor: "bg-[rgba(218,236,235,0.3)]",
            iconColor: "text-[#daeceb]",
        },
        {
            title: "Review Distribution",
            value: Object.keys(stats?.reviewsByRole || {}).length || 0,
            icon: Users,
            bgColor: "bg-orange-50",
            iconColor: "text-orange-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className={`${card.bgColor} rounded-lg p-5 flex items-center justify-between shadow-sm`}>
                    <div>
                        <p className="text-2xl font-semibold text-[#18191c] mb-1">{card.value}</p>
                        <p className="text-sm text-[#18191c]/80">{card.title}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <card.icon className={`size-6 ${card.iconColor}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}
