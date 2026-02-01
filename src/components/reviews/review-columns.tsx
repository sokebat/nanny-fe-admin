"use client";

import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/admin-reviews";
import { format } from "date-fns";
import { Star, MoreHorizontal, Trash, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useDeleteAdminReview } from "@/hooks/use-admin-reviews";
import { cn } from "@/lib/utils";

import { ReviewDetailsDialog } from "./review-details-dialog";
import { useState } from "react";

const columnHelper = createColumnHelper<Review>();

const ReviewActions = ({ review }: { review: Review }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { mutate: deleteReview } = useDeleteAdminReview();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                        Review Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => setIsDetailsOpen(true)}
                        className="cursor-pointer gap-2 py-2.5"
                    >
                        <Eye className="size-4 text-slate-500" />
                        <span className="font-medium text-slate-600">View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer gap-2 py-2.5"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this review?")) {
                                deleteReview(review._id);
                            }
                        }}
                    >
                        <Trash className="size-4" />
                        <span className="font-medium">Delete Review</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ReviewDetailsDialog
                review={review}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </>
    );
};

export const reviewColumns: ColumnDef<Review, any>[] = [
    columnHelper.accessor("reviewerId", {
        header: "Reviewer",
        cell: (info) => {
            const user = info.getValue();
            const role = info.row.original.reviewerRole;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">
                        {user.firstName} {user.lastName}
                    </span>
                    <Badge variant="outline" className="w-fit mt-1 text-[10px] uppercase font-bold text-slate-400 border-slate-100 px-1.5 h-4">
                        {role}
                    </Badge>
                </div>
            );
        },
    }),
    columnHelper.accessor("revieweeId", {
        header: "Reviewee",
        cell: (info) => {
            const user = info.getValue();
            const role = info.row.original.revieweeRole;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">
                        {user.firstName} {user.lastName}
                    </span>
                    <Badge variant="outline" className="w-fit mt-1 text-[10px] uppercase font-bold text-slate-400 border-slate-100 px-1.5 h-4">
                        {role}
                    </Badge>
                </div>
            );
        },
    }),
    columnHelper.accessor("rating", {
        header: "Rating",
        cell: (info) => (
            <div className="flex items-center gap-1.5 bg-orange-50 w-fit px-2 py-1 rounded-lg border border-orange-100">
                <span className="font-bold text-orange-700 text-xs">{info.getValue()}.0</span>
                <Star className="size-3 fill-orange-500 text-orange-500" />
            </div>
        ),
    }),
    columnHelper.accessor("comment", {
        header: "Comment",
        cell: (info) => (
            <div className="max-w-[250px] truncate text-slate-600 italic text-sm" title={info.getValue()}>
                "{info.getValue()}"
            </div>
        ),
    }),
    columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-900 italic opacity-80">{format(new Date(info.getValue()), "PP")}</span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">{format(new Date(info.getValue()), "p")}</span>
            </div>
        ),
    }),
    columnHelper.accessor("isDeleted", {
        header: "Status",
        cell: (info) => (
            <Badge
                className={cn(
                    "text-[10px] uppercase font-bold px-2 py-0 border-none",
                    info.getValue()
                        ? "bg-red-50 text-red-600 hover:bg-red-50/80"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-50/80"
                )}
            >
                {info.getValue() ? "Deleted" : "Active"}
            </Badge>
        ),
    }),
    columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <ReviewActions review={row.original} />
            </div>
        ),
    }),
];

