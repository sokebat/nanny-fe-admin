"use client";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columns, type TableDataType } from "./columns";

const tableData: TableDataType[] = [
    {
        date: "Wed, 17 Dec 2022",
        time: "09:00:20 GMT",
        vendor: "Jacob Marks",
        location: "Corner street 46 London",
        request: "Service name",
        email: "john@gmail.com",
    },
    {
        date: "Wed, 17 Dec 2022",
        time: "09:00:20 GMT",
        vendor: "Jacob Marks",
        location: "Corner street 46 London",
        request: "Product name",
        email: "john@gmail.com",
    },
    {
        date: "Wed, 17 Dec 2022",
        time: "09:00:20 GMT",
        vendor: "Jacob Marks",
        location: "Corner street 46 London",
        request: "Service name",
        email: "john@gmail.com",
    },
];

export default function RequestsTable() {
    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-card border border-border rounded-lg">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-border">
                <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl tracking-wider" style={{ fontFamily: "Righteous, sans-serif" }}>
                    Product & Service Listing Request
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-border">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, rowIndex) => (
                            <tr
                                key={row.id}
                                className={`border-b border-border ${rowIndex % 2 === 1 ? "bg-muted" : "bg-card"}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-3 py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
