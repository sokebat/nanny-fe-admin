"use client";

import { cn } from "@/lib/utils";

type ViewType = "weekly" | "monthly" | "yearly";

interface ViewToggleProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    const views: ViewType[] = ["weekly", "monthly", "yearly"];

    return (
        <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50">
            {views.map((view) => (
                <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-tight",
                        currentView === view
                            ? "bg-brand-navy text-white shadow-sm"
                            : "text-muted-foreground hover:text-brand-navy hover:bg-white/50"
                    )}
                >
                    {view}
                </button>
            ))}
        </div>
    );
}
