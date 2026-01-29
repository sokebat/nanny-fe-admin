"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { UsersTable } from "@/components/users/users-table";
import { columns } from "@/components/users/columns";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const { data, isLoading, isError } = useAdminUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const pageCount = data?.pagination?.totalPages || 0;

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Manage all users (Nannies, Parents, Vendors)
                    </p>
                </div>
            </div>

            {isError ? (
                <div className="p-4 rounded-md bg-red-50 text-red-600">
                    Failed to load users. Please try again later.
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <UsersTable
                    columns={columns}
                    data={data?.users || []}
                    pageCount={pageCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </main>
    );
}
