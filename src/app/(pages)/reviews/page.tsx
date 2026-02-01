"use client";

import { useState } from "react";
import { useAdminReviews } from "@/hooks/use-admin-reviews";
import { ReviewsTable } from "@/components/reviews/reviews-table";
import { reviewColumns } from "@/components/reviews/review-columns";
import { ReviewStats } from "@/components/reviews/review-stats";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ReviewsPage() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [filters, setFilters] = useState({
        search: "",
        minRating: "",
    });

    const { data, isLoading, isError } = useAdminReviews({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        // search: filters.search, // Uncomment if API supports search
        // minRating: filters.minRating ? Number(filters.minRating) : undefined,
    });

    const pageCount = data?.pagination?.totalPages || 0;

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Reviews Management</h2>
                    <p className="text-slate-500 mt-1">
                        Monitor and manage all platform reviews and feedback.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Search reviews..."
                            className="pl-9 bg-white border-slate-200"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter className="size-4" />
                        Filters
                    </button>
                </div>
            </div>

            <ReviewStats />

            {isError ? (
                <div className="p-8 rounded-xl bg-red-50 border border-red-100 text-red-600 flex flex-col items-center justify-center text-center">
                    <p className="font-semibold text-lg">Failed to load reviews</p>
                    <p className="text-sm mt-1 opacity-80">There was an error fetching the data from the server. Please try again later.</p>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center p-24 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    <p className="mt-4 text-slate-500 font-medium">Loading reviews...</p>
                </div>
            ) : (
                <ReviewsTable
                    columns={reviewColumns}
                    data={data?.reviews || []}
                    pageCount={pageCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </main>
    );
}
