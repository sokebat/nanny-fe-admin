"use client";

import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";

interface ReviewsTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    pagination?: {
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export function ReviewsTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    onPaginationChange,
}: ReviewsTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: pageCount ?? -1,
        state: {
            pagination: pagination ?? { pageIndex: 0, pageSize: 10 },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function" && pagination) {
                const newPagination = updater(pagination);
                onPaginationChange?.(newPagination);
            }
        },
    });

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
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
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 align-middle">
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

            <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
                <button
                    className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </button>
                <div className="text-sm font-medium text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() > 0 ? table.getPageCount() : 1}
                </div>
                <button
                    className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
