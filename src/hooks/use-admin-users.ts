import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "@/services/admin-users.service";
import {
    AdminUserFilters,
    UpdateAdminUserDto,
    RestrictUserDto,
    BanUserDto,
    ResolveRestrictionAppealDto,
    RestrictionAppealsFilters,
} from "@/types/admin-users";
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
    appeals: ["admin-users", "appeals", "restrictions"] as const,
    appealsList: (filters: RestrictionAppealsFilters) => [...ADMIN_USERS_KEYS.appeals, filters] as const,
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

export const useRestrictAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RestrictUserDto }) =>
            adminUsersService.restrictUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.lists() });
            toast.success("User restricted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to restrict user");
        },
    });
};

export const useUnrestrictAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminUsersService.unrestrictUser(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.lists() });
            toast.success("User unrestricted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to unrestrict user");
        },
    });
};

export const useBanAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: BanUserDto }) =>
            adminUsersService.banUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.lists() });
            toast.success("User banned successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to ban user");
        },
    });
};

export const useUnbanAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminUsersService.unbanUser(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.lists() });
            toast.success("User unbanned successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to unban user");
        },
    });
};

export const useRestrictionAppeals = (filters: RestrictionAppealsFilters) => {
    return useQuery({
        queryKey: ADMIN_USERS_KEYS.appealsList(filters),
        queryFn: () => adminUsersService.getRestrictionAppeals(filters),
    });
};

export const useResolveRestrictionAppeal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ appealId, data }: { appealId: string; data: ResolveRestrictionAppealDto }) =>
            adminUsersService.resolveRestrictionAppeal(appealId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.appeals });
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.lists() });
            toast.success("Appeal resolved");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to resolve appeal");
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
