import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Globe, Star, Eye } from "lucide-react";
import type { ResourceStatsBase } from "@/types/resource";

interface ResourceStatsProps {
    stats: ResourceStatsBase;
}

export function ResourceStats({ stats }: ResourceStatsProps) {
    const statCards = [
        {
            title: "Total Resources",
            value: stats.resources.total,
            icon: Box,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Listed Resources",
            value: stats.resources.listed,
            icon: Globe,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            title: "Popular Choice",
            value: stats.resources.popular,
            icon: Star,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
        },
        {
            title: "Total Views",
            value: stats.views.total,
            icon: Eye,
            color: "text-brand-navy",
            bg: "bg-slate-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <Card key={index} className="border shadow-none rounded-2xl overflow-hidden group hover:border-brand-navy/20 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                        <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-brand-navy transition-colors">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                            <stat.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-[#1E293B] tracking-tight">{stat.value.toLocaleString()}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
