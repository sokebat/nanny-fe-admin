"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ViewToggle from "./view-toggle";

type ViewType = "weekly" | "monthly" | "yearly";

const revenueData = [
    { month: "Jan", thisYear: 45000, previousYear: 38000, localAverage: 35000 },
    { month: "Feb", thisYear: 52000, previousYear: 42000, localAverage: 38000 },
    { month: "Mar", thisYear: 48000, previousYear: 45000, localAverage: 40000 },
    { month: "Apr", thisYear: 61000, previousYear: 48000, localAverage: 43000 },
    { month: "May", thisYear: 55000, previousYear: 52000, localAverage: 46000 },
    { month: "Jun", thisYear: 67000, previousYear: 55000, localAverage: 49000 },
];

export default function RevenueChart() {
    const [view, setView] = useState<ViewType>("yearly");

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
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
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
                            dataKey="thisYear"
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
            </div>
        </div>
    );
}
