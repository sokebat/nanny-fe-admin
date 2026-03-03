"use client";

import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { AdminUser } from "@/types/admin-users";
import { format } from "date-fns";
import { MoreHorizontal, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const columnHelper = createColumnHelper<AdminUser>();

type UserRowActions = {
    isBusy?: boolean;
    onRestrict: (user: AdminUser) => void;
    onUnrestrict: (user: AdminUser) => void;
    onBan: (user: AdminUser) => void;
    onUnban: (user: AdminUser) => void;
};

export const getUserColumns = (actions: UserRowActions): ColumnDef<AdminUser, any>[] => [
    columnHelper.accessor((row) => `${row.firstName || ""} ${row.lastName || ""}`.trim() || "N/A", {
        id: "name",
        header: "Name",
        cell: (info) => <span className="text-sm font-medium text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => (
            <span className="capitalize px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor("isActive", {
        header: "Status",
        cell: ({ row }) => {
            const accountStatus = row.original.accountStatus || (row.original.isActive ? "active" : "banned");
            const statusClass =
                accountStatus === "active"
                    ? "bg-green-100 text-green-800"
                    : accountStatus === "restricted"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800";

            return (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                    {accountStatus}
                </span>
            );
        },
    }),
    columnHelper.accessor("phone", {
        header: "Phone",
        cell: (info) => <span className="text-sm text-foreground">{info.getValue() || "-"}</span>,
    }),
    columnHelper.accessor("createdAt", {
        header: "Joined Date",
        cell: (info) => <span className="text-sm text-foreground">{format(new Date(info.getValue()), "PP")}</span>,
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            const accountStatus = user.accountStatus || (user.isActive ? "active" : "banned");
            const canRestrict = accountStatus === "active";
            const canUnrestrict = accountStatus === "restricted";
            const canBan = accountStatus !== "banned";
            const canUnban = accountStatus === "banned";

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-muted"
                            disabled={actions.isBusy}
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/users/${user._id || user.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={!canRestrict || actions.isBusy}
                            onSelect={() => actions.onRestrict(user)}
                        >
                            Restrict
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canUnrestrict || actions.isBusy}
                            onSelect={() => actions.onUnrestrict(user)}
                        >
                            Unrestrict
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canBan || actions.isBusy}
                            onSelect={() => actions.onBan(user)}
                            variant="destructive"
                        >
                            Ban
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canUnban || actions.isBusy}
                            onSelect={() => actions.onUnban(user)}
                        >
                            Unban
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];
