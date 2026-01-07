"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Invoice {
    id: string;
    invoiceNumber: string;
    userName: string;
    userEmail: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    date: string;
}

const dummyInvoices: Invoice[] = [
    {
        id: "inv_1",
        invoiceNumber: "INV-001",
        userName: "Alice Johnson",
        userEmail: "alice@example.com",
        amount: 19.99,
        status: "paid",
        date: "2024-01-05",
    },
    {
        id: "inv_2",
        invoiceNumber: "INV-002",
        userName: "Bob Smith",
        userEmail: "bob@example.com",
        amount: 199.99,
        status: "paid",
        date: "2024-01-02",
    },
    {
        id: "inv_3",
        invoiceNumber: "INV-003",
        userName: "Charlie Brown",
        userEmail: "charlie@example.com",
        amount: 29.99,
        status: "pending",
        date: "2024-01-07",
    },
    {
        id: "inv_4",
        invoiceNumber: "INV-004",
        userName: "Diana Ross",
        userEmail: "diana@example.com",
        amount: 49.99,
        status: "failed",
        date: "2023-12-28",
    },
];

export function InvoicesTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    return (
        <div className="space-y-6">
            <Card className="border border-slate-200 overflow-hidden bg-white shadow-none">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="py-4 font-semibold text-slate-700">Invoice #</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">User</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Amount</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dummyInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} className="border-slate-100 transition-colors">
                                        <TableCell className="py-4 font-medium text-slate-600">
                                            {invoice.invoiceNumber}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div>
                                                <p className="font-semibold text-slate-700">{invoice.userName}</p>
                                                <p className="text-xs text-slate-400">{invoice.userEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600 font-medium">${invoice.amount}</TableCell>
                                        <TableCell className="py-4">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600">{invoice.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {[1, 2, 3].map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === page}
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                    className={currentPage === page ? "bg-brand-navy text-white hover:bg-brand-navy hover:text-white" : "cursor-pointer"}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {totalPages > 3 && (
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}
                                        className="cursor-pointer"
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
