"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ViewToggle from "./view-toggle";

type ViewType = "weekly" | "monthly" | "yearly";

const purchaseData = [
    { timeSlot: "10:00 am-01:00 pm", slot1: 60, slot2: 50, slot3: 80 },
    { timeSlot: "01:00 pm-04:00 pm", slot1: 40, slot2: 45, slot3: 50 },
    { timeSlot: "04:00 pm-07:00 pm", slot1: 70, slot2: 65, slot3: 75 },
    { timeSlot: "07:00 pm-10:00 pm", slot1: 35, slot2: 40, slot3: 55 },
];

export default function PurchaseChart() {
    const [view, setView] = useState<ViewType>("yearly");

    return (
        <div className="bg-card border border-border rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Purchase Summary</h3>
                <ViewToggle currentView={view} onViewChange={setView} />
            </div>

            {/* Chart */}
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purchaseData}>
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
            </div>
        </div>
    );
}
