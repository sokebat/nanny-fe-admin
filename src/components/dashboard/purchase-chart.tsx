"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ViewToggle from "./view-toggle";
import { useSalesAnalytics } from "@/hooks/use-admin-analytics";
import { Skeleton } from "@/components/ui/skeleton";

type ViewType = "weekly" | "monthly" | "yearly";

export default function PurchaseChart() {
    const [view, setView] = useState<ViewType>("yearly");

    // Calculate dates based on view
    const getParams = () => {
        const now = new Date();
        const params: any = {};

        switch (view) {
            case "weekly":
                // Last 7 days
                const lastWeek = new Date(now);
                lastWeek.setDate(now.getDate() - 7);
                params.fromDate = lastWeek.toISOString();
                params.groupBy = "day";
                break;
            case "monthly":
                // Last 30 days or start of month? Let's do last 30 days for rolling window
                const lastMonth = new Date(now);
                lastMonth.setDate(now.getDate() - 30);
                params.fromDate = lastMonth.toISOString();
                params.groupBy = "day"; // showing daily breakdown for the month
                break;
            case "yearly":
                // Current year
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                params.fromDate = startOfYear.toISOString();
                params.groupBy = "month";
                break;
        }
        return params;
    };

    const { data: salesData, isLoading } = useSalesAnalytics(getParams());

    const formatData = (data: any) => {
        if (!data || !data.byPeriod || !Array.isArray(data.byPeriod)) return [];

        return data.byPeriod.map((item: any) => ({
            timeSlot: item.date,
            slot1: item.amount,
            slot2: item.amount * 0.8, // Mocked 
            slot3: item.amount * 0.6  // Mocked
        }));
    };

    const chartData = formatData(salesData);

    return (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-brand-navy">Purchase Summary</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Distribution of service requests</p>
                </div>
                <ViewToggle currentView={view} onViewChange={setView} />
            </div>

            {/* Chart */}
            <div className="h-[250px]">
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
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e9e9e9" />
                            <XAxis
                                dataKey="timeSlot"
                                tick={{ fontSize: 10, fill: "#95969c" }}
                                angle={-15}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis tick={{ fontSize: 12, fill: "#667085" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e4e7ec",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar dataKey="slot1" fill="#c8e9f2" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="slot2" fill="#a8cbd1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="slot3" fill="#1f344e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
