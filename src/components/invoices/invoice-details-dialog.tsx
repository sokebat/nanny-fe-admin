"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/types/invoice";
import {
    Calendar,
    CreditCard,
    FileText,
    User,
    DollarSign,
    Package,
    CheckCircle2,
    XCircle,
    Clock,
    Info,
} from "lucide-react";

interface InvoiceDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: Invoice | null;
}

export function InvoiceDetailsDialog({
    open,
    onOpenChange,
    invoice,
}: InvoiceDetailsDialogProps) {
    if (!invoice) return null;

    // Helper to get user name from invoice
    const getUserName = (): string => {
        if (typeof invoice.userId === "object" && invoice.userId !== null) {
            return `${invoice.userId.firstName} ${invoice.userId.lastName}`;
        }
        return "Unknown User";
    };

    // Helper to get user email from invoice
    const getUserEmail = (): string => {
        if (typeof invoice.userId === "object" && invoice.userId !== null) {
            return invoice.userId.email;
        }
        return "";
    };

    // Format date
    const formatDate = (dateString?: string): string => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Get status badge styling
    const getStatusBadge = () => {
        const statusConfig = {
            paid: { className: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
            pending: { className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
            failed: { className: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
            cancelled: { className: "bg-gray-100 text-gray-800 border-gray-200", icon: XCircle },
            refunded: { className: "bg-blue-100 text-blue-800 border-blue-200", icon: Info },
        };

        const config = statusConfig[invoice.status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.className} border flex items-center gap-1.5 px-3 py-1`}>
                <Icon className="w-3.5 h-3.5" />
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
        );
    };

    // Get type badge
    const getTypeBadge = () => {
        const typeColors = {
            subscription: "bg-purple-100 text-purple-800 border-purple-200",
            course: "bg-blue-100 text-blue-800 border-blue-200",
            service: "bg-orange-100 text-orange-800 border-orange-200",
        };

        return (
            <Badge className={`${typeColors[invoice.type] || "bg-gray-100 text-gray-800"} border capitalize`}>
                {invoice.type}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        Invoice Details
                    </DialogTitle>
                    <DialogDescription>
                        Complete invoice information and payment details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Invoice Header */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        {invoice.invoiceNumber}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Issued: {formatDate(invoice.issuedAt || invoice.createdAt)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getStatusBadge()}
                                    {getTypeBadge()}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{getUserName()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{getUserEmail()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <p className="font-medium capitalize">
                                        {invoice.paymentMethod || "N/A"}
                                    </p>
                                </div>
                                {invoice.paymentIntentId && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Payment Intent ID</p>
                                        <p className="font-mono text-xs break-all">
                                            {invoice.paymentIntentId}
                                        </p>
                                    </div>
                                )}
                                {invoice.stripeInvoiceId && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Stripe Invoice ID</p>
                                        <p className="font-mono text-xs break-all">
                                            {invoice.stripeInvoiceId}
                                        </p>
                                    </div>
                                )}
                                {invoice.paidAt && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Paid At</p>
                                        <p className="font-medium">{formatDate(invoice.paidAt)}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    {invoice.lineItems && invoice.lineItems.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Line Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {invoice.lineItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{item.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${item.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pricing Breakdown */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Pricing Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">
                                        ${invoice.subtotal.toFixed(2)} {invoice.currency || "USD"}
                                    </span>
                                </div>
                                {invoice.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span className="font-medium">
                                            ${invoice.tax.toFixed(2)} {invoice.currency || "USD"}
                                        </span>
                                    </div>
                                )}
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">
                                            -${invoice.discount.toFixed(2)} {invoice.currency || "USD"}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span>
                                        ${invoice.total.toFixed(2)} {invoice.currency || "USD"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    {(invoice.description || invoice.metadata) && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Additional Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {invoice.description && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                                        <p className="text-sm">{invoice.description}</p>
                                    </div>
                                )}
                                {invoice.metadata && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                                        <div className="bg-muted p-3 rounded-lg">
                                            <pre className="text-xs overflow-x-auto">
                                                {JSON.stringify(invoice.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Dates */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="font-medium text-sm">{formatDate(invoice.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Updated At</p>
                                    <p className="font-medium text-sm">{formatDate(invoice.updatedAt)}</p>
                                </div>
                                {invoice.issuedAt && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Issued At</p>
                                        <p className="font-medium text-sm">{formatDate(invoice.issuedAt)}</p>
                                    </div>
                                )}
                                {invoice.dueDate && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Due Date</p>
                                        <p className="font-medium text-sm">{formatDate(invoice.dueDate)}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}

