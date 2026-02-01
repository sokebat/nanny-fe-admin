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
