import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Play, Music, Link, Layout, Box } from "lucide-react";
import type { ResourceStatsBase } from "@/types/resource";

interface ResourceStatsProps {
    stats: ResourceStatsBase;
}

export function ResourceStats({ stats }: ResourceStatsProps) {
    const statCards = [
        {
            title: "Total Resources",
            value: stats.totalResources,
            icon: Box,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "PDFs",
            value: stats.byType?.pdf || 0,
            icon: FileText,
            color: "text-red-600",
            bg: "bg-red-50",
        },
        {
            title: "Videos",
            value: stats.byType?.video || 0,
            icon: Play,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Audio",
            value: stats.byType?.audio || 0,
            icon: Music,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            title: "Articles/Links",
            value: (stats.byType?.article || 0) + (stats.byType?.link || 0),
            icon: Link,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            title: "Popular",
            value: stats.popularCount || 0,
            icon: Layout,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat, index) => (
                <Card key={index} className="border shadow-none rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
