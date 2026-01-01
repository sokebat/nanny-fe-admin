type ViewType = "weekly" | "monthly" | "yearly";

interface ViewToggleProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    const views: ViewType[] = ["weekly", "monthly", "yearly"];

    return (
        <div className="flex gap-2">
            {views.map((view) => (
                <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === view
                        ? "bg-[rgba(31,52,78,0.23)] text-brand-navy"
                        : "bg-muted text-muted-foreground"
                        }`}
                >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
            ))}
        </div>
    );
}
