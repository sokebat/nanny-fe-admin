import { ApiService } from "./api.services";
import {
    AdminUser,
    AdminUserFilters,
    UpdateAdminUserDto,
    PaginatedResponse,
    AdminUserSubscription,
    AdminUserInvoice,
    AdminUserCourse,
    UserJob,
    PaginatedUsersResponse,
    AdminUserDetails,
    RestrictUserDto,
    BanUserDto,
    ResolveRestrictionAppealDto,
    RestrictionAppealsFilters,
    PaginatedRestrictionAppealsResponse,
} from "@/types/admin-users";
import { ApiResponse } from "@/types/subscription";

class AdminUsersService extends ApiService {
    async getAllUsers(filters: AdminUserFilters = {}): Promise<PaginatedUsersResponse> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, String(value));
            }
        });

        const response = await this.get<ApiResponse<PaginatedUsersResponse>>(
            `/admin/users?${params.toString()}`,
            true
        );
        return response.data;
    }

    async getUsersByRole(role: "nannies" | "vendors" | "parents", page = 1, limit = 20): Promise<PaginatedUsersResponse> {
        const response = await this.get<ApiResponse<PaginatedUsersResponse>>(
            `/admin/users/${role}?page=${page}&limit=${limit}`,
            true
        );
        return response.data;
    }

    async getUserById(id: string): Promise<AdminUserDetails> {
        const response = await this.get<ApiResponse<AdminUserDetails>>(`/admin/users/${id}`, true);
        return response.data;
    }

    async updateUser(id: string, data: UpdateAdminUserDto): Promise<AdminUser> {
        const response = await this.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, data, true);
        return response.data;
    }

    async restrictUser(id: string, data: RestrictUserDto): Promise<AdminUser> {
        const response = await this.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/restrict`, data, true);
        return response.data;
    }

    async unrestrictUser(id: string): Promise<AdminUser> {
        const response = await this.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/unrestrict`, {}, true);
        return response.data;
    }

    async banUser(id: string, data: BanUserDto): Promise<AdminUser> {
        const response = await this.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/ban`, data, true);
        return response.data;
    }

    async unbanUser(id: string): Promise<AdminUser> {
        const response = await this.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/unban`, {}, true);
        return response.data;
    }

    async getRestrictionAppeals(filters: RestrictionAppealsFilters = {}): Promise<PaginatedRestrictionAppealsResponse> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, String(value));
            }
        });

        const response = await this.get<ApiResponse<PaginatedRestrictionAppealsResponse>>(
            `/admin/users/appeals/restrictions?${params.toString()}`,
            true
        );
        return response.data;
    }

    async resolveRestrictionAppeal(appealId: string, data: ResolveRestrictionAppealDto): Promise<void> {
        await this.patch<ApiResponse<unknown>>(`/admin/users/appeals/restrictions/${appealId}`, data, true);
    }

    async getUserSubscriptions(id: string): Promise<AdminUserSubscription[]> {
        const response = await this.get<ApiResponse<AdminUserSubscription[]>>(`/admin/users/${id}/subscriptions`, true);
        return response.data;
    }

    async getUserInvoices(id: string, page = 1, limit = 20, status = ""): Promise<PaginatedResponse<AdminUserInvoice>> {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.append("status", status);

        const response = await this.get<ApiResponse<PaginatedResponse<AdminUserInvoice>>>(
            `/admin/users/${id}/invoices?${params.toString()}`,
            true
        );
        return response.data;
    }

    async getUserCourses(id: string, page = 1, limit = 20, status = ""): Promise<PaginatedResponse<AdminUserCourse>> {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.append("status", status);

        const response = await this.get<ApiResponse<PaginatedResponse<AdminUserCourse>>>(
            `/admin/users/${id}/courses?${params.toString()}`,
            true
        );
        return response.data;
    }

    async getUserJobs(id: string, page = 1, limit = 20): Promise<PaginatedResponse<UserJob>> {
        const response = await this.get<ApiResponse<PaginatedResponse<UserJob>>>(
            `/admin/users/${id}/jobs?page=${page}&limit=${limit}`,
            true
        );
        return response.data;
    }
}

export const adminUsersService = new AdminUsersService();
