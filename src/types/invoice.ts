import type { UserRole } from "./subscription";

export type InvoiceType = "subscription" | "course" | "service";
export type InvoiceStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export interface InvoiceUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: UserRole;
    phone?: string;
}

export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface InvoiceMetadata {
    planId?: string;
    planName?: string;
    billingCycle?: "monthly" | "yearly";
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    [key: string]: unknown;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    userId: InvoiceUser | string;
    type: InvoiceType;
    subscriptionId?: {
        _id: string;
        planId: {
            _id: string;
            name: string;
        };
        billingCycle: "monthly" | "yearly";
    } | string;
    courseId?: {
        _id: string;
        title: string;
        price: number;
    } | string;
    serviceId?: {
        _id: string;
        title: string;
        price: number;
    } | string;
    amount: number;
    currency?: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: InvoiceStatus;
    lineItems?: InvoiceLineItem[];
    paymentMethod?: string;
    paymentIntentId?: string;
    stripeInvoiceId?: string;
    stripePaymentIntentId?: string;
    issuedAt?: string;
    dueDate?: string;
    paidAt?: string;
    cancelledAt?: string;
    refundedAt?: string;
    description?: string;
    metadata?: InvoiceMetadata;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface InvoiceFilters {
    page?: number;
    limit?: number;
    userId?: string;
    type?: InvoiceType;
    status?: InvoiceStatus;
    fromDate?: string; // ISO format
    toDate?: string; // ISO format
}

export interface InvoicesListResponse {
    invoices: Invoice[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface InvoiceStats {
    total: number;
    totalAmount: number;
    paid: number;
    paidAmount: number;
    pending: number;
    pendingAmount: number;
    failed: number;
    failedAmount: number;
    cancelled: number;
    cancelledAmount: number;
    refunded: number;
    refundedAmount: number;
    overdue: number;
    overdueAmount: number;
    byStatus: {
        pending: { count: number; amount: number };
        paid: { count: number; amount: number };
        failed: { count: number; amount: number };
        cancelled: { count: number; amount: number };
        refunded: { count: number; amount: number };
    };
    byType: {
        subscription: { count: number; amount: number };
        course: { count: number; amount: number };
        service: { count: number; amount: number };
    };
    byMonth: Array<{
        month: string; // Format: "YYYY-MM"
        count: number;
        amount: number;
    }>;
    averageAmount: number;
}

