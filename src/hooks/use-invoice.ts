import { useQuery, useQueryClient } from "@tanstack/react-query";
import { invoicesService } from "@/services/invoices.services";
import type { InvoiceFilters } from "@/types/invoice";
import { toast } from "react-hot-toast";

export const INVOICES_QUERY_KEY = "invoices";
export const INVOICE_STATS_QUERY_KEY = "invoice-stats";

/**
 * Hook for managing invoices
 */
export const useInvoices = (filters: InvoiceFilters = {}) => {
    const queryClient = useQueryClient();

    // Get all invoices query
    const getInvoicesQuery = useQuery({
        queryKey: [INVOICES_QUERY_KEY, filters],
        queryFn: () => invoicesService.getAllInvoices(filters),
    });

    // Get invoice by ID query
    const getInvoiceByIdQuery = (invoiceId: string) =>
        useQuery({
            queryKey: [INVOICES_QUERY_KEY, invoiceId],
            queryFn: () => invoicesService.getInvoiceById(invoiceId),
            enabled: !!invoiceId,
        });

    // Get invoice stats query
    const getInvoiceStatsQuery = (filters?: { fromDate?: string; toDate?: string }) =>
        useQuery({
            queryKey: [INVOICE_STATS_QUERY_KEY, filters],
            queryFn: () => invoicesService.getInvoiceStats(filters),
        });

    // Helper to invalidate invoices cache
    const invalidateInvoices = () => {
        queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    };

    // Helper to invalidate stats cache
    const invalidateStats = () => {
        queryClient.invalidateQueries({ queryKey: [INVOICE_STATS_QUERY_KEY] });
    };

    return {
        // Queries
        getInvoicesQuery,
        getInvoiceByIdQuery,
        getInvoiceStatsQuery,

        // Helpers
        invalidateInvoices,
        invalidateStats,
    };
};

