"use client";

import { useState } from "react";
import {
    ResourcesTable,
    ResourceForm,
    ResourceStats,
    ResourcePagination,
    DeleteResourceDialog,
} from "@/components/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useResources } from "@/hooks/use-resources";
import type { CreateResourceDto, UpdateResourceDto, Resource, ResourceType } from "@/types/resource";
import { RESOURCE_TYPE_OPTIONS } from "@/types/resource";
import { Search, Loader2, X } from "lucide-react";

const ManageResources = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [editResource, setEditResource] = useState<Resource | null>(null);
    const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<ResourceType | "">("");
    const limit = 10;

    // Fetch resources and stats
    const {
        getResourcesQuery,
        getResourceStatsQuery,
        createResource,
        updateResource,
        deleteResource,
        toggleListing,
        togglePopular,
    } = useResources({
        page: currentPage,
        limit,
        search: debouncedSearch,
        type: typeFilter || undefined,
    });

    const resources = getResourcesQuery.data?.resources || [];
    const total = getResourcesQuery.data?.total || 0;
    const totalPages = getResourcesQuery.data?.totalPages || 0;
    const stats = getResourceStatsQuery.data;

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setDebouncedSearch(searchQuery);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setDebouncedSearch("");
        setCurrentPage(1);
    };

    const handleTypeChange = (value: string) => {
        setTypeFilter(value === "all" ? "" : (value as ResourceType));
        setCurrentPage(1);
    };

    const handleOpenCreate = () => {
        setEditResource(null);
        setFormOpen(true);
    };

    const handleEdit = (resourceId: string) => {
        const resource = resources.find((r) => r._id === resourceId);
        if (resource) {
            setEditResource(resource);
            setFormOpen(true);
        }
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditResource(null);
    };

    const handleFormSubmit = async (data: CreateResourceDto) => {
        try {
            if (editResource) {
                await updateResource.mutateAsync({
                    resourceId: editResource._id,
                    data: data as UpdateResourceDto,
                });
            } else {
                await createResource.mutateAsync(data);
            }
            handleCloseForm();
        } catch (error) {
            // Error is handled by the hook
        }
    };

    const handleDelete = async () => {
        if (deleteResourceId) {
            try {
                await deleteResource.mutateAsync(deleteResourceId);
                setDeleteResourceId(null);
            } catch (error) {
                // Error is handled by the hook
            }
        }
    };

    const handleToggleListing = async (resourceId: string, isListed: boolean) => {
        try {
            await toggleListing.mutateAsync({ resourceId, isListed });
        } catch (error) {
            // Error is handled by the hook
        }
    };

    const handleTogglePopular = async (resourceId: string, isPopular: boolean) => {
        try {
            await togglePopular.mutateAsync({ resourceId, isPopular });
        } catch (error) {
            // Error is handled by the hook
        }
    };

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
                {/* Header and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-[#1E293B] text-3xl md:text-4xl font-extrabold tracking-tight">Manage Resources</h2>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Library management and curation tools.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
                        <form onSubmit={handleSearch} className="relative flex-1 sm:flex-initial">
                            <Input
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 w-full sm:w-[250px] md:w-[300px] h-11 rounded-xl border-slate-200 focus-visible:ring-brand-navy"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </form>
                        <Select
                            value={typeFilter || "all"}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-xl border-slate-200 focus:ring-brand-navy text-sm font-medium">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                {RESOURCE_TYPE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-brand-navy hover:bg-[#203a56] text-white px-4 md:px-8 h-11 rounded-xl font-bold shadow-none whitespace-nowrap"
                        >
                            Upload Resource
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                {stats && <ResourceStats stats={stats} />}

                {/* Table Section */}
                <div className="space-y-4">
                    {getResourcesQuery.isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                            <Loader2 className="w-10 h-10 animate-spin text-brand-navy mb-4 opacity-20" />
                            <p className="text-muted-foreground font-medium animate-pulse">Syncing library...</p>
                        </div>
                    ) : getResourcesQuery.isError ? (
                        <div className="text-center py-24 bg-white rounded-2xl border border-red-100">
                            <p className="text-destructive font-bold mb-4">
                                {getResourcesQuery.error instanceof Error
                                    ? getResourcesQuery.error.message
                                    : "Failed to load resources"}
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-xl px-6"
                                onClick={() => getResourcesQuery.refetch()}
                            >
                                Retry Connection
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <ResourcesTable
                                resources={resources}
                                onEdit={handleEdit}
                                onDelete={setDeleteResourceId}
                                onToggleListing={handleToggleListing}
                                onTogglePopular={handleTogglePopular}
                                isDeleting={deleteResource.isPending}
                            />

                            <ResourcePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                total={total}
                                currentCount={resources.length}
                                onPageChange={setCurrentPage}
                                hasNext={currentPage < totalPages}
                                hasPrev={currentPage > 1}
                            />
                        </div>
                    )}
                </div>

                {/* Forms and Dialogs */}
                <ResourceForm
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    resource={editResource}
                    onSubmit={handleFormSubmit}
                    isSubmitting={createResource.isPending || updateResource.isPending}
                />

                <DeleteResourceDialog
                    open={!!deleteResourceId}
                    onOpenChange={(open: boolean) => !open && setDeleteResourceId(null)}
                    onConfirm={handleDelete}
                    isDeleting={deleteResource.isPending}
                />
            </div>
        </main>
    );
};

export default ManageResources;
