import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "@/services/admin-users.service";
import { AdminUserFilters, UpdateAdminUserDto } from "@/types/admin-users";
import { toast } from "react-hot-toast";

export const ADMIN_USERS_KEYS = {
    all: ["admin-users"] as const,
    lists: () => [...ADMIN_USERS_KEYS.all, "list"] as const,
    list: (filters: AdminUserFilters) => [...ADMIN_USERS_KEYS.lists(), filters] as const,
    details: () => [...ADMIN_USERS_KEYS.all, "detail"] as const,
    detail: (id: string) => [...ADMIN_USERS_KEYS.details(), id] as const,
    subscriptions: (id: string) => [...ADMIN_USERS_KEYS.detail(id), "subscriptions"] as const,
    invoices: (id: string, page: number, limit: number, status: string) => [...ADMIN_USERS_KEYS.detail(id), "invoices", { page, limit, status }] as const,
    courses: (id: string, page: number, limit: number, status: string) => [...ADMIN_USERS_KEYS.detail(id), "courses", { page, limit, status }] as const,
    jobs: (id: string, page: number, limit: number) => [...ADMIN_USERS_KEYS.detail(id), "jobs", { page, limit }] as const,
};

export const useAdminUsers = (filters: AdminUserFilters) => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.list(filters),
        queryFn: () => adminUsersService.getAllUsers(filters),
    });
};

export const useAdminUser = (id: string) => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.detail(id),
        queryFn: () => adminUsersService.getUserById(id),
        enabled: !!id,
    });
};

export const useUpdateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAdminUserDto }) =>
            adminUsersService.updateUser(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.lists() });
            toast.success("User updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update user");
        },
    });
};

export const useAdminUserSubscriptions = (id: string) => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.subscriptions(id),
        queryFn: () => adminUsersService.getUserSubscriptions(id),
        enabled: !!id,
    });
};

export const useAdminUserInvoices = (id: string, page = 1, limit = 20, status = "") => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.invoices(id, page, limit, status),
        queryFn: () => adminUsersService.getUserInvoices(id, page, limit, status),
        enabled: !!id,
    });
};

export const useAdminUserCourses = (id: string, page = 1, limit = 20, status = "") => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.courses(id, page, limit, status),
        queryFn: () => adminUsersService.getUserCourses(id, page, limit, status),
        enabled: !!id,
    });
};

export const useAdminUserJobs = (id: string, page = 1, limit = 20) => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.jobs(id, page, limit),
        queryFn: () => adminUsersService.getUserJobs(id, page, limit),
        enabled: !!id,
    });
};
