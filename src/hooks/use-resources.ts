import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesService } from "@/services/resources.services";
import type {
    CreateResourceDto,
    UpdateResourceDto,
    ResourceFilters,
} from "@/types/resource";
import { toast } from "react-hot-toast";

export const RESOURCES_QUERY_KEY = "resources";
export const RESOURCE_STATS_QUERY_KEY = "resource-stats";

/**
 * Hook for managing resources
 */
export const useResources = (filters: ResourceFilters = {}) => {
    const queryClient = useQueryClient();

    // Get all resources query
    const getResourcesQuery = useQuery({
        queryKey: [RESOURCES_QUERY_KEY, filters],
        queryFn: () => resourcesService.getAllResources(filters),
    });

    // Get resource by ID query
    const getResourceByIdQuery = (resourceId: string) =>
        useQuery({
            queryKey: [RESOURCES_QUERY_KEY, resourceId],
            queryFn: () => resourcesService.getResourceById(resourceId),
            enabled: !!resourceId,
        });

    // Get resource stats query
    const getResourceStatsQuery = useQuery({
        queryKey: [RESOURCE_STATS_QUERY_KEY],
        queryFn: () => resourcesService.getResourceStats(),
    });

    // Create resource mutation
    const createResourceMutation = useMutation({
        mutationFn: async (data: CreateResourceDto) => {
            try {
                const response = await resourcesService.createResource(data);
                toast.success("Resource created successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to create resource");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [RESOURCE_STATS_QUERY_KEY] });
        },
    });

    // Update resource mutation
    const updateResourceMutation = useMutation({
        mutationFn: async ({ resourceId, data }: { resourceId: string; data: UpdateResourceDto }) => {
            try {
                const response = await resourcesService.updateResource(resourceId, data);
                toast.success("Resource updated successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update resource");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY, variables.resourceId] });
            queryClient.invalidateQueries({ queryKey: [RESOURCE_STATS_QUERY_KEY] });
        },
    });

    // Delete resource mutation
    const deleteResourceMutation = useMutation({
        mutationFn: async (resourceId: string) => {
            try {
                await resourcesService.deleteResource(resourceId);
                toast.success("Resource deleted successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete resource");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [RESOURCE_STATS_QUERY_KEY] });
        },
    });

    // Toggle listing mutation
    const toggleListingMutation = useMutation({
        mutationFn: async ({ resourceId, isListed }: { resourceId: string; isListed: boolean }) => {
            try {
                const response = await resourcesService.toggleListing(resourceId, isListed);
                toast.success(`Resource ${isListed ? "listed" : "unlisted"} successfully`);
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update resource listing");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY, variables.resourceId] });
            queryClient.invalidateQueries({ queryKey: [RESOURCE_STATS_QUERY_KEY] });
        },
    });

    // Toggle popular mutation
    const togglePopularMutation = useMutation({
        mutationFn: async ({ resourceId, isPopular }: { resourceId: string; isPopular: boolean }) => {
            try {
                const response = await resourcesService.togglePopular(resourceId, isPopular);
                toast.success(`Resource ${isPopular ? "marked as popular" : "removed from popular"}`);
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update resource popular status");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [RESOURCES_QUERY_KEY, variables.resourceId] });
            queryClient.invalidateQueries({ queryKey: [RESOURCE_STATS_QUERY_KEY] });
        },
    });

    return {
        // Queries
        getResourcesQuery,
        getResourceByIdQuery,
        getResourceStatsQuery,

        // Mutations
        createResource: createResourceMutation,
        updateResource: updateResourceMutation,
        deleteResource: deleteResourceMutation,
        toggleListing: toggleListingMutation,
        togglePopular: togglePopularMutation,
    };
};
