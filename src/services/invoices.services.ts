import { ApiService } from "./api.services";
import type {
    Invoice,
    InvoiceFilters,
    InvoicesListResponse,
    InvoiceStats,
} from "@/types/invoice";
import type { ApiResponse } from "@/types/subscription";

class InvoicesService extends ApiService {
    /**
     * Get all invoices with filters (Admin only)
     */
    async getAllInvoices(filters: InvoiceFilters = {}): Promise<InvoicesListResponse> {
        const params = new URLSearchParams();

        if (filters.page) params.append("page", String(filters.page));
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.userId) params.append("userId", filters.userId);
        if (filters.type) params.append("type", filters.type);
        if (filters.status) params.append("status", filters.status);
        if (filters.fromDate) params.append("fromDate", filters.fromDate);
        if (filters.toDate) params.append("toDate", filters.toDate);

        const queryString = params.toString();
        const endpoint = `/admin/invoices${queryString ? `?${queryString}` : ""}`;

        const response = await this.get<ApiResponse<InvoicesListResponse>>(endpoint, true);
        return response.data;
    }

    /**
     * Get invoice statistics (Admin only)
     */
    async getInvoiceStats(filters?: { fromDate?: string; toDate?: string }): Promise<InvoiceStats> {
        const params = new URLSearchParams();

        if (filters?.fromDate) params.append("fromDate", filters.fromDate);
        if (filters?.toDate) params.append("toDate", filters.toDate);

        const queryString = params.toString();
        const endpoint = `/admin/invoices/stats${queryString ? `?${queryString}` : ""}`;

        const response = await this.get<ApiResponse<InvoiceStats>>(endpoint, true);
        return response.data;
    }

    /**
     * Get invoice by ID (Admin only)
     */
    async getInvoiceById(invoiceId: string): Promise<Invoice> {
        const response = await this.get<ApiResponse<{ invoice: Invoice }>>(
            `/admin/invoices/${invoiceId}`,
            true
        );
        return response.data.invoice;
    }
}

export const invoicesService = new InvoicesService();

