import { ApiService } from "./api.services";
import {
    RequestParams,
    SalesAnalyticsData,
    RevenueAnalyticsData,
    InvoiceAnalyticsData,
    DashboardOverview,
    UserGrowthData,
    EngagementMetrics,
    SalesReportItem,
    RevenueReportItem,
} from "@/types/admin-analytics";
import { ApiResponse } from "@/types/subscription";

class AdminAnalyticsService extends ApiService {
    private buildQueryString(params: RequestParams & { [key: string]: any }): string {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                query.append(key, String(value));
            }
        });
        return query.toString();
    }

    // Analytics
    async getSalesAnalytics(params: RequestParams & { source?: string }): Promise<SalesAnalyticsData> {
        const query = this.buildQueryString(params);
        const response = await this.get<ApiResponse<SalesAnalyticsData>>(`/admin/analytics/sales?${query}`, true);
        return response.data;
    }

    async getRevenueAnalytics(params: RequestParams): Promise<RevenueAnalyticsData> {
        const query = this.buildQueryString(params);
        const response = await this.get<ApiResponse<RevenueAnalyticsData>>(`/admin/analytics/revenue?${query}`, true);
        return response.data;
    }

    async getInvoiceAnalytics(params: { fromDate?: string; toDate?: string; status?: string }): Promise<InvoiceAnalyticsData[]> {
        const query = this.buildQueryString(params);
        const response = await this.get<ApiResponse<InvoiceAnalyticsData[]>>(`/admin/analytics/invoices?${query}`, true);
        return response.data;
    }

    // Reports
    async generateSalesReport(params: RequestParams & { format: "json" | "csv"; includeDetails?: boolean }): Promise<SalesReportItem[] | Blob> {
        const query = this.buildQueryString(params);
        if (params.format === "csv") {
            // Handle CSV blob download
            const response = await this.get<Blob>(`/admin/reports/sales?${query}`, true, { responseType: 'blob' });
            return response;
        }
        const response = await this.get<ApiResponse<SalesReportItem[]>>(`/admin/reports/sales?${query}`, true);
        return response.data;
    }

    async generateRevenueReport(params: RequestParams & { format: "json" | "csv"; groupBy?: string }): Promise<RevenueReportItem[] | Blob> {
        const query = this.buildQueryString(params);
        if (params.format === "csv") {
            const response = await this.get<Blob>(`/admin/reports/revenue?${query}`, true, { responseType: 'blob' });
            return response;
        }
        const response = await this.get<ApiResponse<RevenueReportItem[]>>(`/admin/reports/revenue?${query}`, true);
        return response.data;
    }

    // Metrics
    async getDashboardOverview(params: { fromDate?: string; toDate?: string }): Promise<DashboardOverview> {
        const query = this.buildQueryString(params);
        const response = await this.get<ApiResponse<DashboardOverview>>(`/admin/metrics/overview?${query}`, true);
        return response.data;
    }

    async getUserGrowthMetrics(params: RequestParams): Promise<UserGrowthData[]> {
        const query = this.buildQueryString(params);
        const response = await this.get<ApiResponse<UserGrowthData[]>>(`/admin/metrics/users?${query}`, true);
        return response.data;
    }

    async getEngagementMetrics(params: { fromDate?: string; toDate?: string }): Promise<EngagementMetrics> {
        const query = this.buildQueryString(params);
        const response = await this.get<ApiResponse<EngagementMetrics>>(`/admin/metrics/engagement?${query}`, true);
        return response.data;
    }
}

export const adminAnalyticsService = new AdminAnalyticsService();
