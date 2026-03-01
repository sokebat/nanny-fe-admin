"use client";

import { useEffect, useState } from "react";
import {
    ResourcesTable,
    ResourceForm,
    ResourceStats,
    ResourcePagination,
    DeleteResourceDialog,
} from "@/components/resources";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ManageResources = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [editResource, setEditResource] = useState<Resource | null>(null);
    const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<ResourceType | "">("");
    const [audienceFilter, setAudienceFilter] = useState<"all" | "nanny" | "parent" | "vendor">("all");
    const [searchInput, setSearchInput] = useState("");
    const [searchFilter, setSearchFilter] = useState("");
    const limit = 10;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchFilter(searchInput.trim());
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

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
        type: typeFilter || undefined,
        search: searchFilter || undefined,
        targetAudience: audienceFilter === "all" ? undefined : audienceFilter,
    });

    const resources = getResourcesQuery.data?.resources || [];
    const total = getResourcesQuery.data?.total || 0;
    const totalPages = getResourcesQuery.data?.totalPages || 0;
    const stats = getResourceStatsQuery.data;

    // Handlers
    const handleTypeChange = (value: string) => {
        setTypeFilter(value === "all" ? "" : (value as ResourceType));
        setCurrentPage(1);
    };

    const handleAudienceChange = (value: string) => {
        setAudienceFilter(value as "all" | "nanny" | "parent" | "vendor");
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
        } catch {
            // Error is handled by the hook
        }
    };

    const handleDelete = async () => {
        if (deleteResourceId) {
            try {
                await deleteResource.mutateAsync(deleteResourceId);
                setDeleteResourceId(null);
            } catch {
                // Error is handled by the hook
            }
        }
    };

    const handleToggleListing = async (resourceId: string, isListed: boolean) => {
        try {
            await toggleListing.mutateAsync({ resourceId, isListed });
        } catch {
            // Error is handled by the hook
        }
    };

    const handleTogglePopular = async (resourceId: string, isPopular: boolean) => {
        try {
            await togglePopular.mutateAsync({ resourceId, isPopular });
        } catch {
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
                        <div className="w-full sm:w-[260px] space-y-1">
                            <Label htmlFor="resource-search" className="sr-only">
                                Search resources
                            </Label>
                            <Input
                                id="resource-search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search title, category, or description..."
                                className="h-11 rounded-xl border-slate-200 text-sm"
                            />
                        </div>
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
                        <Select
                            value={audienceFilter}
                            onValueChange={handleAudienceChange}
                        >
                            <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-xl border-slate-200 focus:ring-brand-navy text-sm font-medium">
                                <SelectValue placeholder="Audience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All audiences</SelectItem>
                                <SelectItem value="nanny">Nanny</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
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
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded-full bg-slate-100 px-3 py-1">
                                    {total.toLocaleString()} total resources
                                </span>
                                {searchFilter && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1">
                                        Search: {searchFilter}
                                    </span>
                                )}
                                {typeFilter && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 uppercase">
                                        Type: {typeFilter}
                                    </span>
                                )}
                                {audienceFilter !== "all" && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 capitalize">
                                        Audience: {audienceFilter}
                                    </span>
                                )}
                            </div>
                            <ResourcesTable
                                resources={resources}
                                onEdit={handleEdit}
                                onDelete={setDeleteResourceId}
                                onToggleListing={handleToggleListing}
                                onTogglePopular={handleTogglePopular}
                                isDeleting={deleteResource.isPending}
                                deletingResourceId={deleteResourceId}
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
