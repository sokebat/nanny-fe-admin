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
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useInvoices } from "@/hooks/use-invoice";
import type { Invoice } from "@/types/invoice";
import { InvoiceDetailsDialog } from "./invoice-details-dialog";
import { Eye } from "lucide-react";

interface InvoicesTableProps {
    filters?: {
        userId?: string;
        type?: "subscription" | "course" | "service";
        status?: "pending" | "paid" | "failed" | "cancelled" | "refunded";
        fromDate?: string;
        toDate?: string;
    };
}

export function InvoicesTable({ filters = {} }: InvoicesTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const limit = 20;

    const { getInvoicesQuery } = useInvoices({
        page: currentPage,
        limit,
        ...filters,
    });

    const invoices = getInvoicesQuery.data?.invoices || [];
    const pagination = getInvoicesQuery.data?.pagination;
    const totalPages = pagination?.totalPages || 1;

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDialogOpen(true);
    };

    // Helper to get user name from invoice
    const getUserName = (invoice: Invoice): string => {
        if (typeof invoice.userId === "object" && invoice.userId !== null) {
            return `${invoice.userId.firstName} ${invoice.userId.lastName}`;
        }
        return "Unknown User";
    };

    // Helper to get user email from invoice
    const getUserEmail = (invoice: Invoice): string => {
        if (typeof invoice.userId === "object" && invoice.userId !== null) {
            return invoice.userId.email;
        }
        return "";
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get status badge styling
    const getStatusBadgeClass = (status: Invoice["status"]): string => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "cancelled":
                return "bg-gray-100 text-gray-800";
            case "refunded":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (getInvoicesQuery.isLoading) {
        return (
            <Card className="border border-slate-200 overflow-hidden bg-white shadow-none">
                <CardContent className="p-8">
                    <div className="text-center text-slate-500">Loading invoices...</div>
                </CardContent>
            </Card>
        );
    }

    if (getInvoicesQuery.isError) {
        return (
            <Card className="border border-slate-200 overflow-hidden bg-white shadow-none">
                <CardContent className="p-8">
                    <div className="text-center text-red-500">
                        Error loading invoices. Please try again.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
                {invoices.length === 0 ? (
                    <Card className="border border-slate-200 bg-white shadow-none">
                        <CardContent className="p-8">
                            <div className="text-center text-slate-500">No invoices found</div>
                        </CardContent>
                    </Card>
                ) : (
                    invoices.map((invoice) => (
                        <Card
                            key={invoice._id}
                            className="border border-slate-200 bg-white shadow-none hover:shadow-sm transition-shadow"
                        >
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-700 text-sm">
                                                {invoice.invoiceNumber}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {formatDate(invoice.createdAt)}
                                            </p>
                                        </div>
                                        <div
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}
                                        >
                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">User</span>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-700 text-sm">
                                                    {getUserName(invoice)}
                                                </p>
                                                <p className="text-xs text-slate-400">{getUserEmail(invoice)}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">Type</span>
                                            <span className="text-sm text-slate-600 capitalize">{invoice.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">Amount</span>
                                            <span className="font-semibold text-slate-700">
                                                ${invoice.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewInvoice(invoice)}
                                            className="w-full"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <Card className="border border-slate-200 bg-white shadow-none hidden md:block">
                <CardContent className="p-0">
                    <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm whitespace-nowrap">
                                        Invoice #
                                    </TableHead>
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm whitespace-nowrap">
                                        User
                                    </TableHead>
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm whitespace-nowrap">
                                        Type
                                    </TableHead>
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm whitespace-nowrap">
                                        Amount
                                    </TableHead>
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm whitespace-nowrap">
                                        Status
                                    </TableHead>
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm whitespace-nowrap">
                                        Date
                                    </TableHead>
                                    <TableHead className="py-3 px-4 font-semibold text-slate-700 text-sm text-right whitespace-nowrap">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-slate-500">
                                            No invoices found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((invoice) => (
                                        <TableRow
                                            key={invoice._id}
                                            className="border-slate-100 transition-colors hover:bg-slate-50/50"
                                        >
                                            <TableCell className="py-3 px-4 font-medium text-slate-600 text-sm">
                                                {invoice.invoiceNumber}
                                            </TableCell>
                                            <TableCell className="py-3 px-4">
                                                <div>
                                                    <p className="font-semibold text-slate-700 text-sm">
                                                        {getUserName(invoice)}
                                                    </p>
                                                    <p className="text-xs text-slate-400">{getUserEmail(invoice)}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-slate-600 text-sm capitalize">
                                                {invoice.type}
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-slate-600 font-medium text-sm">
                                                ${invoice.total.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="py-3 px-4">
                                                <div
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}
                                                >
                                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-slate-600 text-sm whitespace-nowrap">
                                                {formatDate(invoice.createdAt)}
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewInvoice(invoice)}
                                                    className="h-8 w-8 p-0 hover:bg-slate-100"
                                                >
                                                    <Eye className="h-4 w-4 text-slate-600" />
                                                    <span className="sr-only">View invoice</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <div className="flex justify-center w-full pb-2">
                    <Pagination className="w-full max-w-full flex justify-center">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage((p) => Math.max(1, p - 1));
                                    }}
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let page: number;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }

                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === page}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                            className={
                                                currentPage === page
                                                    ? "bg-brand-navy text-white hover:bg-brand-navy hover:text-white"
                                                    : "cursor-pointer"
                                            }
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            {totalPages > 5 && (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(totalPages);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                                    }}
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Invoice Details Dialog */}
            <InvoiceDetailsDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                invoice={selectedInvoice}
            />
        </div>
    );
}
