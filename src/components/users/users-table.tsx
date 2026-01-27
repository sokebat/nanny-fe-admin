"use client";

import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";

interface UsersTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    pagination?: {
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export function UsersTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    onPaginationChange,
}: UsersTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: pageCount ?? -1,
        state: {
            pagination,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function" && pagination) {
                const newPagination = updater(pagination);
                onPaginationChange?.(newPagination);
            }
        },
    });

    return (
        <div className="rounded-md border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4 px-4">
                <button
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </button>
                <div className="text-sm text-gray-500">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() > 0 ? table.getPageCount() : 1}
                </div>
                <button
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
