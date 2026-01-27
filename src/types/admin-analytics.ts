export interface RequestParams {
    fromDate?: string;
    toDate?: string;
    groupBy?: "day" | "week" | "month";
}

export interface SalesAnalyticsResponse {
    total: number;
    count: number;
    byPeriod: Array<{
        date: string;
        amount: number;
        count: number;
    }>;
    bySource: {
        subscriptions: number;
        courses: number;
        invoices: number;
        [key: string]: number;
    };
    trends: {
        growth: number;
        change: number;
    };
}

export interface RevenueAnalyticsResponse {
    total: number;
    bySource: {
        subscriptions: {
            monthly: number;
            yearly: number;
            total: number;
        };
        courses: number;
        invoices: number;
        commissions: number;
        [key: string]: any;
    };
    byRole: {
        nannies: number;
        parents: number;
        vendors: number;
    };
    trends: Array<{
        date: string;
        amount: number;
        count: number;
    }>;
}

export interface DashboardOverview {
    totalUsers: {
        nannies: number;
        parents: number;
        vendors: number;
        total: number;
    };
    totalJobs: {
        active: number;
        completed: number;
        total: number;
    };
    totalCourses: {
        active: number;
        total: number;
        enrollments: number;
    };
    totalResources: {
        active: number;
        total: number;
        views: number;
    };
    totalRevenue: {
        monthly: number;
        yearly: number;
        total: number;
    };
    subscriptionStats: {
        active: number;
        cancelled: number;
        revenue: number;
    };
    topPerforming: {
        courses: Array<any>;
        resources: Array<any>;
    };
}

export interface UserGrowthData {
    date: string;
    parents: number;
    nannies: number;
    vendors: number;
    total: number;
}

export interface EngagementMetrics {
    activeUsers: number;
    jobPostings: number;
    jobApplications: number;
    messagesExchanged: number;
    // Trends
    activeUsersTrend: number;
    jobPostingsTrend: number;
    jobApplicationsTrend: number;
    messagesTrend: number;
}

export interface InvoiceAnalyticsData {
    status: "paid" | "pending" | "failed" | "cancelled";
    count: number;
    amount: number;
}

export interface SalesReportItem {
    transactionId: string;
    user: string;
    amount: number;
    type: string;
    date: string;
    status: string;
}

export interface RevenueReportItem {
    source: string;
    amount: number;
    transactions: number;
}

// Keeping these for backward compatibility if needed, or aliases
export type SalesAnalyticsData = SalesAnalyticsResponse;
export type RevenueAnalyticsData = RevenueAnalyticsResponse;
