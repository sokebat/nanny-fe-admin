import { cn } from "@/lib/utils";

export type StatusType = "Uploaded" | "Pending";

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium",
                status === "Uploaded" && "text-green-600",
                status === "Pending" && "text-orange-600",
                className
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    status === "Uploaded" && "bg-green-600",
                    status === "Pending" && "bg-orange-600"
                )}
            />
            {status}
        </span>
    );
}
