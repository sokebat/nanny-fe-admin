"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ViewToggle from "./view-toggle";
import { useRevenueAnalytics } from "@/hooks/use-admin-analytics";

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
        <div className="bg-card border border-border rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Revenue</h3>
                <ViewToggle currentView={view} onViewChange={setView} />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-brand-navy rounded-sm" />
                    <span className="text-foreground">This Year</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-brand-orange rounded-sm" />
                    <span className="text-foreground">Previous Year</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-[#a8cbd1] rounded-sm" />
                    <span className="text-foreground">Local Average</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[200px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading revenue data...</div>
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
