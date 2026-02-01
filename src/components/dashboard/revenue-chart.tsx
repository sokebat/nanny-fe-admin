"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ViewToggle from "./view-toggle";
import { useRevenueAnalytics } from "@/hooks/use-admin-analytics";
import { Skeleton } from "@/components/ui/skeleton";

type ViewType = "weekly" | "monthly" | "yearly";

export default function RevenueChart() {
    const [view, setView] = useState<ViewType>("yearly");

    // Calculate dates based on view
    const getParams = () => {
        const now = new Date();
        const params: any = {};

        switch (view) {
            case "weekly":
                const lastWeek = new Date(now);
                lastWeek.setDate(now.getDate() - 7);
                params.fromDate = lastWeek.toISOString();
                params.groupBy = "day";
                break;
            case "monthly":
                const lastMonth = new Date(now);
                lastMonth.setDate(now.getDate() - 30);
                params.fromDate = lastMonth.toISOString();
                params.groupBy = "day";
                break;
            case "yearly":
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                params.fromDate = startOfYear.toISOString();
                params.groupBy = "month";
                break;
        }
        return params;
    };

    const { data: revenueData, isLoading } = useRevenueAnalytics(getParams());

    const formatData = (data: any) => {
        if (!data || !data.trends || !Array.isArray(data.trends)) return [];

        return data.trends.map((item: any) => ({
            month: item.date,
            revenue: item.amount,
            previousYear: item.amount * 0.8, // Mocked
            localAverage: item.amount * 0.9  // Mocked
        }));
    };

    const chartData = formatData(revenueData);

    return (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-brand-navy">Revenue Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Performance tracking over time</p>
                </div>
                <ViewToggle currentView={view} onViewChange={setView} />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mb-6 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-brand-navy rounded-full shadow-[0_0_8px_rgba(31,52,78,0.3)]" />
                    <span className="text-xs font-semibold text-foreground/70 uppercase">This Year</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-brand-orange rounded-full shadow-[0_0_8px_rgba(249,125,97,0.3)]" />
                    <span className="text-xs font-semibold text-foreground/70 uppercase">Previous Year</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#a8cbd1] rounded-full shadow-[0_0_8px_rgba(168,203,209,0.3)]" />
                    <span className="text-xs font-semibold text-foreground/70 uppercase">Local Average</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[200px]">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col gap-4 pt-4">
                        <Skeleton className="w-[80%] h-4" />
                        <div className="flex-1 flex items-end gap-2">
                            <Skeleton className="w-full h-[60%]" />
                            <Skeleton className="w-full h-[80%]" />
                            <Skeleton className="w-full h-[40%]" />
                            <Skeleton className="w-full h-[90%]" />
                            <Skeleton className="w-full h-[50%]" />
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e9e9e9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} />
                            <YAxis tick={{ fontSize: 12, fill: "#667085" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e4e7ec",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#1f344e"
                                strokeWidth={2}
                                dot={{ fill: "#1f344e", r: 4 }}
                                name="This Year"
                            />
                            <Line
                                type="monotone"
                                dataKey="previousYear"
                                stroke="#f97d61"
                                strokeWidth={2}
                                dot={{ fill: "#f97d61", r: 4 }}
                                name="Previous Year"
                            />
                            <Line
                                type="monotone"
                                dataKey="localAverage"
                                stroke="#a8cbd1"
                                strokeWidth={2}
                                dot={{ fill: "#a8cbd1", r: 4 }}
                                name="Local Average"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
