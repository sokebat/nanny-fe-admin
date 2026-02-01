"use client";
import { useDashboardOverview, useEngagementMetrics } from "@/hooks/use-admin-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function StatsCards() {
    const { data: overview, isLoading: isLoadingOverview } = useDashboardOverview();
    const { data: engagement, isLoading: isLoadingEngagement } = useEngagementMetrics();

    const isLoading = isLoadingOverview || isLoadingEngagement;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm animate-pulse">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24 bg-muted" />
                            <Skeleton className="h-8 w-16 bg-muted/60" />
                        </div>
                        <Skeleton className="h-14 w-14 rounded-xl bg-muted/40" />
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Active Jobs",
            value: (overview?.totalJobs?.total || 0).toLocaleString(),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.5L11.5 3H12.5L14.5 5H19C20.1046 5 21 5.89543 21 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            bg: "bg-brand-navy/5",
            textColor: "text-brand-navy"
        },
        {
            title: "Active Users",
            value: (overview?.totalUsers?.total || 0).toLocaleString(),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            bg: "bg-brand-orange/10",
            textColor: "text-brand-orange"
        },
        {
            title: "Total Messages",
            value: (engagement?.messages || 0).toLocaleString(),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21 12.3151 20.8504 13.1222 20.5599 13.840c-0.2905 0.7378 -0.7378 1.403 -1.2721 1.9373l-1.9373 1.9373c-0.5342 0.5343 -1.1995 0.9816 -1.9373 1.2721 -0.7178 0.2905 -1.5249 0.4401 -2.34 0.4401H5L3 21V11.5C3 10.6849 3.1495 9.87784 3.4401 9.14002c0.2905 -0.7378 0.7378 -1.403 1.2721 -1.9373L6.6495 5.26538c0.5342 -0.5342 1.1995 -0.9815 1.9373 -1.2721C9.3046 3.70278 10.1117 3.55325 10.9268 3.55325h6.5332c0.8151 0 1.6222 0.1495 2.34 0.4401 0.7378 0.2905 1.403 0.7378 1.9373 1.2721l1.9373 1.9373c0.5342 0.5342 0.9815 1.1995 1.2721 1.9373z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            bg: "bg-brand-navy/5",
            textColor: "text-brand-navy"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
                <div key={idx} className="group bg-white rounded-2xl p-6 flex items-center justify-between border border-border shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 cursor-default">
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 group-hover:text-brand-navy transition-colors">{card.title}</p>
                        <h3 className="text-3xl font-bold text-brand-navy tracking-tight">{card.value}</h3>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] font-bold text-green-600 uppercase">Live Update</span>
                        </div>
                    </div>
                    <div className={cn("p-4 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-inner", card.bg, card.textColor)}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}
