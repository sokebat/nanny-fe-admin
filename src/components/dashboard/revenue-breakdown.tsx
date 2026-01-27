"use client";

import { useRevenueAnalytics } from "@/hooks/use-admin-analytics";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function RevenueBreakdown() {
    const { data: revenueData, isLoading } = useRevenueAnalytics({ groupBy: "month" });

    if (isLoading || !revenueData) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading breakdown...</div>;
    }

    const sourceData = [
        { name: "Subscriptions", value: revenueData.bySource.subscriptions.total, color: "#1f344e" },
        { name: "Courses", value: revenueData.bySource.courses, color: "#f97d61" },
        { name: "Invoices", value: revenueData.bySource.invoices, color: "#a8cbd1" },
    ].filter(item => item.value > 0);

    const roleData = [
        { name: "Nannies", value: revenueData.byRole.nannies, color: "#c8e9f2" },
        { name: "Parents", value: revenueData.byRole.parents, color: "#1f344e" },
        { name: "Vendors", value: revenueData.byRole.vendors, color: "#f97d61" },
    ].filter(item => item.value > 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-4">Revenue by Source</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-4">Revenue by Role</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={roleData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {roleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
