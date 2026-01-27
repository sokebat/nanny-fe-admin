"use client";

import { useDashboardOverview } from "@/hooks/use-admin-analytics";
import RevenueChart from "@/components/dashboard/revenue-chart";
import PurchaseChart from "@/components/dashboard/purchase-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { adminAnalyticsService } from "@/services/admin-analytics.service";
import { toast } from "react-hot-toast";
import TopPerforming from "@/components/dashboard/top-performing";
import RevenueBreakdown from "@/components/dashboard/revenue-breakdown";


export default function AnalyticsPage() {
    const { data: overview } = useDashboardOverview();

    const handleDownloadReport = async (type: "sales" | "revenue") => {
        try {
            const blob = await (type === "sales"
                ? adminAnalyticsService.generateSalesReport({ format: "csv", includeDetails: true })
                : adminAnalyticsService.generateRevenueReport({ format: "csv" }));

            // Create download link
            const url = window.URL.createObjectURL(blob as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-report.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success(`${type} report downloaded successfully`);
        } catch (error) {
            toast.error("Failed to download report");
        }
    };

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted ">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
                    <p className="text-muted-foreground">
                        Overview of revenue, sales, and user growth
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDownloadReport("sales")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted bg-white transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export Sales
                    </button>
                    <button
                        onClick={() => handleDownloadReport("revenue")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export Revenue
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <OverviewCard
                    title="Total Revenue"
                    value={`$${(overview?.totalRevenue?.total || 0).toLocaleString()}`}
                    subValue={overview?.totalRevenue?.monthly ? `Monthly: $${overview.totalRevenue.monthly.toLocaleString()}` : 'No monthly data'}
                    icon={DollarSign}
                />
                <OverviewCard
                    title="Active Users"
                    value={(overview?.totalUsers?.total || 0).toLocaleString()}
                    subValue={`Parents: ${overview?.totalUsers?.parents || 0}, Nannies: ${overview?.totalUsers?.nannies || 0}`}
                    icon={Users}
                />
                <OverviewCard
                    title="Active Subscriptions"
                    value={(overview?.subscriptionStats?.active || 0).toLocaleString()}
                    subValue={`Revenue: $${(overview?.subscriptionStats?.revenue || 0).toLocaleString()}`}
                    icon={Activity}
                />
                <OverviewCard
                    title="Total Jobs"
                    value={(overview?.totalJobs?.total || 0).toLocaleString()}
                    subValue={`Active: ${overview?.totalJobs?.active || 0}`}
                    icon={TrendingUp}
                />
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview Charts</TabsTrigger>
                    <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
                    <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueChart />
                        <PurchaseChart />
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <TopPerforming />
                    </div>
                </TabsContent>

                <TabsContent value="sales" className="space-y-6">
                    <div className="p-6 bg-card rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Detailed Sales Analysis</h3>
                        <PurchaseChart />
                    </div>
                    {/* Future: Sales Table */}
                </TabsContent>

                <TabsContent value="revenue" className="space-y-6">
                    <div className="p-6 bg-card rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Detailed Revenue Analysis</h3>
                        <RevenueChart />
                    </div>
                    <RevenueBreakdown />
                </TabsContent>
            </Tabs>
        </main>
    );
}

function OverviewCard({ title, value, subValue, icon: Icon }: { title: string, value: string | number, subValue: React.ReactNode, icon: any }) {
    return (
        <div className="p-6 bg-card border rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xs text-muted-foreground mt-1">{subValue}</span>
            </div>
        </div>
    );
}