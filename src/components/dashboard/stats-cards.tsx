"use client";
import { useDashboardOverview, useEngagementMetrics } from "@/hooks/use-admin-analytics";

import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards() {
    const { data: overview, isLoading: isLoadingOverview } = useDashboardOverview();
    const { data: engagement, isLoading: isLoadingEngagement } = useEngagementMetrics();

    const isLoading = isLoadingOverview || isLoadingEngagement;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#daeceb] rounded-lg p-5 flex items-center justify-between">
                <div>
                    <p className="text-2xl font-semibold text-[#18191c] mb-1">{(overview?.totalJobs?.total || 0).toLocaleString()}</p>
                    <p className="text-sm text-[#18191c]/80">Active Jobs</p>
                </div>
                <div className="bg-white p-4 rounded">
                    <div className="w-8 h-8 text-[#a8cbd1]">
                        <svg viewBox="0 0 32 32" fill="none">
                            <rect x="11" y="5" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="4" y="9" width="24" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="14.5" y1="15" x2="17.5" y2="15" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-[#f4faf9] rounded-lg p-5 flex items-center justify-between">
                <div>
                    <p className="text-2xl font-semibold text-[#18191c] mb-1">{(overview?.totalUsers?.total || 0).toLocaleString()}</p>
                    <p className="text-sm text-[#18191c]/80">Active Users</p>
                </div>
                <div className="bg-white p-4 rounded">
                    <div className="w-8 h-8 text-[#a8cbd1]">
                        <svg viewBox="0 0 32 32" fill="currentColor">
                            <circle cx="16" cy="10" r="5" />
                            <path d="M7 27c0-5 4-9 9-9s9 4 9 9" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-[rgba(218,236,235,0.3)] rounded-lg p-5 flex items-center justify-between">
                <div>
                    <p className="text-2xl font-semibold text-[#18191c] mb-1">{(engagement?.messages || 0).toLocaleString()}</p>
                    <p className="text-sm text-[#18191c]/80">Total Messages</p>
                </div>
                <div className="bg-white p-4 rounded">
                    <div className="w-8 h-8 text-[#daeceb]">
                        <svg viewBox="0 0 32 32" fill="currentColor">
                            <path d="M6 6h20a2 2 0 012 2v12a2 2 0 01-2 2h-14l-6 6V8a2 2 0 012-2z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
