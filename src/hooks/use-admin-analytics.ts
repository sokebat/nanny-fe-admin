import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsService } from "@/services/admin-analytics.service";
import { RequestParams } from "@/types/admin-analytics";

export const ADMIN_ANALYTICS_KEYS = {
    all: ["admin-analytics"] as const,
    sales: (params: RequestParams & { source?: string }) => [...ADMIN_ANALYTICS_KEYS.all, "sales", params] as const,
    revenue: (params: RequestParams) => [...ADMIN_ANALYTICS_KEYS.all, "revenue", params] as const,
    invoices: (params: { fromDate?: string; toDate?: string; status?: string }) => [...ADMIN_ANALYTICS_KEYS.all, "invoices", params] as const,
    overview: (params: { fromDate?: string; toDate?: string }) => [...ADMIN_ANALYTICS_KEYS.all, "overview", params] as const,
    userGrowth: (params: RequestParams) => [...ADMIN_ANALYTICS_KEYS.all, "user-growth", params] as const,
    engagement: (params: { fromDate?: string; toDate?: string }) => [...ADMIN_ANALYTICS_KEYS.all, "engagement", params] as const,
};

export const useSalesAnalytics = (params: RequestParams & { source?: string } = {}) => {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_KEYS.sales(params),
        queryFn: () => adminAnalyticsService.getSalesAnalytics(params),
    });
};

export const useRevenueAnalytics = (params: RequestParams = {}) => {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_KEYS.revenue(params),
        queryFn: () => adminAnalyticsService.getRevenueAnalytics(params),
    });
};

export const useInvoiceAnalytics = (params: { fromDate?: string; toDate?: string; status?: string } = {}) => {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_KEYS.invoices(params),
        queryFn: () => adminAnalyticsService.getInvoiceAnalytics(params),
    });
};

export const useDashboardOverview = (params: { fromDate?: string; toDate?: string } = {}) => {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_KEYS.overview(params),
        queryFn: () => adminAnalyticsService.getDashboardOverview(params),
    });
};

export const useUserGrowthMetrics = (params: RequestParams = {}) => {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_KEYS.userGrowth(params),
        queryFn: () => adminAnalyticsService.getUserGrowthMetrics(params),
    });
};

export const useEngagementMetrics = (params: { fromDate?: string; toDate?: string } = {}) => {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_KEYS.engagement(params),
        queryFn: () => adminAnalyticsService.getEngagementMetrics(params),
    });
};
