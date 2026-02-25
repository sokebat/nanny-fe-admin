import { ApiService } from "./api.services";
import type { AxiosRequestConfig } from "axios";
import type {
    Resource,
    CreateResourceDto,
    UpdateResourceDto,
    ResourceFilters,
    ResourcesListResponse,
    ResourceStatsBase,
    TargetAudience,
} from "@/types/resource";
import type { ApiResponse } from "@/types/subscription";

const ALLOWED_AUDIENCES: TargetAudience[] = ["nanny", "parent", "vendor"];

const isTargetAudience = (value: string): value is TargetAudience => {
    return ALLOWED_AUDIENCES.includes(value as TargetAudience);
};

const normalizeTargetAudience = (value: unknown, depth = 0): TargetAudience[] => {
    if (!value || depth > 5) return [];

    if (Array.isArray(value)) {
        for (const item of value) {
            const normalized = normalizeTargetAudience(item, depth + 1);
            if (normalized.length > 0) return [normalized[0]];
        }
        return [];
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return [];

        const lower = trimmed.toLowerCase();
        if (isTargetAudience(lower)) return [lower];

        if (trimmed.includes(",")) {
            return normalizeTargetAudience(trimmed.split(","), depth + 1);
        }

        if (trimmed.startsWith("[") || trimmed.startsWith("\"")) {
            try {
                return normalizeTargetAudience(JSON.parse(trimmed), depth + 1);
            } catch {
                return [];
            }
        }
    }

    return [];
};

const normalizeResource = (resource: Resource): Resource => ({
    ...resource,
    targetAudience: normalizeTargetAudience(resource.targetAudience),
});

class ResourcesService extends ApiService {
    /**
     * Get all resources with filters (Admin only)
     */
    async getAllResources(filters: ResourceFilters = {}): Promise<ResourcesListResponse> {
        const params = new URLSearchParams();

        if (filters.page) params.append("page", String(filters.page));
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.category) params.append("category", filters.category);
        if (filters.type) params.append("type", filters.type);
        if (filters.search) params.append("search", filters.search);
        if (filters.targetAudience) params.append("targetAudience", filters.targetAudience);

        const queryString = params.toString();
        const endpoint = `/admin/resources${queryString ? `?${queryString}` : ""}`;

        const response = await this.get<ApiResponse<ResourcesListResponse>>(endpoint, true);
        return {
            ...response.data,
            resources: response.data.resources.map(normalizeResource),
        };
    }

    /**
     * Get resource details by ID (Admin only)
     */
    async getResourceById(resourceId: string): Promise<Resource> {
        const response = await this.get<ApiResponse<{ resource: Resource }>>(
            `/admin/resources/${resourceId}`,
            true
        );
        return normalizeResource(response.data.resource);
    }

    /**
     * Create a new resource (Admin only)
     * Uses FormData for file upload support
     */
    async createResource(data: CreateResourceDto): Promise<Resource> {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("type", data.type);

        if (data.description) formData.append("description", data.description);
        if (data.category) formData.append("category", data.category);
        if (data.url) formData.append("url", data.url);
        if (data.teachableResourceId) formData.append("teachableResourceId", data.teachableResourceId);
        if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
        if (data.isListed !== undefined) formData.append("isListed", String(data.isListed));
        if (data.isPopular !== undefined) formData.append("isPopular", String(data.isPopular));
        if (data.free !== undefined) formData.append("free", String(data.free));
        const normalizedAudience = normalizeTargetAudience(data.targetAudience);
        if (normalizedAudience.length > 0) {
            formData.append("targetAudience", normalizedAudience[0]);
        }

        if (data.file) formData.append("file", data.file);
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await this.post<ApiResponse<{ resource: Resource }>>(
            "/admin/resources",
            formData,
            true,
            config
        );
        return normalizeResource(response.data.resource);
    }

    /**
     * Update an existing resource (Admin only)
     * Uses FormData for file upload support
     */
    async updateResource(resourceId: string, data: UpdateResourceDto): Promise<Resource> {
        const formData = new FormData();

        if (data.title) formData.append("title", data.title);
        if (data.type) formData.append("type", data.type);
        if (data.description !== undefined) formData.append("description", data.description);
        if (data.category) formData.append("category", data.category);
        if (data.url) formData.append("url", data.url);
        if (data.teachableResourceId) formData.append("teachableResourceId", data.teachableResourceId);
        if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
        if (data.isListed !== undefined) formData.append("isListed", String(data.isListed));
        if (data.isPopular !== undefined) formData.append("isPopular", String(data.isPopular));
        if (data.free !== undefined) formData.append("free", String(data.free));
        const normalizedAudience = normalizeTargetAudience(data.targetAudience);
        if (normalizedAudience.length > 0) {
            formData.append("targetAudience", normalizedAudience[0]);
        }

        if (data.file) formData.append("file", data.file);
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await this.patch<ApiResponse<{ resource: Resource }>>(
            `/admin/resources/${resourceId}`,
            formData,
            true,
            config
        );
        return normalizeResource(response.data.resource);
    }

    /**
     * Toggle resource listing status (Admin only)
     */
    async toggleListing(resourceId: string, isListed: boolean): Promise<Resource> {
        const response = await this.patch<ApiResponse<{ resource: Resource }>>(
            `/admin/resources/${resourceId}/toggle-listing`,
            { isListed },
            true
        );
        return normalizeResource(response.data.resource);
    }

    /**
     * Toggle resource popular status (Admin only)
     */
    async togglePopular(resourceId: string, isPopular: boolean): Promise<Resource> {
        const response = await this.patch<ApiResponse<{ resource: Resource }>>(
            `/admin/resources/${resourceId}/toggle-popular`,
            { isPopular },
            true
        );
        return normalizeResource(response.data.resource);
    }

    /**
     * Delete a resource (Admin only)
     */
    async deleteResource(resourceId: string): Promise<void> {
        await this.delete<ApiResponse<void>>(`/admin/resources/${resourceId}`, true);
    }

    /**
     * Get resource statistics (Admin only)
     */
    async getResourceStats(): Promise<ResourceStatsBase> {
        const response = await this.get<ApiResponse<ResourceStatsBase>>(
            "/admin/resources/stats",
            true
        );
        return response.data;
    }
}

export const resourcesService = new ResourcesService();
